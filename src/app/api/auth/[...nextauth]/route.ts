
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session }) {
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "supersecretkeywhichshouldbeinhiddenfile",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
