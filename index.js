const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vjryr.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const collection = client.db("volunteer").collection("imgs");

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    collection.insertOne(newEvent)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/events', (req, res) => {
    collection.find({})
    .toArray((err, items) => {
      console.log(items)
      res.send(items)
    })
  })

  console.log('database connected')
  // client.close();
});


app.listen(port)