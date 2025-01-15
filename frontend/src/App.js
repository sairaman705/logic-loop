import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import WritePage from "./Pages/WritePage";
// import Home from "./Pages/Home";
import {createContext, useEffect, useState} from "react";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState(null);

  useEffect(()=>{
    const storedUser = sessionStorage.getItem("userAuth");
    if(storedUser){
      setUserAuth(JSON.parse(storedUser));
    }
  }, []);

  useEffect(()=>{
    if(userAuth){
      sessionStorage.setItem("userAuth", JSON.stringify(userAuth));
    }
    else{
      sessionStorage.removeItem("userAuth");
    }
  }, [userAuth]);

  return (
      <UserContext.Provider value={{userAuth, setUserAuth}}>
        <Router>
          {/* <LocationBasedNavbar> */}
            <Routes>
            <Route path="/write" element={<WritePage />} />
              <Route path="/" element={<Navbar />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<div>404 - Page Not Found</div>} />
              </Route>
            </Routes>
          {/* </LocationBasedNavbar> */}
        </Router>
      </UserContext.Provider>
  ); 
}

export default App;
