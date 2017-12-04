API endpoints for PetFinder

api/login
POST
expected data:
{
    email: a string
    password: a string
}

returns:

If email and password are incorrect:

{
    error: error message (string)
}

If email and password are correct:
{
    userId: an ObjectId
}



api/signup
POST
expected data:
{
    email: a string
    password: a string
}

returns:
{
    userId: an ObjectId
}


api/:userId
GET
returns:
{
    userId: an ObjectId
    pets: [ 
        {
            petId: a Petfinder id
            userId: an ObjectId 
            dateAdded: a Date
            comment: (may not exist) a string
        }...
    ]
}


POST
expected data:
{
   petId: a Petfinder id
}

returns:
a MongoDB response


api/:userId/:petId
GET
PUT
DELETE


This web application allows the user to create an account and favorite pets from the petfinder api. Our web application allows the user to search for adoptable pets within a specific location. The user types in a location (defined as a city within a state/province, example: Toronto, ON; or a ZIP/Postal code which includes the spaces if there are any), and presses on the search button. A list of pets is returned, with key information (name, size, gender, age, description, picture if available) of each pet. The user can scroll down and keep going, adding more pets to the list as they go down. Once the user finds a pet they would like to adopt / are interested in they can favorite the pet or clicks on the pet's name and is then taken to the pet's main info page, where more detail is given about that pet and also allow the favorite of the pet. This page would contain more info about the pet such as contact info (if available) and a more expanded description. We also added a back button for the user to switch between the pages, in case they want to look at the list of pets available in their searched location again, or search for pets in a different location. After the user have finished looking for pets to favorite the user can go to their own profile page and look at all the pet that they have favorited and if the user don’t like any of the pet they could unfavorite them. The server will receive the data and keep track of what user favorited so the next time they login they will still have the list. 

