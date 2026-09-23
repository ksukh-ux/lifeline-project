import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";
import test from "node:test";

interface JsonResponse<T = unknown> {
  status: number;
  body: T;
  cookie?: string;
}

async function waitForServer(baseUrl: string, process: ChildProcess): Promise<void> {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (process.exitCode !== null) {
      throw new Error(`Backend wurde unerwartet beendet (Exit-Code ${process.exitCode}).`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // Server startet noch.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error("Backend wurde innerhalb des Test-Zeitlimits nicht erreichbar.");
}

async function request<T>(
  baseUrl: string,
  route: string,
  options: RequestInit = {},
  cookie?: string,
): Promise<JsonResponse<T>> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (cookie) headers.set("Cookie", cookie);

  const response = await fetch(`${baseUrl}${route}`, { ...options, headers });
  const text = await response.text();
  const body = text ? (JSON.parse(text) as T) : undefined;
  const setCookie = response.headers.get("set-cookie") ?? undefined;
  const sessionCookie = setCookie?.split(";")[0];

  return { status: response.status, body: body as T, cookie: sessionCookie };
}

async function stopServer(server: ChildProcess): Promise<void> {
  if (server.exitCode !== null) return;

  await new Promise<void>((resolve) => {
    const finish = () => resolve();
    server.once("exit", finish);
    server.kill();
    setTimeout(finish, 1000).unref();
  });
}

// Startet das Backend als eigenen Prozess mit einer Test-Datenbank.
// Dieselbe Datenbankdatei kann an einen zweiten Start übergeben werden,
// um die Dauerhaftigkeit über einen Neustart zu prüfen (SC-04).
async function startServer(databasePath: string): Promise<{ baseUrl: string; server: ChildProcess }> {
  const port = 31000 + Math.floor(Math.random() * 1000);
  const baseUrl = `http://localhost:${port}`;
  const server = spawn(
    process.execPath,
    [path.resolve("node_modules/tsx/dist/cli.mjs"), "src/server.ts"],
    {
      cwd: path.resolve("."),
      env: {
        ...process.env,
        PORT: String(port),
        DATABASE_PATH: databasePath,
        NODE_ENV: "test",
      },
      stdio: "ignore",
    },
  );
  await waitForServer(baseUrl, server);
  return { baseUrl, server };
}

function uniqueEmail(prefix: string): string {
  return `${prefix}-${randomBytes(4).toString("hex")}@example.com`;
}

test("API schützt Eventdaten und unterstützt den vollständigen Event-CRUD", async () => {
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "lifeline-api-test-"));
  const databasePath = path.join(tempDirectory, "lifeline.db");
  const { baseUrl, server } = await startServer(databasePath);

  try {
    const firstUser = await request<{ id: number }>(baseUrl, "/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "first@example.com", password: "Testpass123!" }),
    });
    assert.equal(firstUser.status, 201);
    assert.ok(firstUser.cookie);

    const categories = await request<Array<{ id: number }>>(
      baseUrl,
      "/api/categories",
      {},
      firstUser.cookie,
    );
    assert.equal(categories.status, 200);
    assert.ok(categories.body[0]?.id);

    const created = await request<{ id: number }>(baseUrl, "/api/events", {
      method: "POST",
      body: JSON.stringify({
        category_id: categories.body[0].id,
        title: "API-Testevent",
        description: "Angelegt über HTTP",
        date: "2026-09-23",
        time: "12:30",
        significance: 75,
      }),
    }, firstUser.cookie);
    assert.equal(created.status, 201);

    const stats = await request<{
      totalCount: number;
      oldestDate: string;
      newestDate: string;
      spanDays: number;
      categories: Array<{ count: number }>;
    }>(baseUrl, "/api/stats", {}, firstUser.cookie);
    assert.equal(stats.status, 200);
    assert.equal(stats.body.totalCount, 1);
    assert.equal(stats.body.oldestDate, "2026-09-23");
    assert.equal(stats.body.newestDate, "2026-09-23");
    assert.equal(stats.body.spanDays, 0);
    assert.equal(stats.body.categories[0]?.count, 1);

    const updated = await request<{ title: string }>(
      baseUrl,
      `/api/events/${created.body.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          category_id: categories.body[0].id,
          title: "API-Testevent geändert",
          description: "Aktualisiert über HTTP",
          date: "2026-09-24",
          time: "13:00",
          significance: 80,
        }),
      },
      firstUser.cookie,
    );
    assert.equal(updated.status, 200);
    assert.equal(updated.body.title, "API-Testevent geändert");

    const secondUser = await request<{ id: number }>(baseUrl, "/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "second@example.com", password: "Testpass123!" }),
    });
    assert.equal(secondUser.status, 201);

    const foreignList = await request<unknown[]>(baseUrl, "/api/events", {}, secondUser.cookie);
    assert.equal(foreignList.status, 200);
    assert.deepEqual(foreignList.body, []);

    const foreignAccess = await request(baseUrl, `/api/events/${created.body.id}`, {}, secondUser.cookie);
    assert.equal(foreignAccess.status, 404);

    // NFR-15a-02: Auch schreibende Zugriffe auf ein fremdes Event werden
    // abgewiesen, und zwar ununterscheidbar von "existiert nicht" (NFR-15a-01).
    const secondCategories = await request<Array<{ id: number }>>(
      baseUrl,
      "/api/categories",
      {},
      secondUser.cookie,
    );
    const foreignUpdate = await request(baseUrl, `/api/events/${created.body.id}`, {
      method: "PUT",
      body: JSON.stringify({
        category_id: secondCategories.body[0].id,
        title: "Übernommen",
        date: "2026-01-01",
      }),
    }, secondUser.cookie);
    assert.equal(foreignUpdate.status, 404);

    const foreignDelete = await request(baseUrl, `/api/events/${created.body.id}`, {
      method: "DELETE",
    }, secondUser.cookie);
    assert.equal(foreignDelete.status, 404);

    // Eine fremde Kategorie darf nicht für ein eigenes Event verwendet werden.
    const foreignCategory = await request(baseUrl, "/api/events", {
      method: "POST",
      body: JSON.stringify({
        category_id: categories.body[0].id,
        title: "Fremde Kategorie",
        date: "2026-01-01",
      }),
    }, secondUser.cookie);
    assert.equal(foreignCategory.status, 422);

    const stillThere = await request<{ title: string }>(
      baseUrl,
      `/api/events/${created.body.id}`,
      {},
      firstUser.cookie,
    );
    assert.equal(stillThere.body.title, "API-Testevent geändert");

    const deleted = await request(baseUrl, `/api/events/${created.body.id}`, {
      method: "DELETE",
    }, firstUser.cookie);
    assert.equal(deleted.status, 204);
  } finally {
    await stopServer(server);
    await fs.rm(tempDirectory, { recursive: true, force: true });
  }
});
test("Anmeldung, Abmeldung und Zugriff ohne Session (UC-07)", async () => {
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "lifeline-api-test-"));
  const { baseUrl, server } = await startServer(path.join(tempDirectory, "lifeline.db"));

  try {
    const withoutSession = await request(baseUrl, "/api/events");
    assert.equal(withoutSession.status, 401);

    const email = uniqueEmail("login");
    const registered = await request(baseUrl, "/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password: "Testpass123!" }),
    });
    assert.equal(registered.status, 201);

    const duplicate = await request(baseUrl, "/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: email.toUpperCase(), password: "Testpass123!" }),
    });
    assert.equal(duplicate.status, 409);

    const wrongPassword = await request<{ error: string }>(baseUrl, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: "falsch-falsch" }),
    });
    const unknownUser = await request<{ error: string }>(baseUrl, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: uniqueEmail("unbekannt"), password: "Testpass123!" }),
    });
    assert.equal(wrongPassword.status, 401);
    assert.equal(unknownUser.status, 401);
    // B1 DLG-05: Die Meldung verrät nicht, ob die Adresse existiert.
    assert.equal(wrongPassword.body.error, unknownUser.body.error);

    const loggedIn = await request<{ email: string }>(baseUrl, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: "Testpass123!" }),
    });
    assert.equal(loggedIn.status, 200);
    assert.ok(loggedIn.cookie);

    const me = await request<{ email: string }>(baseUrl, "/api/auth/me", {}, loggedIn.cookie);
    assert.equal(me.body.email, email);

    const loggedOut = await request(baseUrl, "/api/auth/logout", { method: "POST" }, loggedIn.cookie);
    assert.equal(loggedOut.status, 204);

    const afterLogout = await request(baseUrl, "/api/auth/me", {}, loggedIn.cookie);
    assert.equal(afterLogout.status, 401);
  } finally {
    await stopServer(server);
    await fs.rm(tempDirectory, { recursive: true, force: true });
  }
});

test("Kategorie anlegen und verwenden (UC-08, NFR-14c-01)", async () => {
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "lifeline-api-test-"));
  const { baseUrl, server } = await startServer(path.join(tempDirectory, "lifeline.db"));

  try {
    const user = await request(baseUrl, "/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: uniqueEmail("kategorie"), password: "Testpass123!" }),
    });

    const defaults = await request<Array<{ label: string }>>(baseUrl, "/api/categories", {}, user.cookie);
    assert.equal(defaults.body.length, 6);

    const created = await request<{ id: number; label: string }>(baseUrl, "/api/categories", {
      method: "POST",
      body: JSON.stringify({ label: "Hobby", color: "#A3E635" }),
    }, user.cookie);
    assert.equal(created.status, 201);
    assert.equal(created.body.label, "Hobby");

    const duplicate = await request(baseUrl, "/api/categories", {
      method: "POST",
      body: JSON.stringify({ label: "Hobby", color: "#000000" }),
    }, user.cookie);
    assert.equal(duplicate.status, 409);

    const invalidColor = await request(baseUrl, "/api/categories", {
      method: "POST",
      body: JSON.stringify({ label: "Sport", color: "grün" }),
    }, user.cookie);
    assert.equal(invalidColor.status, 422);

    const event = await request(baseUrl, "/api/events", {
      method: "POST",
      body: JSON.stringify({ category_id: created.body.id, title: "Erster Marathon", date: "2025-10-12" }),
    }, user.cookie);
    assert.equal(event.status, 201);
  } finally {
    await stopServer(server);
    await fs.rm(tempDirectory, { recursive: true, force: true });
  }
});

test("Events bleiben nach einem Neustart erhalten (SC-04, NFR-12d-01)", async () => {
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "lifeline-api-test-"));
  const databasePath = path.join(tempDirectory, "lifeline.db");
  const email = uniqueEmail("neustart");

  let running = await startServer(databasePath);
  try {
    const user = await request(running.baseUrl, "/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password: "Testpass123!" }),
    });
    const categories = await request<Array<{ id: number }>>(running.baseUrl, "/api/categories", {}, user.cookie);
    const created = await request(running.baseUrl, "/api/events", {
      method: "POST",
      body: JSON.stringify({ category_id: categories.body[0].id, title: "Bleibt erhalten", date: "2024-05-01" }),
    }, user.cookie);
    assert.equal(created.status, 201);
  } finally {
    await stopServer(running.server);
  }

  running = await startServer(databasePath);
  try {
    const loggedIn = await request(running.baseUrl, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: "Testpass123!" }),
    });
    const events = await request<Array<{ title: string }>>(running.baseUrl, "/api/events", {}, loggedIn.cookie);
    assert.equal(events.status, 200);
    assert.deepEqual(events.body.map((event) => event.title), ["Bleibt erhalten"]);
  } finally {
    await stopServer(running.server);
    await fs.rm(tempDirectory, { recursive: true, force: true });
  }
});
