import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {isLogin} from '../utils/index.util';

const PublicRoute = ({component: Component, restricted, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            isLogin() && restricted ? <Redirect to="/home"/> : <Component {...props} />
        )}/>
    );
};

export default PublicRoute;
