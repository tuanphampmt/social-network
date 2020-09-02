import * as types from '../Constants/index.constant.js'
import axios from "axios";
import * as AuthService from "../Services/auth-header.service";

const API_URL_USER = "/api/user";


export const getAllUsers = () => async dispatch => {
    try {
        const res = await axios.get(API_URL_USER, {
            headers: AuthService.authHeader()
        });
        const {data} = res;

        localStorage.setItem("users", JSON.stringify(data.users));
        dispatch({
            type: types.GET_ALL_USERS,
            payload: data.users
        });
    } catch (err) {

    }
};
export const updatePerDetail = (formData) => async dispatch => {
    try {
        await axios.put(API_URL_USER + "/updatePerDetail", {formData}, {
            headers: AuthService.authHeader()
        });
        dispatch({
            type: types.GET_ALL_USERS,
        });
    } catch (err) {

    }
};

export const getCurrentUser = () => async dispatch => {
    try {
        const res = await axios.get(API_URL_USER + "/showCurrentUser", {
            headers: AuthService.authHeader()
        });
        const {data} = res;
        console.log(data.currentUser)
        localStorage.setItem("user", JSON.stringify(data.currentUser));
        dispatch({
            type: types.GET_CURRENT_USER,
            payload: data.currentUser
        });
    } catch (err) {

    }
};
export const getUserById = (id) => async dispatch => {
    try {
        const res = await axios.get(API_URL_USER + "/showUser/" + id, {
            headers: AuthService.authHeader()
        });
        const {data} = res;
        dispatch({
            type: types.GET_USER_BY_ID,
            payload: data.user
        });
    } catch (err) {

    }
};

export const follow = (userID, friendID, followQuantity) => async dispatch => {
    try {
        await axios.put(API_URL_USER + "/follow/" + userID + "/" + friendID, {followQuantity}, {
            headers: AuthService.authHeader()
        });

        dispatch({
            type: types.ADD_FRIEND,
        })
    } catch (err) {

    }
};

const difference = (A, B) => {
    let count = 0, C = [];
    for (let i = 0; i < A.length; i++) {
        count = 0;
        for (let j = 0; j < B.length; j++) {
            if (A[i]._id === B[j]) break;
            count++;
        }
        if (count === B.length) {
            C.push(A[i])
        }
    }
    return C
};
