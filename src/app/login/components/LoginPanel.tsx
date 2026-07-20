'use client';

interface LoginPanelProps {
  ssoEnabled: boolean;
  devBypassEnabled: boolean;
  loading: boolean;
  error: string | null;
  fadingOut: boolean;
  onSignIn: () => void;
  onDevBypass: () => void;
}

export default function LoginPanel({
  ssoEnabled,
  devBypassEnabled,
  loading,
  error,
  fadingOut,
  onSignIn,
  onDevBypass,
}: LoginPanelProps) {
  return (
    <div
      className={`flex flex-col items-center text-center px-4 min-h-0 ${fadingOut ? 'animate-panel-fade-out' : ''}`}
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
        Let&apos;s launch your <span className="text-[#39ff88]">AI</span> journey.
      </h1>
      <p className="mt-2 text-sm sm:text-base text-white/80 max-w-sm">
        Sign in with your NESR Microsoft account to board.
      </p>

      <div className="mt-5 sm:mt-6 w-full max-w-xs">
        {!ssoEnabled ? (
          <p className="rounded-xl border border-[#39ff88]/25 bg-white/5 px-4 py-3 text-sm text-white/90">
            Single sign-on isn&apos;t configured yet. Contact IT to get access.
          </p>
        ) : (
          <button
            type="button"
            onClick={onSignIn}
            disabled={loading}
            aria-busy={loading}
            className="group relative w-full inline-flex items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold text-black bg-[#39ff88] shadow-[0_0_25px_-5px_rgba(57,255,136,0.7)] hover:shadow-[0_0_35px_-4px_rgba(57,255,136,0.9)] hover:bg-[#5cffa1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff88] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                Preparing for launch…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 23 23" aria-hidden="true">
                  <path fill="#0a0f0d" d="M1 1h10v10H1z" />
                  <path fill="#0a0f0d" d="M12 1h10v10H12z" />
                  <path fill="#0a0f0d" d="M1 12h10v10H1z" />
                  <path fill="#0a0f0d" d="M12 12h10v10H12z" />
                </svg>
                Sign in with Microsoft
              </>
            )}
          </button>
        )}

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-2.5 text-sm text-red-200"
          >
            {error}
          </p>
        )}

        {devBypassEnabled && (
          <button
            type="button"
            onClick={onDevBypass}
            disabled={loading}
            className="mt-3 w-full rounded-xl border border-dashed border-white/30 px-4 py-2.5 text-xs font-medium text-white/70 hover:text-white hover:border-white/60 disabled:opacity-50 transition-colors"
          >
            Continue as Dev User (local only)
          </button>
        )}
      </div>
    </div>
  );
}
