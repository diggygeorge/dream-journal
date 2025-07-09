"use client";

import { signup } from '../actions'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from 'lucide-react';
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

export default function SignupPage() {

  const [isHidden, setHidden] = useState(true)
  const [password, setPassword] = useState("")
  const [confirm_password, setConfirmPassword] = useState("")

  const alertUnmatched = function () {
    alert("Passwords must match!")
  }

  return (
    <form className="bg-gradient-to-b from-[#03002e] to-[#7965c1] h-screen">
    <Card className="relative top-40 m-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Enter your email and new password:
        </CardDescription>
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
              <Label htmlFor="password">Password</Label>
              <div className="w-full flex">
                <Input id="password" name="password" type={isHidden ? "password" : ""} onChange={(e) => setPassword(e.target.value)} required />
                <div className="hover:cursor-pointer" onClick={(e: React.MouseEvent) => {
                                    e.preventDefault()
                                    setHidden(!isHidden)
                                    }}>{isHidden ? <EyeOff className="pl-2" size="40px"/> : <Eye className="pl-2" size="40px"/>}</div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <div className="w-full flex">
                <Input id="confirm_password" name="confirm_password" type={isHidden ? "password" : ""} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>
          </div>
          <div className="pt-2">
            <p>{(password !== confirm_password && confirm_password.length > 0) ? "Passwords must match!" : ""}</p>
            <p>{password.length < 3 || password.length > 16 ? "Password must be between 3 and 16 characters!" : ""}</p>
          </div>
        
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button formAction={password == confirm_password ? signup : alertUnmatched} type="submit" className="w-full hover:cursor-pointer">
          Sign Up
        </Button>
      </CardFooter>
    </Card>
    </form>
    
  )
}