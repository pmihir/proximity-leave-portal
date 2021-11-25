import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.accessToken = user._id;
        token.user = user;
      }
      return token;
    },
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.SECRET,
    encryption: true,
    signingKey: process.env.SIGNING_KEY,
    encryptionKey: process.env.ENCRYPTION_KEY,
  },
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
});
