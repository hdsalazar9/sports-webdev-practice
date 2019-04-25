//with this yoy specify that this is businesslogic, I mean a router
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

//Import the model information
const {
  ListSports
} = require('./model');

//Next would be added instead of the send Finish, in order to finish the execution
router.get('/list-sports', (req, res, next) => {
  //We need to ask the model for the raw info
  //Making the call to the function that gets the sports which is defined in the ListSports model
  ListSports.get()
    .then(sports => {
      res.status(200).json({
        message: "Successfully sent the list of sports",
        status: 200,
        sports: sports
      }).catch(err => {
        res.status(500).json({
          message: "Internal server error",
          status: 500
        });
        return next();
      });
    });
});

router.get('/list-sports/:id', (req, res, next) => {
  let sportId = req.params.id;

  ListSports.getById(sportId)
    .then(sport => {
      if (sport) {
        res.status(200).json({
          message: "Succesfully found the defined sport",
          status: 200,
          sport: sport
        });
      } else {
        res.status(406).json({
          message: "Sport id not found",
          status: 406,
          sportId: sportId
        });
        return next();
      }
    }).catch(err => {
      res.status(500).json({
        message: "Internal server error",
        status: 500
      });
      return next();
    });
});

/*
router.post('/post-sport', (req, res, next) => {
  //Obtain the information from the body message
	let sportId = req.body.id;
	let sportName = req.body.name;

	//Validate that we receive both of the params. Send error 400 Missing fields
	if(sportId == undefined || sportId == "" || sportName == undefined || sportName == ""){
		res.status(406).json({
	    message: "Missing some value (name or id).",
	    status: 406
	  });
		return next();
	}

  //COPIAR EL POST DEL PROFE PORQUE NO HICE EL MIO
  //Valdiar que no existe el id FALTA HACERLO AAAH
	//Validate that the id received is in the current array
	if(ListSports.verifyId(sportId)){
    let newSport = {
  		name : sportName,
  		id: sportId,
  	};
    ListSports.post(newSport);
  }
  else{
    res.status(409).json({
      message: "Please use another id, that is already used xd.",
      status: 409
    });
    return next();
  }

	res.status(201).json({
		message: "Successfully added the sport m8.",
		status: 201,
		sport: newSport
	});

}); */

router.post('/post-sport', (req, res, next) => {
  let requiredFields = ['id', 'name'];

  for (let i = 0; i < requiredFields.length; i++) {
    let currentField = requiredFields[i];
    if (!(currentField in req.body)) {
      res.status(406).json({
        message: `Missing field ${currentField} in body.`,
        status: 406
      });
      return next();
    }
  }
/*
  bcrypt.hash(req.body.name, 10)
    .then(hashedName => {
      let objectToAdd = {
        id: req.body.id,
        name : hashedName
      };
      ListSports.post(objectToAdd)
        .then(sport => {
          res.status(201).json({
            message: "Successfully added the sport",
            status: 201,
            sport: sport
          });
        })
        .catch(err => {
          res.status(500).json({
            message: `Internal server error.`,
            status: 500
          });
          return next();
        });
    }) */

    //Now the objecto to be added would have a hashed name
  let objectToAdd = {
    id: req.body.id,
    name: req.body.name
  };

  ListSports.post(objectToAdd)
    .then(sport => {
      res.status(201).json({
        message: "Successfully added the sport",
        status: 201,
        sport: sport
      });
    })
    .catch(err => {
      res.status(500).json({
        message: `Internal server error.`,
        status: 500
      });
      return next();
    });
    
});

router.put('/update-sport/:id', (req, res, next) => {
  let requiredFields = ['name'];
  for (let i = 0; i < requiredFields.length; i++) {
    let currentField = requiredFields[i];
    if (!(currentField in req.body)) {
      res.status(406).json({
        message: `Missing field ${currentField} in body.`,
        status: 406
      });
      return next();
    }
  }
  let sportId = req.params.id;
  let sportName = req.body.name;

  if (sportId) {
    ListSports.put(sportId, sportName)
      .then(updatedSport => {
        if (updatedSport) {
          res.status(200).json({
            message: "Successfully updated the sport",
            status: 200,
            sport: updatedSport
          });
        } else {
          res.status(404).json({
            message: "Sport not found in the list",
            status: 404,
            sportId: sportId
          });
          return next();
        }
      })
      .catch(err => {
        res.status(500).json({
          message: `Internal server error.`,
          status: 500
        });
        return next();
      });
  } else {
    res.status(406).json({
      message: "Missing param 'id'",
      status: 406
    });
    return next();
  }
});

