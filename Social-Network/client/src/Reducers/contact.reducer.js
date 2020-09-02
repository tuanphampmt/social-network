import * as types from '../Constants/index.constant'

const initialState = {
    contacts: [],
    countFriends: 0,
    isContact: undefined,
    isAddFriend: undefined,
    friends: [],
    chatGroupId: ""
};
const contactReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_CONTACTS:
            return {...state, contacts: action.payload};
        case types.COUNT_FRIENDS:
            return {...state, countFriends: action.payload};
        case types.IS_CONTACT:
            return {...state, isContact: action.payload};
        case types.IS_ADD_FRIEND:
            return {...state, isAddFriend: action.payload};
        default:
            return state
    }
};

export default contactReducer

