import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { commitSession, requireSession } from '@/lib/sessions';
import { valibotResolver } from '@hookform/resolvers/valibot';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  Input as vInput,
  email,
  maxLength,
  minLength,
  object,
  string,
} from 'valibot';

const profileFormSchema = object({
  displayName: string([
    minLength(2, 'Display Name must be at least 2 characters.'),
    maxLength(30, 'Display Name must not be longer than 30 characters.'),
  ]),
  bio: string([maxLength(160)]),
});

type ProfileFormValues = vInput<typeof profileFormSchema>;

// This can come from your database or API.

export async function loader({ request }: LoaderFunctionArgs) {
  let { user, session } = await requireSession(request);

  let token = session.get('token')!;

  try {
    let res = await fetch('http://localhost:8000/api/users/profile', {
      headers: {
        Cookie: token,
      },
    });

    if (!res.ok) {
      throw await res.json();
    }

    let profile = await res.json();

    console.log(profile);

    return json({ profile: profile.users });
  } catch (error) {
    throw redirect('/');
  }
}

export async function action({ request }: ActionFunctionArgs) {
  let { user, session } = await requireSession(request);

  let token = session.get('token')!;

  let formData = await request.formData();

  try {
    let res = await fetch('http://localhost:8000/api/users/profile', {
      method: 'PATCH',
      headers: {
        Cookie: token,
      },
      body: formData
    });

    if (!res.ok) {
      throw await res.json();
    }

    const profile = await res.json();
    console.log(profile);

    session.set('token', profile?.token)
    return redirect('/dashboard/profile', {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    });
  } catch (error) {
    console.log(error);

    throw redirect('/signin');
  }
}

export default function Page() {
  let { profile } = useLoaderData<typeof loader>();

  const defaultValues: ProfileFormValues = {
    displayName: profile?.displayName || '',
    bio: profile?.bio || '',
  };

  const form = useForm<ProfileFormValues>({
    resolver: valibotResolver(profileFormSchema),
    defaultValues,
    mode: 'all',
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const fetcher = useFetcher();

  return (
    <>
      <Form {...form}>
        <fetcher.Form
          // onSubmit={form.handleSubmit(onSubmit)}
          method="POST"
          className="space-y-8"
          encType='multipart/form-data'
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2">
            <Avatar className="w-24 h-24">
              <AvatarImage src={`http://localhost:8000/public/images/${profile?.avatarUrl}`} />
              <AvatarFallback>{profile?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <Input
              className="w-min"
              name="file"
              type="file"
              accept="image/png, image/gif, image/jpeg"
            />
          </div>
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a pseudonym. You can only change this once every 30 days.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='space-y-2'>
            <Label>Referral Code</Label>
          <Input disabled value={profile.referralCode} />
          </div>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations to
                  link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update profile</Button>
        </fetcher.Form>
      </Form>
    </>
  );
}
