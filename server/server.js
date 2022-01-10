require('dotenv').config()
const axios = require('axios');
const express = require('express');
const Log = require('./helper/Log');

const app =  express();
app.use(express.json());

app.use(function (req, res, next) {
    Log.request(req.path)
    next()
})



app.get('/tweetDailyRecipe',async (req, res, next) => {
    try{
        let data = JSON.stringify({
            "text": "hello world 2"
        });

        let config = {
            method: 'post',
            url: `${process.env.TWITTER_API}/2/tweets`,
            headers: {
                'Authorization': process.env.AUTH_STRING,
                'Content-Type': 'application/json'
            },
            data : data
        };

        await axios(config)
            .then(function (response) {
                res.json(response.data)
            })
            .catch(function (error) {
                res.json(error.toString())
            });
    }catch(e){
        console.log(e)
        res.json(e.toString())
    }
});


app.post('/twitterfake/*',async (req, res, next) => {
    try{
        console.log("twitterfake url", req.body)
        res.json(req.body)
    }catch(e){
        console.log(e)
        res.json(e.toString())
    }
});

const port = 42042;
app.listen(port, () =>{
    console.log(`server is running at http://localhost:${port}`)
})
