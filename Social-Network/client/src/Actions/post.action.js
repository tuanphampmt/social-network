import * as types from '../Constants/index.constant.js'
import axios from "axios";
import * as AuthService from "../Services/auth-header.service"

const API_URL_POST = "/api/post";
const API_URL_COMMENT = "/api/comment";


export const getCurrentUserPosts = () => async dispatch => {
    try {
        const res = await axios.get(API_URL_POST + "/showPosts", {
            headers: AuthService.authHeader()
        });

        const {data} = res;
        dispatch({
            type: types.GET_CURRENT_USER_POSTS,
            payload: data.userPosts
        });

    } catch (err) {
    }
};



export const addPost = (postId, url, quotes) => async dispatch => {
    try {
        await axios.post(API_URL_POST + "/addPost", {postId, url, quotes}, {
            headers: AuthService.authHeader()
        });
    } catch (err) {
        console.log(err)
    }
};
export const uploadProfileImg = async (formData) => {
    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/tuanpham/image/upload", {
            method: "POST",
            body: formData
        });
        const file = await res.json();
        const {url} = file;
        const response = await axios.post(API_URL_POST + "/uploadProfileImg", {url}, {
            headers: AuthService.authHeader()
        });
        const {data} = response;
        return data.profileImage
    } catch (err) {
        console.log(err)
    }
};
export const upLoadCoverImages = async (formData) => {
    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/tuanpham/image/upload", {
            method: "POST",
            body: formData
        });
        const file = await res.json();
        const {url} = file;
        const response = await axios.post(API_URL_POST + "/upLoadCoverImages", {url}, {
            headers: AuthService.authHeader()
        });
        const {data} = response;
        return data.coverImages
    } catch (err) {
        console.log(err)
    }
};

export const like = (postId, like, isCheckPull) => async dispatch => {
    try {
        await axios.put(API_URL_POST + "/like/" + postId + "/" + isCheckPull, {like}, {
            headers: AuthService.authHeader()
        });
        dispatch({
            type: types.GET_CURRENT_USER_POSTS
        });
    } catch (err) {
    }
};

export const dislike = (postId, dislike, isCheckPull) => async dispatch => {
    try {
        await axios.put(API_URL_POST + "/dislike/" + postId + "/" + isCheckPull, {dislike}, {
            headers: AuthService.authHeader()
        });
        dispatch({
            type: types.GET_CURRENT_USER_POSTS
        });

    } catch (err) {
    }
};

export const postComment = (postId, commentId, content) => async dispatch => {
    try {
        console.log(postId)
        await axios.post(API_URL_COMMENT + "/comment/" + postId, {commentId, content}, {
            headers: AuthService.authHeader()
        });
        dispatch({
            type: types.GET_CURRENT_USER_POSTS
        });

    } catch (err) {
    }
};

export const removePost = (postID) => async dispatch => {
    try {
        await axios.delete(API_URL_POST + "/removePost/" + postID, {
            headers: AuthService.authHeader()
        });

    } catch (err) {
    }
};
export const editPost = (postId, url, quotes) => async dispatch => {
    try {
        await axios.put(API_URL_POST + "/editPost/" + postId, {url, quotes}, {
            headers: AuthService.authHeader()
        });

    } catch (err) {
    }
};


export const removeComment = (postId, commentId) => async dispatch => {
    try {
        await axios.delete(API_URL_COMMENT + "/removeComment/" + commentId + "/" + postId, {
            headers: AuthService.authHeader()
        });

    } catch (err) {
    }
};
export const editComment = (commentId, content) => async dispatch => {
    try {

        await axios.put(API_URL_COMMENT + "/editComment/" + commentId, {content}, {
            headers: AuthService.authHeader()
        });

    } catch (err) {
    }
};


