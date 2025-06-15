import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <form className="block">
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button className="border-2 border-white rounded-lg p-2 hover:bg-gray-800" formAction={login}>Log in</button>
      <button className="border-2 border-white rounded-lg p-2 hover:bg-gray-800" formAction={signup}>Sign up</button>
    </form>
  )
}