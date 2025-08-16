"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
app.use(express.json());
const mainrouter = require("./route");
const cors = require("cors");
app.use(cors());
app.use("/api/vi", mainrouter);
app.listen(3000, () => console.log("smooth operatorrr"));
//# sourceMappingURL=index.js.map