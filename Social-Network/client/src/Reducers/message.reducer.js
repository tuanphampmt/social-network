import * as types from '../Constants/index.constant'

const initialState = {
    friends: [],
    conversationId: "",
    messages: [],
    converId: "",
};
const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.CONTACTS_BY_STATUS_IS_TRUE:
            return {...state, friends: action.payload};
        case types.GET_CHAT_GROUP_ID:
            return {...state, conversationId: action.conversationId};
        // case types.GET_CONVERSATION_ID:
        //     const friend = state.friends.find(fi => fi._id === action.conversationId);
        //     return {...state, messages: friend.messages};
        case types.GET_CONVERSATION_ID_WHEN_SUBMIT:
            return {...state, converId: action.converId};
        // case types.GET_MESSAGES_BY_PARAMS_ID:
        //     const conversation = action.payload.find(fi => fi._id === action.conversationId);
        //     return {...state, messages: conversation.messages};
        case types.LOAD_MESSAGE_SOCKET:
            const con = state.friends.find(fi => fi._id === action.conversationId);
            return {...state, messages: con.messages};
        case types.UPDATED_AT_WHEN_SUBMIT:
            const friends = action.payload.friends.map(item => {
                if (item._id === action.payload.conversationId) {
                    item.updatedAt = Date.now();
                    return item
                }
                return item;
            });
            return {...state, friends: sortCreatedAt(friends)};
        default:
            return state
    }
};
const sortCreatedAt = (data) => {
    return data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

export default messageReducer

