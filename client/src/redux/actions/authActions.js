import { GET_ERRORS, SET_CURRENT_USER } from "./types";

import api from "../../api";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";

//REgister new user
export const registerUser = (user, history) => dispatch => {
  api
    .post("/api/users/register", user)
    .then(result => history.push("/login"))
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};

//login user and get token
export const loginUser = user => dispatch => {
  api
    .post("/api/users/login", user)
    .then(result => {
      //save to local storage
      const { token } = result.data;
      localStorage.setItem("jwtToken", token);
      //set token to auth header
      setAuthToken(token);
      //set the user object in redux store
      const decodedToken = jwt_decode(token);
      delete decodedToken._doc.password;
      dispatch({
        type: SET_CURRENT_USER,
        payload: decodedToken
      });
    })
    .catch(error => {
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      });
    });
};

//log user out
export const logoutUser = () => dispatch => {
  //Remove token from localstorage
  localStorage.removeItem("jwtToken");
  //Remove auth-header from future requests
  setAuthToken(false);
  dispatch({
    type: SET_CURRENT_USER,
    payload: {}
  });
};
