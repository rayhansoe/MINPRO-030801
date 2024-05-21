import { Signup } from '@/components/component/signup';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormInput,
  FormItem,
  FormMessage,
  Submit,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  commitSession,
  destroySession,
  getSession,
  getUser,
} from '@/lib/sessions';
import { SignupInput, SignupSchema } from '@/types/input';
import { valibotResolver } from '@hookform/resolvers/valibot';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { Link, useActionData, useFetcher } from '@remix-run/react';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, ValiError, flatten, parse } from 'valibot';

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

  try {
    parse(SignupSchema, body);

    const res = await fetch('http://localhost:8000/api/users', {
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
    if (e instanceof ValiError) {
      errors = flatten<typeof SignupSchema>(e);
    } else {
      const data = e as any;

      errors = data.errors as string;
    }

    console.log(errors);

    return json({ errors });
  }
}

const defaultValues: SignupInput = {
  username: '',
  email: '',
  displayName: '',
  registerCode: '',
  password: '',
  password2: '',
};

export default function SigninPage() {
  const [isShow, setIsShow] = useState(false);

  const form = useForm<Input<typeof SignupSchema>>({
    resolver: valibotResolver(SignupSchema),
    mode: 'all',
    defaultValues,
  });

  const fetcher = useFetcher<typeof action>();
  const isSubmitting = fetcher.state !== 'idle';
  const data = useActionData<typeof action>();

  return (
    <>
      <main className="md:container sm:py-8">
        <Card className="mx-auto max-w-md md:max-w-lg space-y-6">
          <CardHeader>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Sign Up</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your information to create an account
              </p>
              {typeof data?.errors === 'string' && (
                <p className="text-sm font-medium text-red-500 dark:text-red-900">
                  {data?.errors}
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <fetcher.Form method="POST">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="displayName">
                          Display Name{' '}
                          <span className="pl-1 text-red-500">*</span>
                        </Label>
                        <FormInput
                          {...field}
                          pending={isSubmitting}
                          id="displayName"
                          placeholder="Lee Robinson"
                          required
                        />
                        <FormMessage>
                          {typeof data?.errors !== 'string' &&
                            data?.errors?.nested.displayName}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="username">
                          Username <span className="pl-1 text-red-500">*</span>
                        </Label>
                        <FormInput
                          {...field}
                          pending={isSubmitting}
                          id="username"
                          placeholder="leerobinson"
                          required
                        />
                        <FormMessage>
                          {typeof data?.errors !== 'string' &&
                            data?.errors?.nested.username}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email">
                          Email <span className="pl-1 text-red-500">*</span>
                        </Label>
                        <FormInput
                          {...field}
                          pending={isSubmitting}
                          id="email"
                          placeholder="m@example.com"
                          required
                          type="email"
                        />
                        <FormMessage>
                          {typeof data?.errors !== 'string' &&
                            data?.errors?.nested.email}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="registerCode"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="registerCode">Referral Code</Label>
                        <FormInput
                          {...field}
                          pending={isSubmitting}
                          id="registerCode"
                          type="text"
                          placeholder="ABCD1234"
                        />
                        <FormMessage>
                          {typeof data?.errors !== 'string' &&
                            data?.errors?.nested.registerCode}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password">
                          Password <span className="pl-1 text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <FormInput
                            {...field}
                            pending={isSubmitting}
                            id="password"
                            placeholder="Enter your password"
                            required
                            type={isShow ? 'text' : 'password'}
                          />
                          <Button
                            type="button"
                            onClick={() =>
                              setIsShow((show) => (show ? false : true))
                            }
                            className="absolute inset-y-0 right-0 rounded-r-md"
                            size="icon"
                            variant="ghost"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </div>
                        <FormMessage>
                          {typeof data?.errors !== 'string' &&
                            data?.errors?.nested.password}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password2"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password2">
                          Re-Password{' '}
                          <span className="pl-1 text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <FormInput
                            {...field}
                            pending={isSubmitting}
                            id="password2"
                            placeholder="Enter your password"
                            required
                            type={isShow ? 'text' : 'password'}
                          />
                          <Button
                            type="button"
                            onClick={() =>
                              setIsShow((show) => (show ? false : true))
                            }
                            className="absolute inset-y-0 right-0 rounded-r-md"
                            size="icon"
                            variant="ghost"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </div>
                        <FormMessage>
                          {typeof data?.errors !== 'string' &&
                            data?.errors?.nested.password2}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <Submit
                    pending={isSubmitting}
                    className="w-full"
                    type="submit"
                  >
                    Sign Up
                  </Submit>
                </div>
              </fetcher.Form>
            </Form>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <div className="text-center text-sm">
              Already have an account?
              <Link
                className="pl-1 font-medium underline underline-offset-4 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:hover:text-gray-50 dark:focus:ring-gray-300"
                to="/signin"
              >
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
