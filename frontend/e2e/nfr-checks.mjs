// Browser-Prüfungen für nichtfunktionale Anforderungen aus docs/spec/N1.
//
// Startet Backend (mit temporärer Datenbank) und Frontend auf eigenen Ports,
// legt Testdaten über die API an und prüft die Oberfläche in einem echten
// Chrome bzw. Edge (über playwright-core, ohne Browser-Download).
//
// Aufruf: npm --prefix frontend run test:browser
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const FRONTEND_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BACKEND_DIR = path.resolve(FRONTEND_DIR, '..', 'backend')
const API_PORT = 3190
const APP_PORT = 5191
const API = `http://localhost:${API_PORT}`
const APP = `http://localhost:${APP_PORT}`
const PASSWORD = 'Testpass123!'

const results = []
const record = (requirement, passed, detail) => {
  results.push({ requirement, passed, detail })
  console.log(`${passed ? 'OK    ' : 'FEHLER'} ${requirement}: ${detail}`)
}

// ---------------------------------------------------------------- Server

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lifeline-browser-'))
const children = []

function start(command, args, cwd, env) {
  const child = spawn(process.execPath, [command, ...args], {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'ignore',
  })
  children.push(child)
  return child
}

async function waitFor(url) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if ((await fetch(url)).ok) return
    } catch {
      // startet noch
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`${url} wurde nicht erreichbar.`)
}

async function stopAll() {
  // Unter Windows hält das Backend die Datenbankdatei, bis der Prozess
  // wirklich beendet ist; erst danach lässt sich der Ordner löschen.
  await Promise.all(children.map((child) => new Promise((resolve) => {
    if (child.exitCode !== null) return resolve()
    child.once('exit', resolve)
    child.kill()
    setTimeout(resolve, 3000).unref()
  })))
  try {
    fs.rmSync(tempDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
  } catch {
    console.log(`Hinweis: temporärer Ordner ${tempDir} konnte nicht gelöscht werden.`)
  }
}

// ---------------------------------------------------------------- API-Hilfen

async function registerUser(email) {
  const response = await fetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD }),
  })
  const cookie = response.headers.get('set-cookie').split(';')[0]
  const call = async (route, body) => {
    const res = await fetch(`${API}${route}`, {
      method: body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: body && JSON.stringify(body),
    })
    return res.json()
  }
  const categories = await call('/api/categories')
  return { email, call, categories }
}

async function seedEvents(user, count) {
  const batchSize = 25
  for (let start = 0; start < count; start += batchSize) {
    const batch = []
    for (let i = start; i < Math.min(start + batchSize, count); i++) {
      const year = 2000 + (i % 27)
      const month = String((i % 12) + 1).padStart(2, '0')
      const day = String((i % 28) + 1).padStart(2, '0')
      batch.push(user.call('/api/events', {
        category_id: user.categories[i % user.categories.length].id,
        title: `Testereignis ${i + 1}`,
        description: 'Automatisch angelegt für die Lastprüfung.',
        date: `${year}-${month}-${day}`,
        time: i % 3 === 0 ? null : '12:00',
        significance: (i * 7) % 101,
      }))
    }
    await Promise.all(batch)
  }
}

async function login(page, email) {
  await page.goto(APP)
  await page.fill('#auth-email', email)
  await page.fill('#auth-password', PASSWORD)
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click()
  await page.getByRole('button', { name: 'Ereignis hinzufügen', exact: true }).waitFor()
}

const cardTitles = (page) => page.locator('h3').allTextContents()
const timelineLabels = (page) =>
  page.locator('button[aria-label*=", Kategorie "]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label').split(',')[0]))

async function launchBrowser() {
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ channel, headless: true })
    } catch {
      // nächsten Browser versuchen
    }
  }
  throw new Error('Weder Google Chrome noch Microsoft Edge gefunden.')
}

// ---------------------------------------------------------------- Prüfungen

