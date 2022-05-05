import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from './components/admin/RequireAuth';
import Game from './components/Game';
import Admin from './components/admin/Admin';
import Login from './components/admin/auth/Login';
import AdminPictures from './components/admin/AdminPictures';

function App() {

  return (
    <Routes>
      <Route index element={<Game />} />
      <Route path="admin" element={<Admin />}>
        <Route path="login" element={<Login />} />
        <Route
            index
            element={
              <RequireAuth>
                <AdminPictures />
              </RequireAuth>
            }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
  );
}

export default App;