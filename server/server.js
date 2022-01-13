require('dotenv').config()
const axios = require('axios');
const express = require('express');

const Log = require('./helper/Log');
const Chefkoch = require('./helper/chefkoch_api');
const Template = require('./helper/template');
const Header = require('./helper/header');


const app =  express();
app.use(express.json());

app.use(function (req, res, next) {
    Log.request(req.path)
    next()
})



app.get('/tweetDailyRecipe',async (req, res, next) => {
    try{
        let categorie = req.query.categorie,
            day = new Date().getDay() - 1
        await (Chefkoch.getWeekRecipes(categorie)).then(async recipes => {
            let tweet = await Template.compile("tweet.html",recipes[day])
            const request = {
                url: `${process.env.TWITTER_API}/2/tweets`,
                method: 'POST',
                body: {
                    "text":tweet
                }
            };

            const authHeader = Header.getAuthHeaderForRequest(request);

            let config = {
                method: 'post',
                url: request.url,
                headers: authHeader,
                data: request.body
            };

            await axios(config)
                .then(function (response) {
                    Log.success(`Succesfully tweeted. hehe.`)
                    res.json(response.data)
                })
                .catch(function (error) {
                    res.json(error.toString())
                });
        })
    }catch(e){
        console.log(e)
        res.json(e.toString())
    }
});


app.get('/tweetTest',async (req, res, next) => {

    const request = {
        url: `${process.env.TWITTER_API}/2/tweets`,
        method: 'POST',
        body: {
            "text":"Hello World."
        }
    };

    const authHeader = Header.getAuthHeaderForRequest(request);

    let config = {
        method: 'post',
        url: request.url,
        headers: authHeader,
        data: request.body
    };

    await axios(config)
        .then(function (response) {
            Log.success(`Succesfully tweeted. hehe.`)
            res.json(response.data)
        })
        .catch(function (error) {
            console.log(error)
            res.json(error.toString())
        });
});



app.post('/twitterfake/*',async (req, res, next) => {
    try{
        console.log("twitterfake url")
        res.json(req.body)
    }catch(e){
        console.log(e)
        res.json(e.toString())
    }
});


app.post('/ping',async (req, res, next) => {
    try{
        console.log("Pong!")
        res.json({data:"Pong!", req_body:req.body})
    }catch(e){
        console.log(e)
        res.json(e.toString())
    }
});

const port = 42042;
app.listen(port, () =>{
    console.log(`server is running at http://localhost:${port}`)
})
