'use strict';

const express =require("express");
const cors=require("cors");
const { required } = require("nodemon/lib/config");
const axios=require("axios").default;
require("dotenv").config();
const app=express();
const bodyParser=require('body-parser')
app.use(cors());
const port=3000;


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

let url="postgres://malak:1993@localhost:5432/firstdb";

const { Client }=require('pg')
const client =new Client(url);

app.post('/postMovies', postHandler);
app.get('/getMovies', getHandler);

function postHandler(req,res){
    console.log(req.body);
    let{title,date,description}=req.body;
    let sql=`INSERT INTO movies(title,date,description) VALUES($1,$2,$3) RETURNING *;`
    let values=[title,date,description];

    client.query(sql, values).then((result)=>{
        console.log(result);
      //  return res.send("added to DB");
      return res.status(201).json(result.rows);

    })
}

function getHandler(req,res){
    let sql=`SELECT * FROM movies; `;
    client.query(sql).then((result)=>{
        console.log(result); 
    res.json(result.rows)   }
    ).catch()
}

client.connect().then(() =>{
    app.listen(port, ()=> {
        console.log("Server is running on port ${port}");
    });
}
)















