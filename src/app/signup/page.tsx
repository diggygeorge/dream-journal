"use client";

import { signup } from '../actions'
import { useState } from 'react'

export default function SignupPage() {

  const [isHidden, setHidden] = useState(true)

  return (
    <form className="block">
      <label htmlFor="email">Enter Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Create password:</label>
      <input id="password" name="password" type={isHidden ? "password" : ""} required />
      <label htmlFor="password">Confirm password:</label>
      <input id="confirm_password" name="confirm_password" type={isHidden ? "password" : ""} required />
      <button onClick={(e: React.MouseEvent) => {
                                e.preventDefault()
                                setHidden(!isHidden)
                                }}>Set Visibility</button>
      <button className="border-2 border-white rounded-lg p-2 hover:bg-gray-800" formAction={signup}>Sign up</button>
    </form>
  )
}