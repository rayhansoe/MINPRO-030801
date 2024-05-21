// app/sessions.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node"; // or cloudflare/deno

import { IUserSession } from "@/types";
import jwt from "jsonwebtoken";

type SessionData = {
  token: string;
  resetToken?: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      // a Cookie from `createCookie` or the CookieOptions to create one
      cookie: {
        name: "session",

        // all of these are optional
        // domain: "remix.run",
        // Expires can also be set (although maxAge overrides it when used in combination).
        // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
        //
        // expires: new Date(Date.now() + 60_000),
        httpOnly: true,
        // maxAge: 60,
        path: "/",
        sameSite: "lax",
        // secrets: ["s3cret1"],
        secure: true,
      },
    }
  );

export function getUser(token: string): IUserSession | null {
  try {
    const session = jwt.verify(token, 'privateKey')
    return session as IUserSession
  } catch (error) {
    return null
  }
}

export { getSession, commitSession, destroySession };

export async function requireSession(request: Request) {
  // get the session
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);
  
  // validate the session, `token` is just an example, use whatever value you
  // put in the session when the user authenticated
  if (!session.has("token")) {
    // if there is no user session, redirect to login
    throw redirect("/signin", {
      headers: {
        "Set-Cookie": await destroySession(session)
      }
    });
  }
  
  const user = getUser(session.get('token')!)
  
  if (!user) {
    throw redirect("/signin", {
      headers: {
        "Set-Cookie": await destroySession(session)
      }
    });
  }

  if (!user.isActive) {
    throw redirect('/')
  }

  return {session, user};
}
