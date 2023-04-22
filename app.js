require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
require('./db/conn');

const Products = require('./models/ProductSchema');
const DefaultData = require('./DefaultData');

const cors = require('cors');

const router = require('./routes/router');

const corsOptions = {
    origin: 'https://melodic-puffpuff-8d23a8.netlify.app',
    credentials: true,
  };


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(router);

const port = process.env.PORT || 8000;

// for deployment
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"))
}

app.listen(port, () => {
    console.log('server is sunning at port');

})

DefaultData();
