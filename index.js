const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectID;

const port = process.env.PORT || 5055

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0fkav.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  console.log('connection error: ', err);
  const booksCollection = client.db("bookParadise").collection("books");
  const userBookingCollection = client.db("bookParadise").collection("booking");

  app.post('/addBooks', (req, res) => {
    const newBook = req.body;
    console.log('adding new event');
    booksCollection.insertOne(newBook)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/books', (req, res) => {
    booksCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addBooking', (req, res)=>{
    const newBooking = req.body;
    userBookingCollection.insertOne(newBooking)
    .then(result => {
      console.log(result);
    })
    console.log(newBooking);
  })

  app.get('/myBooking', (req, res) => {
    userBookingCollection.find({email: req.query.email})
    .toArray((err, myBookings) =>{
      res.send(myBookings);
    })
  })  

  app.delete('/delete/:id', (req, res)=>{
    console.log(req.params.id);
    booksCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      console.log(result);
    })
  
  }

  )  
  app.get('/', (req, res)=>{
    res.send('Welcome to Heroku website')
  })


  console.log('Database connected successfully');
  //   client.close();
});


app.listen(process.env.PORT || port)