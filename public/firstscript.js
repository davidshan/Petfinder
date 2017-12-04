
var src="https://code.jquery.com/jquery-3.2.1.min.js";
var integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=";
var crossorigin="anonymous";
var newpet_list;
var current_view=1;


//Favorite a pet
function Favorite(ID) {
    var user = sessionStorage.getItem('user_email');
        if(user){ //logged in      
            addPet(user, ID)
            .then(
            (item) => {
                var database_item = item;
                console.log("added a pet!")
                console.log(JSON.stringify(database_item));

                //setting session storage
                // sessionStorage.setItem('user', database_item);
                // sessionStorage.setItem('user_email', user_email);
                // console.log("user set in session storage: ");
                // console.log( sessionStorage.getItem('user'));
                // document.getElementById("welcome_greeting").innerHTML = "welcome " + user_email;        
            })
            .catch(string => {
                console.log("Error!", string);
                console.log("Did not add pet :(")
            });
        }
        else{
            window.alert("please login first to favourite!")
    }
}

//Delete a pet
function Delete(ID) {
    var user = sessionStorage.getItem('user_email');
        if(user){ //logged in      
            deletePet(user, ID)
            .then(
            (item) => {
                var database_item = item;
                console.log("Deleted a pet!")
                console.log(JSON.stringify(database_item));

                //setting session storage
                // sessionStorage.setItem('user', database_item);
                // sessionStorage.setItem('user_email', user_email);
                // console.log("user set in session storage: ");
                // console.log( sessionStorage.getItem('user'));
                // document.getElementById("welcome_greeting").innerHTML = "welcome " + user_email;        
            })
            .catch(string => {
                console.log("Error!", string);
                console.log("Did not delete pet :(")
            });
        }
        else{
            //shouldn't be here lol
        }
    
}


function getPetInfo(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type:'GET',
            data : {},
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            },
            url: "https://api.petfinder.com/pet.get?format=json&key=b31df3dfa380bae9b0039e3a91d9126f&id=".concat(id).concat('&callback=?'),
            dataType: 'json',
            success:function(data) {

                new_pet_obj = {
                    name : data["petfinder"]["pet"]["name"]["$t"],
                    id : data["petfinder"]["pet"]["id"]["$t"],
                    age : data["petfinder"]["pet"]["age"]["$t"],
                    size : data["petfinder"]["pet"]["size"]["$t"],
                    description : data["petfinder"]["pet"]["description"]["$t"],
                    breed : data["petfinder"]["pet"]["breeds"]["breed"]["$t"],
                    sex_code : data["petfinder"]["pet"]["sex"]["$t"],
                    photo : data["petfinder"]["pet"]["media"]["photos"]["photo"][0]["$t"],
                    
                    phone : data["petfinder"]["pet"]["contact"]["phone"]["$t"],
                    city : data["petfinder"]["pet"]["contact"]["city"]["$t"],
                    state : data["petfinder"]["pet"]["contact"]["state"]["$t"],
                    email : data["petfinder"]["pet"]["contact"]["email"]["$t"],
                    address : data["petfinder"]["pet"]["contact"]["address1"]["$t"],
                    zip : data["petfinder"]["pet"]["contact"]["zip"]["$t"],
                }
                
                        if (new_pet_obj["name"] == null) {
                            new_pet_obj["name"] = "No Name!";
                        }
                        if (new_pet_obj["age"] == null) {
                            new_pet_obj["age"] = "Unknown";
                        }
                        if (new_pet_obj["size"] == null) {
                            new_pet_obj["size"] = "Unknown";
                        }
                        if (new_pet_obj["sex_code"] == null) {
                            new_pet_obj["sex_code"] = "Unknown";
                        }
                        if (new_pet_obj["phone"] == null) {
                            new_pet_obj["phone"] = "Unknown";
                        }
                        if (new_pet_obj["email"] == null) {
                            new_pet_obj["email"] = "Unknown";
                        }
                        if (new_pet_obj["description"] == null) {
                            new_pet_obj["description"] = "No description";
                        }

                resolve(new_pet_obj);
             },
             fail:function() {
                reject("FAILED AJAX");
            }
        });
    });                 
}

