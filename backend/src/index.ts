const express = require('express')
const app = express();
app.use(express.json())
const mainrouter = require("/route/index.ts")

const cors = require("cors")
app.use(cors());

app.use("/api/vi", mainrouter);
app.listen(3000, ()=> console.log("smooth operatorrr"))