import * as types from '../Constants/index.constant'

const initialState = [];
const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_CURRENT_USER_POSTS:
            state = action.payload;
            return state;
        default:
            return state
    }
};

export default postReducer

