'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

// login function
export async function login(formData: FormData) {

  // supabase client created
  const supabase = await createClient()

  // gets the email and password
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  // signs in with password using the data, if error then redirected to error
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error?.code == "invalid_credentials") {
    console.log("Email or password incorrect!")
  }
  else if (error) {
    console.log("Error: ", error.name)
    console.log("Code: ", error.code)
    redirect('/error')
  }
  else {
    // changed data for '/', so redirected to account
    revalidatePath('/', 'layout')
    redirect('/account')
  } 
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // same thing but for signup
  const { error } = await supabase.auth.signUp(data)

  if (data.password.length < 3 || data.password.length > 16) {
    console.log("Please enter a password that is between 3 and 16 characters.")
  }
  else if (error) {
    redirect('/error')
  }
  else {
    revalidatePath('/', 'layout')
    redirect('/confirmation') // redirect to confirmation page
  }
}