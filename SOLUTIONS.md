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
