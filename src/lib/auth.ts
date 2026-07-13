import type { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * Auth for learnai.
 *
 * Primary (once provisioned): Microsoft Entra ID via OIDC — the same setup the
 * SC Agents platform uses. The Azure provider only turns on when the
 * AZURE_AD_* env vars are present, so no code change is needed to go live:
 * IT registers the app, you drop the three values into the environment, and
 * the "Sign in with Microsoft" button starts working.
 *
 * Interim / break-glass: a shared username + password (Credentials provider),
 * kept working until SSO is live so the site is never locked out.
 */

export const ssoEnabled = Boolean(
  process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_TENANT_ID,
);

const FALLBACK_USER = process.env.LEARNAI_USER ?? 'nesrai';
const FALLBACK_PASS = process.env.LEARNAI_PASS ?? 'nesr123456';

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
    CredentialsProvider({
      name: 'Password',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials?.username === FALLBACK_USER &&
          credentials?.password === FALLBACK_PASS
        ) {
          return {
            id: 'shared',
            name: 'NESR AIverse',
            email: `${FALLBACK_USER}@nesr.com`,
          };
        }
        return null;
      },
    }),
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
