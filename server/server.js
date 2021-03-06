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
        if(day == -1 ){
            day = 6
        }
        await (Chefkoch.getWeekRecipes(categorie)).then(async recipes => {
            let tweet = await Template.compile("tweet.html",recipes[day])

            if(recipes[day] != undefined) {


                const request = {
                    url: `${process.env.TWITTER_API}/2/tweets`,
                    method: 'POST',
                    body: {
                        "text": tweet
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
            }else{
                Log.error(`Recipe undefined.Day: ${day} Categorie: ${categorie}`)
                res.json({error:`Recipe undefined.Day: ${day} Categorie: ${categorie}`})
            }
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

const port = process.env.PORT;
app.listen(port, () =>{
    console.log(`${process.env.PROJECT_NAME} is running at http://localhost:${process.env.PORT}`)
    axios({
        method:"post",
        url: "http://localhost:42015/app/register",
        data:{
            project_name: process.env.PROJECT_NAME,
            project_description: process.env.PROJECT_DESCRIPTION,
            project_port: process.env.PORT
        }
    })
        .then(response => Log.success(response.data.data))
        .catch(error => Log.error(error.toString()))
})
