import React, { useContext } from "react";
import { useLocation,Navigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";

const RequireAuth = ({children}) => {
    const { adminAuthenticated } = useContext(GlobalContext);

    let location = useLocation();
  
    if (!adminAuthenticated) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  
    return children;
}
  
export default RequireAuth
