"use server"
import { cookies } from "next/headers";
import { cache } from "react";

export const getSession = cache(session)

export async function session() {
  try {
    const response = await fetch(`http://localhost:8000/api/users/session`, {
      headers: { Cookie: cookies().toString() }
    })

    if (!response.ok) {
      throw 'token is invalid!'
    }
    
    const session = await response.json()

    return session

  } catch (error) {
    await (fetch('http://localhost:3000/api/signout'))
  }
}