/**
 * Created by ozknemoy on 20.05.2017.
 */
var http = require("http");
var unit = require("./unit.js");
var message = "Hello World";



http.createServer(function(request,response){
    //console.log(message);
    response.end(message);



}).listen(3000, "127.0.0.1",()=>console.log("localhost:3000"));