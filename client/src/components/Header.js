import {  useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { IoHelpCircle, IoStatsChart } from "react-icons/io5"

const Header = () => {

  const { isLoading, viewDialog } = useContext(GlobalContext);

  const location = useLocation();

  return (
    <header>
        { !location.pathname.startsWith('/admin') && !isLoading && 
            <IoHelpCircle id="help" onClick={() => viewDialog('info')} /> }
        <h1>Blurdle { location.pathname.startsWith('/admin') && 'Admin' }</h1>
        { !location.pathname.startsWith('/admin') && !isLoading && 
            <IoStatsChart id="stats" onClick={() => viewDialog('stats')} /> }
            { process.env.NODE_ENV == 'development' && <div id="devWarning">DEV</div> }
    </header>
  )
}

export default Header