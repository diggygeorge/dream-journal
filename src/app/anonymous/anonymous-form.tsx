"use client";
import { redirect } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react';

interface Dream {
  id: number
  title: string
  description: string
  author: string
}

export default function AnonymousPage({ user }: { user: User | null }) {

  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
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

  const getProfile = useCallback(async () => {
      try {
        setLoading(true)
  
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`username`)
          .eq('id', user?.id)
          .single()
  
        if (error && status !== 406) {
          console.log(error)
          throw error
        }
  
        if (data) {
          setUsername(data.username)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }, [user, supabase])
  
    useEffect(() => {
      getProfile()
    }, [user, getProfile])

  useEffect(() => {
    getAnonymousDreams()
  }, [user])
  

  return (
    <div className="form-widget static min-h-screen bg-gradient-to-b from-[#03002e] to-[#7965c1]">
      {user ?
      <>
      <div className="sticky p-4 top-0 bg-[#03002e] flex justify-between">
        <div className="text-[#e3d095] scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          <label htmlFor="username">Hello, </label>
            {username}
        </div>
          <div className="flex">
            <div>
              <form action={() => redirect('/account')} method="post">
                <Button className=" text-white border-2 border-black button block bg-[#0e2148] hover:bg-gray-800 cursor-pointer" type="submit">
                  View/Submit Dreams
                </Button>
              </form>
            </div>

            <div>
              <form action="/auth/signout" method="post">
                <Button  className="text-[#e3d095] bg-[#0e2148] border-2 border-black button block hover:bg-gray-800 cursor-pointer" type="submit">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
          </div>
      </>
      : 
      <>
        <div className="sticky p-4 top-0 bg-[#03002e] flex justify-between">
          <div className="text-[#e3d095] scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Anonymous
          </div>
            <div className="flex">
              <div>
                <form action={() => redirect('/anonymous')} method="post">
                  <Button className=" text-white border-2 border-black button block bg-[#0e2148] hover:bg-gray-800 cursor-pointer" type="submit">
                    View/Submit Dreams
                  </Button>
                </form>
              </div>

              <div>
                  <form action={() => redirect('/')}>
                      <Button className="text-[#e3d095] bg-[#0e2148] border-2 border-black button block hover:bg-gray-800 cursor-pointer" type="submit">
                          Back to Login Page
                      </Button>
                  </form>
              </div>
            </div>
        </div>
      </>
      }
      {loading ? <div className="static"><Loader color="#ffffff" className="absolute top-1/2 left-1/2"/></div> : <div className="p-4">
        <ul className="flex-grow bg-[#001e6a] rounded-lg border-1 border-transparent">
          {dreamList?.map((dream) => (
            <li className={`shadow-md bg-white text-black hover:shadow-lg transition-all duration-200 border-4 p-4 m-2 rounded-lg bg-white`} key={dream.id}>
              <strong>{dream.title}</strong>
              <h2 className="pb-2">{dream.description}</h2>
              <h2>{dream.author}</h2>
            </li>
          ))}
        </ul>
      </div>}
    </div>
  )
}