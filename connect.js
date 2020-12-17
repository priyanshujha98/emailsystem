
$(document).ready(function(){


	$("#signin").submit(function(event) {
		event.preventDefault();

		console.log(JSON.stringify({unmae:$('#user').val(), pwd:$('#pass').val() }))
		$.ajax({
            url: "https://0g02hvzc46.execute-api.ap-south-1.amazonaws.com/dev/emailauth",
            data: JSON.stringify({unmae:$('#user').val(), pwd:$('#pass').val() }),
            type: 'POST',
           	crossDomain: true,
            contentType: 'application/json',
            dataType: "json",
            headers: {
				      
				      'Content-Type': 'application/json'
				    },
			
            success: function(data){
              alert(data)
              console.log(data);
              
            }

            

          });

	});

})


/*
headers: {
   						 "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
   						 "Access-Control-Allow-Methods" : ["GET, POST, PUT, DELETE"],
   						 "Access-Control-Allow-Headers" : ["Content-Type, Accept"]
    					//"Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
  					}

 */