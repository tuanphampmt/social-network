import axios from "axios";
import * as types from "../Constants/index.constant";

const API_URL_AUTH = "/api/auth/";


export const register = async (email, password, firstName, lastName, birthday, sex) => {
    return await axios.post(API_URL_AUTH + "register", {email, password, firstName, lastName, birthday, sex});
};

export const login = async (email, password) => {
    return await axios.post(API_URL_AUTH + "login", {email, password})
};

export const recover = async (email) => {
    return await axios.post(API_URL_AUTH + "recover", {email});
};


export const reset = async (token) => {
    return await axios.get("/api/auth/reset/" + token);
};

export const resetPassword = async (token, password) => {
    return await axios.post("/api/auth/reset/" + token, {password});
};

export const facebook = async (id, email, name) => {
    return await axios.post("/api/auth/facebook/" + id, {email, name});
};

// logout()
// {
//     localStorage.removeItem("user")
// }
// getCurrentUser()
// {
//     return JSON.parse(localStorage.getItem("user"))
// }
// }