/*
function infoAggregator(url, n) {
    var promises = [];
    var numbers = [];
    for (var i = 0; i < n; i++) {
        numbers[i] = i;
    }
    
    numbers.forEach((j) => {
            promises[j] = getPetInfo(url, j).then(new_pet => {
                console.log(new_pet);
                console.log(j);
                return new_pet;
            }).catch(string => {
                console.log("Error!", string);
            });
        });
    return Promise.all(promises);
}
*/
function getPetList(new_get_url, offset) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type:'GET',
            data : {},
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            },
            url: new_get_url.concat('&count=8&offset=').concat(offset).concat('&callback=?'),
            dataType: 'json',
            success:function(data) {
                petlist = [];
				// If we get no pets
				if (data["petfinder"]["pets"] == null){
					console.log("no pet")
				}
				else{
				
					for (var i = 0; i < 8; i++) {
						petlist[i] = {
							name : data["petfinder"]["pets"]["pet"][i]["name"]["$t"],
							id : data["petfinder"]["pets"]["pet"][i]["id"]["$t"],
							age : data["petfinder"]["pets"]["pet"][i]["age"]["$t"],
							size : data["petfinder"]["pets"]["pet"][i]["size"]["$t"],
							description : data["petfinder"]["pets"]["pet"][i]["description"]["$t"],
							breed : data["petfinder"]["pets"]["pet"][i]["breeds"]["breed"]["$t"],
							sex_code : data["petfinder"]["pets"]["pet"][i]["sex"]["$t"],
							photo : data["petfinder"]["pets"]["pet"][i]["media"]["photos"]["photo"][0]["$t"],
                            phone : data["petfinder"]["pets"]["pet"][i]["contact"]["phone"]["$t"],
                            city : data["petfinder"]["pets"]["pet"][i]["contact"]["city"]["$t"],
                            state : data["petfinder"]["pets"]["pet"][i]["contact"]["state"]["$t"],
                            email : data["petfinder"]["pets"]["pet"][i]["contact"]["email"]["$t"],
                            address : data["petfinder"]["pets"]["pet"][i]["contact"]["address1"]["$t"],
                            zip : data["petfinder"]["pets"]["pet"][i]["contact"]["zip"]["$t"],
						};
                        
                        if (petlist[i]["name"] == null) {
                            petlist[i]["name"] = "an unnamed pet";
                        }
                        if (petlist[i]["age"] == null) {
                            petlist[i]["age"] = "Unknown";
                        }
                        if (petlist[i]["size"] == null) {
                            petlist[i]["size"] = "Unknown";
                        }
                        if (petlist[i]["sex_code"] == null) {
                            petlist[i]["sex_code"] = "Unknown";
                        }
                        if (petlist[i]["phone"] == null) {
                            petlist[i]["phone"] = "Unknown";
                        }
                        if (petlist[i]["email"] == null) {
                            petlist[i]["email"] = "Unknown";
                        }
                        if (petlist[i]["description"] == null) {
                            petlist[i]["description"] = "No description.";
                        }
						
					}
					console.log(offset + " " + petlist)
				}
                resolve(petlist);
             },
             fail:function() {
                reject("FAILED AJAX");
            }
        });
    });                 
}

function returnPetObj(new_pet_obj){
    return new_pet_obj;
}

function resolve(){
    console.log("resolved");
}

function reject(){
    console.log("rejected");
}

