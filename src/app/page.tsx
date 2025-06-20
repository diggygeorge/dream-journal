"use client";

import { login } from './actions'
import { useState } from 'react'
import { redirect } from 'next/navigation'

export default function LoginPage() {

  const [isHidden, setHidden] = useState(true)

  return (
    <>
      <form className="block">
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type={isHidden ? "password" : ""} required />
        <button onClick={(e: React.MouseEvent) => {
                                  e.preventDefault()
                                  setHidden(!isHidden)
                                  }}>Set Visibility</button>
        <button className="border-2 border-white rounded-lg p-2 hover:bg-gray-800" formAction={login}>Log in</button>
      </form>
      <div>
        <button className="border-2 border-white rounded-lg p-2 hover:bg-gray-800" onClick={() => redirect('/signup')}>Create Account</button>
      </div>
    </>
  )
}