import { signup } from './actions'
import PasswordInput from '@/components/password-input'
import SubmitButton from '@/components/submit-button'

const inputClass = 'w-full border border-zinc-700 rounded-lg px-3 py-3 text-base bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-zinc-100 text-center mb-1">CloseMate</h1>
        <p className="text-sm text-zinc-500 text-center mb-8">Create your account</p>

        {error === 'exists' && (
          <p className="text-sm text-red-400 text-center mb-4">An account with this email already exists.</p>
        )}

        <form action={signup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
            <PasswordInput id="password" name="password" autoComplete="new-password" minLength={8} />
            <p className="text-xs text-zinc-500 mt-1">Minimum 8 characters</p>
          </div>
          <SubmitButton label="Create account" />
        </form>

        <p className="text-sm text-zinc-500 text-center mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-zinc-300 hover:text-zinc-100">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
