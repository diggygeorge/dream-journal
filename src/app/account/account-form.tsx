'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'

// ...

interface Dream {
  id: number
  title: string
  description: string
}

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  
  const [newDream, setNewDream] = useState({user: user?.id, title: "", description: ""})
  const [dreamList, setDreamList] = useState<Dream[]>([])
  const [update, setUpdate] = useState(false)
  const [selectedId, setSelectedId] = useState(0)
  const [updatedDream, setUpdatedDream] = useState({title: "", description: ""})

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
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  const getDreams = async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('dreams')
        .select(`id, title, description`)
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
    setNewDream({user: user?.id, title: "", description: ""})

  }

  useEffect(() => {
    getProfile()
    getDreams()
  }, [])

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    setLoading(true)

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
    console.log(updatedDream)
    console.log(id)

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
    <div className="form-widget">

      {/* ... */}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
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
        <p>Title</p>
        <input
        type="text"
        value={newDream.title}
        onChange={(e) => setNewDream((prev) => ({...prev, title: e.target.value}))}
        required
        ></input>
      </div>
      <div>
        <p>Description</p>
        <input
        type="text"
        value={newDream.description}
        onChange={(e) => setNewDream((prev) => ({...prev, description: e.target.value}))}
        required
        ></input>
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {update ? 
        <div>
          <strong>New Title: </strong><input type="text" onChange={(e) => setUpdatedDream((prev) => ({...prev, title: e.target.value}))}></input>
          <strong>New Description: </strong><input type="text" onChange={(e) => setUpdatedDream((prev) => ({...prev, description: e.target.value}))}></input>
          <button onClick={(e:React.MouseEvent) => handleUpdate(e, selectedId)}>Update</button>
        </div> : <></>}
      <div>
        <ul>
          {dreamList?.map((dream) => (
            <li className="border-2 border-white p-4 m-4 rounded-lg" key={dream.id}>
              <strong>{dream.title}</strong>
              <h2>{dream.description}</h2>
              <button onClick={() => {setUpdate(!update)
                                      setSelectedId(dream.id)}}>Edit</button>
              <button onClick={(e:React.MouseEvent) => handleDelete(e, dream.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}