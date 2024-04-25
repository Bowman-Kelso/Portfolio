const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb("employees");
    const result = await db_connect.collection("records").find({}).toArray();
    res.json(result);
  } catch (err) {
    throw err;
  }
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("records").findOne(myquery);
    res.json(result);
  } catch (err) {
    throw err;
  }
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myobj = {
      name: req.body.name,
      numToGuess: Math.floor(Math.random() * 100) + 1,
      userGuess: 0,
      userScore: 0,
      isDone: false,
    };
    const result = await db_connect.collection("records").insertOne(myobj);
    //console.log(result.insertedId);
    res.json(result);
  } catch (err) {
    throw err;
  }
});

// This section will help you update a record by id.
recordRoutes.route("/guess/:id").post(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const newvalues = {
      $set: {
        userGuess: req.body.userGuess,
      },
      $inc: {
        userScore: 1,
      },
    };
    await db_connect.collection("records").updateOne(myquery, newvalues);

    // Get the updated record to check the guess
    const updatedRecord = await db_connect.collection("records").findOne(myquery);

    if (updatedRecord.userGuess == updatedRecord.numToGuess) 
    {
      //console.log("The guess is CORRECT!");
      res.json({guessResult: "Your guess is correct!", userScore: updatedRecord.userScore});

      const winvalue = {
        $set: {
          isDone: true,
        },
      };
      await db_connect.collection("records").updateOne(myquery, winvalue);
    } 
    else if (updatedRecord.userGuess < updatedRecord.numToGuess) 
    {
      //console.log("The guess is too low.");
      res.json({guessResult: "Your guess is too low.", userScore: updatedRecord.userScore});
    } 
    else if (updatedRecord.userGuess > updatedRecord.numToGuess) 
    {
      //console.log("The guess is too high.");
      res.json({guessResult: "Your guess is too high.", userScore: updatedRecord.userScore});
    }

  } catch (err) {
    throw err;
  }
});
 
// This section will help you delete a record
recordRoutes.route("/:id").delete(async function (req, res) {
  try {
    const db_connect = await dbo.getDb();
    const myquery = { _id: new ObjectId(req.params.id) };
    const result = await db_connect.collection("records").deleteOne(myquery);
    console.log("1 document deleted");
    res.json(result);
  } catch (err) {
    throw err;
  }
});

 module.exports = recordRoutes;