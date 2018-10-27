"use strict";
require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const {Order} = require('./models/orders');
const mongoose = require('mongoose');
const CORS = require("cors");
//const passport = require('passport');

const { PORT, CLIENT_ORIGIN } = require("./config");
const jsonParser = bodyParser.json();
// Here we use destructuring assignment with renaming so the two variables
// called router (from ./users and ./auth) have different names
// For example:
// const actorSurnames = { james: "Stewart", robert: "De Niro" };
// const { james: jimmy, robert: bobby } = actorSurnames;
// console.log(jimmy); // Stewart - the variable name is jimmy, not james
// // console.log(bobby); // De Niro - the variable name is bobby, not robert
// const { router: usersRouter } = require('./users');
// const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { dbConnect } = require("./db-mongoose");
//const {dbConnect} = require("./db-knex");

const app = express();  

app.use(
  CORS({
    origin: CLIENT_ORIGIN
  })
);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// passport.use(localStrategy);
// passport.use(jwtStrategy);

// app.use('/api/users/', usersRouter);
// app.use('/api/auth/', authRouter);

// const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
// app.get('/api/protected', jwtAuth, (req, res) => {
//   return res.json({
//     data: 'rosebud'
//   });
// });
// Logging
//app.use(morgan('common'));
app.use(
  morgan(process.env.NODE_ENV === "production" ? "common" : "dev", {
    skip: (req, res) => process.env.NODE_ENV === "test"
  })
);


app.get('/api/orders', (req, res, next) => {
//  app.get("/api/protected/orders", jwtAuth, (req, res, next) => {
    Order.find()
  .then(results => {
    res.json(results);  //
  })
  .catch(err => {
    next(err);
  });
  
  //const orders = getorders()

  });
  app.get('/api/orders/:id', jsonParser, (req, res, next) => {
    //app.get('/api/protected/orders/:id', jwtAuth, jsonParser, (req, res, next) => {
      const { id } = req.params;
    const userId = req.user.id;
  console.log('req: ', req);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The `id` is not valid');
      err.status = 400;
      return next(err);
    }
    //Order.findOne({ _id: id})  
    Order.findOne({ _id: id, userId })
      .populate('recipients')
      .then(result => {
        if (result) {
          res.json(result);
        } else {
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  });
  
  app.post("/api/orders", jsonParser, (req, res, next) => {
    console.log('req.body: ', req.body);
    const { userId, customerName,  email, phone, productCode, productName, productSize, status, orderDate, message, expectedTime } = req.body;
    const newOrder = { userId, customerName,  email, phone, productCode, productName, productSize, status, orderDate, message, expectedTime };  
    Order.create(newOrder) //
      .then(result => {
        res
          .location(`${req.originalUrl}/${result.id}`)
          .status(201)
          .json(result); //
      })
      .catch(err => {
        next(err);
      });
  });
app.put('/api/orders/:id', jsonParser,  (req, res, next) => {
  console.log('put called. req.body = ', req.body);

  const updateorder = {};
  const updateFields = [userId, customerName,  email, phone, productCode, productName, productSize, status, orderDate, message, expectedTime];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateorder[field] = req.body[field];
    }
  });
  const id = req.params.id;

  console.log(`Updating order \`${req.params.id}\``);
  order.findByIdAndUpdate(id, updateorder, { new: true })
    .then(result => {
      if (result) {
        console.log('put request response is: ', res);
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
  });
// when DELETE request comes in with an id in path,
// try to delete that item 
  app.delete('/api/orders/:id', (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    /***** Never trust users - validate input *****/
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The `id` is not valid');
      err.status = 400;
      return next(err);
    }
    //order.deleteOne({ _id: id})
    order.deleteOne({ _id: id, userId })
      .then(result => {
        if (result.n) {
          res.sendStatus(204);
        } else {
          res.sendStatus(404);
        }
      })
      .catch(err => {
        next(err);
      });
  });
   
function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on("error", err => {
      console.error("Express failed to start");
      console.error(err);
    });
}


if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
