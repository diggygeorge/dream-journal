import UsernamePage from './username_page'
import { createClient } from '@/utils/supabase/server'

export default async function Username() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log(user)

  return <UsernamePage user={user} />
}