import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic' // defaults to auto
export async function POST(request: Request) {
  cookies().delete('session')
  redirect('/')
}