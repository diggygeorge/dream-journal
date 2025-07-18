'use client'
import { redirect } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { Loader } from 'lucide-react';

// ...

interface Dream {
  id: number
  title: string
  description: string
  author: string
}

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  
  const [newDream, setNewDream] = useState({user: user?.id, title: "", description: "", isPublic: false, author: username})
  const [dreamList, setDreamList] = useState<Dream[]>([])
  const [update, setUpdate] = useState(false)
  const [selectedId, setSelectedId] = useState(37)
  const [updatedDream, setUpdatedDream] = useState({title: "", description: ""})

  const getDreams = async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('dreams')
        .select(`id, title, description, author`)
        .eq('user', user?.id)
        .order('created_at', { ascending: false })

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        console.log(data)
        setDreamList(data)
        console.log("Dreams updated!")
      }
    } catch (error) {
      alert('Error updating dream!')
      console.log(error)
    } finally {
      setLoading(false)
    }
    setNewDream((prev) => ({...prev, title: "", description: "", isPublic: false}))

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
        setNewDream((prev) => ({...prev, author: data.username}))
        getDreams()
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

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

  const handleSubmit = async (e: React.MouseEvent) => {
    try {
      e.preventDefault()

      setLoading(true)

      console.log(newDream)

      const { error } = await supabase.from("dreams").insert(newDream).single();

      if (error) {
        console.error("Error inserting dream: ", error.message)
      }
      else {
        await getDreams()
      }
    }
    finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e:React.MouseEvent, id: number) => {

    e.preventDefault()

    setLoading(true)

    const { error } = await supabase.from("dreams").delete().eq('id', id);

    if (error) {
      console.error("Error deleting dream: ", error.message)
    }
    else {
      await getDreams()
    }

    setLoading(false)
  }

  const handleUpdate = async (e:React.MouseEvent, id: number) => {

    e.preventDefault()

    setLoading(true)

    const { error } = await supabase.from("dreams").update(updatedDream).eq('id', id);
    console.log("dream successfully updated!")

    if (error) {
      console.error("Error updating dream: ", error.message)
    }
    else {
      await getDreams()
    }

    setLoading(false)
  }
  

  return (
    <div className="form-widget static min-h-screen bg-gradient-to-b from-[#03002e] to-[#7965c1]">

      <div className="sticky p-4 top-0 bg-[#03002e]">
        <div className="flex justify-between">
          <div className="text-[#e3d095] scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            <label>Dreamcatchers</label>
          </div>
          <div className="flex align-stretch">
            <form className="pt-[2px] pr-2"action={() => redirect('/anonymous')} method="post">
              <Button className="text-white border-2 border-black button block bg-[#0e2148] hover:bg-gray-800 cursor-pointer" type="submit">
                View Anonymous Dreams
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
        
        <AlertDialog>
          <AlertDialogTrigger asChild className="fixed bottom-10 right-10">
            <Button className="hover:bg-gray-800 cursor-pointer text-xl">+</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="w-full">
              <div className="flex">
                <Switch
                  checked={newDream.isPublic}
                  onCheckedChange={() => setNewDream((prev) => ({...prev, isPublic: !newDream.isPublic}))}
                  />
                <Label className="pl-2" htmlFor="public_switch">{newDream.isPublic ? "Public" : "Private"}</Label>
              </div>
              <AlertDialogTitle>Add New Dream</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="">
                  <div>
                    <Label className="pt-2 pb-2">Title</Label>
                    <Input
                    type="text"
                    value={newDream.title}
                    onChange={(e) => setNewDream((prev) => ({...prev, title: e.target.value}))}
                    required
                    ></Input>
                  </div>
                  <div className="">
                    <Label className="pb-2 pt-2">Description</Label>
                    <Textarea
                    value={newDream.description}
                    onChange={(e) => setNewDream((prev) => ({...prev, description: e.target.value}))}
                    required
                    ></Textarea>
                  </div>
                </div>              
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>            
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
              <AlertDialogAction className="cursor-pointer" onClick={handleSubmit}>Submit</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      {loading ? <div className="static"><Loader color="#ffffff" className="absolute top-1/2 left-1/2"/></div> : <div className="p-4">
        <ul className="flex-grow bg-[#001e6a] rounded-lg border-1 border-transparent">
          {dreamList?.map((dream) => (
            <li className={`shadow-md bg-white text-black hover:shadow-lg transition-all duration-200 border-4 ${selectedId === dream.id && update ? "ring-4 ring-purple-500" : ""} p-4 m-2 rounded-lg bg-white`} key={dream.id}>
              <strong>{dream.title}</strong>
              <h2 className="pb-2">{dream.description}</h2>
              <AlertDialog>
                <Button size="sm" className="hover:bg-gray-200 cursor-pointer" variant="outline">
                  <AlertDialogTrigger className="cursor-pointer" onClick={() => {
                                                                      setSelectedId(dream.id)
                                                                      setUpdate(true)
                                                                      }}>Edit</AlertDialogTrigger>
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Edit Dream</AlertDialogTitle>
                    <AlertDialogDescription>
                      Choose a new title and description.
                      <div className="">
                        <div>
                          <Label className="pt-2 pb-2">New Title</Label>
                          <Input
                           type="text"
                           onChange={(e) => setUpdatedDream((prev) => ({...prev, title: e.target.value}))}
                           required
                          ></Input>
                        </div>
                        <div className="">
                          <Label className="pb-2 pt-2">New Description</Label>
                          <Textarea
                          onChange={(e) => setUpdatedDream((prev) => ({...prev, description: e.target.value}))}
                          required
                          ></Textarea>
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setUpdate(false)} className="cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="cursor-pointer" onClick={(e:React.MouseEvent) => handleUpdate(e, selectedId)}>Update</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button size="sm" className="ml-2 hover:bg-gray-800 cursor-pointer" onClick={(e:React.MouseEvent) => handleDelete(e, dream.id)}>Delete</Button>
            </li>
          ))}
        </ul>
      </div>}
    </div>
  )
}