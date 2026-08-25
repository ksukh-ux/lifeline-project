import { useState } from 'react'

interface AuthFormsProps {
  onLogin: () => void
}

export default function AuthForms({ onLogin }: AuthFormsProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Bitte E-Mail und Passwort eingeben.')
      return
    }

    if (isRegister && password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.')
      return
    }

    // Aktuell nur UI – Backend-Anbindung folgt später.
    onLogin()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass-500">
            Lifeline
          </p>

          <h1 className="mt-3 bg-gradient-to-r from-orange-400 via-pink-500 to-violet-500 bg-clip-text font-display text-4xl font-medium text-transparent">
            {isRegister ? 'Konto erstellen' : 'Willkommen zurück'}
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            {isRegister
              ? 'Erstelle ein Konto für deine persönliche Timeline.'
              : 'Melde dich an, um deine persönliche Timeline zu öffnen.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/10 bg-ink-900/60 p-6 shadow-xl"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                E-Mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-md border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-brass-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Passwort
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-brass-500"
              />
            </div>

            {isRegister && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Passwort wiederholen
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-brass-500"
                />
              </div>
            )}
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-rose-400/20 bg-rose-400/5 px-3 py-2 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-brass-500 px-4 py-2.5 text-sm font-medium text-ink-950 transition hover:bg-brass-400"
          >
            {isRegister ? 'Registrieren' : 'Anmelden'}
          </button>

          <div className="mt-5 text-center text-sm text-slate-500">
            {isRegister ? 'Bereits ein Konto?' : 'Noch kein Konto?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setError('')
              }}
              className="font-medium text-brass-500 transition hover:text-brass-400"
            >
              {isRegister ? 'Anmelden' : 'Registrieren'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
