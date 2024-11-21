//import React from "react";
//import CodeDisplay from "./components/Codescreen";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
const App = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
