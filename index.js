const express = require('express');
const axios = require('axios');
const { render } = require('ejs');
const app = express();
const port = 3000;
const db = require('./queries');
const { urlencoded } = require('express');

require('dotenv').config();
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data
app.use(express.static(__dirname + '/assets'));
app.get('/users', db.getUsers)
app.get('/users/:username', db.getUserById)
app.post('/users', db.createUser)
app.post('/codewars_info', db.createUserCodewars)
app.put('/users/:username', db.updateUser)
app.delete('/users/:username', db.deleteUser)
app.set('view engine', 'ejs');

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login', { authUrl: `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:3000/auth&response_type=code` });
});

app.get('/auth', async (req, res) => {
  const result = axios.post("https://api.intra.42.fr/oauth/token",
    {
      'grant_type': 'authorization_code',
      'client_id': process.env.CLIENT_ID,
      'client_secret': process.env.CLIENT_SECRET,
      'code': req.query['code'],
      'redirect_uri': 'http://localhost:3000/auth'
    }
  ).then((res) => {
    return res.data.access_token;
  }).catch((err) => console.log(err));
  const token = await result;

  const leaderboard = axios.get("http://localhost:3000/users")
    .then(response => {
      return response.data;
    }).catch(() => null);

  const intralogin = await axios.get("https://api.intra.42.fr/v2/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => {
    console.log("this1!! " + res.data)
    return res.data;
  }).catch((err) => console.log(err));

  let userRecord = [];
  if (intralogin) {
    userRecord = axios.get("http://localhost:3000/users/" + intralogin.login)
      .then(response => {
        return response.data;
      }).catch(() => null);
  }
  if (userRecord.length == 0) 
    res.render('home', { accessToken: await result, list: await leaderboard, user: [], showModal: false});
  else
    res.render('home', { accessToken: await result, list: await leaderboard, user: await userRecord, showModal: true});
});

// app.post('/set-codewars-login', (req, res) => {
//   console.log(req.body.codewarsLogin);
//   res.render('home', {});
// });


// API tests page
app.get('/home', async (req, res) => {

  const result = axios.get("http://localhost:3000/users")
    .then(response => {
      return response.data;
    }).catch(() => null);
  res.render('home', { loginError: false, list: await result });
});

// Function that gets a response from the codewars API
// Parameter is codewars login
// This is currently only checking the first page of results
const getChallengeList = (codewarsLogin) => {
  const result = axios.get(`https://www.codewars.com/api/v1/users/${codewarsLogin}/code-challenges/completed?page=0`)
    .then(response => {
      return response.data.data;
    }).catch(() => null);
  return result;
};

// Get information for a single challenge
const getChallengeInfo = (challengeName) => {
  const result = axios.get(`https://www.codewars.com/api/v1/code-challenges/${challengeName}`)
    .then(response => {
      return response.data;
    }).catch(() => null);
  return result;
};

// Post request to get info on a single challenge
app.post('/challenge-info', async (req, res) => {
  const response = await getChallengeInfo(req.body.challengeName);
  // We are interested in name, URL, category, description
  res.render('api-tests/challenge-info', { ...response, challengeNotFound: !response });
});

// Post request to check that a given challenge has been completed by a user
app.post('/has-completed', async (req, res) => {
  let data = { 'completed': false, 'date': null };
  const response = await getChallengeList(req.body.name);
  if (response) {
    const completed = response.map(i => i.slug).includes(req.body.challenge.trim());
    data.completed = completed;
    if (completed) {
      response.forEach(item => {
        if (item.slug == req.body.challenge.trim()) {
          data.date = new Date(item.completedAt);
        }
        // We can also check the languages the challenge was completed
        // in here
        // item.completedLanguages.forEach(Any callback function)
      });

      // Some functions we can use on the date object
      // console.log(completionDate.getSeconds());
      // console.log(completionDate.getMinutes());
    }
    res.render('api-tests/challenge-complete', data);
  }
  else {
    res.render('api-tests/test-list', { loginError: true });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  console.log(`API tests on http://localhost:${port}/login`);
});