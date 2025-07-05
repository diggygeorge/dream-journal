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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
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
    setNewDream({user: user?.id, title: "", description: "", isPublic: false, author: username})

  }

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setNewDream((prev) => ({...prev, author: username}))
        console.log("New Dream:", newDream)
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

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    setLoading(true)

    console.log(newDream)

    const { error } = await supabase.from("dreams").insert(newDream).single();

    if (error) {
      console.error("Error inserting dream: ", error.message)
    }
    else {
      getDreams()
    }

    setLoading(false)
  }

  const handleDelete = async (e:React.MouseEvent, id: number) => {

    e.preventDefault()

    setLoading(true)

    const { error } = await supabase.from("dreams").delete().eq('id', id);

    if (error) {
      console.error("Error deleting dream: ", error.message)
    }
    else {
      getDreams()
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
      getDreams()
      setUpdate(false)
    }

    setLoading(false)
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  

  return (
    <div className="form-widget static">

      {/* ... */}
      <div>
        <label htmlFor="username">Hello, </label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ fullname, username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>

      <div>
        <form action={() => redirect('/anonymous')} method="post">
          <button className="button block" type="submit">
            View Anonymous Dreams
          </button>
        </form>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">+</Button>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {update ? 
        <div className="fixed bottom-0 right-0 border-4 border-white p-2 rounded-lg">
          <div>
              <div className="flex justify-between">
                <p className="font-weight-bold">New Title: </p>
                <button className="" onClick={() => setUpdate(false)}>X</button>
              </div>
              <input type="text" onChange={(e) => setUpdatedDream((prev) => ({...prev, title: e.target.value}))} required></input>
          </div>
          <div>
            <p>New Description: </p>
            <textarea onChange={(e) => setUpdatedDream((prev) => ({...prev, description: e.target.value}))} required></textarea>
          </div>
          <button onClick={(e:React.MouseEvent) => handleUpdate(e, selectedId)}>Update</button>
        </div> : <></>}
      <div>
        <ul>
          {dreamList?.map((dream) => (
            <li className={`border-2 ${selectedId === dream.id && update ? "border-green-300" : "border-black"} p-4 m-4 rounded-lg`} key={dream.id}>
              <strong>{dream.title}</strong>
              <h2>{dream.description}</h2>
              <button onClick={() => {
                                      if (!update)
                                        setUpdate(!update)
                                      setSelectedId(dream.id)
                                      console.log(dream.id)}}>Edit</button>
              <button onClick={(e:React.MouseEvent) => handleDelete(e, dream.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}