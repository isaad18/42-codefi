const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data

app.get('/', (req, res) => {
  res.render('index');
});
app.get('/api-test', (req, res) => {
  res.render('api-tests/test-list', {error: false});
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

// has-completed post request
app.post('/has-completed', async function (req, res) {
  let data = {'completed': false, 'date' : null};  
  const response = await getChallengeList(req.body.name);
  if (response)
  {
    const completed = response.map(i => i.slug).includes(req.body.exercise.trim());
    data.completed = completed;
    if (completed)
    {
      response.forEach(item => {
        if (item.slug == req.body.exercise)
        {
          data.date = new Date(item.completedAt);
        }
      });
      // console.log(completionDate.getSeconds());
      // console.log(completionDate.getMinutes());
    }
    res.render('api-tests/challenge-complete', data);
  }
  else
  {
    res.render('api-tests/test-list', {error: true});
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  console.log(`API tests on http://localhost:${port}/apitest`);
});