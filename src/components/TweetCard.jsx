import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

function TweetCard({ tweet, currentUser }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    fetchLikes()
  }, [])

  const fetchLikes = async () => {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('tweet_id', tweet.id)

    if (!error) {
      setLikeCount(count)
    }

    if (currentUser) {
      const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('tweet_id', tweet.id)
        .eq('user_id', currentUser.id)
        .single()

      setLiked(!!data)
    }
  }

  const toggleLike = async () => {
    if (!currentUser) {
      alert("Please log in to like tweets.")
      return
    }

    if (liked) {
      // Unlike
      await supabase
        .from('likes')
        .delete()
        .eq('tweet_id', tweet.id)
        .eq('user_id', currentUser.id)
    } else {
      // Like
      await supabase.from('likes').insert({
        tweet_id: tweet.id,
        user_id: currentUser.id,
      })
    }

    setLiked(!liked)
    fetchLikes()
  }

  return (
    <div className="tweet-card">
      <p>{tweet.content}</p>
      <p>— {tweet.username}</p>
      <button onClick={toggleLike}>
        {liked ? '💙' : '🤍'} {likeCount}
      </button>
    </div>
  )
}

export default TweetCard
