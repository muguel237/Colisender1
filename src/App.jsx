import { BrowserRouter,Routes, Route} from "react-router-dom"
import Dashboard from "./assets/code/Dashboard.jsx";
import Inscription from "./assets/code/Inscription.jsx";
import Terms from "./assets/code/Terms.jsx";
import Login from "./assets/code/login.jsx";
import Forgot from "./assets/code/Forgot.jsx";
import User from "./assets/code/UserDashboard.jsx";
import UserD from "./assets/code/UserDashboard.jsx";
import Navigation from "./assets/code/Navigation.jsx";

function App() {

  return (

    <BrowserRouter>

      <Routes>
         <Route
          path="/Navigation"
          element={<Navigation />}/>
          <Route
          path="/"
          element={<UserD />}/>
 
        {/* <Route
          path="/"
          element={<Dashboard />}
        />
        <Route
          path="/Inscription"
          element={<Inscription />}
        />
        <Route
          path="/Terms"
          element={<Terms />}
        />
           <Route
          path="/login"
          element={<Login />}
        />
         <Route
          path="/Forgot"
          element={<Forgot />}
        />
       <Route path="/Dashboard" element={<UserDashboard/>}/> */}
      </Routes>

    </BrowserRouter>

  )
}

export default App