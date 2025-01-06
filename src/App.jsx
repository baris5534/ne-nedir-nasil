//import React from "react";
//import CodeDisplay from "./components/Codescreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Reacts from "./pages/Reactpage";
import { div  } from "framer-motion/client";

const App = () => {
  return (
    <div className="bg-gray-950 ">
    <div className="mx-auto container  text-white flex bg-gray-950  ">
      <Sidebar className="w-1/6  mx-auto" />
      <div className=" w-4/6 mx-auto px-5 py-10 ">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reacts" element={<Reacts />} >react</Route>
          </Routes>
        </Router>
      </div>
    </div>
    </div>
  );
};

export default App;