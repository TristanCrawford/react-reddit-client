import React, { useEffect, useCallback, useState } from 'react'
import './App.css'

import { useAppSelector, useAppDispatch } from './hooks'
import { fetchPosts } from './features/posts/postsSlice'
import { PostComponent } from './features/posts/PostComponent'
import { LightboxComponent } from './features/posts/LightboxComponent'

import axios from 'axios'

const debounce = (callback: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  }
};

function App() {

  const status = useAppSelector(state => state.posts.status)
  const posts = useAppSelector(state => state.posts.posts)
  const dispatch = useAppDispatch()

  const [searchResults, setSearchResults] = useState<string[]>([])
  const [lightboxUrl, setLightboxUrl] = useState<string>('')
  const [subreddit, setSubreddit] = useState<string>('popular')

  const fetchSearchResults = async (query: string) => {
    if (query.length > 0) {
      const resp = await axios.get<{ names: string[] }>(`https://www.reddit.com/api/search_reddit_names.json?query=${query}`)
      setSearchResults(resp.data.names)
    } else {
      setSearchResults([])
    }
  }

  const debouncedSearch = useCallback(
    debounce((text: string) => fetchSearchResults(text), 500),
    []
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  useEffect(() => {
    if (posts.length === 0)
      dispatch(fetchPosts(subreddit))
  }, [])

  return (
    <div className="App">
      { lightboxUrl.length > 0 && <LightboxComponent url={lightboxUrl} onClick={(e) => {setLightboxUrl('')}} />}
      <div className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-center align-items-center mb-3">
        <input onFocus={e => { setSearchResults([]) }} onChange={handleSearch} type="text" name="search" placeholder="Search..." className="form-control w-25" />
      </div>
      {searchResults.map((entry, i) => (
        <span onClick={e => { setSubreddit(entry); dispatch(fetchPosts(entry)); }} key={i} className="badge rounded-pill bg-primary text-light mx-1">
          r/{entry}
        </span>
      ))}
      {status === 'loading' && <div className="spinner-grow text-primary screen-center" role="status"></div>}
      {status === 'idle' && <h1>r/{subreddit}</h1>}
      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
          {
            status === 'idle' && posts.map((post, i) => (
              <PostComponent key={i} post={post} onClick={() => { setLightboxUrl(post.data.url) }} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default App
