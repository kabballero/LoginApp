const express = require('express')
const mysql = require('mysql')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const cors = require('cors')
require('dotenv').config();
const jwt = require('jsonwebtoken')

const port = 9103;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

var con = mysql.createPool({
    multipleStatements: true,
    host: "127.0.0.1",
    user: "root",
    database: "CosaNostra"
});

const filePath = 'C:\\Users\\exarx\\Downloads\\truncated_data_w_assets\\truncated_data\\truncated_title.akas.tsv';

fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const rows = data.split('\n');

  // Assuming the first row contains headers and the rest contain data
  const headers = rows[0].split('\t');
  const values = rows.slice(1).map(row => row.split('\t'));

  // Log headers
  console.log('Headers:', headers);

  // Log values
  /*console.log('Values:');
  values.forEach((valueRow) => {
    console.log(valueRow.join('\t'));
  });*/

});

app.post('/login', (req, res) => {
    var myquery = `select caporegime.username as caporegime,soldier.username as soldier from 
    (select * from members where username=? and kodikos=?) as t1 left join soldier 
    on t1.username=soldier.username left join caporegime on t1.username=caporegime.username `;
    con.query(myquery, [req.body.username, req.body.password], async (err, result, fields) => {
        if (err) throw err;
        if (result.length == 0) {
            res.send('access denied')
        }
        else if (result[0].soldier !== null) {
            const token = jwt.sign({ username: result[0].soldier, role: 'soldier' }, process.env.TOKEN_SECRET_KEY, {
                expiresIn: '1h',
            });
            res.json({ token: token })
        }
        else if (result[0].caporegime !== null) {
            const token = jwt.sign({ username: result[0].caporegime, role: 'caporegime' }, process.env.TOKEN_SECRET_KEY, {
                expiresIn: '1h',
            });
            res.json({ token: token })
        }
    });
})

function authenticateToken(req, res, next) {
    const token = req.headers['x-observatory-auth'];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        req.decoded = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

app.get('/capoClassified', authenticateToken, (req, res) => {
    const decoded = req.decoded;
    if (decoded && decoded.username && decoded.role==='caporegime') {
        const myquery = 'select * from caporegimesStaff where username=?';
        con.query(myquery, [decoded.username], (err, result, fields) => {
            res.send(result)
        })
    }
    else {
        res.status(403).json({ message: 'Invalid token or missing username' });
    }

})

app.get('/soldierClassified', authenticateToken, (req, res) => {
    const decoded = req.decoded;
    if (decoded && decoded.username && decoded.role==='soldier') {
        const myquery = 'select * from soldiersStaff where username=?';
        con.query(myquery, [decoded.username], (err, result, fields) => {
            res.send(result)
        })
    }
    else {
        res.status(403).json({ message: 'Invalid token or missing username' });
    }

})