import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar';
import { useState, useEffect } from 'react';

function App() {
  const location = useLocation();
  const [sidebarVisibility, setSidebarVisibility] = useState(location.pathname);

  useEffect(() => {
    setSidebarVisibility(location.pathname);
  }, [location.pathname]);

  return (
    <div className='d-flex'>
      <div className={`${sidebarVisibility === '/login' ? 'invisible' : 'visible'}`}>
        <Sidebar />
      </div>
      <div className='flex-grow-1 w-100'>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
