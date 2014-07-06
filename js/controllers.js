/******************
Controllers
******************/

var projectManagement = angular.module('projectManagement',['ng-breadcrumbs']);
projectManagement.factory('globalvar', function () {

	var sprintProjectName = {};
	sprintProjectName.ProjName='globalvar';
	sprintProjectName.SprintName='globalvar';
	return sprintProjectName;

});
/************Project Management Controller*************/
projectManagement.controller('loginpageController', ['$scope', '$http','$location','breadcrumbs',
  function ($scope, $http,$location,breadcrumbs) {	
	$scope.logout=false;
	$scope.login=true;
	$scope.menu=false;
	$scope.welcome_message=false;
	$scope.addProject_Alert=false;
	$scope.breadcrumbs = breadcrumbs;
	//$('#mobile_menu_symbol').attr('disabled','disabled');
	$('#clear').click(function(e){
		$('#Email').val("");
		$('#password').val("");
	});
	
	
	
	
	$('.menu_option').click(function(){
		$('.menu_option').removeClass('active1');
		$('#admin').removeClass('active1');
		$(this).addClass('active1');
		console.log($(this).parent())
	});
	$('.menu_sub_option').click(function(){
		$('.menu_option').removeClass('active1');
		$('#admin').removeClass('active1');
		$('#admin').addClass('active1');
	});
	$("#logo").click(function(){
		$('.menu_option').removeClass('active1');
		$('#admin').removeClass('active1');
	});
	$scope.signin_disable=function(){
		$('#signIn').attr('disabled','disabled');
		$('#login_alerts').html('<div class="alert alert-info" >Please enter your login details</div>');
	}
	
	$scope.check_empty_fields=function(){
		input1=$('#Email').val();
		input2=$('#password').val();
		if(input1 && input2){
		$('#signIn').removeAttr('disabled');
		}
	}
	$('#signIn').click(function(e){	
		input1=$('#Email').val();
		input2=$('#password').val();
		if(input1 && input2){
			obj={email:input1,
			password:input2	};
			e.preventDefault();
			
			$http({method: 'POST',data:obj, url: 'http://192.168.10.100:8080/check', cache: false}).
				success(function(data, status) {
					console.log("Succesful");
					data1=data;
					console.log(data1);
					if(data1.length){
						$('#myModal').modal('hide');
						$scope.welcome_message=true;
						$scope.logout=true;
						$scope.login=false;
						$scope.loggedUser=data1[0].FirstName;
						$scope.welcome_message=true;				
						$scope.menu=true;
						console.log('inside if loop of ajax call.'+ data1[0].username);
						$('#mobile_welcome_msg').removeClass('hide');
						$('#mobile_welcome_msg').addClass('visible-xs');
						//$('#mobile_menu_symbol').removeAttr('disabled');
					}else{
						$('#login_alerts').html("<div class='alert alert-danger' >Email or Password doesn't match.</div>");
					}
				}).error(function(data, status) {
					console.log("Error");
					console.log(data);
				});	
		}	
	});
	
	$scope.modify_logout=function(){
		$scope.logout=false;
		$scope.login=true;
		$scope.menu=false;
		$scope.welcome_message=false;
		$('#Email').val('');
		$('#password').val('');
		$('#password').val('');
		 $('#mobile_welcome_msg').addClass('hide');
		 $('#mobile_welcome_msg').removeClass('visible-xs');
		//$('#mobile_menu_symbol').attr('disabled','disabled');
	
	}
}]);
  /*********************controller for "manage projects" page*************************/
