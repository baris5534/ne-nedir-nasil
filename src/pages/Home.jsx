import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col  items-center justify-center space-y-6">
      <div className="container text-white text-center">
        {/* Link ile yönlendirme */}
        <Link to="/reacts" className="text-blue-500 underline">
        <span className="bg-blue-500 p-5 ml-4 text-white">react</span>
        </Link>
        
      </div>
      <div>
      </div>
    </div>
  );
}
