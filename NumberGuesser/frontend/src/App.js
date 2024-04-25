import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 // We import all the components we need in our app
import Highscores from "./components/highscores";
import Game from "./components/game";
import Start from "./components/start";
// Bringing this from the old Navbar for bootstrap css
import "bootstrap/dist/css/bootstrap.css";

 const App = () => {
 return (
   <div>
     <Routes>
       <Route exact path="/" element={<Start />} />
       <Route path="/game/:id" element={<Game />} />
       <Route path="/highscores" element={<Highscores />} />
     </Routes>
   </div>
 );
};
 export default App;