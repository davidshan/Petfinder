
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
        
        request.get({
            url: "http://localhost:3000/api/5a22ddf338824b161f91614c/396414612",
            json: true, // don't forget,
            /*body: {
            comment: "poo"
      
            }
        */}, function (err,res, body) {
if(err) {
console.log(err)
} else {
data = body

//Modify this to access different JSON fields
console.log(data) 
}
});