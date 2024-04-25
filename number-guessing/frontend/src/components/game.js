import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
 export default function Game() {
 const [form, setForm] = useState({
   userGuess: "",
   position: "",
   level: "",
   records: [],
 });
 const [guessResult, setGuessResult] = useState("");
 const [userScore, setUserScore] = useState(0);

 const params = useParams();
 const navigate = useNavigate();
  useEffect(() => {
   async function fetchData() {
     const id = params.id.toString();
     const response = await fetch(`http://localhost:5000/record/${params.id.toString()}`);
      if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
      const record = await response.json();
     if (!record) {
       window.alert(`Record with id ${id} not found`);
       navigate("/");
       return;
     }
      setForm(record);
   }
    fetchData();
    return;
 }, [params.id, navigate]);
  // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
  async function onSubmit(e) {
   e.preventDefault();
   const editedPerson = {
     userGuess: parseInt(form.userGuess),
   };
    // This will send a post request to guess the number in the database.
   const result = await fetch(`http://localhost:5000/guess/${params.id}`, {
     method: "POST",
     body: JSON.stringify(editedPerson),
     headers: {
       'Content-Type': 'application/json'
     },
   });
   
   const newGuessResult = await result.json();
   //console.log("newGuessResult: " + newGuessResult.guessResult);
   //console.log("newGuessResultScore: " + newGuessResult.userScore);
   setGuessResult(newGuessResult.guessResult);
   setUserScore(newGuessResult.userScore);
   //console.log("guessResult: " + guessResult);

   if (newGuessResult.guessResult == "Your guess is correct!")
   {
      //console.log("I am in the end of game if block.");
      setTimeout(() => {
        navigate("/highscores");
      }, 3000);
   }
 }

  useEffect(() => {}, [guessResult, userScore]);

  // This following section will display the form that takes input from the user to update the data.
 return (
   <div>
     <h3>Update Record</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="userGuess">Enter your guess: </label>
         <input
           type="number"
           className="form-control"
           id="userGuess"
           value={form.userGuess}
           onChange={(e) => updateForm({ userGuess: e.target.value })}
         />
       </div>
       <div>{guessResult}</div>
       <div>Number of guesses: {userScore}</div>
       <div className="form-group">
         <input
           type="submit"
           value="Submit Guess"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}