// this is just a helper function to get rid of the duplicate code
// for adding in 8 entries everytime we scroll / transition from view1 -> view2
function append_new_entries(list_of_stuff, add_to) {
    for(var i = 0; i < 8; i++){
        $(add_to).append("<div class=\"row\">\
                                <div class=\"search-result-frame\">\
                                    <div class=\"search-result-content-frame hidden-xs\">\
                                          <div class= \"pet-pic-frame\">\
                                                <img class=\"pet-thumbnail\" src = \" "+list_of_stuff[i].photo.split('?')[0]+"\" width=\"600\" >\
                                            </div>\
                                        <div class=\"search-result-pet-info hidden-xs\">\
                                            <br />\
                                            <a class='title' id="+ list_of_stuff[i].id +">Hi I'm "+ list_of_stuff[i].name +"!</a>\
											<button onclick=\"Favorite("+list_of_stuff[i].id+")\" class=\"btn btn-info\">Favorite This Pet</button>\
                                            <h4><b>Size:</b> "+ list_of_stuff[i].size +"</h4>\
                                            <h4><b>Sex:</b> "+ list_of_stuff[i].sex_code +"</h4>\
                                            <h4><b>Age:</b> "+ list_of_stuff[i].age +"</h4>\
                                            <div class=\"search-pet-description\">\
                                                <h5><b>Description:</b> "+ list_of_stuff[i].description +"</h5>\
                                            </div>\
                                               <a class='title small-font' id="+ list_of_stuff[i].id +">...Click here for more info!</a>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class=\"search-result-frame-small\">\
                                    <div class=\"search-result-content-frame-small hidden-sm hidden-md hidden-lg\">\
                                          <div class= \"pet-pic-frame-small\">\
                                                <img class=\"pet-thumbnail-small\" src = \" "+list_of_stuff[i].photo.split('?')[0]+"\" width=\"600\" >\
                                            </div>\
                                        <div class=\"search-result-pet-info-small\">\
                                            <h3 class='title' id="+ list_of_stuff[i].id +">Hi I'm "+ list_of_stuff[i].name +"!</h3>\
                                            <h4><b>Size:</b> "+ list_of_stuff[i].size +"</h4>\
                                            <h4><b>Sex:</b> "+ list_of_stuff[i].sex_code +"</h4>\
                                            <h4><b>Age:</b> "+ list_of_stuff[i].age +"</h4>\
                                            <div class=\"search-pet-description\">\
                                                <h5><b>Description:</b> "+ list_of_stuff[i].description +"</h5>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>")
    }
}

function append_new_fav_entries(list_of_stuff, add_to) {
    for(var i = 0; i < 8; i++){
        $(add_to).append("<div class=\"row\">\
                                <div class=\"search-result-frame\">\
                                    <div class=\"search-result-content-frame hidden-xs\">\
                                          <div class= \"pet-pic-frame\">\
                                                <img class=\"pet-thumbnail\" src = \" "+list_of_stuff[i].photo.split('?')[0]+"\" width=\"600\" >\
                                            </div>\
                                        <div class=\"search-result-pet-info hidden-xs\">\
                                            <br />\
                                            <a class='title' id="+ list_of_stuff[i].id +">Hi I'm "+ list_of_stuff[i].name +"!</a>\
                                            <button onclick=\"Favorite("+list_of_stuff[i].id+")\" class=\"btn btn-info\">Favorite This Pet</button>\
                                            <h4><b>Size:</b> "+ list_of_stuff[i].size +"</h4>\
                                            <h4><b>Sex:</b> "+ list_of_stuff[i].sex_code +"</h4>\
                                            <h4><b>Age:</b> "+ list_of_stuff[i].age +"</h4>\
                                            <div class=\"search-pet-description\">\
                                                <h5><b>Description:</b> "+ list_of_stuff[i].description +"</h5>\
                                            </div>\
                                               <a class='title small-font' id="+ list_of_stuff[i].id +">...Click here for more info!</a>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class=\"search-result-frame-small\">\
                                    <div class=\"search-result-content-frame-small hidden-sm hidden-md hidden-lg\">\
                                          <div class= \"pet-pic-frame-small\">\
                                                <img class=\"pet-thumbnail-small\" src = \" "+list_of_stuff[i].photo.split('?')[0]+"\" width=\"600\" >\
                                            </div>\
                                        <div class=\"search-result-pet-info-small\">\
                                            <h3 class='title' id="+ list_of_stuff[i].id +">Hi I'm "+ list_of_stuff[i].name +"!</h3>\
                                            <h4><b>Size:</b> "+ list_of_stuff[i].size +"</h4>\
                                            <h4><b>Sex:</b> "+ list_of_stuff[i].sex_code +"</h4>\
                                            <h4><b>Age:</b> "+ list_of_stuff[i].age +"</h4>\
                                            <div class=\"search-pet-description\">\
                                                <h5><b>Description:</b> "+ list_of_stuff[i].description +"</h5>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>")
    }
}

