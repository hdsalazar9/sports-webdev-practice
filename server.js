//You need to import something in order to use the body
//You need to run a snippet of code before using the body,
//As you need to let it know that you need something of the body

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const sportsRouter = require('./router');
const app = express();
const jsonParser = bodyParser.json();
//Mongoose for connect to a mango DB
mongoose.Promise = global.Promise;

//Pick values from config
//The {} are to ensure that the names are exactly the same
const {DATABASE_URL, PORT} = require('./config');

app.use(express.static('public'));

//Setup the router to the server.js, place the path that all of the endpoints will require
//you will need to put "/Sports/api" to use the end points of the router
app.use('/sports/api', jsonParser, sportsRouter);

//Configuration of the setting for the server for the DB
let server;

function runServer(port, databaseUrl) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl,
      err => {
        //IF there is no error this would be undefined
        if (err)
          return reject(err);
        else {
          server = app.listen(port, () => {
              console.log("Your app is running in port " + port);
              resolve(); //Succesfully connect
            })
            .on("error", err => {
              mongoose.disconnect();
              return reject(err);
            });
        }
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect()
    .then(() => {
      return new Promise((resolve, reject) => {
        console.log("Closing the server");
        server.close(err => {
          if (err) {
            return reject(err);
          } else {
            resolve();
          }
        });
      });
    });
}

//IF the url does not existis, creates it
runServer(PORT, DATABASE_URL)
  .catch(err => console.log(err));

module.exports = {
  app,
  runServer,
  closeServer
};
