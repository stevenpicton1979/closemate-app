import { login } from './actions'

const inputClass = 'w-full border border-zinc-700 rounded-lg px-3 py-3 text-base bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-zinc-100 text-center mb-1">CloseMate</h1>
        <p className="text-sm text-zinc-500 text-center mb-8">Sign in to your account</p>

        {error === 'invalid' && (
          <p className="text-sm text-red-400 text-center mb-4">Invalid email or password.</p>
        )}

        <form action={login} className="space-y-4">
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
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-100 text-zinc-900 text-sm font-medium py-3 rounded-full mt-2"
          >
            Sign in
          </button>
        </form>

        <p className="text-sm text-zinc-500 text-center mt-6">
          No account?{' '}
          <a href="/signup" className="text-zinc-300 hover:text-zinc-100">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
