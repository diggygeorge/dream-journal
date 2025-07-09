"use client";

import { useSearchParams } from 'next/navigation'
import { update_password } from '../actions'
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
import { Suspense } from 'react'

function Code() {
const searchParams = useSearchParams()

  const code = searchParams.get('code')

  return (
    <input type="hidden" name="code" value={code ? code : ""}/>
  )
}


export default function ChangePasswordPage() {

  return (
    <form className="bg-gradient-to-b from-[#03002e] to-[#7965c1] h-screen">
    <Suspense>
        <Code/>
    </Suspense>
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