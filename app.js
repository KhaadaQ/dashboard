const express = require("express");
const PORT = 6000;
const { deafult: mongoose } = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());

// Routes managament

// mongo connection

