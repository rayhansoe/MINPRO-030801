import { Navbar } from '@/components/component/navbar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toggle } from '@/components/ui/toggle';
import { destroySession, getSession, getUser } from '@/lib/sessions';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import {
  Form,
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
} from '@remix-run/react';
import {
  BadgeDollarSign,
  BadgePercent,
  PanelsTopLeft,
  Building,
  Building2,
  CirclePercent,
  CircleUser,
  CreditCard,
  DollarSign,
  Heart,
  Keyboard,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Moon,
  Percent,
  Receipt,
  ShoppingCart,
  Settings,
  Sun,
  Ticket,
  TicketPercent,
  TicketPercentIcon,
  User,
  Users,
  Users2,
  LineChart,
  CalendarRange,
} from 'lucide-react';

import { useHydrated } from 'remix-utils/use-hydrated';

import {
  getTheme,
  setTheme as setSystemTheme,
} from '@/components/theme-switcher';
import { useCallback, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/styles';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  try {
    if (!session.has('token')) {
      throw null;
    }

    const user = getUser(session.data.token!);

    console.log(user);

    return json(user);
  } catch (error) {
    return json(null, {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }
}

export default function AppLayout() {
  let session = useLoaderData<typeof loader>();
  let hydrated = useHydrated();
  let [, rerender] = useState({});
  let setTheme = useCallback((theme: string) => {
    setSystemTheme(theme);
    rerender({});
  }, []);
  let theme = getTheme();

  // let fetcher = useFetcher();

  return (
    <>
      {session && !session?.isActive && (
        <header className="flex items-center justify-center sticky top-0 h-10 bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50 border-b dark:border-b-slate-300/20">
          <h4 className="text-sm font-medium">
            Please check your email to activate your account!
          </h4>
        </header>
      )}
      <div
        className={cn(
          ' sticky top-0 bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50 border-b dark:border-b-slate-300/20',
          session && !session?.isActive && 'top-10',
        )}
      >
        <header className="container flex items-center justify-between gap-4 h-16 bg-background px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* <Link className="flex items-center gap-2" to="/">
              <TicketPercent className="h-6 w-6" />
              <span className="text-lg font-semibold">kitabuatevent</span>
            </Link> */}
            <Link
              to="#"
              className="flex items-center gap-2 text-lg font-semibold md:text-sm"
            >
              <TicketPercent className="h-7 w-7" />
              {/* <span className="font-semibold">kitabuatevent</span> */}
            </Link>
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <Link
                to="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Events
              </Link>
              <Link
                to="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Promo
              </Link>
              {/* <Link
                to="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Products
              </Link>
              <Link
                to="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Customers
              </Link>
              <Link
                to="#"
                className="text-foreground transition-colors hover:text-foreground"
              >
                Settings
              </Link> */}
            </nav>
          </div>
          <div className="flex items-center gap-4">
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
            {!session ? (
              <>
                <Button size={'sm'}>
                  <Link to={'/signin'}>Signin</Link>
                </Button>
              </>
            ) : session.role === 2 ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar>
                        <AvatarImage
                          src={`http://localhost:8000/public/images/${session.avatarUrl}`}
                          alt={session.username}
                        />
                        <AvatarFallback>
                          {session.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Organization</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link to={'/dashboard/profile'}>
                        <DropdownMenuItem>
                          <Building2 className="mr-2 h-4 w-4" />
                          <span>{session.username}</span>
                          {/* <DropdownMenuShortcut>10000</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                      </Link>
                      <Link to={'/dashboard'}>
                        <DropdownMenuItem>
                          <PanelsTopLeft className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                          {/* <DropdownMenuShortcut>10000</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                      </Link>
                      <Link to={'/dashboard/transactions'}>
                        <DropdownMenuItem>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          <span>Transactions</span>
                          {/* <DropdownMenuShortcut>10000</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                      </Link>
                      <Link to={'/dashboard/analytics'}>
                        <DropdownMenuItem>
                          <LineChart className="mr-2 h-4 w-4" />
                          <span>Analytics</span>
                          {/* <DropdownMenuShortcut>10000</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link to={'/dashboard/events'}>
                        <DropdownMenuItem>
                          <CalendarRange className="mr-2 h-4 w-4" />
                          <span>Events</span>
                          {/* <DropdownMenuShortcut>10000</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                      </Link>
                      <Link to={'/dashboard/events'}>
                        <DropdownMenuItem>
                          <Ticket className="mr-2 h-4 w-4" />
                          <span>Tickets</span>
                          {/* <DropdownMenuShortcut>10000</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                      </Link>
                      <Link to={'/dashboard/vouchers'}>
                        <DropdownMenuItem>
                          <Percent className="mr-2 h-4 w-4" />
                          <span>Vouchers</span>
                          {/* <DropdownMenuShortcut>3</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                      </Link>
                      <Link to={'/dashboard/profile/settings'}>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <Form className="flex-1" method="POST" action="/signout">
                      <button
                        className="w-full flex-1 text-start"
                        type="submit"
                        name="_action"
                        value={'signout'}
                      >
                        <DropdownMenuItem>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign out</span>
                        </DropdownMenuItem>
                      </button>
                    </Form>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar>
                        <AvatarImage
                          src={`http://localhost:8000/public/images/${session.avatarUrl}`}
                          alt={session.username}
                        />
                        <AvatarFallback>
                          {session.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link to={'/dashboard/profile'}>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          <span>{session.username}</span>
                          {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                      </Link>
                      <Link to={'/dashboard/points'}>
                        <DropdownMenuItem>
                          <DollarSign className="mr-2 h-4 w-4" />
                          <span>Points</span>
                          <DropdownMenuShortcut>10000</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={'/dashboard/vouchers'}>
                        <DropdownMenuItem>
                          <Percent className="mr-2 h-4 w-4" />
                          <span>Vouchers</span>
                          <DropdownMenuShortcut>3</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={'/dashboard/profile/settings'}>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link to={'/dashboard/transactions'}>
                        <DropdownMenuItem>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          <span>Transactions</span>
                          {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                      </Link>
                      <Link to={'/dashboard/tickets'}>
                        <DropdownMenuItem>
                          <Ticket className="mr-2 h-4 w-4" />
                          <span>Tickets</span>
                          {/* <DropdownMenuShortcut>10000</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                      </Link>
                      <Link to={'/dashboard/wishlist'}>
                        <DropdownMenuItem>
                          <Heart className="mr-2 h-4 w-4" />
                          <span>Wishlist</span>
                          {/* <DropdownMenuShortcut>3</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <Form className="flex-1" method="POST" action="/signout">
                      <button
                        className="w-full flex-1 text-start"
                        type="submit"
                        name="_action"
                        value={'signout'}
                      >
                        <DropdownMenuItem>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign out</span>
                        </DropdownMenuItem>
                      </button>
                    </Form>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button className="md:hidden" size="icon" variant="ghost">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px]" side="right">
                <div className="flex flex-col items-start gap-4 p-4">
                  <Toggle
                    aria-label="Toggle dark mode"
                    className="flex md:hidden"
                  >
                    <Moon className="h-5 w-5" />
                  </Toggle>
                  <nav className="flex flex-col items-start gap-2">
                    <Link
                      to="#"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="#"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Orders
                    </Link>
                    <Link
                      to="#"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Products
                    </Link>
                    <Link
                      to="#"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Customers
                    </Link>
                    <Link
                      to="#"
                      className="text-foreground transition-colors hover:text-foreground"
                    >
                      Settings
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
      </div>
      <Outlet />
    </>
  );
}
