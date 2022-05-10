'use strict';

const express =require("express");
const cors=require("cors");
const { required } = require("nodemon/lib/config");
const Data_file =require("./movie_data/data.json");

const axios=require("axios").default;
require("dotenv").config();
const app=express();
const bodyParser=require('body-parser')
app.use(cors());
const port=3000;


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


const { Client }=require('pg');
const { handle } = require("express/lib/application");
const client =new Client(process.env.DB_url);

app.get("/", Homehandle);
app.get("/favorite", Pagehandle);
app.get("/trending", movieshandler);
app.get("/search", searchMovieshandler);

app.post('/postMovies', postHandler);
app.get('/getMovies', getHandler);
app.put('/updateMovies/:MovieId', handleUpdateMovies);
app.put('/deleteMovies/:MovieId', handleDeleteMovies);





app.get('/params/:name',handleParams);

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


function  Pagehandle(req,res){
    res.send("Welcome to Favorite Page ");
} 


function  Homehandle(req,res){
    
    
   let newData= new JsonData(
    Data_file.title,
    Data_file.poster_path,
    Data_file.overview
 
        ) 
     
     res.json(newData);
     

} 


function JsonData(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview

}



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



function  searchMovieshandler(req,res){
    let movieName=req.query.name;
    let url=`https://api.themoviedb.org/3/search/movie?api_key=2f8a538a539278f73d836e14ebd285a5&name=${movieName}`;
    axios.get(url)
    .then((result) => {
        console.log(result.data.results);

    })
    .catch((error => {
        console.log(error);
        res.send("error in data")
    }));
}

function handleParams(req,res){
    console.log(req.params.name);
    res.send("ok")
}

function handleUpdateMovies(req,res){
    let id=req.params.MovieId;
    let title=req.body.title;
    let sql=`  UPDATE movies SET title=$1 WHERE id=${id} RETURNING *;`;
    let values =[title];
    client.query(sql,values).then((result)=>{
        console.log(result.rows[0]); 
    res.send("record updated");   }
    ).catch()



}

function handleDeleteMovies(req,res){
    let id=req.params.MovieId;
    let sql=`  DELETE FROM movies WHERE id=${id} RETURNING *;`;
    client.query(sql).then((result)=>{
        console.log(result.rows[0]); 
    res.send("record deleted");   }
    ).catch()  
}

client.connect().then(() =>{
    app.listen(port, ()=> {
        console.log("Server is running on port ${port}");
    });
}
)















