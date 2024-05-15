import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/shared/navbar/icons"
import { MainNav } from "@/components/shared/navbar/main-nav"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { getSession } from "@/lib"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const signout = async () => {
  "use server"
  cookies().delete('session')
  redirect('/')
}

export default async function SiteHeader() {

  
  const session = await getSession()

  return (
    <header className="bg-slate-50 dark:bg-slate-950 sticky top-0 z-40 w-full border-b dark:border-b-slate-300/20">
      <div className="container mx-auto flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
           
            <ThemeToggle />
            {
              session ? (<form action={signout}><Button variant={'outline'} type="submit">Signout</Button></form>) : (<Link href={'/signin'}><Button>Signin</Button></Link>)
            }
            
          </nav>
        </div>
      </div>
    </header>
  )
}