
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let sportSchema = mongoose.Schema({
	id : {type: Number, required : true, unique : true},
	name : {type: String, required : true}
});

let Sports = mongoose.model('Sports', sportSchema);

//Simulating the querys
const ListSports = {
  get : function(){
		//The return espera para que le manden la informacion del otro return para mandarla
		//Eso es lo que hace un promise, esperar
    return Sports.find()
			.then(sports => {
				return sports;
			})
			.catch(err => {
				throw new Error(err);
			});
  },
	getById : function(sportId){
		return Sports.findOne({id : sportId})
			.then(sport => {
				return sport;
			})
			.catch(err => {
				throw new Error(err);
			});
	},
	/* Ya no es asi, ya no es un array de objetos
  verifyId : function(idToCheck){
    sportsDB.forEach(item => {
  		if(item.id == idToCheck)
        return false;
  	});
    return true; //Si no existe regresa verdadero
  }, */
  post: function(newSport){
		//different from mongo, in mongo is insert mongoose is create
		return Sports.create(newSport)
			.then(sport => {
				return sport;
			})
			.catch(err => {
				throw new Error(err);
			});
  },
	put: function(oldId, newName){
		return Sports.findOneAndUpdate({id : oldId}, {$set: {name: newName}}, {new: true})
		.then(sport => {
			return sport;
		})
		.catch(err => {
			throw new Error(err);
		});
	},
	delete: function(idToDelete){
		return Sports.findOneAndDelete({id: idToDelete})
		.then(sport => {
			//Returns the deleted sport finded by find one
			return sport;
		})
		.catch(err => {
			throw new Error(err);
		});
	}
}

//Thingy to be reachable (part of node)
module.exports = {ListSports};
