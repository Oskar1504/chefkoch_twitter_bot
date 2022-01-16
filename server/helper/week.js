module.exports = {
     get() {
        let now = new Date(),
            onejan = new Date(now.getFullYear(), 0, 1)
        return Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7)-1
    }
};