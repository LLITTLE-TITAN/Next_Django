import NextAuth from 'next-auth';
import  {authConfig}  from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import google from 'next-auth/providers/google'
import { User } from '@/lib/definitions';

export const {handlers: { GET, POST }, auth, signIn, signOut, update} = NextAuth({
    ...authConfig,
    providers: [
        google({
            clientId: process.env.GOOGLE_ID ?? '',
            clientSecret: process.env.GOOGLE_SECRET ?? '',
            authorization: {
                params: {
                  prompt: "consent",
                  access_type: "offline",
                  response_type: "code"
                }
              }
          }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
          if (account.provider === "google") {
            return profile.email_verified && profile.email.endsWith("@gmail.com")
          }
          return true // Do different verification for other providers that don't have `email_verified`
        },
      }
});