import { Separator } from '@/components/ui/separator';
import { Outlet } from '@remix-run/react';

export default function Page() {
  return (
    <>
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <Outlet />
      </div>
    </>
  );
}
