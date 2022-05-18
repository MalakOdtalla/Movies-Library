'use strict';

const express =require("express");
const cors=require("cors");
const { required } = require("nodemon/lib/config");
const axios=require("axios").default;
require("dotenv").config();
const app=express();
const bodyParser=require('body-parser')
app.use(cors());
const port=process.env.PORT ||3001;


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


const { Client }=require('pg')
const client =new Client(process.env.DATABASE_URL);

app.post('/postMovies', postHandler);


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

app.get('/getMovies', getHandler);
function getHandler(req,res){
    let sql=`SELECT * FROM movies; `;
    client.query(sql).then((result)=>{
        console.log(result); 
    res.json(result.rows)   }
    ).catch()
}

app.get("/trending", movieshandler);
function  movieshandler(req,res){
  axios.get("https://api.themoviedb.org/3/trending/all/week?api_key=2f8a538a539278f73d836e14ebd285a5")
  .then(result=>{
      //console.log(result.data.results);
      //res.send("data from API")
      let trends=result.data.results.map((trend)=>{
          return new Trend(
              trend.id,
              trend.title,
              trend.release_date,
              trend.poster_path,
              trend.overview
          );
      });
      res.json(trends);


  })
  .catch((error => {
      console.log(error);
      res.send("error in data")
  }));

} 
function Trend(id,title,release_date,poster_path,overview){
    this.id=id,
    this.title=title;
    this.release_date=release_date,
    this.poster_path=poster_path;
    this.overview=overview

}


app.get("/search", searchMovieshandler);

function  searchMovieshandler(req,res){
    let movieName=req.query.title;
   // console.log(movieName)
    let url=`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=2f8a538a539278f73d836e14ebd285a5`;
    axios.get(url)
    .then((result) => {
        res.json(result.data.results);

    })
    .catch((error => {
        console.log(error);
        res.send("error in data")
    }));
}


app.get("/certification", certificatHandler);
function certificatHandler(req,res){
  
    // 
     let url="https://api.themoviedb.org/3/certification/movie/list?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US";
     axios.get(url)
     .then((result) => {
        console.log(result)
        res.json(result.data.results);
 
     })
     .catch((error => {
         console.log(error);
         res.send("error in data")
     }));

}

app.get("/watchProviders", providersHandler);
function providersHandler(req,res){
  
    // 
     let url="https://api.themoviedb.org/3/watch/providers/regions?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US";
     axios.get(url)
     .then((result) => {
        console.log(result)
        res.json(result.data.results);
 
     })
     .catch((error => {
         console.log(error);
         res.send("error in data")
     }));

}

client.connect().then(() =>{
    app.listen(port, ()=> {
        console.log("Server is running on port ${port}");
    });
}
)















