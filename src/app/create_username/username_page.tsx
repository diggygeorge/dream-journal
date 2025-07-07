"use client";

import { useState } from 'react'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'


export default function CreateUsernamePage({ user }: { user: User | null }) {

  const supabase = createClient()
  const [username, setUsername] = useState<string | null>(null)

  async function createUsername() {
    try {
      const { error } = await supabase.from('profiles').update({
        username: username,
        updated_at: new Date().toISOString(),
      }).eq('id', user?.id)
      if (error) throw error
    } catch (error) {
      alert('Error updating the data!')
      console.log("Error:", error)
    } finally {
      redirect('/account')
    }
  }

  const alertUnmatched = function () {
    alert("Username must be between 4 and 16 characters!")
  }

  return (
    <form>
    <p>{user ? "User exists" : "User does not exist"}</p>
    <Card className="relative top-50 m-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create username</CardTitle>
        <CardDescription>
          Username has to be between 3 and 16 characters.  Note that you cannot change your name afterwards.
        </CardDescription>
      </CardHeader>
      <CardContent>
        
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <div className="w-full flex">
                <Input id="username" name="username" onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>
          </div>
          <div className="pt-2">
            <p>{username && (username.length < 3 || username.length > 16) ? "username must be between 3 and 16 characters!" : ""}</p>
          </div>
        
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button formAction={username && username.length >= 3 && username.length <= 16 ? createUsername : alertUnmatched} type="submit" className="w-full hover:cursor-pointer">
          Sign Up
        </Button>
      </CardFooter>
    </Card>
    </form>
    
  )
}