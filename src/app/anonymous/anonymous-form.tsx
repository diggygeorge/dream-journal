"use client";
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'

interface Dream {
  id: number
  title: string
  description: string
  author: string
}

export default function AnonymousPage({ user }: { user: User | null }) {

  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  
  const [dreamList, setDreamList] = useState<Dream[]>([])

  const getAnonymousDreams = async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('dreams')
        .select(`id, title, description, author`)
        .eq('isPublic', true)
        .order('created_at', { ascending: false })

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        console.log(data)
        setDreamList(data)
        console.log("Anonymous dreams loaded!")
      }
    } catch (error) {
      alert('Error updating dream!')
      console.log(error)
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    getAnonymousDreams()
  }, [user])
  

  return (
    <div className="form-widget static">
      {loading ? <p>Loading</p> : <div>
        <ul>
          {dreamList?.map((dream) => (
            <li className={`border-2 border-black p-4 m-4 rounded-lg`} key={dream.id}>
              <strong>{dream.title}</strong>
              <h2>{dream.description}</h2>
              <h2>By {dream.author}</h2>
            </li>
          ))}
        </ul>
      </div>}
      {user ?
      <>
        <div>
            <form action="/auth/signout" method="post">
            <Button className="button block" type="submit">
                Sign out
            </Button>
            </form>
        </div>
        <div>
            <form action={() => redirect('/account')} method="post">
                <Button className="button block" type="submit">
                    View/Create Dreams
                </Button>
            </form>
        </div>
      </>
      : 
      <>
        <p>You are not able to post dreams.  Log in to create one.</p>
        <div>
            <form action={() => redirect('/')}>
                <button className="button block" type="submit">
                    Back to Login Page
                </button>
            </form>
        </div>
      </>
      }
    </div>
  )
}