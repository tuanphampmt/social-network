import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import MainAuth from "./Components/Auth/MainAuth";
import PrivateRoute from './Components/Auth/PrivateRoute'
import PublicRoute from './Components/Auth/PublicRoute'
import MainHome from "./Components/Home/MainHome";
import MainHomeAdmin from "./Components/Admin/HomeAdmin/MainHomeAdmin";
import MainProfile from "./Components/Profile/MainProfile";
import MainMessage from "./Components/Message/MainMessage";
import RecoverForm from "./Components/Auth/RecoverForm";
import ResetPwForm from "./Components/Auth/ResetPasswordForm";
import MainTableUsers from "./Components/Admin/HomeAdmin/TableUsers/MainTableUsers";
import MainTablePosts from "./Components/Admin/HomeAdmin/TablePosts/MainTablePosts";
import MainDashboard from "./Components/Admin/Dashboard/MainDashboard";
import MasterMessage from "./Components/Message/MasterMessage";
import MasterSociety from "./Components/Society/MasterSociety";


class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <PrivateRoute component={MasterSociety} path="/home/society" exact/>
                    <PrivateRoute component={MasterMessage} path="/home/message/:conversationId" exact/>
                    <PrivateRoute component={MainProfile} path="/home/profile/:userId" exact/>
                    <PublicRoute component={MainAuth} path="/" exact restricted={true}/>
                    <PublicRoute component={RecoverForm} path="/recover" exact restricted={false}/>
                    <PrivateRoute component={MainHome} path="/home" exact/>
                    <Route component={ResetPwForm} path="/reset/:token" exact/>
                    {/*<Route component={MainHomeAdmin} path="/home-admin" exact/>*/}
                    <Route component={MainDashboard} path="/home-admin" exact/>
                    <Route component={MainTableUsers} path="/table-users" exact/>
                    <Route component={MainTablePosts} path="/table-posts" exact/>
                </Switch>
            </BrowserRouter>

        )
    }
}


export default App;
