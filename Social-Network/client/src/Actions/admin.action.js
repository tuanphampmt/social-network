import axios from "axios";

import * as AuthService from "../Services/auth-header.service"
import * as types from "../Constants/index.constant";

const API_URL_ADMIN = "/api/admin";

export const getStats = () => async dispatch => {
    try {
        const res = await axios.get(API_URL_ADMIN + "/getStats", {
            headers: AuthService.authHeader()
        });
        const {data} = res;
        dispatch({
            type: types.GET_STATS,
            payload: data.stats
        });
    } catch (err) {

    }
};
export const getUsers = async () => {
    try {
        const res = await axios.get(API_URL_ADMIN + "/showUsers", {
            headers: AuthService.authHeader()
        });
        const {data} = res;
        localStorage.setItem("users-admin", JSON.stringify(data.users));
    } catch (err) {

    }
};
export const userAccountLock = async (userId, permissions, isVerified) => {
    return await axios.post(API_URL_ADMIN + "/userAccountLock/" + userId, {isVerified, permissions}, {
        headers: AuthService.authHeader()
    });
};
export const changePermissions = async (userId, permissions) => {
    return await axios.post(API_URL_ADMIN + "/changePermissions/" + userId, {permissions}, {
        headers: AuthService.authHeader()
    });
};
export const removeUser = async (userId, permissions) => {
    return await axios.post(API_URL_ADMIN + "/removeUser/" + userId, {permissions}, {
        headers: AuthService.authHeader()
    });
};
export const removePost = async (postId, userId) => {
    return await axios.post(API_URL_ADMIN + "/removePost/" + postId, {userId}, {
        headers: AuthService.authHeader()
    });
};
