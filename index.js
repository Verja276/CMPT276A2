const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


var app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null };
    res.render('pages/db', results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
app.post('/database/d', async (req, res) => {
  try {
    let deletename = req.body.deletename;
    const client = await pool.connect();
    const deleted = await client.query(`DELETE FROM "rct" WHERE "name"='${deletename}'`);
    const result = await client.query('SELECT * FROM rct ORDER BY name ASC');
    const results = { 'results': (result) ? result.rows : null };
    res.render('pages/db', results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.post('/database/i', async (req, res) => {
  try {
    let name = req.body.name;
    let height = req.body.height;
    let width = req.body.width;
    let color = req.body.color;
    let personality = req.body.personality;
    if (width == "") {
      width = 0;
      color = "Blank";
    }
    if (height == "") {
      height = 0;
      color = "Blank";
    }
    if (name == "") {
      name = "Rectangle";
    }
    if (personality == "") {
      personality = "Basic";
    }
    if(color ==""){
      color = "Blank";
    }
    const client = await pool.connect();
    const insert = await client.query(`INSERT INTO rct VALUES ('${name}','${height}','${width}','${color}','${personality}')`);
    const result = await client.query(`SELECT * FROM rct ORDER BY name ASC`);
    const results = { 'results': (result) ? result.rows : null };
    res.render('pages/db', results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.post('/database/:name', async (req, res) => {
  try {
    let updateNm = req.body.updateNm; let updateHt = req.body.updateHt;
    let updateWd = req.body.updateWd; let updateClr = req.body.updateClr; let updatePer = req.body.updatePer; var name = req.params.name;
    arr1 = [updateNm, updateHt, updateWd, updateClr, updatePer,];
    const client = await pool.connect();
    const selection = await client.query(`SELECT * FROM rct WHERE name = '${name}'`)
    const resultOriginal = { 'results': (selection) ? selection.rows : null };
    for (let i = 0, l = resultOriginal.results.length; i < l; i++) {
      var obj = resultOriginal.results[i];
    }
    arr2 = [obj.name, obj.height, obj.width, obj.color, obj.personality]
    for (let i = 0; i < arr2.length; i++) {
      if (arr1[i] == "") {
        arr1[i] = arr2[i];
      }
    }
    const update = await client.query(`UPDATE rct SET name='${arr1[0]}', height='${arr1[1]}', width='${arr1[2]}', color='${arr1[3]}',personality='${arr1[4]}' WHERE name = '${name}'`);
    const result = await client.query(`SELECT * FROM rct WHERE name = '${name}'`);
    const results = { 'results': (result) ? result.rows : null };
    res.render('pages/recta', results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/database', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM rct');
    const results = { 'results': (result) ? result.rows : null };
    res.render('pages/db', results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/database/:name', async (req, res) => {
  try {
    var name = req.params.name;
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM rct WHERE name = '${name}'`);
    const results = { 'results': (result) ? result.rows : null };
    res.render('pages/recta', results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

  .listen(PORT, () => console.log(`Listening on ${PORT}`))