async function checkChronologicalOrder(browser) {
  const user = await registerUser('ordnung@example.com')
  const categoryId = user.categories[0].id
  for (const [title, date, time] of [
    ['Mittag', '2026-05-10', '14:00'],
    ['Ohne Uhrzeit', '2026-05-10', null],
    ['Neujahr', '2026-01-01', null],
    ['Morgen', '2026-05-10', '08:00'],
  ]) {
    await user.call('/api/events', { category_id: categoryId, title, date, time, significance: 50 })
  }
  const page = await browser.newPage()
  await login(page, user.email)
  await page.getByRole('heading', { name: 'Neujahr' }).waitFor()

  const timeline = await timelineLabels(page)
  const expectedTimeline = ['Neujahr', 'Morgen', 'Mittag', 'Ohne Uhrzeit']
  record('NFR-12c-01 Reihenfolge Timeline', JSON.stringify(timeline) === JSON.stringify(expectedTimeline),
    `${timeline.join(' → ')} (erwartet: nach Datum, dann Uhrzeit; ohne Uhrzeit am Tagesende)`)

  const cards = await cardTitles(page)
  const expectedCards = [...expectedTimeline].reverse()
  record('NFR-12c-01 Reihenfolge Event-Liste', JSON.stringify(cards) === JSON.stringify(expectedCards),
    `${cards.join(' → ')} (erwartet: dieselbe Ordnung, neueste zuerst)`)
  await page.close()
}

async function checkTextNeutralisation(browser) {
  const user = await registerUser('skript@example.com')
  const title = '<img src=x onerror="window.__lifelineXss=1"><script>window.__lifelineXss=1</script>'
  await user.call('/api/events', { category_id: user.categories[0].id, title, date: '2026-02-02', significance: 50 })
  const page = await browser.newPage()
  await login(page, user.email)
  await page.locator('h3').first().waitFor()
  const shown = await page.locator('h3').first().textContent()
  const executed = await page.evaluate(() => window.__lifelineXss === 1)
  record('NFR-15b-03 Freitext wird nicht ausgeführt', shown === title && !executed,
    executed ? 'Skript wurde ausgeführt' : 'Titel mit <script> und <img onerror> erscheint als Text, nichts ausgeführt')
  await page.close()
}

async function checkFilterWithoutRequest(browser) {
  const user = await registerUser('filter@example.com')
  const [first, second] = user.categories
  for (let i = 0; i < 30; i++) {
    await user.call('/api/events', {
      category_id: (i % 2 ? first : second).id,
      title: `Filterereignis ${i}`,
      date: `2025-${String((i % 12) + 1).padStart(2, '0')}-10`,
      significance: 50,
    })
  }
  const page = await browser.newPage()
  await login(page, user.email)
  await page.getByRole('heading', { name: 'Filterereignis 0', exact: true }).waitFor()

  const requests = []
  page.on('request', (request) => { if (request.url().includes('/api/')) requests.push(request.url()) })
  const filterButton = page.locator('button', { hasText: first.label }).last()
  const handle = await filterButton.elementHandle()
  const milliseconds = await page.evaluate((button) => new Promise((resolve) => {
    const start = performance.now()
    button.click()
    requestAnimationFrame(() => requestAnimationFrame(() => resolve(performance.now() - start)))
  }), handle)
  const visible = (await cardTitles(page)).length
  record('NFR-12a-02 Filter ohne Serveranfrage', requests.length === 0 && visible === 15,
    `${requests.length} Serveranfragen, ${visible} von 30 Events sichtbar`)
  record('NFR-12a-02 Filter unter 200 ms', milliseconds < 200, `${Math.round(milliseconds)} ms bis zur Darstellung`)
  await page.close()
}

async function checkLoadTime(browser, count, requirement, limitMs) {
  const user = await registerUser(`last${count}@example.com`)
  await seedEvents(user, count)
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  const page = await context.newPage()
  await login(page, user.email)

  // Neu laden und die Zeit bis zur vollständigen Darstellung messen.
  const start = Date.now()
  await page.reload()
  await page.waitForFunction((expected) => document.querySelectorAll('h3').length === expected, count, { timeout: 30000 })
  await page.waitForFunction(() => document.querySelectorAll('button[aria-label*=", Kategorie "]').length > 0)
  const milliseconds = Date.now() - start
  record(requirement, milliseconds < limitMs, `${count} Events in ${milliseconds} ms dargestellt (Grenze ${limitMs} ms)`)
  return { page, context, user }
}

