const moment = require("moment"); // Import moment.js for date formatting
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require("express-handlebars");
const path = require('path');
const fs = require('fs');
const PORT = 3000;
const app = express();

app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: false,
  helpers: {
    eq: (a, b) => a === b,

    formatAsDate: (date, format) => {
      if (!date) return ''; // If no date, return empty string
      if (!(date instanceof Date) && typeof date !== "string") return ''; // Ensure valid date
      if (typeof format !== "string") format = "MM/DD/YYYY"; // Ensure is in string format

      return moment(date).local().format(format);
    }
  }
  
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//Middleware body-parser parses json reqs
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//MongoDB Database connection
const mongoURI = "mongodb://localhost:27017/Empl"
mongoose.connect(mongoURI);
const db = mongoose.connection;

//check conection
db.on("error", console.error.bind(console, "MongoDB Connection error"));
db.once("open", ()=>{
  console.log('connected to MongoDB Database')
});

// Define the schema
const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  department: String,
  startDate: Date,
  jobTitle: String,
  salary: Number,
});
const Employee = mongoose.model('Employee', employeeSchema, "employee");

// ========== Employee Routes ========== //
// 1. Home / Create Employee Form
app.get('/', (req, res) => {
  res.render('employees/createEmployee'); 
});

// 2. Handle Creation (POST)
app.post('/create', async (req, res) => {
  try {
    const newEmployee = new Employee({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      department: req.body.department,
      startDate: req.body.startDate,
      jobTitle: req.body.jobTitle,
      salary: req.body.salary,
    });
    await newEmployee.save();
    res.redirect('/employees');
  } catch (err) {
    res.status(500).send('Error creating employee: ' + err.message);
  }
});

// 3. View All Employees (GET)
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find().lean();
    res.render('employees/viewEmployee', { employees });
  } catch (err) {
    res.status(500).send('Error retrieving employees: ' + err.message);
  }
});

// 4. Edit Form 
app.get('/edit/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).lean();
    if (!employee) return res.status(404).send('Employee not found');
    res.render('employees/editEmployee', { employee });
  } catch (err) {
    res.status(500).send('Error loading employee: ' + err.message);
  }
});

// 5. Handle Update
app.post('/update/:id', async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      department: req.body.department,
      startDate: req.body.startDate,
      jobTitle: req.body.jobTitle,
      salary: req.body.salary,
    }).lean();
    res.redirect('/employees');
  } catch (err) {
    res.status(500).send('Error updating employee: ' + err.message);
  }
});

// 6. Delete
app.get('/delete/:id', async (req, res) => {
  try {
    const deletedEmp = await Employee.findByIdAndDelete(req.params.id).lean();
    if (!deletedEmp) return res.status(404).send('Employee not found');
    res.render('employees/deleteEmployee', { employee: deletedEmp });
  } catch (err) {
    res.status(500).send('Error deleting employee: ' + err.message);
  }
});




// ======== Game Exmaples from DEMO ========= //

//Mongoose game Schema and Model
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
  console.log(req.body.gamename);
  try{
      const newGame = new Game(req.body);
      const savedGame = await newGame.save();
      res.status(201).json(savedGame)
      console.log(savedGame);
  }catch(err){
      res.status(400).json({error: "Failed to create entry"});
  }
})

//For HBs View form
app.get("/addgame", (req,res)=>{
  res.render("addgame", {
      title:"Add a game to the Favorite Game Database",
      message:"Please add a game."
  })
});

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


// ======== Rest of File ========= //
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

//app.get('/index', (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});

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

app.use((req, res) => {
  res.redirect('/');
});

//PORT log
app.listen(PORT, () => {
  console.log("Server running on port 3000.");
});