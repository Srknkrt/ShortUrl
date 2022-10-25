require("dotenv/config")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const connectDb = require("./config/db")

const PORT = process.env.PORT || 5001
const app = express()

app.use(cors())
app.use(bodyParser.json())

connectDb()
 
app.use(express.json({ extended: false }))
 
app.use("/", require("./routers/url"))

app.listen(PORT, () => {
  console.log("Service endpoint http://localhost:" + PORT)
})