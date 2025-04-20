import { createSelector } from "@reduxjs/toolkit";

const selectUser = (state) => state.auth.userData;
const selectAllPosts = (state) => state.post.data;

export const selectUserPosts = createSelector(
  [selectUser, selectAllPosts],
  (user, posts) =>
    user ? posts.filter((post) => post.userId === user.userId) : []
);
