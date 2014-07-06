var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;
var express = require('express');
var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,      Accept");
    next();
};
app.listen(8080);
app.use(allowCrossDomain);

var server = new Server('ds030827.mongolab.com', 30827, { auto_reconnect: true });
var db = new Db('galidb', server);

var responseText = "Null";

db.open(function(err, client) {
    client.authenticate('galipnapps', 'Gali@2411', function(err, success) {
        if (!err) {
            console.log("Done");
            var collection = db.collection('ManageUsers');
            collection.find().each(function(err, doc) {
                if (doc != null) console.log("Doc from Each ");
                console.log(typeof doc);
                // var details = doc["Employees"];
                console.log(doc);
                responseText = "Got It";
            });


        }
        else {
            console.log("Error");
            console.log(err);
        }
    });
});

app.get('/', function(req, res) {
        res.write(responseText);
        res.end();
});