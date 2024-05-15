"use server"

import axios from 'axios'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import * as v from 'valibot'

const schema = v.object({
  data: v.string([v.minLength(5, 'Should be at least 5 character(s)'), v.maxLength(256, 'asdadwd')]),
  password: v.string([v.minLength(8), v.maxLength(512)]),
})

type Error = v.FlatErrors<typeof schema>

export async function signin(prevState: any, formData: FormData) {

  try {
    
    console.log(formData)

    const res = await fetch('http://localhost:8000/api/users/signin', {
      method: 'POST',
      body: formData,
    })
  
    const user = await res.json()
  
    
    if (!user.token) {
      throw user?.errors
    }
    
    console.log(user);

    cookies().set({
      name: 'session',
      value: user?.token,
      httpOnly: true,
      path: '/',
    })
  } catch (errors: any) {
    console.log(errors, 'HEEYYYY');
    
    if (errors?.nested) {
      let err = errors as Error
      return err.nested
      
    } else {
      return errors as string
    }
    
  }
  
  redirect('/')
}