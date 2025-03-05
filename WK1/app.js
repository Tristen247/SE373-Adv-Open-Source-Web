//Note: If something breaks or isnt working may need to check Express

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Middleware body-parser parses json reqs
app.use(bodyParser.json());
//MongoDB Database connection
const mongoURI = "mongodb://localhost:27017/gamelibrary"
mongoose.connect(mongoURI);
const db = mongoose.connection;

//check conection
db.on("error", console.error.bind(console, "MongoDB Connection error"));
db.once("open", ()=>{
  console.log('connected to MongoDB Database')
});

//Mongoose Schema and Model
const gameSchema = new mongoose.Schema({
  gamename:String,
  developer:String
})

const Game = mongoose.model("Game", gameSchema, "favoritegames");

//Crud app examples Connection to DB route examples below
app.get("/games", async (req,res)=>{
    try{
        const games = await Game.find();
        res.json(games);
    }catch(err){
        res.status(500).json({error:"Failed to fetch game data"})
    }
});


const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/todo', async (req, res) => {
  let data = await readFile('data/todo.json');
  res.send(JSON.parse(data));
});

app.get('/read-todo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'read-todo.html'));
});

// updated
app.use((req, res) => {
  res.writeHead(301, {
    Location: `http://${req.headers.host}/index`,
  });
  res.end();
});
//PORT log
app.listen(PORT, () => {
  console.log("Server running on port 3000.");
});