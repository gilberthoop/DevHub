import axios from "axios";
import { setAuthToken } from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register User - an Action Creator
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get user token - an Action Creator
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to LS
      localStorage.setItem("jwtToken", token);
      // Set token to auth header
      setAuthToken(token);
      // Decode the token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user - an Action Creator
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log out user
export const logoutUser = () => dispatch => {
  // Remove the token from local storage
  localStorage.removeItem("jwtToken");
  // Remove the auth header for future request
  setAuthToken(false);
  // Set current user to empty object which sets isAuthenticated to false
  dispatch(setCurrentUser({}));
};
