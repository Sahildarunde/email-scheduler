import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsAuthenticated(true);  
    } else {
      navigate('/signin');  
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div>
      <h1>Dashboard</h1>
     
    </div>
  );
}
