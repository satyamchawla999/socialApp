import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Home from "./Home";

// function PrivateRoute({ children }) {
//   // const Navigate = useNavigate();
//   const user = useSelector((state) => state.user);
//   return user ? <>{children}</> : <Navigate to="/" />
// }

const Main = () => {
  return (
    <div className="Main">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={
          
          // <PrivateRoute>
            <Home/>
          // </PrivateRoute>
          
          } />
          </Routes>
      </Router>
    </div>
  );
}

export default Main;
