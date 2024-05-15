'use client';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signin } from './action';
import { useFormState } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const signinSchema = v.object({
  data: v.string([
    v.minLength(5, 'Should be at least 5 character(s)'),
    v.maxLength(256),
  ]),
  password: v.string([v.minLength(8, 'Should be at least 8 character(s)'), v.maxLength(512)]),
});

const defaultValues = {
  data: '',
  password: '',
};

export function SigninForm() {
  // ...
  const form = useForm<v.Input<typeof signinSchema>>({
    resolver: valibotResolver(signinSchema),
    defaultValues,
    mode: 'all',
  });

  const [state, formAction] = useFormState(signin, undefined, undefined);

  return (
    <Card className="w-[350px] mx-auto my-32">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction}>
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="username or email" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage>
                    {typeof state !== 'string' && state?.data}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage>
                    {typeof state !== 'string' && state?.password}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              pendingState="Submitting..."
              className="w-full mt-5"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      {typeof state === 'string' && <CardFooter className='flex justify-center item-center'><p className='text-sm font-medium text-red-500 dark:text-red-900'>{state}</p></CardFooter>}
    </Card>
  );
}
