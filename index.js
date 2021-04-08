const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.PORT || 8088

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h25va.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodCollection = client.db("hotOnion").collection("food");
  const lunchCollection = client.db("hotOnion").collection("lunch");
  const dinnerCollection = client.db("hotOnion").collection("dinner");

  app.post('/addFoods', (req, res) => {
      const foods = req.body;
      foodCollection.insertMany(foods)
      .then( result => {
          console.log("adding all food", result)
          res.send(result.insertedCount)
      })
  })

  app.get('/breakfast', (req, res) => {
    foodCollection.find({})
    .toArray((err, items) => {
        res.send(items)
    })
  })

  app.post('/addLunch', (req, res) => {
    const lunch = req.body;
    lunchCollection.insertMany(lunch)
    .then( result => {
        console.log("adding all food", result)
        res.send(result.insertedCount)
    })
}) 

app.get('/lunch', (req, res) => {
    lunchCollection.find({})
    .toArray((err, items) => {
        res.send(items)
    })
  })

  app.post('/addDinner', (req, res) => {
    const dinner = req.body;
    dinnerCollection.insertMany(dinner)
    .then( result => {
        console.log("adding all food", result)
        res.send(result.insertedCount)
    })
})

app.get('/dinner', (req, res) => {
  dinnerCollection.find({})
  .toArray((err, items) => {
      res.send(items)
  })
})
  
});


app.listen(port)