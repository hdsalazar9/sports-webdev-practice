//Here should be the variables that change between the environments
//like deployment or develop environments

//With the or, will take the envrionment var of the server if it exists or will take the localhost
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/sports';
//exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://sportsadmin:sportsadmin@hdsscluster-7fgdi.mongodb.net/sports?retryWrites=true';
exports.PORT = process.env.PORT || 8080;
