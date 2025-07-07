"use client";

import { update_password } from '../actions'
import { useState } from 'react'
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

export default function SignupPage() {

  const [password, setPassword] = useState("")

  return (
    <form>
    <Card className="relative top-40 m-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your new password:
        </CardDescription>
      </CardHeader>
      <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
        
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button formAction={update_password} type="submit" className="w-full hover:cursor-pointer">
          Update
        </Button>
      </CardFooter>
    </Card>
    </form>
    
  )
}