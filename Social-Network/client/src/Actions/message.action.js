import * as types from '../Constants/index.constant.js'
import axios from "axios";
import * as AuthService from "../Services/auth-header.service";


const API_URL_MESSAGE = "/api/message";

export const getContactsByStatusIsTrue = () => async dispatch => {
    try {
        const res = await axios.get(API_URL_MESSAGE + "/getContactsByStatusIsTrue/", {
            headers: AuthService.authHeader()
        });
        const {data} = res;
        dispatch({
            type: types.CONTACTS_BY_STATUS_IS_TRUE,
            payload: data.contacts
        })
    } catch (err) {

    }
};
export const getChatGroupId = (conversationId) => async dispatch => {
    try {
        console.log(conversationId)
        dispatch({
            type: types.GET_CHAT_GROUP_ID,
            conversationId: conversationId,

        })
    } catch (err) {

    }
};
export const getConversationId = (conversationId) => async dispatch => {
    try {
        dispatch({
            type: types.GET_CONVERSATION_ID,
            conversationId: conversationId,

        })
    } catch (err) {

    }
};

export const addMessage = (message, messageAmount) => async dispatch => {
    try {
        await axios.post(API_URL_MESSAGE + "/addMessage", {message, messageAmount}, {
                headers: AuthService.authHeader()
            }
        );

        dispatch({})
    } catch (err) {

    }
};
export const getConversationIdWhenSubmit = (conversationId) => async dispatch => {
    try {
        dispatch({
            type: types.GET_CONVERSATION_ID_WHEN_SUBMIT,
            converId: conversationId,

        })
    } catch (err) {

    }
};

export const getMessagesByParamsId = (conversationId) => async dispatch => {
    try {
        const res = await axios.get(API_URL_MESSAGE + "/getContactsByStatusIsTrue/", {
            headers: AuthService.authHeader()
        });
        const {data} = res;
        dispatch({
            type: types.GET_MESSAGES_BY_PARAMS_ID,
            conversationId: conversationId,
            payload: data.contacts

        })
    } catch (err) {

    }
};

export const uploadImgUrl = async (formData) => {
    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/tuanpham/image/upload", {
            method: "POST",
            body: formData
        });
        const file = await res.json();
        const {url} = file;
        return url
    } catch (err) {
        console.log(err)
    }
};

export const updatedAtWhenSubmit = (conversationId, friends) => async dispatch => {
    try {
        dispatch({
            type: types.UPDATED_AT_WHEN_SUBMIT,
            payload: {
                conversationId: conversationId,
                friends: friends
            }

        })
    } catch (err) {

    }
};

export const changeIsRead = (messageId) => async dispatch => {
    try {
        await axios.post(API_URL_MESSAGE + "/changeIsRead/" + messageId, {}, {
            headers: AuthService.authHeader()
        });

        dispatch({})
    } catch (err) {

    }
};

export const loadMessageSocket = (conversationId, message) => async dispatch => {
    try {
        dispatch({
            type: "LOAD_MESSAGE_SOCKET",
            conversationId: conversationId,
            message: message
        })
    } catch (err) {

    }
};
