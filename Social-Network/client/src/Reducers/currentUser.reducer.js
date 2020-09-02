import * as types from '../Constants/index.constant'

const initialState = {};
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_CURRENT_USER:
            state = action.payload;
            return state;
        default:
            return state
    }
};

export default userReducer

