'use strict';

const express =require("express");
const cors=require("cors");
const { required } = require("nodemon/lib/config");
const axios=require("axios").default;
require("dotenv").config();
const app=express();
app.use(cors());
const port=3000;


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





app.listen(port, ()=> {
    console.log("Server is running on port ${port}");
});





/* const Data_file =require("./movie_data/data.json");

app.get("/favorite", Pagehandle);
function  Pagehandle(req,res){
    res.send("Welcome to Favorite Page ");
} 

app.get("/", Homehandle);
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

} */



