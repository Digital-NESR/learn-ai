'use client';

import Starfield from './components/Starfield';
import Spaceship from './components/Spaceship';
import LoginPanel from './components/LoginPanel';
import { useLoginLaunch } from './useLoginLaunch';

export default function LoginForm({
  ssoEnabled,
  devBypassEnabled,
}: {
  ssoEnabled: boolean;
  devBypassEnabled: boolean;
}) {
  const { phase, loading, error, overlayVisible, handleSignIn, handleDevBypass } = useLoginLaunch();
  const shipPhase = phase === 'igniting' ? 'ignition' : phase === 'launching' || phase === 'arriving' ? 'launch' : 'idle';
  const panelFadingOut = phase !== 'idle';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center px-4 py-12">
      <Starfield />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6 sm:gap-8">
        <div className="w-40 sm:w-48 md:w-56">
          <Spaceship phase={shipPhase} />
        </div>
        <LoginPanel
          ssoEnabled={ssoEnabled}
          devBypassEnabled={devBypassEnabled}
          loading={loading}
          error={error}
          fadingOut={panelFadingOut}
          onSignIn={handleSignIn}
          onDevBypass={handleDevBypass}
        />
      </div>

      <p className="relative z-10 mt-10 text-center text-xs text-white/30">NESR Digital Supply Chain</p>

      {/* Masks the underlying page navigation once the ship is mid-launch. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-20 bg-black opacity-0 ${
          overlayVisible ? 'animate-screen-fade-to-black' : ''
        }`}
      />
    </div>
  );
}