function showView2(search_location){

    new_get_url = 'https://api.petfinder.com/pet.find?format=json&key=b31df3dfa380bae9b0039e3a91d9126f&location='.concat(search_location);
    getPetList(new_get_url, 0).then(
        (pet_list) => {
			if(pet_list.length == 0){
                $("#loading").hide();
				var no_result = "You Searched for: \""
				no_result += document.getElementById("search_location").value;
				no_result += "\". There are no results for \""
				no_result += document.getElementById("search_location").value;
				no_result += "\"."
				document.getElementById("No_Result").innerHTML = no_result;
				
				var example_search = "Locations may be entered in one of the following ways:"
				example_search += "<li> 5 digit ZIP code e.g. \"08876\"</li>"
				example_search += "<li> Postal code (with space) e.g. \"k8p 3h2\"</li>"
				example_search += "<li> Town, State/Province combination (2 letter abbr) e.g. \"Somerville, NJ\" or \"Vancouver, BC\"</li>"
				document.getElementById("example_search").innerHTML = example_search;
				
			}
			else{
				$("#view1").hide();
				$("#view3").hide();
                $("#loading").hide();
                $("#spotlightView").hide();
                $("#loginView").hide();
                $("#profileView").hide();
                $("#signupView").hide();
				$("#view2").show();
				var user = sessionStorage.getItem('user');
				if(user){ //logged in
					$("#logout").show();
				}
				else{
					$("#logout").hide();
				}
                current_view = 2;
				console.log(pet_list);
			}
			newpet_list = pet_list;
			console.log(newpet_list);
			
			////////////////////////////////////////////////////////////////////////////
			
            append_new_entries(newpet_list,'#posts');
            /*
			for(var i = 0; i < 8; i++){
				$('#posts').append("<div class=\"row\">\
										<div class= \"col-sm-4\">\
											<img class=\"img-responsive\" src = \" "+newpet_list[i].photo.split('?')[0]+"\" width=\"600\" >\
										</div>\
										<div class=\"col-sm-4\">\
										<h3 class='title' id="+ newpet_list[i].id +">"+ newpet_list[i].name +"</h3>\
										<h4>Size: "+ newpet_list[i].size +"</h4>\
										<h4>Sex: "+ newpet_list[i].sex +"</h4>\
										<h4>Age: "+ newpet_list[i].age +"</h4>\
										<h5>Description: "+ newpet_list[i].description +"</h5>\
										</div>\
									</div>")
			}
			*/
			
			////////////////////////////////////////////////////////////////////////////
            return pet_list;
        }
    ).catch(string => {
        console.log("Error!", string);
    });

	var x = "You Searched for: "
	x += document.getElementById("search_location").value;
	document.getElementById("Result").innerHTML = x;
	
    
}

