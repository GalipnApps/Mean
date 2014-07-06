var MongoClient = require('mongodb').MongoClient; 
var express=require('express');
var bodyParser = require("body-parser");
var app=express();
var visitorCount=0;
app.use(bodyParser());
app.listen(8080);
db=null;
// For cross Origin Issues

var allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,      Accept");
	next();
};
app.use(allowCrossDomain);
connect();

function connect(){
	MongoClient.connect("mongodb://localhost:27017/ProjectManagement", function(err, db1) { 
		if (err) return false;
		else {
			console.log("Connected to database");
			db = db1;
		}
	});	
}

// For Validating Login Credentials

app.post('/check',function(req,res){
	obj=req.body;
	console.log('inside app.post method, u value is: '+obj);
	input1=obj.email;
	input2=obj.password;
	console.log(input1);
	console.log(input2);	
	console.log('inside compare function.Now we need to compare these values, with values in database.');

	db.collection("ManageUsers").find({Email:input1,Password:input2}).toArray(function(err,data){
		console.log(data);//console.log(data.length  +'      '+err);	
		 visitorCount++;
		 console.log(visitorCount+"  is the visitor count");
		res.write(JSON.stringify(data));
		res.end();
	});
});

/*******for populating data in project manage page*******/

app.get('/data',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	db.collection("ManageProjects").find().toArray(function(err,data){
		full=data;
		res.write(JSON.stringify(full));
		res.end();
   });
});



/*************adding new project into manage projects page****************/
app.post('/addNewProject',function(req,res){
 new_entry=req.body;
 res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
 	db.collection("ManageProjects").insert(new_entry, function (err, result) {
		if(!err){
			recrd_id=(result[result.length-1]._id);
			console.log('insertion completed.');
			res.write(JSON.stringify(recrd_id));
			res.end();

		}else{
			console.log('couldnt insert');
			res.write('');
			res.end();
		}
	});
});

/*******for populating data in user manage page*******/

app.get('/userData',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	db.collection("ManageUsers").find().toArray(function(err,data){
		user=data;
		res.write(JSON.stringify(user));
		res.end();
   });
});



/******************for adding new user**************************/

app.post('/addNewUser',function(req,res){
 newUser_entry=req.body;
 res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
 db.collection("ManageUsers").insert( newUser_entry, function (err, result) {
			if(!err){
				console.log('insertion completed.');
				res.write(JSON.stringify(result));
 				res.end();
			}else{
				res.write('Error');
 				res.end();
			}
	});

});




/*******for removing user from manage users page*******/

app.post('/removeUser',function(req,res){
	console.log('in server app.post');
	// res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.header('Access-Control-Allow-Headers', 'Content-Type');
	new_entry=req.body;
	console.log(new_entry.Email);
	db.collection("ManageUsers").remove({"Email":new_entry.Email},function(err,data){if(data){console.log(data);}else{console.log(err);}});
	res.write('Done!!');
	res.end();
});
 
 
  /*********************for displaying data in "my projects" page*************************/

app.get('/projectsData',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	db.collection("ManageProjects").find().toArray(function(err,data){
		project=data;
		res.write(JSON.stringify(project));
		res.end();
   });
});




app.post('/newSprint',function(req,res){
filter1=req.body;
 res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	reqProj=filter1.projName+'$';
	form_regex={ Sprint_ProjectName: {$regex:reqProj}};
	//aa=filter1.one;
	console.log(form_regex);
	if(db){
	 	db.collection("Sprints").find(form_regex).toArray(function(err,data){
		project=data;
		res.write(JSON.stringify(project));
		res.end();
			});
		}
	});
	

/******************for adding new sprint**************************/

app.post('/addSprint',function(req,res){
 newUser_entry=req.body;
 res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
 db.collection("Sprints").insert( newUser_entry, function (err, result) {
			if(!err){
				console.log('insertion completed.');
				res.write(JSON.stringify(result));
 				res.end();
			}else{
				res.write('Error');
 				res.end();
			}
	});

});

/*****************tasks *************************/


app.post('/getTasks',function(req,res){
filter2=req.body;
 res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	console.log("after ::"+ filter2.two);
	requested=filter2.two+'$';
	got={ TaskName_SprintProjectName: {$regex:requested}};
	//aa=filter1.one;
	console.log(got);
	if(db){
	 	db.collection("TasksSprint").find(got).toArray(function(err,data){
		taskData=data;
		res.write(JSON.stringify(taskData));
		res.end();
			});
		}
	});
	
app.post('/addTask',function(req,res){
 newTask_entry=req.body;
console.log( newTask_entry.TaskName_SprintProjectName);
 res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
 db.collection("TasksSprint").insert(newTask_entry, function (err, result) {
			if(!err){
				console.log('insertion completed.');
				res.write(JSON.stringify(result));
 				res.end();
			}else{
				res.write('Error');
 				res.end();
			}
	});

});

/*********for Backlog****************/


app.post('/getBacklog',function(req,res){
console.log('in server');
filterBacklog=req.body;
 res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	reqProj='^'+filterBacklog.projName;
	
	backlog_regex={ ProjectName_ProjectBacklog: {$regex:reqProj}};
	//aa=filterBacklog.one;
	console.log(backlog_regex);
	if(db){
	 	db.collection("ProjectBackLog").find(backlog_regex).toArray(function(err,data){
		backlog=data;
		res.write(JSON.stringify(backlog));
		res.end();
			});
		}
	});
	

/******************for adding new Backlog item**************************/

app.post('/addBacklog',function(req,res){
 backlog_entry=req.body;
console.log(" :::::::ABCD" + backlog_entry );
 res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
 db.collection("ProjectBackLog").insert( backlog_entry, function (err, result) {
			if(!err){
			console.log("backlog");
				console.log('insertion completed.');
				res.write(JSON.stringify(result));
 				res.end();
			}else{
				res.write('Error');
 				res.end();
			}
	});

});
