import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { commitSession, requireSession } from '@/lib/sessions';
import { cn } from '@/lib/styles';
import { UpdateIcon } from '@radix-ui/react-icons';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Check, ChevronsUp, Upload, UserPlus, UserPlus2 } from 'lucide-react';

export async function loader({ request }: LoaderFunctionArgs) {
  let { session, user } = await requireSession(request);

  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let _action = formData.get('_action') as 'upgrade' | 'delete';

  let { session } = await requireSession(request);

  let token = session.get('token')!;

  if (_action === 'delete') {
    return redirect('/dashboard/profile/settings');
  }

  try {
    let res = await fetch('http://localhost:8000/api/users/upgrade', {
      method: 'PATCH',
      headers: {
        Cookie: token,
      },
    });

    if (!res.ok) {
      throw await res.json();
    }

    let data = await res.json();

    session.set('token', data?.token);

    return redirect('/dashboard/profile/settings', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } catch (error) {
    throw redirect('/dashboard/profile/settings');
  }
}

export default function Page() {
  let { user } = useLoaderData<typeof loader>();
  let isUpgraded = user.role > 1;
  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <Form method="POST" className="flex flex-col gap-6">
          <Card
            className={cn(
              isUpgraded && 'text-muted-foreground dark:text-muted-foreground',
            )}
          >
            <CardHeader>
              <CardTitle>Upgrade to Event Organizer Account</CardTitle>
              <CardDescription>
                Transfer your project to another team or account without
                downtime or workflow interruptions.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent></CardContent>
            <CardFooter>
              <Button
                name="_action"
                value={'upgrade'}
                disabled={isUpgraded}
                className={cn(
                  'w-full',
                  isUpgraded &&
                    'disabled:pointer-events-auto disabled:cursor-not-allowed',
                )}
              >
                <ChevronsUp className="mr-2 h-4 w-4" /> Upgrade Now
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>
                The project will be permanently deleted, including its
                deployments and domains. This action is irreversible and can not
                be undone.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent></CardContent>
            <CardFooter>
              <Button
                disabled
                name="_action"
                value={'delete'}
                className={cn(
                  'w-full bg-destructive hover:bg-red-800 dark:bg-destructive dark:hover:bg-red-800 text-white dark:text-white disabled:pointer-events-auto disabled:cursor-not-allowed',
                )}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        </Form>
      </div>
    </>
  );
}
