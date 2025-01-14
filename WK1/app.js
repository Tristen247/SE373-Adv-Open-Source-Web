const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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

app.use((req, res) => {
  res.writeHead(301, {'Location': req.headers['host'] + '/index'});
  res.end();
});

app.listen(PORT, () => {
  console.log("Server running on port 3000.");
});