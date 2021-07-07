import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { Listing, Child, ChildData } from '../../types/reddit'

interface PostState {
    status: string,
    posts: Array<Child>,
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