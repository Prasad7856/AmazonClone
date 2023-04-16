const mongoose = require('mongoose');
// password = "prasadraje96"

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => console.log("connected")).catch((err) => console.log("error : " + err.message));
