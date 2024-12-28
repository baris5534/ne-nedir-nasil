import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Reacts from "./Reactpage";

export default function Home() {
  return (
    <div className="flex flex-col  items-center justify-center space-y-6">
      <div className="container text-white">
        <div><span>Geri</span></div>
        <div className="flex items-center justify-center space-x-4">
          <Link to="/reacts">
            <span className="p-2 bg-slate-500 rounded-md">
              reacts
            </span>
          </Link>

        </div>

        {/* <Router>
        <Routes>
        <Route path="/reacts" element={<Reacts/>} >react</Route>
        </Routes>
       </Router> */}


      </div>
    </div>
  );
}