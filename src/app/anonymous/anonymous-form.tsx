"use client";
import { redirect } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
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
  const [uploading, setUploading] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
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
          .select(`username, avatar_url`)
          .eq('id', user?.id)
          .single()
  
        if (error && status !== 406) {
          console.log(error)
          throw error
        }
  
        if (data) {
          setUsername(data.username)
          setAvatarUrl(data.avatar_url)
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

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (avatar_url) downloadImage(avatar_url)
  }, [avatar_url, supabase])

const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)
      console.log("hi")

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        console.log("Error", uploadError)
        throw uploadError
      }

      setAvatarUrl(filePath)
      console.log(filePath)
      updateProfile({username, avatar_url: filePath })

    } catch (error) {
      alert('Error uploading avatar!')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="form-widget static min-h-screen bg-gradient-to-b from-[#03002e] to-[#7965c1]">
      {user ?
      <>
      <div className="sticky p-4 top-0 bg-[#03002e] flex justify-between">
        <div className="text-[#e3d095] scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          <label>Dreamcatchers</label>
        </div>
          <div className="flex align-stretch">
            <form className="pt-[2px] pr-2" action={() => redirect('/account')} method="post">
              <Button className=" text-white border-2 border-black button block bg-[#0e2148] hover:bg-gray-800 cursor-pointer" type="submit">
                View/Submit Dreams
              </Button>
            </form>
          <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={avatar_url as string} />
                  <AvatarFallback>{username?.substring(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="text-center">{username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div>
                  <Label className="w-full text-center pt-3 pb-3 rounded-lg m-auto text-white bg-[#0e2148] border-2 border-black button block hover:bg-gray-800 cursor-pointer" htmlFor="single">
                    Change Avatar
                  </Label>
                  <Input
                    style={{
                      visibility: 'hidden',
                      position: 'absolute',
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                  />
                </div>
                <div className="pt-1">
                  <form action="/auth/signout" method="post">
                    <Button className="w-full bg-[#0e2148] border-2 border-black button block hover:bg-gray-800 cursor-pointer" type="submit">
                      Sign Out
                    </Button>
                  </form>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          </div>
      </>
      : 
      <>
        <div className="sticky p-4 top-0 bg-[#03002e] flex justify-between">
          <div className="text-[#e3d095] scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Dreamcatchers
          </div>
            <div className="flex">
              <div>
                <form action={() => redirect('/anonymous')} method="post">
                  <Button className=" text-white border-2 border-black button block bg-[#0e2148] hover:bg-gray-800 cursor-pointer" type="submit">
                    View/Submit Dreams
                  </Button>
                </form>
              </div>
              <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Avatar>
                                <AvatarImage src={avatar_url as string} />
                                <AvatarFallback>A</AvatarFallback>
                              </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel className="text-center">Anonymous</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <div>
                                  <form action={() => redirect('/')}>
                                      <Button className="text-[#e3d095] bg-[#0e2148] border-2 border-black button block hover:bg-gray-800 cursor-pointer" type="submit">
                                          Back to Login Page
                                      </Button>
                                  </form>
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>
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