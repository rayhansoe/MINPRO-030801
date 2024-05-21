import {
  getTheme,
  setTheme as setSystemTheme,
} from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getSession, getUser } from '@/lib/sessions';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, Outlet, redirect } from '@remix-run/react';
import {
  CircleUser,
  Menu,
  Moon,
  Package2,
  Search,
  Sun,
  TicketPercent,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const session = await getSession(request.headers.get('Cookie'));

    const user = getUser(session.data.token!);

    if (user) {
      return redirect('/');
    }

    console.log(user);

    return user;
  } catch (error) {
    return null;
  }
}

export default function AuthLayout() {
  const [, rerender] = useState({});
  const setTheme = useCallback((theme: string) => {
    setSystemTheme(theme);
    rerender({});
  }, []);
  const theme = getTheme();
  return (
    <>
      <header className="flex items-center justify-between gap-4 sticky top-0 h-16 border-b bg-background px-4 md:px-6">
        <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <TicketPercent className="h-7 w-7" />
            <span className="sr-only">kitabuatevent</span>
          </Link>
        </nav>
        <div className="flex w-full items-center justify-end gap-4 md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2">
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button
                  type="button"
                  className="w-full"
                  onClick={() => setTheme('light')}
                  aria-selected={theme === 'light'}
                >
                  Light
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  type="button"
                  className="w-full"
                  onClick={() => setTheme('dark')}
                  aria-selected={theme === 'dark'}
                >
                  Dark
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  type="button"
                  className="w-full"
                  onClick={() => setTheme('system')}
                  aria-selected={theme === 'system'}
                >
                  System
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size={'sm'}  variant={'outline'}>
            <Link to={'/signin'}>Signin</Link>
          </Button>
          <Button size={'sm'} >
            <Link to={'/signup'}>Signup</Link>
          </Button>
        </div>
      </header>
      <Outlet />
    </>
  );
}
