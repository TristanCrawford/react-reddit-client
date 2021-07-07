import React, { useEffect, useCallback, useState } from 'react'
import './App.css'

import { useAppSelector, useAppDispatch } from './hooks'
import { Post, fetchPosts } from './features/posts/postsSlice'

import axios from 'axios'

const PostBody = ({ post }: { post: Post }) => {
  if (post.data.url.match(/(\.png|\.jpg)/g)) {
    return <img className="card-img" style={{ height: '100%', objectFit: 'contain' }} src={post.data.url} alt="" />
  } else {
    return <i className="text-light fab fa-reddit-alien fs-1"></i>
  }
}

const PostComponent = ({ post }: { post: Post }) => {
  return (
    <div className="col">
      <div className="card my-3">
        <div className="card-header">
          <p className="fw-bold text-truncate">{post.data.title}</p>
        </div>
        <div className="card-body bg-dark p-0 d-flex align-items-center justify-content-center" style={{ height: '50vh' }}>
          <PostBody post={post} />
        </div>
        <div className="card-footer d-flex align-items-center justify-content-between">
          <div>
            <span className="text-primary"><i className="fas fa-arrow-alt-circle-up"></i> {post.data.score}</span>
          </div>
          <div>
            <a className="btn btn-secondary mx-2" href={`https://www.reddit.com/u/${post.data.author}`}>
              <i className="fa fa-user-circle"></i> {post.data.author}
            </a>
            <a className="btn btn-secondary" href={`https://www.reddit.com/${post.data.permalink}`}>
              <i className="fa fa-comment-alt"></i> {post.data.num_comments}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

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
      dispatch(fetchPosts('vim'))
  }, [])

  return (
    <div className="App">
      <div className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-center align-items-center mb-3">
        <input onFocus={e => { setSearchResults([]) }} onChange={handleSearch} type="text" name="search" placeholder="Search..." className="form-control w-25" />
      </div>
      {searchResults.map((entry, i) => (
        <span onClick={e => { dispatch(fetchPosts(entry)) }} key={i} className="badge rounded-pill bg-primary text-light mx-1">
          r/{entry}
        </span>
      ))}
      {status === 'loading' && <div className="spinner-grow text-primary screen-center" role="status"></div>}
      {status === 'idle' && <h1>r/{posts[0].data.subreddit}</h1>}
      <div className="container">
        <div className="row row-cols-2">
          {
            status === 'idle' && posts.map((post, i) => (
              <PostComponent key={i} post={post} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default App
