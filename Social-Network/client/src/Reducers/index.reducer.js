import {combineReducers} from 'redux'
import authReducer from './auth.reducer'
import userReducer from './user.reducer'
import postReducer from './post.reducer'
import currentUserReducer from './currentUser.reducer'
import getUserById from './getUserById.reducer'
import contactReducer from './contact.reducer'
import adminReducer from './admin.reducer'
import messageReducer from './message.reducer'

const myReducer = combineReducers({
    authReducer,
    userReducer,
    postReducer,
    currentUserReducer,
    getUserById,
    contactReducer,
    adminReducer,
    messageReducer

});

export default myReducer
