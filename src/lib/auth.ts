import type { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * Auth for learnai — Microsoft Entra ID (SSO) only in production.
 *
 * The Azure provider only turns on when the AZURE_AD_* env vars are present.
 * There is intentionally no fallback/bypass login in production; if SSO
 * isn't configured, sign-in is unavailable and the login page says so
 * rather than rendering a button that can't work.
 */
export const ssoEnabled = Boolean(
  process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_TENANT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET,
);

/**
 * One-click "Continue as Dev User" for testing locally without a real
 * Microsoft login (e.g. to preview the launch animation). Requires BOTH a
 * non-production NODE_ENV and an explicit opt-in env var, so it can't end up
 * live by accident even if one of the two is misconfigured.
 */
export const devBypassEnabled =
  process.env.NODE_ENV !== 'production' && process.env.LOCAL_AUTH_BYPASS === 'true';

export const authOptions: NextAuthOptions = {
  providers: [
    ...(ssoEnabled
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID as string,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? '',
            tenantId: process.env.AZURE_AD_TENANT_ID as string,
            authorization: { params: { scope: 'openid profile email' } },
          }),
        ]
      : []),
    ...(devBypassEnabled
      ? [
          CredentialsProvider({
            id: 'dev-bypass',
            name: 'Dev bypass',
            credentials: {},
            async authorize() {
              return { id: 'dev@nesr.com', name: 'Dev User', email: 'dev@nesr.com' };
            },
          }),
        ]
      : []),
  ],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.name = (token.name as string) ?? session.user.name;
        session.user.email = (token.email as string) ?? session.user.email;
      }
      return session;
    },
  },
};
