import { useState, type FormEvent } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { login, register, type AuthUser } from '../api/client'

interface Props {
  onAuthenticated: (user: AuthUser) => void
}

// Registrierungs-/Login-Seite (UC-07). Wird angezeigt, solange keine
// gültige Session besteht (siehe App.tsx). Ersetzt die frühere
// automatische Demo-Anmeldung.
export default function AuthForms({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isRegister = mode === 'register'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (isRegister && password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }

    setIsSubmitting(true)
    try {
      const user = isRegister
        ? await register(email.trim(), password)
        : await login(email.trim(), password)
      onAuthenticated(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Etwas ist schiefgelaufen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-ink-900 p-8 shadow-2xl">
        <h1 className="bg-gradient-to-r from-orange-400 via-pink-500 to-violet-500 bg-clip-text text-center font-display text-4xl font-medium text-transparent">
          Lifeline
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          {isRegister
            ? 'Erstelle ein Konto, um deine Timeline zu beginnen.'
            : 'Melde dich an, um deine Timeline zu sehen.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              E-Mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="du@beispiel.de"
              className="w-full rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brass-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isRegister ? 8 : undefined}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              placeholder={isRegister ? 'Mindestens 8 Zeichen' : '••••••••'}
              className="w-full rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brass-500"
            />
          </div>

          {error && (
            <p className="rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brass-500 px-4 py-2 text-sm font-medium text-ink-950 transition hover:bg-brass-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRegister ? <UserPlus size={16} /> : <LogIn size={16} />}
            {isSubmitting
              ? 'Einen Moment …'
              : isRegister
                ? 'Konto erstellen'
                : 'Anmelden'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(isRegister ? 'login' : 'register')
            setError(null)
          }}
          className="mt-5 w-full text-center text-sm text-slate-400 transition hover:text-slate-200"
        >
          {isRegister
            ? 'Bereits ein Konto? Anmelden'
            : 'Noch kein Konto? Registrieren'}
        </button>
      </div>
    </div>
  )
}
