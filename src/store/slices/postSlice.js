import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "../../appwrite/post";
const initialState = {
  data: [],
  error: null,
  loading: false,
};

export const createPost = createAsyncThunk("posts/addPost", async (post) => {
  
  const createdPost = await postService.createPost(post);
  
  return createdPost;
});

export const getAllPosts = createAsyncThunk("posts/fetchAllPosts", async () => {
  const posts = await postService.getPosts();
  return posts;
});

export const updatePost = createAsyncThunk(
  "posts/updatePost", // asyncThunk mein ek hi parameter pass kar skte hai
  async ({ id, data, featuredImage }) => {
    const updatedPost = await postService.updatePost(id, {
      ...data,
      featuredImage,
    });
    return updatedPost;
  }
);

export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
  await postService.deletePost(id);
  return id;
});

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getAllPosts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.documents || [];
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updatePost.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.data.findIndex(
          (post) => post?.$id === action.payload?.$id
        );
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deletePost.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = state.data.filter((post) => post.$id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default postSlice.reducer;
