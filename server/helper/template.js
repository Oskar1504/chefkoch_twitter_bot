const fs = require("fs")

module.exports = {
    async compile(template, data) {
        let template_string = fs.readFileSync(__dirname + "/../templates/" + template).toString()

        //replace all
        for(let key in data){
            template_string = template_string.replace(`{{${key}}}`, data[key])
        }
        return template_string
    },
};