projectManagement.controller('manageProjectsController', ['$scope', '$http','$compile',
	function ($scope, $http, $compile) {
	
	
		$scope.addProject_Alert=false;
		resp='';
		$http({method: 'GET', url: 'http://192.168.10.100:8080/data', cache: false}).
			success(function(data, status) {
				console.log(data);
				$scope.projects_list=data;
				$("#project_add__alert").html(resp1);
				
			}).error(function(data, status) {
				console.log("error occured."+err);
			});
		
		
		$http({method: 'GET', url: 'http://192.168.10.100:8080/userData', cache: false}).
			success(function(data, status) {
				console.log(data);
				$scope.devDataSet=data;
				
			}).error(function(data, status) {
				console.log("error occured."+err);
			});
		/*****/
		$scope.userSets = {
			developers: [{
						developer:''
					}]
				};
				
		$scope.addItem = function() {
			$scope.userSets.developers.push({
				developer:''
			});
		};
		
		$scope.removeItem = function(index) {
			$scope.userSets.developers.splice(index, 1);
		}
		
		/*****/
		
		$scope.save_project=function(newproject,userSets){
			console.log("user set is   ::  "+JSON.stringify(userSets.developers));
			new_entry={ProjectName:newproject.name,Description:newproject.description,ProjectOwner:newproject.projectowner,User:userSets.developers};
			if((newproject.name) && (newproject.description) && (newproject.projectowner)){
				$scope.addProject_Alert=false;

				$http({method: 'POST',data:new_entry, url: 'http://192.168.10.100:8080/addNewProject', cache: false}).
					success(function(data, status) {
						if(data){
						console.log("Succesful "+data);
						resp1="<div class='alert alert-warning'><h5> A Project with id"+data+"was succesfully added.</h5></div>";
						$("#project_add__alert").html(resp1);
						
						window.location.href="#/home/manage_projects";
						
						}else{
						//duplicate record entry alert.
						resp="<div class='alert alert-danger'><h5>Record already exists.</h5></div>";
							if(!($("#duplicate_alert").html())){
								$("#duplicate_alert").append(resp);
							}
						$scope.duplicate_project=true;
						$scope.addProject_Alert=false;
						}
					}).error(function(data, status) {
						console.log("Error");
						
					});	
			}else{
				$scope.addProject_Alert=true;
				$scope.duplicate_project=false;
				console.log("please enter all values");
			}
		}
	}
]);

  /*********************controller for "manage users" page*************************/
projectManagement.controller('manageUsersController', ['$scope', '$http',
	function ($scope, $http) {
			$scope.new_user_alert=false;
	
		function populate_users(){
			$http({method: 'GET',url: 'http://192.168.10.100:8080/userData', cache: false}).
					success(function(userData, status) {
						console.log(userData);
						$scope.all_users_data=userData;					
					}).error(function(data, status) {
					
						console.log("error occured."+err);
					});	
			
			}
		populate_users();
		/********************/
		$scope.removeUser=function(index){
			var userName=$('.userRow').eq(index).find("#userEmail").text();
			console.log("this value is ...."+$('.userRow').eq(index).find("#userEmail").text());
			new_entry={Email:userName};
			var r = confirm("Do you Really want to remove : "+userName);
			if(r == true){
				$http({method: 'POST',data:new_entry, url: 'http://192.168.10.100:8080/removeUser', cache: false}).
						success(function(data, status) {
							console.log("Success");
							populate_users();
							window.location.href='#/home/manage_users';
						}).error(function(data, status) {
							console.log("Error");
						});
			}else{
			window.location.href='#/home/manage_users';}
		};
		/*********************/
		$scope.save_user=function(newuser){
			if($('#admin').attr('checked')) {
				var adminStatus=true;
			}
			else{
				adminStatus=false;
			}
		if(newuser.email && newuser.lastname && newuser.firstname && newuser.password && newuser.passwordRepeat){
					if((newuser.email).length>=8){
						if(newuser.password == newuser.passwordRepeat){
						console.log(newuser);
						
							new_entry={Image:"",Email:newuser.email,FirstName:newuser.firstname,LastName:newuser.lastname,Password:newuser.password ,Status:adminStatus};
			
							$http({method: 'POST',data:new_entry, url: 'http://192.168.10.100:8080/addNewUser', cache: false}).
							success(function(data, status) {
								
								if(data!='Error'){
									console.log('data is   '+data);
									$scope.new_user_alert=false;
									window.location.href='#/home/manage_users';
								}
								else{
								console.log((newuser.email).length);
									$("#new_user_alert").html("<div class='alert alert-danger'><h5>Details already exists.</h5></div>");
									$scope.new_user_alert=true;
								}
							console.log(data);
							}).error(function(data, status) {
								console.log("Error");
							});	
						}
						else{
								$("#new_user_alert").html("<div class='alert alert-danger'><h5>passwords does not match</h5></div>");
								$scope.new_user_alert=true;
						}
					}else{
						$("#new_user_alert").html("<div class='alert alert-danger'><h5>E-Mail length should be greater than EIGHT characters</h5></div>");
						$scope.new_user_alert=true;
					}
				}	
			else{
			
				$("#new_user_alert").html("<div class='alert alert-danger'><h5>Please enter all the fields.</h5></div>");
				$scope.new_user_alert=true;
			}
		}	
	}
]);

 /*********************controller for "my projects" page*************************/
