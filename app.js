const express = require('express');
const sqlite = require('sqlite3');
const env = require('./konfiguracija/environment')

var app = express();

app.use(express.static("public"));
app.use(express.json());

app.listen(env.port,function(){
    console.log ("Server je pokrenut na portu: "+env.port);
});