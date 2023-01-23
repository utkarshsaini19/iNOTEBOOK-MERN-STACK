const dotenv = require('dotenv');
dotenv.config()
const PORT = process.env.PORT;
const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const mongoose= require('mongoose')
const path= require('path')


connectToMongo();



const app = express()
const port = process.env.PORT || 5000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// Middleware so that we can fix req.body = undefined error
//app.use(cors)

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.use(express.json())


// Availabale routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("/", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.listen(port, () => {
  console.log(`iNote Backend listening on port ${port}`)
})