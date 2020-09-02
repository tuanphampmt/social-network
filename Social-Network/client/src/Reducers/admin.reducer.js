import * as types from '../Constants/index.constant'

const initialState = [];
const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_STATS:
            state = action.payload;
            return state;
        default:
            return state
    }
};

export default adminReducer