router.delete('/remove-sport/:id', (req, res, next) => {

	let sportId = req.params.id;
	if (sportId){
    ListSports.delete(sportId)
      .then(deletedSport => {
        if (deletedSport) {
          res.status(200).json({
            message: "Successfully deleted the sport",
            status: 200,
            sport: deletedSport
          });
        } else {
          res.status(404).json({
            message: "Sport not found in the list",
            status: 404,
            sportId: sportId
          });
          return next();
        }
      })
      .catch(err => {
        res.status(500).json({
          message: `Internal server error.`,
          status: 500
        });
        return next();
      });
		}	else {
      res.status(406).json({
        message : `Missing id in parameters.`,
        status : 406
      });
      return next();
		}

});

//We need to make the router visible, so lets export it
module.exports = router;

/*
app.get('/list-sports',(req, res) => {
	res.status(200).json({
		message: "Successfully sent the list of sports",
		status : 200,
		sports : sportsArray
	});
});

//A get of sport with the id in the header, la unica forma de pasar datos es por codigo o postman
app.get('/list-sports-with-headers',(req, res) =>{
	let sportId = req.get('id');

	sportsArray.forEach(item => {
		if(item.id == sportId){
			res.status(200).json({
				message: "Successfully sent the found sport",
				status : 200,
				sport : item
			});
		}
	});

	res.status(400).json({
		message: "Sport not found in the list :(",
		status: 400
	});
});

app.get('/list-sports/:id',(req, res) => {
	let sportId = req.params.id;
  sportsArray.forEach(item => {
    if(item.id == sportId){
      res.status(200).json({
    		message: "Successfully sent the found sport",
    		status : 200,
    		sport : item
    	});
    }
  });

  res.status(400).json({
    message: "Sport not found in the list :(",
    status: 400
  });
});

//To post an object, de informacion que viene desde body
//jsonParser is a middleware, (snippet runned before the other thingys) to convert the body into json
app.post('/post-sport', jsonParser, (req, res) =>{
	//Obtain the information from the body message
	let sportId = req.body.id;
	let sportName = req.body.name;

	//Validate that we receive both of the params. Send error 400 Missing fields
	if(sportId == undefined){
		res.status(406).json({
	    message: "Missing sportId :(",
	    status: 406
	  });
		res.send("Finish");
	}
	if(sportName == undefined){
		res.status(406).json({
	    message: "Missing Sport name :(",
	    status: 406
	  });
		res.send("Finish");
	}

	//Validate that the id received is in the current array
	//Send an error if it is. Error 409
	sportsArray.forEach(function(element){
		if(element.id == sportId){
			res.status(409).json({
		    message: "Please use another id, that is already used xd.",
		    status: 409
		  });
			res.send("Finish");
		}
	});

	//Success callback with status 201 with the just created object
	let newSport = {
		name : sportName,
		id: sportId,
	};
	sportsArray.push(newSport);

	res.status(201).json({
		message: "Successfully added the sport m8.",
		status: 201,
		sport: newSport
	});
});

app.put('/update-sport/:id', jsonParser, (req, res) => {

	let requiredFields = ['name'];



	for ( let i = 0; i < requiredFields.length; i ++){

		let currentField = requiredFields[i];



		if (! (currentField in req.body)){

			res.status(406).json({

				message : `Missing field ${currentField} in body.`,

				status : 406

			}).send("Finish");

		}

	}



	let sportId = req.params.id;



	if (sportId){

		sportsArray.forEach((item, index) => {

			if (item.id == sportId){

				sportsArray[index].name = req.body.name;



				res.status(200).json({

					message : "Successfully updated the sport",

					status : 200,

					sport : item

				});

			}

		});



		res.status(404).json({

			message : "Sport not found in the list",

			status : 404

		}).send("Finish");;

	}

	else{

		res.status(406).json({

			message : "Missing param 'id'",

			status : 406

		}).send("Finish");;

	}

});



app.delete('/remove-sport/:id', jsonParser, (req, res) => {

	let requiredFields = ['id'];



	for ( let i = 0; i < requiredFields.length; i ++){

		let currentField = requiredFields[i];



		if (! (currentField in req.body)){

			res.status(406).json({

				message : `Missing field ${currentField} in body.`,

				status : 406

			}).send("Finish");

		}

	}

	let sportId = req.params.id;



	if (sportId){

		if(sportId == req.body.id){

			sportsArray.forEach((item, index) => {

				if (item.id == sportId){

					sportsArray.splice(index, 1);



					res.status(204).json({

						message : "Successfully deleted the sport",

						status : 204,

						sport : item

					});

				}

			});



			res.status(404).json({

				message : "Sport not found in the list",

				status : 404

			}).send("Finish");

		}

		else{

			res.status(400).json({

				message : "Param and body do not match",

				status : 400

			}).send("Finish");

		}

	}

	else{

		res.status(406).json({

			message : "Missing param 'id'",

			status : 406

		}).send("Finish");

	}

});
*/
