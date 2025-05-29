import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

function Header({ onLoginClick }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="header">
      <h1>Mini Twitter 🐦</h1>
      <div>
        {user && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </header>
  )
}

export default Header