projectManagement.controller('myProjectsController', ['$scope', '$rootScope','$http','globalvar',
	function ($scope, $rootScope,$http,globalvar) {
	console.log(globalvar.ProjName);
	globalvar.ProjName="";
		$http({method: 'GET',url: 'http://192.168.10.100:8080/projectsData', cache: false}).
			success(function(data, status) {
				console.log(data);
				$scope.projectDetails=data;
			}).error(function(data, status) {
							console.log("error occured."+err);
						});	
						
		$scope.show_sprints=function(index){
			console.log($('.projectRow').eq(index).find('#proj').text());
			globalvar.ProjName=$('.projectRow').eq(index).find('#proj').text();
			window.location.href='#/home/projects/manage_sprints';	
		};				
		
		$scope.show_backlog=function(index){
			globalvar.ProjName=$('.projectRow').eq(index).find('#proj').text();
			console.log(globalvar.ProjName);
			// sprint_prj1="{Sprint_ProjectName:{$regex:'"+sprintProjectName+"$'}}"; 
			//console.log("before ::"+sprint_prj1);
			window.location.href='#/home/projects/manage_backlogs';		
		};

						
						
	}
]);

// For date Picker
projectManagement.controller('mySprintController', ['$scope','$rootScope', '$http','globalvar',
	function ($scope,$rootScope, $http,globalvar) {
	console.log(globalvar.ProjName);
	globalvar.SprintName='';
	
	/****************date picker for sprint form********************/
		$('#startDate').datepicker({
			format: "dd/mm/yyyy"
		});  
		$('#endDate').datepicker({
			format: "dd/mm/yyyy"
		}); 
		
		/*************for populating sprint table*************/
		var populate_sprint=function (){
			$http({method: 'POST',data:{projName:globalvar.ProjName}, url: 'http://192.168.10.100:8080/newSprint', cache: false}).
						success(function(data, status) {
							console.log("Success");
							console.log(data);
							$scope.sprintDataset=data;
						}).error(function(data, status) {
							console.log("Error");
				});			
			}
		if(globalvar.ProjName){	
		console.log(globalvar.ProjName);
		populate_sprint();
		}else{
		console.log('rootscope variable not defined.');
		}
		
		
	
		/***************adding new sprint***************/
		$scope.saveSprint=function(newSprint){
		console.log("new sprint name is::"+globalvar.ProjName);
			
			if((newSprint.name) && (newSprint.startDate) && (newSprint.endDate)&&(newSprint.capacity)){
				newSprint.name1=newSprint.name+"_"+globalvar.ProjName;
				sprint_entry={Sprint_ProjectName:newSprint.name1,StartDate:newSprint.startDate,EndDate:newSprint.endDate,Status:"ACTIVE",Capacity:newSprint.capacity};
				$http({method: 'POST',data:sprint_entry, url: 'http://192.168.10.100:8080/addSprint', cache: false}).
					success(function(data, status) {
						if(data!='Error'){	
							$scope.new_sprint_alert=false;						
							populate_sprint();						
							window.location.href="#/home/projects/manage_sprints";
						}else{
								$("#new_sprint_alert").html("<div class='alert alert-danger'><h5>Record already exists.</h5></div>");
								$scope.new_sprint_alert=true;
						}
					}).error(function(data, status) {
						console.log("Error");
						
					});	
			}else{
					$("#new_sprint_alert").html("<div class='alert alert-danger'><h5>Please enter all the fields.</h5></div>");
					$scope.new_sprint_alert=true;
			}
		}
		
		$scope.show_tasks= function(index){
				console.log($('.sprintRow').eq(index).find("#sprintproj").text());
				globalvar.SprintName=$('.sprintRow').eq(index).find("#sprintproj").text(); 
				console.log("name is::: "+globalvar.SprintName);
				window.location.href='#/home/projects/manage_sprints/manage_tasks';	
			};
	}	
	
	
	
]);
/**********populating tasks table ***********/
projectManagement.controller('myTaskController', ['$scope','$rootScope', '$http','globalvar',
	function ($scope,$rootScope, $http,globalvar) {
	
	var populate_task=function (){
			console.log("taskkkk::::::");
				$http({method: 'POST',data:{two:globalvar.SprintName}, url: 'http://192.168.10.100:8080/getTasks', cache: false}).
							success(function(data, status) {
								console.log("Success");
								console.log(data);
								$scope.taskDataset=data;
							}).error(function(data, status) {
								console.log("Error");
					});			
				}
				if(globalvar.SprintName){	
					console.log(globalvar.SprintName);
					populate_task();
				}else{
					console.log('rootscope variable not defined.');
				}
	
	
	
		/***************adding new Tasks***************/
		$scope.saveTask=function(newTask){
		console.log(globalvar.SprintName+":dfgdi:::::");
		console.log("new sprint name is::"+globalvar.SprintName);
			newTask.TaskName_SprintProjectName1=newTask.TaskName_SprintProjectName+"_"+globalvar.SprintName;
			console.log(newTask.TaskName_SprintProjectName+"INSERTED RECORD :::::::::");
			task_entry={TaskName_SprintProjectName:newTask.TaskName_SprintProjectName1,Estimation:newTask.Estimation,Remaining:newTask.Remaining,Description:newTask.Description,State:newTask.State,AssignedTo:newTask.AssignedTo};
			if((newTask.TaskName_SprintProjectName) && (newTask.Estimation) && (newTask.Remaining)&&(newTask.Description)&& (newTask.State)&&(newTask.AssignedTo)){
				$http({method: 'POST',data:task_entry, url: 'http://192.168.10.100:8080/addTask', cache: false}).
					success(function(data, status) {
						if(data){
							$scope.new_task_alert=false;
							populate_task();						
							window.location.href="#/home/projects/manage_sprints/manage_tasks";
						}else{
								console.log('unable to insert...details already exists');
						}
					}).error(function(data, status) {
						console.log("Error");
						
					});	
			}else{
				$("#new_task_alert").html("<div class='alert alert-danger'><h5>Please enter all the fields.</h5></div>");
				$scope.new_task_alert=true;
			}
		}
		
		// $(document).delegate('#add_task', 'click', function(){
				
				// $rootScope.taskSprintProjectName=$(this).parent().parent().parent().find(".sprintproj").text(); 
				// console.log("name is::: "+$rootScope.taskSprintProjectName);		
			// });
	}
		
	
	
]);


