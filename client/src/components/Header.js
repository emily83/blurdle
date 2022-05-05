import {  useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { IoHelpCircle, IoStatsChart } from "react-icons/io5"

const Header = () => {

  const { isLoading, viewDialog, adminLogout, adminAuthenticated } = useContext(GlobalContext);

  const location = useLocation();

  function handleLogoutClick(e) {
      e.preventDefault();

      const r = window.confirm("Are you sure you want to logout?");
      if (r === true) {
          adminLogout();
      }          
  }

  return (
    <header>
        { !location.pathname.startsWith('/admin') && !isLoading && 
            <IoHelpCircle id="help" onClick={() => viewDialog('info')} /> }
        <h1>Blurdle { location.pathname.startsWith('/admin') && 'Admin' }</h1>
        { !location.pathname.startsWith('/admin') && !isLoading && 
            <IoStatsChart id="stats" onClick={() => viewDialog('stats')} /> }
        { location.pathname.startsWith('/admin') && adminAuthenticated && <button id="logoutButton" onClick={handleLogoutClick}>Logout</button>   }
    </header>
  )
}

export default Header