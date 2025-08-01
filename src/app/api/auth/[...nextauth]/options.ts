import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string,string> | undefined): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
        if(!credentials){
          throw new Error("No credentials provided.");
        }
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with the provided credentials.");
          }
          if (!user.isVerified) {
            throw new Error(
              "User is not verified. Please check your email for verification link."
            );
          }

          const isPasswordcorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordcorrect) {
            throw new Error("Invalid password. Please try again.");
          }
          return user;
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Unknown error during authorization.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      // You can also add other properties to the session object here
      // For example, if you want to include the user's email:
      // session.user.email = user.email;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
