const express = require( 'express' );
const mongoose = require( 'mongoose' );
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static( 'public' ));

app.use(require( './routes' ));

/*
mongoose.connect() tells Mongoose which database we want to connect to.
If the environment variable MONGODB_URI exists, like on Heroku when we
deploy later, it will use that. Otherwise, it will short-circuit to the
local MongoDB server's database at mongodb://localhost/pizza-hunt.
MongoDB will find and connect to the database if it exists or create the
database if it doesn't.
*/
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/pizza-hunt', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Use this to log mongo queries being executed!
mongoose.set( 'debug', true );

app.listen( PORT, () => console.log(`🌍 Connected on localhost:${PORT}` ));