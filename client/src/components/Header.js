import { IoHelpCircle, IoStatsChart } from "react-icons/io5"

const Header = ({ isLoading, viewDialog }) => {

  return (
    <header>
        { !isLoading && <IoHelpCircle id="help" onClick={() => viewDialog('info')} /> }
        <h1>Blurdle</h1>
        { !isLoading && <IoStatsChart id="stats" onClick={() => viewDialog('stats')} /> }
    </header>
  )
}

export default Header