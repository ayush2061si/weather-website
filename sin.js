const http = require("http");
const fs = require("fs");
var requests = require('requests');

const homefi = fs.readFileSync("ayu.html", "utf-8");
function ayush(poleo){
return parseFloat(poleo-273).toFixed(2);
}
const replaceval = (tempval, orgval) => {
   let tempe = tempval.replace("{%temp%}", ayush(orgval.main.temp));
   tempe = tempe.replace("{%mintemp%}", ayush(orgval.main.temp_min));
   tempe = tempe.replace("{%maxtemp%}", ayush(orgval.main.temp_max));
   tempe = tempe.replace("{%location%}", orgval.name);
   tempe = tempe.replace("{%country%}", orgval.sys.country);
   tempe = tempe.replace("{%tempst%}", orgval.weather[0].main);

   return tempe;
};
const server = http.createServer((req, res) => {
   if (req.url == "/") {
      requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=b202b441d607bc1889380c4270798578')
         .on('data', function (chunk) {
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata];
            const realtimedata = arrdata.map((val) => replaceval(homefi, val)).join("");
            res.write(realtimedata);
         })
         .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
         });
   }
});

server.listen(8000, "127.0.0.1");