function showView3(pet_id) {
    // todo: display the information we got from getPetInfo
    $("#loading").show();
    $("#view1").hide();
    $("#view2").hide();
    $("#view3").hide();
    $("#spotlightView").hide();
    $("#loginView").hide();
    $("#profileView").hide();
    $("#signupView").hide();
	var user = sessionStorage.getItem('user');
	if(user){ //logged in
		$("#logout").show();
	}
	else{
		$("#logout").hide();
	}
    // test code
    getPetInfo(pet_id).then( 
        (pet_list) => {
            var pet_info = pet_list;
            console.log(JSON.stringify(pet_info));
			console.log(pet_info.id);
             $('#petprofilename').append("<div>\
                <h1>"+ pet_info.name +" 's Profile</h1>\
                 </div>\
              ")
            $('#singlepetinfo').append("<div class=\"container-fluid\">\
                <div class= \"row\">\
                <div class= \"col-sm-5\">\
                <img class=\"img-responsive\" src = \" "+pet_info.photo.split('?')[0]+"\" width=\"600\" >\
                </div>\
                <div class=\"col-sm-7\">\
                <h4><b>Size:</b> "+ pet_info.size +"</h4>\
                <h4><b>Sex:</b> "+ pet_info.sex_code +"</h4>\
                <h4><b>Age:</b> "+ pet_info.age +"</h4>\
                <h4><b>Contact Info:</b></h4>\
                <h4><b>Phone:</b> "+ pet_info.phone +"</h4>\
                <h4><b>Email:</b> "+ pet_info.email +"</h4>\
                <h4><b>About "+ pet_info.name +" :</b> </h5>\
                <h5>"+ pet_info.description +"</h5>\
				<button onclick=\"Favorite("+pet_info.id+")\" class=\"btn btn-info\">Favorite This Pet</button>\
                </div>\
                </div>\
            </div>")
        });

    $("#view1").hide();
    $("#view2").hide();
    $("#view3").show();
    $("#loading").hide();
    current_view = 3;
}

function showFavView3(pet_id) {
    // todo: display the information we got from getPetInfo
    $("#loading").show();
    $("#view1").hide();
    $("#view2").hide();
    $("#view3").hide();
    $("#spotlightView").hide();
    $("#loginView").hide();
    $("#profileView").hide();
    $("#signupView").hide();
    $("#back_to_results_button").hide();

    var user = sessionStorage.getItem('user');
    if(user){ //logged in
        $("#logout").show();
    }
    else{
        $("#logout").hide();
    }
    // test code
    getPetInfo(pet_id).then( 
        (pet_list) => {
            var pet_info = pet_list;
            console.log(JSON.stringify(pet_info));
            console.log(pet_info.id)
             $('#petprofilename').append("<div>\
                <h1>"+ pet_info.name +" 's Profile</h1>\
                 </div>\
              ")
            $('#singlepetinfo').append("<div class=\"container-fluid\">\
                <div class= \"row\">\
                <div class= \"col-sm-5\">\
                <img class=\"img-responsive\" src = \" "+pet_info.photo.split('?')[0]+"\" width=\"600\" >\
                </div>\
                <div class=\"col-sm-7\">\
                <h4><b>Size:</b> "+ pet_info.size +"</h4>\
                <h4><b>Sex:</b> "+ pet_info.sex_code +"</h4>\
                <h4><b>Age:</b> "+ pet_info.age +"</h4>\
                <h4><b>Contact Info:</b></h4>\
                <h4><b>Phone:</b> "+ pet_info.phone +"</h4>\
                <h4><b>Email:</b> "+ pet_info.email +"</h4>\
                <h4><b>About "+ pet_info.name +" :</b> </h5>\
                <h5>"+ pet_info.description +"</h5>\
                <button onclick=\"Delete("+pet_info.id+")\" class=\"btn btn-info\">Unfavorite This Pet</button>\
                </div>\
                </div>\
            </div>")
        });

    $("#view1").hide();
    $("#view2").hide();
    $("#view3").show();
    $("#loading").hide();
    current_view = 3;
}

function showView1() {
    $("#loading").hide();
    $("#view1").show();
    $("#view2").hide();
    $("#view3").hide();
    $("#spotlightView").hide();
    $("#loginView").hide();
    $("#profileView").hide();
    $("#signupView").hide();
	var user = sessionStorage.getItem('user');
	if(user){ //logged in
		$("#logout").show();
	}
	else{
		$("#logout").hide();
	}
    current_view = 1;
}

function showProfileView() {
   $("#loading").hide();
    $("#view1").hide();
    $("#view2").hide();
    $("#view3").hide();
    $("#spotlightView").hide();
    $("#loginView").hide();
    $("#signupView").hide();
    $("#profileView").show();
	$("#logout").show();
    $(".alert").show();
    getFavs();

}

