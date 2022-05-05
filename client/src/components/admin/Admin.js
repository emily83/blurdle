import { Outlet } from "react-router-dom";
import Header from '../Header'

const Admin = () => {
 
  return (
    <div id="admin">
        <Header />
        <main>
          <Outlet />
        </main>
    </div>
  )
}

export default Admin