//Note: If something breaks or isnt working may need to check Express

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require("express-handlebars");
const path = require('path');
const fs = require('fs');
const PORT = 3000;
const app = express();

//Set Handlebars as our templating engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

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


//Handlebars examples
app.get("/hbsindex", (req,res)=>{
  res.render("home", {
      title:"Welcome to the Handlbars Site",
      message:"This is our page using the template engine"
  })
});

//Crud app examples Connection to DB route examples below
app.get("/games", async (req,res)=>{
    try{
        const games = await Game.find();
        res.json(games);
    }catch(err){
        res.status(500).json({error:"Failed to fetch game data"});
    }
});

// route to get game by ID (GET)
app.get("/games/:id", async (req, res)=>{
  try{
      const game = await Game.findById(req.params.id);
      if(!game){
        return res.status(404).json({error:"Game not found"});
      }
      res.json(game)
  }catch(err){
      res.status(500).json({error:"Failed to fetch game data"});
  }
})

// route to add game (POST)
app.post("/addgame", async (req, res)=>{
  try{
      const newGame = new Game(req.body);
      const savedGame = await newGame.save();
      res.status(201).json(savedGame)
      console.log(savedGame);
  }catch(err){
      res.status(400).json({error: "Failed to create entry"});
  }
})

// route for update (PUT)
app.put("/updategame/:id", async (req, res)=>{
    //example using a promise statement
    Game.findByIdAndUpdate(req.params.id, req.body, {
      new:true,
      runValidators:true
    }).then((updatedgame)=>{
        if(!updatedgame){
          return res.status(400).json({error: "game not found"});
          res.json(updatedgame);
        }
    }).catch((err)=>{
      return res.status(400).json({error: "failed to update game"});
    });     
});

// delete route (DELETE)
app.delete("/deletegame/gamename/", async (req,res)=>{
  try{
      const gamename = req.query;
      const game = await Game.find(gamename);

      if(game.length === 0){
          return res.status(404).json({ error: "Failed to find the game" });
      }
      const deletedGamme = await Game.findOneAndDelete(gamename);
      res.json({message:"Game deleted successfully"})
  }catch(err){
      console.error(err);
      res.status(404).json({ error: "Game not found"});
  }
})



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

app.get("/nodemon",(req,res)=>{
  res.sendStatus(500);
})

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