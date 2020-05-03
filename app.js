const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

let key = process.env.MAILCHIMP_KEY
let url = process.env.MAILCHIMP_URL



app.get('/count', async (req,res) => {

  const options = {
    method: 'GET',
    headers: {
      Authorization: key
    }
  }

  try {

    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);

  } catch {
    console.log('error server side')
  }
  


  
   
});





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

app.listen(PORT);