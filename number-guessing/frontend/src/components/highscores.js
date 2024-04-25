import React, { useEffect, useState } from "react";
const Record = (props) => (
 <tr>
   <td>{props.record.name}</td>
   <td>{props.record.userScore}</td>
 </tr>
);
export default function Highscores() {
 const [records, setRecords] = useState([]);
  // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`http://localhost:5000/record/`);
      if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
      const records = await response.json();
     setRecords(records);
   }
    getRecords();
    return;
 }, [records.length]);
  // This method will map out the records on the table
 function highscores() {

  const filteredRecords = records.filter(record => record.isDone);

   return filteredRecords.map((record) => {
     return (
       <Record
         record={record}
         key={record._id}
       />
     );
   });
 }
  // This following section will display the table with the records of individuals.
 return (
   <div>
     <h3>Highscores</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Name</th>
           <th>Guesses</th>
         </tr>
       </thead>
       <tbody>{highscores()}</tbody>
     </table>
   </div>
 );
}