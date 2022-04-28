'use strict';

const express =require("express");
const app=express();
const port=3000;
const Data_file =require("./movie_data/data.json");

app.get("/favorite", Pagehandle);
function  Pagehandle(req,res){
    res.send("Welcome to Favorite Page ");
} 

app.get("/", Homehandle);
function  Homehandle(req,res){
    let result=[];

    Data_file.data.forEach(element => {
        let newData= new JsonData(
            element.title,
            element.poster_path,
            element.overview
 
        ) 
        result.push(newData);
     })
     res.json(result);
     

} 


function JsonData(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview

}



app.listen(port, ()=> {
    console.log("Hello");
});