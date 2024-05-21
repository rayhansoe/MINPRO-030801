import { Signin } from '@/components/component/signin';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  commitSession,
  destroySession,
  getSession,
  getUser,
} from '@/lib/sessions';
import { SigninSchema } from '@/types/input';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import {
  Link,
  json,
  redirect,
  useActionData,
  useFetcher,
} from '@remix-run/react';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';
import { valibotResolver } from '@hookform/resolvers/valibot';
import {
  Submit,
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormInput,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  try {
    if (!session.has('token')) {
      throw null;
    }

    const user = getUser(session.data.token!);

    if (user) {
      return redirect('/');
    }

    return user;
  } catch (error) {
    return json(null, {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  console.log(body, 'body');

  try {
    v.parse(SigninSchema, body);

    const res = await fetch('http://localhost:8000/api/users/signin', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw await res.json();
    }

    const data = await res.json();

    console.log(data?.token);

    const session = await getSession(request.headers.get('Cookie'));

    session.set('token', data.token);

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } catch (e) {
    let errors;
    if (e instanceof v.ValiError) {
      errors = v.flatten<typeof SigninSchema>(e);
    } else {
      const data = e as any;

      errors = data.errors as string;
    }

    console.log(errors);

    return json({ errors });
  }
}

const defaultValues = {
  data: '',
  password: '',
};

export default function SigninPage() {
  const [isShow, setIsShow] = useState(false);
  const fetcher = useFetcher<typeof action>();
  const isSubmitting = fetcher.state === 'submitting';

  const form = useForm<v.Input<typeof SigninSchema>>({
    resolver: valibotResolver(SigninSchema),
    defaultValues,
    mode: 'all',
  });

  const data = useActionData<typeof action>();

  return (
    <>
      <main className="container py-28">
        <div className="mx-auto max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your credentials to access your account
            </p>
            {typeof data?.errors === 'string' && (
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {data?.errors}
              </p>
            )}
            {typeof fetcher.data?.errors === 'string' && (
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {fetcher.data?.errors}
              </p>
            )}
          </div>
          <Form {...form}>
            <fetcher.Form method="post">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="data">Username or Email</Label>
                      <FormInput
                        id="data"
                        pending={isSubmitting}
                        placeholder="Enter your username or email"
                        required
                        type="text"
                        {...field}
                      />
                      <FormMessage>
                        {typeof data?.errors !== 'string' &&
                          data?.errors?.nested.data}
                        {typeof fetcher?.data?.errors !== 'string' &&
                          fetcher.data?.errors?.nested.data}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <FormInput
                          pending={isSubmitting}
                          id="password"
                          placeholder="Enter your password"
                          required
                          type={isShow ? 'text' : 'password'}
                          {...field}
                        />
                        <Button
                          onClick={() =>
                            setIsShow((show) => (show ? false : true))
                          }
                          className="absolute inset-y-0 right-0 rounded-r-md"
                          size="icon"
                          variant="ghost"
                          type="button"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </div>
                      <FormMessage>
                        {typeof data?.errors !== 'string' &&
                          data?.errors?.nested.password}
                        {typeof fetcher?.data?.errors !== 'string' &&
                          fetcher.data?.errors?.nested.password}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <Link
                    className="text-sm font-medium underline underline-offset-4 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:hover:text-gray-50 dark:focus:ring-gray-300"
                    to="#"
                  >
                    Forgot Password?
                  </Link>
                  <Submit
                    pending={isSubmitting}
                    className="shrink-0"
                    type="submit"
                  >
                    Sign In
                  </Submit>
                </div>
              </div>
            </fetcher.Form>
          </Form>
          <div className="text-center text-sm">
            Don't have an account?
            <Link
              className="pl-1 font-medium underline underline-offset-4 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:hover:text-gray-50 dark:focus:ring-gray-300"
              to="/signup"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
