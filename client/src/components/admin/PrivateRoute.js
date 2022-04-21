import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const { adminAuthenticated } = useContext(GlobalContext);

    return (
        <Route
            {...rest}
            render={props =>
                adminAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/admin/login" />
                )
            }
        />
    );
        };
