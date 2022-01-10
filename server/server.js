require('dotenv').config()
const axios = require('axios');
const express = require('express');

const Log = require('./helper/Log');
const Chefkoch = require('./helper/chefkoch_api');
const Template = require('./helper/template');

const app =  express();
app.use(express.json());

app.use(function (req, res, next) {
    Log.request(req.path)
    next()
})



app.get('/tweetDailyRecipe',async (req, res, next) => {
    try{
        let categorie = req.query.categorie
        await (Chefkoch.getWeekRecipes(categorie)).then(async recipes => {
            let tweet = await Template.compile("tweet.html",recipes[0])
            let data = JSON.stringify({
                "text": tweet
            });

            let config = {
                method: 'post',
                url: `${process.env.TWITTER_API}/2/tweets`,
                headers: {
                    'Authorization': process.env.AUTH_STRING,
                    'Content-Type': 'application/json'
                },
                data: data
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


app.post('/twitterfake/*',async (req, res, next) => {
    try{
        console.log("twitterfake url")
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
