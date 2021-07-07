import React, { MouseEventHandler } from 'react'

import { Child } from '../../types/reddit'
import { LightboxComponent } from './LightboxComponent'

const PostBodyComponent = ({ post }: { post: Child }) => {
  if (post.data.url.match(/(\.png|\.jpg|\.jpeg|\.gif)$/g)) {
    return <img className="card-img-top" style={{ height: '100%', objectFit: 'contain' }} src={post.data.url} alt="" />
  } else {
    return <i className="text-light fab fa-reddit-alien fs-1 absolute-center"></i>
  }
}

export const PostComponent = ({ post, onClick }: { post: Child, onClick: MouseEventHandler}) => {
  return (
    <div className="col">
      <div className="card my-3">
        <div onClick={onClick} className="bg-dark position-relative" style={{ height: '50vh' }}>
            <PostBodyComponent post={post} />
            <div className="card-img-overlay">
              <p className="card-title text-light text-start post-title fw-bold">{post.data.title}</p>
            </div>
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