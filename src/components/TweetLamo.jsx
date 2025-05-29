import { useState } from 'react'

function TweetLamo({ onTweet }) {
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim() === '') return
    onTweet(content)
    setContent('') // clear textarea after submit
  }

  return (
    <form className="tweet-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="What's happening?"
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button type="submit">Tweet</button>
    </form>
  )
}

export default TweetLamo

