'use strict'

const path=require('path');
const config = require('../config')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const errorHandler = require('../middlewares/error-handler')
const apiRouter = require('../routes/api')
const pageRouter=require('../routes/page')
const passport = require('passport')
const passportJwt = require('../services/passport')

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(helmet())

if (config.env !== 'test') app.use(morgan('combined'))

// passport
app.use(passport.initialize())
passport.use('jwt', passportJwt.jwt)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')))


app.use('/api', apiRouter)
app.use('/dashboard',pageRouter)
app.use(errorHandler.handleNotFound)
app.use(errorHandler.handleError)

exports.start = () => {
  app.listen(config.port, (err) => {
    if (err) {
      console.log(`Error : ${err}`)
      process.exit(-1)
    }

    console.log(`${config.app} is running on ${config.port}`)
  })
}

exports.app = app
