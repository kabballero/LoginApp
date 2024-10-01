#!/usr/bin/env node

const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const yargs = require('yargs');

// Create a MySQL connection pool (replace with your own configuration)
const con = mysql.createPool({
    multipleStatements: true,
    host: "127.0.0.1",
    user: "root",
    database: "CosaNostra"
});

// Define a CLI command
yargs
  .command('login', 'Authenticate user', (yargs) => {
    return yargs
      .option('username', {
        alias: 'u',
        demandOption: true,
        describe: 'Username',
        type: 'string',
      })
      .option('password', {
        alias: 'p',
        demandOption: true,
        describe: 'Password',
        type: 'string',
      });
  }, async (argv) => {
    const username = argv.username;
    const password = argv.password;

    const myquery = `SELECT caporegime.username AS caporegime, soldier.username AS soldier FROM 
    (SELECT * FROM members WHERE username=? AND kodikos=?) AS t1 LEFT JOIN soldier 
    ON t1.username = soldier.username LEFT JOIN caporegime ON t1.username = caporegime.username`;

    con.query(myquery, [username, password], (err, result) => {
      if (err) {
        console.error('Database error:', err);
      } else if (result.length === 0) {
        console.log('Access denied');
      } else if (result[0].soldier !== null) {
        const token = jwt.sign({ username: result[0].soldier, role: 'soldier' }, 'your-secret-key', {
          expiresIn: '1h',
        });
        console.log('Token:', token);
      } else if (result[0].caporegime !== null) {
        const token = jwt.sign({ username: result[0].caporegime, role: 'caporegime' }, 'your-secret-key', {
          expiresIn: '1h',
        });
        console.log('Token:', token);
      }
      con.end(); // Close the database connection
    });
  })
  .argv;