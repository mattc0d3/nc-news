const app = require(`${__dirname}/api/app`)
const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
    if (err) console.log(err)
    else console.log("Listening on port 9090...")
})