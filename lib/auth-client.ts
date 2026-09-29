"use client";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", input: false },
        username: { type: "string", required: false, input: false },
        banned: { type: "boolean", input: false },
      },
    }),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;
