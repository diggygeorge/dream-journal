"use client";

import { signup } from '../actions'
import { useState } from 'react'

export default function SignupPage() {

  const [isHidden, setHidden] = useState(true)
  const [password, setPassword] = useState("")
  const [confirm_password, setConfirmPassword] = useState("")

  const handleSignUp = () => {
    if (password == confirm_password) {
      signup
    }
    else {
      alert("Passwords must match!")
    }
  }

  return (
    <>
      <form className="block">
        <label htmlFor="email">Enter Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Create password:</label>
        <input id="password" name="password" type={isHidden ? "password" : ""} onChange={(e) => setPassword(e.target.value)} required />
        <label htmlFor="password">Confirm password:</label>
        <input id="confirm_password" name="confirm_password" type={isHidden ? "password" : ""} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button onClick={(e: React.MouseEvent) => {
                                  e.preventDefault()
                                  setHidden(!isHidden)
                                  }}>Set Visibility</button>
        <button className="border-2 border-white rounded-lg p-2 hover:bg-gray-800" formAction={handleSignUp}>Sign up</button>
      </form>
      <div>
        <p>{(password !== confirm_password && confirm_password.length > 0) ? "Passwords must match!" : ""}</p>
        <p>{password.length < 3 || password.length > 16 ? "Password must be between 3 and 16 characters!" : ""}</p>
      </div>
    </>
    
  )
}