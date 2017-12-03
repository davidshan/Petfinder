
    const request = require('request')

    function rot13(msg) {
        // implement this
    }

 /* request.post({
            url: 'http://wolf.teach.cs.toronto.edu:3090/secret-message/huang387',
            json: true, // don't forget,
            body: {
                'utorid': 'huang387',
                'message': 'ofprehistoricwolvesithasbeendeterminedthatthesewolvesaremorphologicallydistinctfromm'https://www.reqres.in/api/login
            }http://localhost:3000/api/login
        }) */
        
        request.post({
            url: "https://restpect.herokuapp.com/api/favourites/5a247a3938824b161fbe0f9b/",
            json: true, // don't forget,
            body: {
            petId: "396414612"
      
            }
        }, function (err,res, body) {
if(err) {
console.log(err)
} else {
data = body

//Modify this to access different JSON fields
console.log(data) 
}
});