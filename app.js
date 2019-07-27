require('dotenv').config();
const express = require("express")
const app = express();
const mongoose = require('mongoose');
const PORT= process.env.PORT || 4000
const articles = require("./routes/articleRoutes")
const users = require("./routes/userRoutes")
const session = require('express-session')
const expressValidator = require("express-validator")
const flash = require("connect-flash")
const config = require("./config/database")
const passport =require("passport")

 

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Use a static folder and include middleware
app.use(express.static("public"))
// initializing ejs
app.set('view engine', 'ejs');

//EXPRESS SESSION MIDDLEWARE  be sure to use session() before passport.session() to ensure that the login session is restored in the correct order.
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
   
  }))


  // EXPRESS MESSAGES MIDDLEWARE
app.use(flash());

// Passport Config Put this before routes
require("./config/passport")(passport)
//Passport Middleware. Put this before routes
  app.use(passport.initialize());
  app.use(passport.session());

  // Always put local middlware after Passport middleware
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  res.locals.messages = require('express-messages')(req, res);
  res.locals.errors = req.flash('errors');
 
  next();
});



// // express Validator 
// app.use(expressValidator())


//ROUTES MIDDLEWARE
app.use("/article",articles)
app.use("/user",users)


app.get("/",(req,res)=>[
    res.send("homepage")
])


mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.DATABASE01, { useNewUrlParser: true}, err => {
	if (err) throw err;
	console.log('database connected');
});

app.listen(PORT,()=>{
    console.log(`Server is now running on port ${PORT}`)
})

////