"use client";

import { reset } from '../actions'
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

  return (
    <form className="bg-gradient-to-b from-[#03002e] to-[#7965c1] h-screen">
    <Card className="relative top-40 m-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email:
        </CardDescription>
      </CardHeader>
      <CardContent>
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
        
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button formAction={reset} type="submit" className="w-full hover:cursor-pointer">
          Confirm
        </Button>
      </CardFooter>
    </Card>
    </form>
    
  )
}