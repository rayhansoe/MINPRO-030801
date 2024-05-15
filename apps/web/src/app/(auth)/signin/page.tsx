
import { SigninForm } from "@/components/pages/SigninForm";
import { getSession } from "@/lib";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {

  // const data = await fetch('http://localhost:8000/api/users', {
  //   headers: { Cookie: cookies().toString() }
  // })

  const session = await getSession()

  // const users = await data.json()

  if (session) {
    redirect('/')
  }
  

  return (
    <>
      <main className="container mx-auto">
        <SigninForm />
      </main>
    </>
  );
}
