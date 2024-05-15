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
  Button
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createUser } from './action';
import { useFormState } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect } from 'react';

const SignupSchema = v.object({
  email: v.string([
    v.email('email is invalid'),
    v.minLength(8, 'email must be at least 2 characters.'),
  ]),
});

const defaultValues = {
  email: '',
};

export function SignupForm() {
  // ...
  const form = useForm<v.Input<typeof SignupSchema>>({
    resolver: valibotResolver(SignupSchema),
    defaultValues,
    mode: 'all'
  });

  const [state, formAction, isPending] = useFormState(createUser, undefined, undefined);

  return (
    <Card className="w-[350px] mx-auto my-32">
      <CardHeader>
        <CardTitle>Create project <span>{isPending ? 'true': 'false'}</span></CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button pendingState="Signing up" className='w-full mt-6' type="submit">Signup</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
