import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import TweetCard from '../components/TweetCard'
import TweetLamo from '../components/TweetLamo'
import AuthModal from '../components/AuthModal'

function Home() {
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [tweets, setTweets] = useState([])

  useEffect(() => {
    // Get session on mount
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
    })

    // Listen to auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    // Cleanup subscription on unmount
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  
  

  // Fetch tweets from Supabase
  const fetchTweets = async () => {
    const { data, error } = await supabase
      .from('tweets')
      .select('id, content, user_id, username,created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tweets:', error)
    } else {
      setTweets(data)
    }
  }

  // Fetch tweets on component mount
  useEffect(() => {
    fetchTweets()
  }, [])

  // Handle Tweet button click
  const handleTweetClick = () => {
    if (!user) {
      setShowModal(true)
    } else {
      // Show tweet form or trigger tweet logic
      // For example, you could toggle a form here
    }
  }

  // Handle user signup/signin
  const handleAuth = async ({ email, password, isSignup }) => {
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Check your email for a confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      setShowModal(false)
    } catch (error) {
      alert(error.message)
    }
  }

  // Function to add a new tweet (you’ll need to call this from your TweetLamo or form)
  const addTweet = async (content) => {
    if (!user) {
      alert('Please log in to tweet!')
      return
    }
    const { data, error } = await supabase.from('tweets').insert([
      {
        content,
        user_id: user.id,
        username: user.email,
      },
    ])

    if (error) {
      alert('Error posting tweet: ' + error.message)
    } else {
      fetchTweets() // refresh tweet list after new tweet
    }
  }

  return (
    <div className="container">
      <button onClick={handleTweetClick}>Tweet</button>
      {user && <TweetLamo onTweet={addTweet} />}
      {tweets.map((tweet) => (
  <TweetCard key={tweet.id} tweet={tweet} currentUser={user} />
  ))}

      {showModal && <AuthModal onClose={() => setShowModal(false)} onSubmit={handleAuth} />}
    </div>
  )
}

export default Home


