import { Navigate } from 'react-router-dom';

export default function Reactpage() {
    // React sayfasını /category/react sayfasına yönlendir
    return <Navigate to="/category/react" replace />;
}
