
const mongoose = require('mongoose');
// require('dotenv').config();


//Here we are connecting to the DB
const dbConnection = async()=>{

    try{

        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log('DB Online');

    }catch( error ){
        console.log(error);
        throw new Error('Error a la hora de inicialzar DB');
    }

}

module.exports = {
    dbConnection
}