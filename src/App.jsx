import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home";
import OrderPage from './pages/OrderSubmit';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import Profile from './pages/Profile';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/order" 
        element={
          isAuthenticated ? <OrderPage /> : <Navigate to="/" />
        } 
      />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;