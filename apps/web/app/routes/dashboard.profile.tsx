import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/styles';
import { Link, Outlet, useLocation } from '@remix-run/react';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/dashboard/profile',
  },
  {
    title: 'Settings',
    href: '/dashboard/profile/settings',
  },
];

export default function Page() {
  const location = useLocation();
  return (
    <>
      <div className="space-y-6 p-8 pb-12 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">My Account</h2>
          <p className="text-muted-foreground">
            Manage your profile account and settings.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <nav
              className={cn(
                'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
                // className,
              )}
              // {...props}
            >
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    location.pathname === item.href
                      ? 'bg-muted hover:bg-muted'
                      : 'hover:bg-transparent hover:underline',
                    'justify-start',
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
