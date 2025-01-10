import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function AuthGuard({ children }) {
  const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
  const location = useLocation();

  // URL'den direkt erişimi kontrol et
  useEffect(() => {
    // Eğer URL'den direkt erişim varsa ve authenticate olmamışsa
    if (!isAuthenticated && location.key === "default") {
      // Tüm admin oturumunu temizle
      sessionStorage.removeItem('isAdminAuthenticated');
    }
  }, [isAuthenticated, location]);

  // Authenticate olmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate 
      to="/admin-login" 
      replace 
      state={{ from: location.pathname }}
    />;
  }

  return children;
} 