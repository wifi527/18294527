var request = require('request');
var csv = require('csv');
var parser = csv.parse();

request.get('https://data.wien.gv.at/csv/wienerlinien-ogd-linien.csv', function (error, response, body) {
    if (!error && response.statusCode == 200) {
       csv.parse(body, {delimiter:';'}, function(err, data){
        // Continue with your processing here.
        console.log( data );
      });
    }
});
