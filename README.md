# chefkoch_twitter_bot
- [Unofficial Chefkoch.de API](https://github.com/Oskar1504/chefkoch_scrap.git) daily recipe twitter bot integration
- this app using my api to twitter the RecipeOfTheDay on my twitter account

## Usage
- clone repository
- create .env
````dotenv
# orig: https://api.twitter.com  dev: http://localhost:42042/twitterfake
TWITTER_API=https://api.twitter.com
AUTH_STRING=<AUTH_HEADER_STRING>
````
- ```npm run dev```

- setup your own Chefkoch API locally and bend the helper to the specifeid port the API is running
- hit https://localhost:42042/tweetDailyRecipe to trigger tweet action
    - notice to double check the ports when hosting it yourself