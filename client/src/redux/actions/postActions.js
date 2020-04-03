import axios from "axios";

import {
  ADD_POST,
  GET_ERRORS,
  GET_POSTS,
  POST_LOADING,
  DELETE_POST,
  CLEAR_ERRORS,
  GET_POST
} from "./types";

//Add post
export const addPost = post => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/posts", post)
    .then(response =>
      dispatch({
        type: ADD_POST,
        payload: response.data
      })
    )
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

export const setPostLoading = () => {
  return { type: POST_LOADING };
};

//get all posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get("/api/posts")
    .then(response =>
      dispatch({
        type: GET_POSTS,
        payload: response.data
      })
    )
    .catch(error =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

//delete post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(response =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

//like a post
export const likePost = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(response => dispatch(getPosts()))
    .catch(error => console.log(error));
};

//unlike a post
export const unlikePost = id => dispatch => {
  axios
    .post(`/api/posts/unlike/${id}`)
    .then(response => dispatch(getPosts()))
    .catch(error => console.log(error));
};

//get a post
export const getPost = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/posts/${id}`)
    .then(response =>
      dispatch({
        type: GET_POST,
        payload: response.data
      })
    )
    .catch(error =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
};

//add Comment
export const addComment = (postId, comment) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/posts/comment/${postId}`, comment)
    .then(response =>
      dispatch({
        type: GET_POST,
        payload: response.data
      })
    )
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

//delete comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/posts/comment/${postId}/${commentId}`)
    .then(response =>
      dispatch({
        type: GET_POST,
        payload: response.data
      })
    )
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
