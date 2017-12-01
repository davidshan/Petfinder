

class Petfinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 1,
        };

        this.getPetList = this.getPetList.bind(this);  
    }
    
     getPetList(new_get_url, offset) {
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

    handleSearchClick(this){
        search_location = this.props.search_location    
        new_get_url = 'http://api.petfinder.com/pet.find?format=json&key=b31df3dfa380bae9b0039e3a91d9126f&location='.concat(search_location);
        this.getPetList(new_get_url, 0).then(
          (pet_list) => {
          if(pet_list.length == 0){
            //this.loading = false
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
            $("#view2").show();
                    current_view = 2;
            console.log(pet_list);
          }
          newpet_list = pet_list;
          console.log(newpet_list);
        
          append_new_entries(newpet_list);
          return pet_list;
          }
        ).catch(string => {
            console.log("Error!", string);
        });

    }

    ComponentDidMount(){
       

  
    }

    render() {
        return (
            <div>
                {this.state.view === 1 ? <HomePage onClick={this.handleSearchClick}/> : null}
                {this.state.view === 2 ? <SearchResults /> : null}
            </div>
      );
    }
}

class HomePage extends React.Component{
    constructor(props) {
        super(props);
      
    }

    render() {
        return (
            <div>
                HELLOOO HELLO
            </div>
      );
    }
    

}

//each Row of Information in Scoreboard
class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            home_team_view: true, //for toggling between two team info
        };

        
    }

    
   
    componentDidMount(){
   
    }

    render() {
      return (
          //assuming that the home team is on the top
          <div>
        
          </div>
      );
    }
}

//For PopUp
// class PetProfile extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render(){
//         return(
//             <tr>
//                 <td>{this.props.batter.name_display_first_last}</td>
//                 <td>{this.props.batter.ab}</td>
//                 <td>{this.props.batter.r}</td>
//                 <td>{this.props.batter.h}</td>
//                 <td>{this.props.batter.rbi}</td> 
//                 <td>{this.props.batter.bb}</td>
//                 <td>{this.props.batter.so}</td>
//                 <td>{this.props.batter.avg}</td>  
//             </tr>
//         );
//     }
// }

ReactDOM.render(<PetFinder/>, document.getElementById('root'));