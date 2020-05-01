const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

let key = process.env.MAILCHIMP_KEY
let url = process.env.MALCHIMP_URL



app.get('/count', (req,res) => {
  const {count} = req.body;

  const data = {
    stats: {
      member_count: count
    }   
  }
  const JSONdata = JSON.stringify(data)

  const options = {
    url: url,
    method: 'GET',
    headers: {
      Authorization: key
    },
    body: JSONdata
  }

 
  request(options, (err,response,body) => {
    if (err) {
      res.json({error: err})
    } else {
        res.sendStatus(200);   
    }
    })
   
})



app.post('/subscribe', (req, res) => {
  const { email, first_name, last_name, js } = req.body;

  const mcData = {
    members: [
      {
        email_address: email,
        status: 'pending',
        merge_fields: {
          FNAME: first_name,
          LNAME: last_name
        }
      }
    ]
  }
  const mcDataPost = JSON.stringify(mcData);
  
  const options = {
    url: url,
    method: 'POST',
    headers: {
      Authorization: key
    },
    body: mcDataPost
  }

  if (email) {
    //success
    request(options, (err,response,body) => {
      if (err) {
        res.json({error: err})
      } else {
        if (js) {
          res.sendStatus(200);
        } else {
          res.redirect('/success.html')
        }
      }

    })
  } else {
    res.status(404).send({message: 'Failed'})
  }

})




const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('server running'));