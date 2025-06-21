import { redirect } from 'next/navigation'

export default function ErrorPage() {
    return (
    <div>
        <p>Sorry, something went wrong.  Please try again:</p>
        <button onClick={redirect("/")}>Back to Login Page</button>
    </div>
    )
}