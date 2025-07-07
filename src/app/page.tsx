"use client";

import { login } from './actions'
import { useState } from 'react'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function LoginPage() {

  const [isHidden, setHidden] = useState(true)

  return (
    <div className="">
      <form>
      <Card className="relative top-50 m-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button className="hover:cursor-pointer" onClick={() => redirect('/signup')} variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/reset"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="w-full flex">
                  <Input id="password" name="password" type={isHidden ? "password" : ""} required />
                  <div className="hover:cursor-pointer" onClick={(e: React.MouseEvent) => {
                                      e.preventDefault()
                                      setHidden(!isHidden)
                                      }}>{isHidden ? <EyeOff className="pl-2" size="40px"/> : <Eye className="pl-2" size="40px"/>}</div>
                </div>
              </div>
            </div>
          
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button formAction={login} type="submit" className="w-full hover:cursor-pointer">
            Login
          </Button>
          <Button variant="outline" onClick={() => redirect('/anonymous')} type="submit" className="w-full hover:cursor-pointer">
            View as Guest
          </Button>
        </CardFooter>
      </Card>
      </form>
    </div>
  )
}