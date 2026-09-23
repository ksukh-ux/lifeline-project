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

test("API schützt Eventdaten und unterstützt den vollständigen Event-CRUD", async () => {
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "lifeline-api-test-"));
  const databasePath = path.join(tempDirectory, "lifeline.db");
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
        SESSION_SECRET: randomBytes(32).toString("hex"),
        NODE_ENV: "test",
      },
      stdio: "ignore",
    },
  );

  try {
    await waitForServer(baseUrl, server);

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

    const deleted = await request(baseUrl, `/api/events/${created.body.id}`, {
      method: "DELETE",
    }, firstUser.cookie);
    assert.equal(deleted.status, 204);
  } finally {
    await stopServer(server);
    await fs.rm(tempDirectory, { recursive: true, force: true });
  }
});