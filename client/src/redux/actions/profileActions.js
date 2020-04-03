import api from "../../api";
import axios from "axios";

import {
  GET_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  CLEAR_CURRENT_PROFILE,
  SET_CURRENT_USER,
  GET_PROFILES
} from "./types";

//get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile")
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(error =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

//Profile Loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

//Profile Loading
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

//create profile
export const createProfile = (profile, history) => dispatch => {
  axios
    .post("/api/profile", profile)
    .then(result => history.push("/dashboard"))
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

//delete account
export const deleteAccount = () => dispatch => {
  if (
    window.confirm("Are you sure to delete your account? This cannot be undone")
  ) {
    axios
      .delete("/api/users")
      .then(result =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(error =>
        dispatch({
          type: GET_ERRORS,
          payload: error.response.data
        })
      );
  }
};

//add experience
export const addExperience = (experience, history) => dispatch => {
  axios
    .post("/api/profile/experience", experience)
    .then(result => history.push("/dashboard"))
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

//add education
export const addEducation = (education, history) => dispatch => {
  axios
    .post("/api/profile/education", education)
    .then(result => history.push("/dashboard"))
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

//delete experience
export const deleteExperience = experience_id => dispatch => {
  if (window.confirm("Are you sure you want to delete this experience?")) {
    axios
      .delete(`/api/profile/experience/${experience_id}`)
      .then(result =>
        dispatch({
          type: GET_PROFILE,
          payload: result.data
        })
      )
      .catch(error =>
        dispatch({
          type: GET_ERRORS,
          payload: error.response.data
        })
      );
  }
};

//delete education
export const deleteEducation = education_id => dispatch => {
  if (
    window.confirm("Are you sure you want to delete this education credential?")
  ) {
    axios
      .delete(`/api/profile/education/${education_id}`)
      .then(result =>
        dispatch({
          type: GET_PROFILE,
          payload: result.data
        })
      )
      .catch(error =>
        dispatch({
          type: GET_ERRORS,
          payload: error.response.data
        })
      );
  }
};

//get profiles
export const getProfiles = () => dispatch => {
  dispatch({
    type: PROFILE_LOADING
  });
  axios
    .get(`/api/profile/all`)
    .then(result =>
      dispatch({
        type: GET_PROFILES,
        payload: result.data
      })
    )
    .catch(error =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

//get profile by handle
export const getProfileByHandle = handle => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/handle/${handle}`)
    .then(result =>
      dispatch({
        type: GET_PROFILE,
        payload: result.data
      })
    )
    .catch(error =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    );
};
