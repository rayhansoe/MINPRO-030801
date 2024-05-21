import {
  PanelsTopLeft,
  Bell,
  Building2,
  DollarSign,
  Heart,
  Home,
  LineChart,
  LogOut,
  Menu,
  Package2,
  Percent,
  ReceiptText,
  Search,
  Settings,
  ShoppingCart,
  Ticket,
  TicketPercent,
  User,
  Users,
  CalendarRange,
  Sun,
  Moon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { requireSession } from '@/lib/sessions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useHydrated } from 'remix-utils/use-hydrated';
import { useCallback, useState } from 'react';
import {
  getTheme,
  setTheme as setSystemTheme,
} from '@/components/theme-switcher';

const dashboardNavUser = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Transactions',
    href: '/dashboard/transactions',
  },
  {
    title: 'Tickets',
    href: '/dashboard/tickets',
  },
  {
    title: 'Points',
    href: '/dashboard/vouchers',
  },
  {
    title: 'Vouchers',
    href: '/dashboard/vouchers',
  },
  {
    title: 'Wishlist',
    href: '/dashboard/wishlist',
  },
];

const dashboardNavOrg = [
  {
    title: 'Profile',
    href: '/dashboard',
  },
  {
    title: 'Upgrade',
    href: '/examples/forms/account',
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  let { user } = await requireSession(request);

  return json({ user });
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();
  let hydrated = useHydrated();
  let [, rerender] = useState({});
  let setTheme = useCallback((theme: string) => {
    setSystemTheme(theme);
    rerender({});
  }, []);
  let theme = getTheme();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="relative hidden border-r bg-slate-100 dark:bg-slate-900 md:block">
        <div className="sticky top-0 flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <TicketPercent className="h-7 w-7" />
              <span className="">kitabuatevent</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {user.role === 2 ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <PanelsTopLeft className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Transactions
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      6
                    </Badge>
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <LineChart className="h-4 w-4" />
                    Analytics
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <CalendarRange className="h-4 w-4" />
                    Events
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Ticket className="h-4 w-4" />
                    Tickets
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Percent className="h-4 w-4" />
                    Vouchers{' '}
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  >
                    <User className="h-4 w-4" />
                    Profile{' '}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <PanelsTopLeft className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Transactions
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      6
                    </Badge>
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Ticket className="h-4 w-4" />
                    Tickets
                  </Link>
                  <Link
                    to="/dashboard/vouchers"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <DollarSign className="h-4 w-4" />
                    Points
                    {/* <Badge className="ml-auto flex shrink-0 items-center justify-center rounded-full">
                      $10000
                    </Badge> */}
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Percent className="h-4 w-4" />
                    Vouchers{' '}
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist{' '}
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  >
                    <User className="h-4 w-4" />
                    Profile{' '}
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col">
        <header className="flex h-14 items-center sticky top-0 gap-4 border-b bg-slate-100 dark:bg-slate-900 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                {user.role === 2 ? (
                  <>
                    <Link
                      to="#"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <TicketPercent className="h-6 w-6" />
                      <span className="sr-only">kitabuatevent</span>
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <PanelsTopLeft className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Transactions
                      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        6
                      </Badge>
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <LineChart className="h-5 w-5" />
                      Analytics
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <CalendarRange className="h-5 w-5" />
                      Events
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Ticket className="h-5 w-5" />
                      Tickets
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Percent className="h-5 w-5" />
                      Vouchers
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="#"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <TicketPercent className="h-6 w-6" />
                      <span className="sr-only">kitabuatevent</span>
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <PanelsTopLeft className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Transactions
                      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        6
                      </Badge>
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Ticket className="h-5 w-5" />
                      Tickets
                    </Link>
                    <Link
                      to="/dashboard/vouchers"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <DollarSign className="h-5 w-5" />
                      Points
                      {/* <Badge className="ml-auto flex shrink-0 items-center justify-center rounded-full">
                        $10000
                      </Badge> */}
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Percent className="h-5 w-5" />
                      Vouchers
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Heart className="h-5 w-5" />
                      Wishlist
                    </Link>
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                  </>
                )}
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
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
          {user.role === 2 ? (
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
                        src={`http://localhost:8000/public/images/${user.avatarUrl}`}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username[0].toUpperCase()}
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
                        <span>{user.username}</span>
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
                        src={`http://localhost:8000/public/images/${user.avatarUrl}`}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username[0].toUpperCase()}
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
                        <span>{user.username}</span>
                        {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                      </DropdownMenuItem>
                    </Link>
                    <Link to={'/dashboard/vouchers'}>
                      <DropdownMenuItem>
                        <DollarSign className="mr-2 h-4 w-4" />
                        {/* <span>Points</span>
                        {/* <DropdownMenuShortcut>10000</DropdownMenuShortcut> */}
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
                        {/* <span>Tickets</span>
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
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </header>
        <main className="flex gap-4 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
