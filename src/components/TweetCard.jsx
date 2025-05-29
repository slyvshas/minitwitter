import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

function TweetCard({ tweet, currentUser }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    fetchLikes()
  }, [tweet.id, currentUser?.id])

  const fetchLikes = async () => {
    try {
      // Get total likes count
      const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('tweet_id', tweet.id)

      if (countError) {
        console.error('Error fetching like count:', countError)
        return
      }

      setLikeCount(count || 0)

      // Check if current user has liked the tweet
      if (currentUser) {
        const { data, error: userLikeError } = await supabase
          .from('likes')
          .select('*')
          .eq('tweet_id', tweet.id)
          .eq('user_id', currentUser.id)
          .maybeSingle()

        if (userLikeError) {
          console.error('Error checking user like:', userLikeError)
          return
        }

        setLiked(!!data)
      }
    } catch (error) {
      console.error('Error in fetchLikes:', error)
    }
  }

  const toggleLike = async () => {
    if (!currentUser) {
      alert("Please log in to like tweets.")
      return
    }

    try {
      if (liked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('tweet_id', tweet.id)
          .eq('user_id', currentUser.id)

        if (error) throw error
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            tweet_id: tweet.id,
            user_id: currentUser.id,
          })

        if (error) throw error
      }

      setLiked(!liked)
      fetchLikes()
    } catch (error) {
      console.error('Error toggling like:', error)
      alert('Error updating like status. Please try again.')
    }
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