async function checkLargeInventory(browser) {
  const { page, context, user } = await checkLoadTime(browser, 500, 'NFR-12e-01 Laden mit 500 Events', 5000)
  const steps = []

  // Filtern
  await page.locator('button', { hasText: user.categories[1].label }).last().click()
  const filtered = (await cardTitles(page)).length
  steps.push(`Filtern (${filtered} Events)`)
  await page.getByRole('button', { name: 'Alle', exact: true }).click()

  // Navigieren: Jahresansicht und Jahreswechsel
  await page.getByRole('button', { name: 'Jahresansicht' }).click()
  await page.getByRole('button', { name: 'Vorheriges Jahr' }).click()
  steps.push('Jahresansicht und Jahreswechsel')

  // Anlegen
  await page.getByRole('button', { name: 'Ereignis hinzufügen', exact: true }).click()
  await page.fill('#event-title', 'Neu bei 500')
  await page.getByRole('button', { name: 'Hinzufügen', exact: true }).click()
  await page.getByRole('heading', { name: 'Neu bei 500' }).waitFor()
  steps.push('Anlegen')

  // Bearbeiten
  const card = page.locator('div.group', { has: page.getByRole('heading', { name: 'Neu bei 500' }) })
  await card.getByRole('button', { name: 'Ereignis bearbeiten' }).click()
  await page.fill('#event-title', 'Geändert bei 500')
  await page.getByRole('button', { name: 'Speichern', exact: true }).click()
  await page.getByRole('heading', { name: 'Geändert bei 500' }).waitFor()
  steps.push('Bearbeiten')

  const total = (await cardTitles(page)).length
  record('NFR-12e-01 Bedienung mit 500 Events', filtered > 0 && filtered < 501 && total === 501,
    `${steps.join(', ')} funktionieren; danach ${total} Events`)
  await context.close()
}

async function checkNoHorizontalScroll(browser) {
  const user = await registerUser('layout@example.com')
  await seedEvents(user, 12)
  for (const [width, height] of [[375, 667], [1920, 1080]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 500, hasTouch: width < 500 })
    const page = await context.newPage()
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    const findings = []

    await page.goto(APP)
    await page.locator('#auth-email').waitFor()
    if (await overflow() > 0) findings.push('Anmeldung')

    await login(page, user.email)
    await page.locator('h3').first().waitFor()
    if (await overflow() > 0) findings.push('Hauptansicht')

    await page.getByRole('button', { name: 'Ereignis hinzufügen', exact: true }).click()
    await page.locator('#event-title').waitFor()
    if (await overflow() > 0) findings.push('Ereignisformular')
    const save = await page.getByRole('button', { name: 'Hinzufügen', exact: true }).boundingBox()
    if (!save || save.x + save.width > width) findings.push('Schaltfläche außerhalb')

    record(`NFR-10a-01 Layout ${width} × ${height}`, findings.length === 0,
      findings.length === 0 ? 'kein horizontales Scrollen in Anmeldung, Hauptansicht und Formular' : `horizontales Scrollen in: ${findings.join(', ')}`)
    await context.close()
  }
}

// ---------------------------------------------------------------- Ablauf

let browser
try {
  start(path.join(BACKEND_DIR, 'node_modules', 'tsx', 'dist', 'cli.mjs'), ['src/server.ts'], BACKEND_DIR, {
    PORT: String(API_PORT),
    DATABASE_PATH: path.join(tempDir, 'lifeline.db'),
    FRONTEND_ORIGIN: APP,
    NODE_ENV: 'test',
  })
  start(path.join(FRONTEND_DIR, 'node_modules', 'vite', 'bin', 'vite.js'), ['--port', String(APP_PORT), '--strictPort'], FRONTEND_DIR, {
    VITE_API_URL: API,
  })
  await waitFor(`${API}/api/health`)
  await waitFor(APP)

  browser = await launchBrowser()
  // Erster Aufruf, damit Vite alle Module übersetzt hat, bevor gemessen wird.
  const warmup = await browser.newPage()
  await warmup.goto(APP)
  await warmup.locator('#auth-email').waitFor()
  await warmup.close()

  await checkChronologicalOrder(browser)
  await checkTextNeutralisation(browser)
  await checkFilterWithoutRequest(browser)
  const { context } = await checkLoadTime(browser, 200, 'NFR-12a-01 Ladeverhalten mit 200 Events', 2000)
  await context.close()
  await checkLargeInventory(browser)
  await checkNoHorizontalScroll(browser)
} catch (error) {
  record('Ablauf', false, error instanceof Error ? error.message.split('\n')[0] : String(error))
} finally {
  await browser?.close()
  await stopAll()
}

const failed = results.filter((result) => !result.passed).length
console.log(`\n${results.length - failed}/${results.length} Prüfungen bestanden`)
process.exit(failed === 0 ? 0 : 1)