function showSignupView() {
    $("#loading").hide();
    $("#view1").hide();
    $("#view2").hide();
    $("#view3").hide();
    $("#spotlightView").hide();
    $("#loginView").hide();
    $("#profileView").hide();
    $("#signupView").show();
	var user = sessionStorage.getItem('user');
	if(user){ //logged in
		$("#logout").show();
	}
	else{
		$("#logout").hide();
	}
}

function showLoginView() {
    $(".alert").hide();
    $("#loading").hide();
    $("#view1").hide();
    $("#view2").hide();
    $("#view3").hide();
    $("#spotlightView").hide();
    $("#profileView").hide();
    $("#signupView").hide();
    $("#loginView").show();
	var user = sessionStorage.getItem('user');
	if(user){ //logged in
		$("#logout").show();
	}
	else{
		$("#logout").hide();
	}
}

function signUp(user_email, user_password){

    return new Promise((resolve, reject) => {
       $.ajax({
            type:'POST',
            data: JSON.stringify({
                    email: user_email,
                    password: user_password,
                    }),
            headers: {
                'Content-Type': 'application/json',
            },
            url: "/api/signup/" ,
            dataType: 'json',
            success:function(data) {
                resolve(data);
            },
            fail:function() {
                reject("FAILED AJAX");
            }
        });
    });                 
}

