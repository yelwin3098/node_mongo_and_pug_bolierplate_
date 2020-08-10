'use strict'

const path=require('path');
const config = require('./config')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const errorHandler = require('./middlewares/error-handler')
const apiRouter = require('./routes/api')
const pageRouter=require('./routes/page')
const passport = require('passport')
const session=require('express-session');
const MongoDbStore=require('connect-mongo')(session);
const passportJwt = require('./services/passport')
const Mongo=require('mongoose');
const mongoose = require('./services/mongoose')

// start app and connect to database
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors())
app.use(helmet())

if (config.env !== 'test') app.use(morgan('combined'))

//Session Store 
let mongoStore=new MongoDbStore({
  mongooseConnection:Mongo.connection,
  collection: 'session',
})

//Session
app.use(session({
  secret:config.cookie_secret,
  resave: false,
  store:mongoStore,
  saveUninitialized: true,
  cookie: { maxAge: 1000*60*60*24 } //24hr
}))


// passport
app.use(passport.initialize())
app.use(passport.session())
passport.use('jwt', passportJwt.jwt)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', apiRouter)
app.use('/auth',pageRouter)
app.use(errorHandler.handleNotFound)
app.use(errorHandler.handleError)

app.use((req,res,next)=>{
  res.locals.session=req.session;
  res.locals.user=req.user
  next();
})

  app.listen(config.port, (err) => {
    if (err) {
      console.log(`Error : ${err}`)
      process.exit(-1)
    }

    console.log(`${config.app} is running on ${config.port}`)
  })
mongoose.connect()

module.exports = app
