import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Listing {
    kind: string,
    data: {
        before: string | null,
        after: string | null,
        dist: number,
        modhash: string,
        children: Array<Post>
    },
}

export interface Post {
    kind: string,
    data: {
        author: string,
        created_utc: number,
        num_comments: number,
        permalink: string,
        score: number,
        stickied: boolean,
        subreddit: string,
        thumbnail: string | null,
        title: string,
        url: string,
    }
}

interface PostState {
    status: string,
    posts: Array<Post>,
}

const initialState: PostState = {
    status: '',
    posts: [],
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (subreddit: string) => {
    const response = await axios.get<Listing>(`http://www.reddit.com/r/${subreddit}.json`)
    return response
})

const postsSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(fetchPosts.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.posts  = action.payload.data.data.children
            state.status = 'idle'
        })
    }
})

export default postsSlice.reducer

export const selectAllPosts = (state: PostState) => state.posts