function loginUser(user_email, user_password){

    /*
    req.params = {
        userId: _id from database
        petId: petfinder id
    }
    */
    return new Promise((resolve, reject) => {
       $.ajax({
            type: 'POST',
            data: JSON.stringify({
                "email": user_email,
                "password": user_password,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            url: "/api/login/" ,
            dataType: 'json',
            success:function(data) {
                resolve(data);
            },
            fail:function() {
                reject("FAILED AJAX");
            }
        });
    });                 
}

function getAllMessages() {
    $.ajax({
        type: 'GET',
        url: 'api/messages',
        headers: {'Content-Type': 'application/json'},
        success: function(data) {
            console.log("data:" + JSON.stringify(data));
        }
    });
    setTimeout(getAllMessages, 5000);
    
}

function deletePet(user_id, pet_id){
    return new Promise((resolve, reject) => {
       $.ajax({
            type:'DELETE',
            data: JSON.stringify({
                    "userId": user_id,
                    "petId": pet_id,
                    }),
            headers: {
                'Content-Type': 'application/json',
            },
            url: "/api/"+user_id+"/"+pet_id,
            dataType: 'json',
            success:function(data) {
                resolve(data);
            },
            fail:function() {
                reject("FAILED AJAX");
            }
        });
    });                 
}

function addPet(user_id, pet_id){
    return new Promise((resolve, reject) => {
       $.ajax({
            type:'POST',
            data: JSON.stringify({
                    "userId": user_id,
                    "petId": pet_id,
                    }),
            headers: {
                'Content-Type': 'application/json',
            },
            url: "/api/addPet/" ,
            dataType: 'json',
            success:function(data) {
                resolve(data);
            },
            fail:function() {
                reject("FAILED AJAX");
            }
        });
    });                 
}


function getFavs(){
    var user_id = sessionStorage.getItem('user_email');
    console.log("get user pets user id is:");
    console.log(user_id);
    getUserPets(user_id)
        .then(
            (item) => {
                var database_item = JSON.parse(JSON.stringify(item));
                console.log("returned pet list:");
                console.log(database_item.pets);
       
                var pet_id_list = [];

                for(var i = 0; i < database_item.pets.length; i++){
                    pet_id_list.push(database_item.pets[i].petId);
                }

                console.log("pet id list is: " + pet_id_list);

                var pet_obj_list = [];
                   
                    for(var j = 0; j < pet_id_list.length; j++){
                        var promise = new Promise(function(resolve, reject) {
                        getPetInfo(pet_id_list[j]).then( 
                            (pet_list) => {
                                console.log("pet info: " + pet_list);
                                var pet_info = pet_list;
                                if(pet_info){
                                    resolve(pet_info);
                                }
                                else{
                                    reject("pet_info not retrieved");
                                }
                            })
                        });
                    
                        promise.then(
                        (pet_info) => {
                            pet_obj_list.push(pet_info);
                            console.log(pet_obj_list);
                            if(pet_obj_list.length === pet_id_list.length){
                                append_new_fav_entries(pet_obj_list,'#favs');
                            }
                        });
                        
                    }
        });
}

function getUserPets(user_id,){

    console.log(user_id);
    return new Promise((resolve, reject) => {
       $.ajax({
            type:'GET',
            data: JSON.stringify({
                    "userId": user_id,
                    }),
            headers: {
                'Content-Type': 'application/json',
            },
            url: "/api/getUserPets/"+user_id ,
            dataType: 'json',
            success:function(data) {
                resolve(data);
            },
            fail:function() {
                reject("FAILED AJAX");
            }
        });
    });                 
}

function getLatestMessage() {
    $.ajax({
        type: 'GET',
        url: 'api/messages',
        headers: {'Content-Type': 'application/json'},
        success: function(data) {
            var message;
            if ( (data['messages'].length == 0) || (data['messages'][0]['data'] == null) ) {
                message = "No New Messages";
            }
            else {
                message = data['messages'][0]['data'];
            }

            $(".alertText").html(message);
        }
    });
    setTimeout(getLatestMessage, 5000);
}
var counter = 0;
    
$(document).ready(function() {

    setTimeout(getLatestMessage, 5000);
    var user = sessionStorage.getItem('user');
    /*if(user){
        //show profile page
        $("#view1").hide();
        $("#view2").hide();
        $("#view3").hide();
        $("#spotlightView").hide();
        $("#loading").hide();
        $("#loginView").hide();
        $("#signupView").hide();
        $("#profileView").show();
    }
    else{*/ //no user
        //initial views for when page loads
        $("#view2").hide();
        $("#view3").hide();
        $("#profileView").hide();
        $("#loginView").hide();
        $("#spotlightView").hide();
        $("#signupView").hide();
        $("#loading").hide();
		var user = sessionStorage.getItem('user');
		if(user){ //logged in
			$("#logout").show();
            $(".alert").show();
		}
		else{
			$("#logout").hide();
            $(".alert").hide();
		}
    //}
	var win = $(window);
	var count = 1;
	
	// Each time the user scrolls
	win.scroll(function() {
        if (current_view == 2 && $(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            // End of the document reached?
            new_get_url = 'https://api.petfinder.com/pet.find?format=json&key=b31df3dfa380bae9b0039e3a91d9126f&location='.concat($("#search_location").val());
            if ($(document).height() - win.height() < (win.scrollTop()+10)) {
                getPetList(new_get_url, count*8).then(
                    (pet_list) => {
                        if (newpet_list[7].id == pet_list[0].id) {
                            pet_list.splice(0, 1);
                            }   
                        
                        newpet_list = pet_list;
                        console.log(pet_list);
                        ///////////////////////////////////////////////////////////////////////////
                        append_new_entries(newpet_list,'#posts');
                        /*
                        for(var i = 0; i < 8; i++){
						$('#posts').append("<img class=\"img-responsive\" src = \" "+newpet_list[i].photo.split('?')[0]+"\" width=\"600\" >");
                        }
                        */
					
                        ////////////////////////////////////////////////////////////////////////////
                        return pet_list;
                    }
                ).catch(string => {
                    console.log("Error!", string);
                });
                count++;
            }
		
        }
		
  //       //scroll for user favriotes
		// if (current_view == 5 && $(window).scrollTop() + $(window).height() > $(document).height() - 100) {
  //           // End of the document reached?
  //           new_get_url = 'https://api.petfinder.com/pet.find?format=json&key=b31df3dfa380bae9b0039e3a91d9126f&location='.concat($("#search_location").val());
  //           if ($(document).height() - win.height() < (win.scrollTop()+10)) {
  //               getPetList(new_get_url, count*8).then(
  //                   (pet_list) => {
  //                       if (newpet_list[7].id == pet_list[0].id) {
  //                           pet_list.splice(0, 1);
  //                           }   
  //                       newpet_list = pet_list;
  //                       console.log(pet_list);
  //                       append_new_entries(newpet_list,'#Favorited');
  //                       return pet_list;
  //                   }
  //               ).catch(string => {
  //                   console.log("Error!", string);
  //               });
  //               count++;
  //           }
		
  //       }
    });
    /*$("#magic").click(function (){
                $.ajax({
                    type:'GET',
                    data : {},
                    headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        },
                    url: 'https://api.petfinder.com/pet.get?format=json&key=b31df3dfa380bae9b0039e3a91d9126f&id=39041553&callback=?',
                    dataType: 'json',
                    success:function(data){
                    console.log("data is:" + JSON.stringify(data));
                    var obj = data;


                    var att = obj["petfinder"]["pet"]["media"]["photos"]["photo"][0]["$t"];
                    console.log(att);
                        $('<img>')
                            .attr("src", att)
                            .appendTo('.modify')
                    }
                });
            });
    */


$("#login").click(function (){
    var user_email = $("#login_email").val();
    var user_password = $("#login_password").val();
    loginUser(user_email,user_password)
        .then(
            (item) => {
                var database_item = item;
                console.log("returned userid!")
                console.log(JSON.stringify(database_item));
                showProfileView();

                //setting session storage
                sessionStorage.setItem('user', database_item);
                sessionStorage.setItem('user_email', user_email);
                console.log("user set in session storage: ");
                console.log( sessionStorage.getItem('user'));
                document.getElementById("welcome_greeting").innerHTML = "welcome " + user_email;
                
        })
        .catch(string => {
            console.log("Error!", string);
            console.log("user is not signed up yet")
            showSignupView();
    });
});

$("#go_signup").click(function (){
    showSignupView();
});

  
$("#signup").click(function (){
    var user_email = $("#signup_email").val();
    var user_password = $("#sign_password").val();
    signUp(user_email,user_password).then( 
        (item) => {
            var database_item = item;
            console.log("finished signing up")
            console.log(JSON.stringify(database_item));

            //saving user to session storage
            sessionStorage.setItem('user', database_item);
            sessionStorage.setItem('user_email', user_email);
            document.getElementById("welcome_greeting").innerHTML = "welcome " + user_email;
            showProfileView();
        })
    .catch(string => {
        console.log("Error!", string);
        console.log("user did not sign up successfully")
    });

});

$("#logout").click(function (){
    sessionStorage.clear(); //remove user from session storage
    showLoginView();
});

$("#spotlight").click(function (){
    console.log("spotlight view");
    $("#loading").hide();
    $("#view1").hide();
    $("#view2").hide();
    $("#view3").hide();
    $("#loginView").hide();
    $("#signupView").hide();
    $("#profileView").hide();
    $("#spotlightView").show();
	var user = sessionStorage.getItem('user');
    if(user){ //logged in
        $("#logout").show();
    }
    else{
        $("#logout").hide();
    }
	
});

$("#profile").click(function (){
    var user = sessionStorage.getItem('user');
    if(user){ //logged in
        showProfileView();
    }
    else{
        showLoginView();
    }
});

$("#SearchButton").click(function (){
      var search_location = $("#search_location").val();
      console.log("search location: " + search_location);
      showView2(search_location);
});

$("#view2toview1").click(function (){
      newpet_list = null;
      $('#posts').empty();
      $("#search_location").val("");
      showView1();
});

$("#view3toview2").click(function (){
      newpet_list = null;
      $('#posts').empty();
      $('#petprofilename').empty();
      $('#singlepetinfo').empty();
      
      var search_location = $("#search_location").val();
      showView2(search_location);
});


// Anything with class 'title' will trigger a view change to VIEW_3 
// when clicked on. The pet's name in VIEW2 will trigger it
$("#posts").on('click', '.title', function () {
    var id = event.target.id;
    // change to view3
    showView3(id);
});

$("#favs").on('click', '.title', function () {
    var id = event.target.id;
    // change to view3
    showFavView3(id);
});

});