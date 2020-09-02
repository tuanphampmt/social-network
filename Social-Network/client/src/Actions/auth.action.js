import * as types from '../Constants/index.constant.js'
import axios from "axios";

const API_URL_AUTH = "/api/auth/";

// export const login = (email, password) => {
//     return async dispatch => {
//         try {
//             const res = await axios.post(API_URL_AUTH + "login", {email, password});
//             const {data} = res;
//             if (data.token) {
//                 localStorage.setItem("jwt", JSON.stringify(data.token));
//                 localStorage.setItem("user", JSON.stringify(data.user));
//                 window.location.assign("/home");
//                 window.location.reload();
//                 dispatch({
//                     type: types.LOGIN_SUCCESS,
//                     payload: data.user
//                 })
//             }
//         } catch (error) {
//             const resMessage = (error.response && error.response.data && error.response.data.css) || error.css || error.toString();
//             dispatch({
//                 type: types.LOGIN_FAIL,
//                 payload: resMessage
//             })
//         }
//     }
// };

// export const register = (email, password, firstName, lastName, birthday, sex) => {
//     return async dispatch => {
//         try {
//             const res = await axios.post(API_URL_AUTH + "register", {
//                 email,
//                 password,
//                 firstName,
//                 lastName,
//                 birthday,
//                 sex
//             });
//             const {data} = res;
//             dispatch({
//                 type: types.REGISTER_SUCCESS,
//                 payload: data.css
//             })
//         } catch (error) {
//             const resMessage = (error.response && error.response.data && error.response.data.css) || error.css || error.toString();
//             dispatch({
//                 type: types.REGISTER_FAIL,
//                 payload: resMessage
//             })
//         }
//     }
// };
// export const register = async (email, password, firstName, lastName, birthday, sex) => {
//     return await axios.post(API_URL_AUTH + "register", {email, password, firstName, lastName, birthday, sex})
//     // try {
//     //     const res = await axios.post(API_URL_AUTH + "register", {email, password, firstName, lastName, birthday, sex});
//     //     const {data} = res;
//     //     return data.css
//     // } catch (error) {
//     //     return (error.response && error.response.data && error.response.data.css) || error.css || error.toString();
//     // }
// };

// export const recover = (email) => async dispatch => {
//     try {
//         const res = await axios.post(API_URL_AUTH + "recover", {email});
//         const {data} = res;
//
//     } catch (error) {
//         const resMessage = (error.response && error.response.data && error.response.data.css) || error.css || error.toString();
//         dispatch({
//             type: types.RECOVER_FAIL,
//             payload: resMessage
//         })
//     }
// };
export const reset = (token) => async dispatch => {
    try {
        const res = await axios.get("/api/auth/reset/" + token);
        const {data} = res;
        dispatch({
            type: types.RESET_SUCCESS,
            payload: data.isReset
        })
    } catch (error) {
        const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        dispatch({
            type: types.RECOVER_FAIL,
            payload: resMessage
        })
    }
};

export const resetPassword = (token, password) => async dispatch => {
    try {
        const res = await axios.post("/api/auth/reset/" + token, {password});
        const {data} = res;
        console.log(data.message)
        dispatch({
            type: types.RESET_PASSWORD_SUCCESS,
            payload: data.message
        })

    } catch (error) {
        const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        dispatch({
            type: types.RESET_PASSWORD_FAIL,
            payload: resMessage
        })
    }
};