/************for populating Project Backlog****************/
projectManagement.controller('myProjectBackLogController', ['$scope','$rootScope', '$http','globalvar',
	function ($scope,$rootScope, $http,globalvar) {

		var populate_backlog=function (){
			$http({method: 'POST',data:{projName:globalvar.ProjName}, url: 'http://192.168.10.100:8080/getBacklog', cache: false}).
						success(function(data, status) {
							console.log("Success");
							console.log(data);
							$scope.BacklogDataSet=data;
							 // var Backlogtbl="<table class='table table-hover'><tr><th>ProjectName_ProjectBacklog</th><th>Description</th><th>Priority</th><th>Estimation</th></tr>";
							// for(var i=0;i<data.length;i++){
								// Backlogtbl+="<tr><td class='backlogproj'>"+data[i].ProjectName_ProjectBacklog+"</td><td>"+data[i].Description+"</td>"+
								// "<td>"+data[i].Priority+"</td><td>"+data[i].Estimation+"</td></tr>";
							// }
							// Backlogtbl+="</table>"
							// $('#backlogTable').html(Backlogtbl); 

							// populate_users();
							// window.location.href='#/manage_users';
						}).error(function(data, status) {
							console.log("Errordfhgm");
				});			
			}
		if(globalvar.ProjName){	
		populate_backlog();
		}
		// $scope.show_backlog=function(index){
			// globalvar.ProjName=$(this).parent().parent().find("#proj").text(); 
			// console.log($rootScope.sprintProjectName);
			// // sprint_prj1="{Sprint_ProjectName:{$regex:'"+sprintProjectName+"$'}}"; 
			// console.log("before ::"+sprint_prj1);
			// populate_backlog();			
		// };
		
	
		/***************adding new backlog***************/
		$scope.saveBacklog=function(newBacklog){
		console.log("new sprint name is::"+globalvar.ProjName);
			console.log(newBacklog.name+" before backlogname");
			
			if((newBacklog.name) && (newBacklog.description) && (newBacklog.priority)&&(newBacklog.estimation)){
				newBacklog.name1=globalvar.ProjName+"_"+newBacklog.name;
				console.log(newBacklog.name+" after backlogname");
				backlog_entry={ProjectName_ProjectBacklog:newBacklog.name1,Description:newBacklog.description,Priority:newBacklog.priority,Estimation:newBacklog.estimation};
				$http({method: 'POST',data:backlog_entry, url: 'http://192.168.10.100:8080/addBacklog', cache: false}).
					success(function(data, status) {
						if(data!='Error'){	
							$scope.new_backlog_alert=false;						
							populate_backlog();						
							window.location.href="#/home/projects/manage_backlogs";
						}else{
								console.log('unable to insert...details already exists');
								$("#new_backlog_alert").html("<div class='alert alert-danger'><h5>Record Already exists.</h5></div>");
								$scope.new_backlog_alert=true;
						}
					}).error(function(data, status) {
						console.log("Error");
						
					});	
			}else{
					$("#new_backlog_alert").html("<div class='alert alert-danger'><h5>Please enter all the fields.</h5></div>");
					$scope.new_backlog_alert=true;
			}
		}
		
		
	}	
	
	
	
]);