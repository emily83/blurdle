import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { Link } from 'react-router-dom';

const AdminNav = () => {

    const { adminLogout } = useContext(GlobalContext);

    function handleLogoutClick(e) {
        e.preventDefault();

        const r = window.confirm("Are you sure you want to logout?");
        if (r === true) {
            adminLogout();
        }          
    }

    return (
        <nav id="adminNav">
            <div className="navLeft">
                <Link to="/admin" className="link">View Pictures</Link>
                <Link to="/admin/pictureForm" className="link">Add Picture</Link>
            </div>
            <button className="link" onClick={handleLogoutClick}>Logout</button>  
        </nav>
    )
}

export default AdminNav