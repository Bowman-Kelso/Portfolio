import React, { useState } from "react";
import { useNavigate } from "react-router";
export default function Start() {
 const [form, setForm] = useState({
   name: ""
 });
 const navigate = useNavigate();
  // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
  // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
    // When a post request is sent to the start url, we'll add a new record to the database.
   const newPerson = { ...form };
    const player = await fetch("http://localhost:5000/record/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
     return;
   });

    const playerJSON = await player.json();
    const playerID = playerJSON.insertedId;
    //console.log(playerID);

    setForm({ name: "" });
    navigate("/game/" + playerID);
 }
  // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Welcome to Number Guesser!</h3>
     <p>Please enter your username below.</p>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Begin Game"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}