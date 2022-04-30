'use strict';

const express =require("express");
const app=express();
const port=3001;
const Data_file =require("./movie_data/data.json");

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

}



app.listen(port, ()=> {
    console.log("Hello");
});