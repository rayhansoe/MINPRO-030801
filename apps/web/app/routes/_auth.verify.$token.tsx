import { commitSession, getSession } from "@/lib/sessions";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export async function loader({ params, request }: LoaderFunctionArgs) {
  try {
    
    if (!params.token) {
      throw null
    }

    const res = await fetch(`http://localhost:8000/api/users/verify/${params.token}`)

    if (!res.ok) {
      throw null
    }

    const data = await res.json()

    console.log(data, 'New Session');

    const session = await getSession(request.headers.get('Cookie'))

    session.set('token', data.token)
    
    
    return redirect('/', {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    })

  } catch (error) {
    throw redirect('/signin', {
      headers: {
        "Set-Cookie": ""
      }
    })
  }
}