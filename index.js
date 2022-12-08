var express = require("express")
var app = express()

app.use(express.static("dist/weather"))
app.get("/", function (req, res) {
    req.redirect("/")
})

app.listen(4200)