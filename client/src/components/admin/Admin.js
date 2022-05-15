import { Outlet } from "react-router-dom";
import Header from '../Header'
import AdminNav from './AdminNav'

const Admin = () => {
 
  return (
    <div id="admin">
        <Header />
        <AdminNav />
        <main>
          <Outlet />
        </main>
    </div>
  )
}

export default Admin