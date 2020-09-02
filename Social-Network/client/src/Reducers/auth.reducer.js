import * as types from '../Constants/index.constant'

const initialState = {
    message: "",
    isReset: false,
    successful: false,
    currentUser: {}
};
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.REGISTER_SUCCESS:
            return {...state, message: action.payload, successful: true};
        case types.LOGIN_SUCCESS:
            return {...state, currentUser: action.payload};
        case types.RESET_SUCCESS:
            return {...state, isReset: action.payload};
        case types.RESET_PASSWORD_SUCCESS:
            return {...state, message: action.payload};
        case types.REGISTER_FAIL:
        case types.RESET_PASSWORD_FAIL:
        case types.LOGIN_FAIL:
            localStorage.removeItem('token');
            return {...state, message: action.payload};

        default:
            return state
    }
};

export default authReducer

