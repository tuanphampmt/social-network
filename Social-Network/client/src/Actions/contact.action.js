import axios from "axios";
import * as AuthService from "../Services/auth-header.service";
import * as types from "../Constants/index.constant";

const API_URL_CONTACT = "/api/contact";

export const getContacts = () => async dispatch => {
    try {
        const res = await axios.get(API_URL_CONTACT, {
            headers: AuthService.authHeader()
        });
        const {data} = res;
        dispatch({
            type: types.GET_CONTACTS,
            payload: data.contacts
        })
    } catch (err) {

    }
};
export const addFriend = (contactId, notificationId) => async dispatch => {
    try {
        const res = await axios.post(API_URL_CONTACT + "/addFriend/" + contactId, {notificationId}, {
            headers: AuthService.authHeader()
        });
        console.log(res.data);
        dispatch({
            type: types.ADD_FRIEND,
        })
    } catch (err) {

    }
};

export const cancelRequest = (contactId, notificationId) => async dispatch => {
    try {

        const res = await axios.delete(API_URL_CONTACT + "/cancelRequest/" + contactId + "/" + notificationId, {
            headers: AuthService.authHeader()
        });
        console.log(res.data);
        dispatch({
            type: types.CANCEL_REQUEST,
        })
    } catch (err) {

    }
};
export const confirmFriend = (senderId, receiverId, notificationId) => async dispatch => {
    try {

        const res = await axios.post(API_URL_CONTACT + "/confirmFriend", {senderId, receiverId, notificationId}, {
            headers: AuthService.authHeader()
        });
        console.log(res.data);
        dispatch({
            type: types.CANCEL_REQUEST,
        })
    } catch (err) {

    }
};

export const removeContact = (contactId) => async dispatch => {
    try {

        const res = await axios.delete(API_URL_CONTACT + "/removeContact/" + contactId, {
            headers: AuthService.authHeader()
        });
        console.log(res.data);
        dispatch({
            type: types.CANCEL_REQUEST,
        })
    } catch (err) {

    }
};
export const unFriend = (contactId) => async dispatch => {
    try {

        const res = await axios.delete(API_URL_CONTACT + "/unFriend/" + contactId, {
            headers: AuthService.authHeader()
        });
        console.log(res.data);
        dispatch({
            type: types.CANCEL_REQUEST,
        })
    } catch (err) {

    }
};
export const getCountFriends = () => async dispatch => {
    try {

        const res = await axios.get(API_URL_CONTACT + "/getCountFriends", {
            headers: AuthService.authHeader()
        });
        const {data} = res;
        dispatch({
            type: types.COUNT_FRIENDS,
            payload: data.countFriends
        })
    } catch (err) {

    }
};

export const getIsContact = (contactId) => async dispatch => {
    try {
        const res = await axios.get(API_URL_CONTACT + "/getIsContact/" + contactId, {
            headers: AuthService.authHeader()
        });
        const {data} = res;
        dispatch({
            type: types.IS_CONTACT,
            payload: data.isContact
        })
    } catch (err) {

    }
};
export const getIsAddFriend = (contactId) => async dispatch => {
    try {
        const res = await axios.get(API_URL_CONTACT + "/getIsAddFriend/" + contactId, {
            headers: AuthService.authHeader()
        });
        const {data} = res;
        dispatch({
            type: types.IS_ADD_FRIEND,
            payload: data.isAddFriend
        })
    } catch (err) {

    }
};




