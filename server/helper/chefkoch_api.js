const axios = require("axios")
const week = require("./week")

module.exports = {
    async getWeekRecipes(categorie) {
        let host = "http://localhost:42069",
            route = "/api/getWeekRecipes",
            url = host + route,
            output = []

        await axios.get(url, {
            params: {
                week: week.get(),
                categorie: categorie
            }
        })
            .then(async function (response) {
                console.log(url, " | Status:", response.status);
                output = response.data.recipes
            })
            .catch(function (error) {
                console.log(error.toString());
            })

        return output
    },
    async getTodaysRecipes() {
        let host = "http://localhost:42069",
            route = "/api/getTodaysRecipes",
            url = host + route,
            output = []

        await axios.get(url)
            .then(async function (response) {
                console.log(url, " | Status:", response.status);
                output = response.data.recipes
            })
            .catch(function (error) {
                console.log(error.toString());
            })

        return output
    },
};