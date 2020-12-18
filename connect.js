var loginedUser = false
var loginusername = null;


$(document).ready(function(){

	var IDENTITY_POOL_ID = 'ap-south-1_YhnB3TDXt';
	var ACCOUNT_ID = 'ojoravhjdbsa4nhi1d0ifama';
	var REGION = 'ap-south-1';

	// Initialize the Amazon Cognito credentials provider

	$('#bold').click(function(event){
		event.preventDefault();
	})
	$('#italic').click(function(event){
		event.preventDefault();
	})
	$('#underline').click(function(event){
		event.preventDefault();
	})


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

								var authenticationData = {
									Username : $('#user').val(),
									Password : $('#pass').val()
								}
								
								var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData)

								var poolData = {

												UserPoolId : IDENTITY_POOL_ID,
												ClientId : ACCOUNT_ID
											}

								var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

								var userData = {
									Username:  $('#user').val(),
									Pool : userPool
								}
								
								var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
								
								cognitoUser.authenticateUser(authenticationDetails,{
									onSucess: function (result){
										console.log(result)
										var accessToken = result.getAccessToken().getJwtToken();
										console.log(accessToken)
										console.log(result)
									},
									onFailure : function (err){
											if (err.message == "Unkown error"){
												$('#result').text('Login Sucessful')
												$('#result').css('color','green')
												loginedUser = true
												loginusername = $('#user').val()
												$('#loginSystem').css('display','none')
												$("#emailSystem").css('display','')
												$('#loggedinUser').text(loginusername)  
												$('#c_e_sender').val(loginusername)
											}
											else{
												$('#result').text(err.message)
												$('#result').css('color','red')
												loginedUser = false
												loginusername = null
											}
											
									},

								})
				
            }

            

          });

	});




	$("#submitRegister").submit(function(event) {
		

		console.log(JSON.stringify({unmae:$('#userRegestration').val(), pwd:$('#passRegestration').val() }))
		$.ajax({
            url: "https://0g02hvzc46.execute-api.ap-south-1.amazonaws.com/dev/emailauth",
            data: JSON.stringify({unmae:$('#userRegestration').val(), pwd:$('#passRegestration').val() }),
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



				                var attributeList = [];
								var dataEmail = {
								    Name : 'email',
								    Value : $('#emailRegestration').val() // your email here
								};
								
								var poolData = {

												UserPoolId : IDENTITY_POOL_ID,
												ClientId : ACCOUNT_ID
											}

								var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


								
								
								cognitoIdentity = new AWS.CognitoIdentity({apiVersion: '2014-06-30'})	
								
								 
								attributeList.push(dataEmail);
								//attributeList.push(dataPhoneNumber);
								//attributeList.push(dataName);
								
								var username = $('#userRegestration').val()
								var password = $('#passRegestration').val()
								var cognitoUser;
								userPool.signUp(username, password, attributeList, null, function(err, result){
								    if (err) {
								        alert(err.message);
								        return;
								    }
								    else{
								    		cognitoUser = result.user;
								    		console.log('user name is ' + cognitoUser.getUsername());
								    		location.reload()
									}
								});
              
            }

            

          });

	});

})

function emailnav(fun_name){

	$('#'+fun_name).submit(function(event){
		event.preventDefault();
	})

	if (fun_name == 'sent_email'){
		$('#'+fun_name).addClass('active')
		$('#compose_email').removeClass('active')
		$('#logout').removeClass('active')
		$('#ComposeEmail').css('display','none')
	}

	else if (fun_name == 'compose_email'){

		$('#'+fun_name).addClass('active')
		$('#sent_email').removeClass('active')
		$('#logout').removeClass('active')
		$('#ComposeEmail').css('display','')

	}

	else if (fun_name == 'logout'){

		$('#'+fun_name).addClass('active')
		$('#compose_email').removeClass('active')
		$('#sent_email').removeClass('active')
		
		location.reload()
		
	}

}

function changeFont(identity){

	if (identity=='bold'){

		if($('#'+identity).hasClass('active')){
			$('#'+identity).removeClass('active')
		} 
		else{
			$('#'+identity).addClass('active')
		}
	}


	else if (identity=='italic'){

		if($('#'+identity).hasClass('active')){
			$('#'+identity).removeClass('active')
		} 
		else{
			$('#'+identity).addClass('active')
		}
	}

	else if (identity=='underline'){

		if($('#'+identity).hasClass('active')){
			$('#'+identity).removeClass('active')
		} 
		else{
			$('#'+identity).addClass('active')
		}
	}


	to_id = $('.active','#ComposeEmail')
	var selected_font = [];

	$.each(to_id, function (key, value){
		var temp = key

		selected_font.push(value.id)
		
	})
	console.log(selected_font)

	if (selected_font.length <1){
		$('#c_e_msg').css('font-weight','')
		$('#c_e_msg').css('font-style','')
		$('#c_e_msg').css('text-decoration','')
	}

	if (selected_font.includes('bold')){
		$('#c_e_msg').css('font-weight','bold')
		$('#c_e_msg').css('font-style','')
		$('#c_e_msg').css('text-decoration','')

		if (selected_font.includes('italic')){
			$('#c_e_msg').css('font-style','italic')
		}

		if (selected_font.includes('underline')){
			$('#c_e_msg').css('text-decoration','underline')
		}

	}

	if (selected_font.includes('italic')){
		$('#c_e_msg').css('font-style','italic')
		$('#c_e_msg').css('font-weight','')
		$('#c_e_msg').css('text-decoration','')
		if (selected_font.includes('bold')){
			$('#c_e_msg').css('font-weight','bold')
		}
		if (selected_font.includes('underline')){
			$('#c_e_msg').css('text-decoration','underline')
		}
	}

	if (selected_font.includes('underline')){
		$('#c_e_msg').css('text-decoration','underline')
		$('#c_e_msg').css('font-style','')
		$('#c_e_msg').css('font-weight','')
	}
		if (selected_font.includes('bold')){
				$('#c_e_msg').css('font-weight','bold')
			}
		if (selected_font.includes('italic')){
				$('#c_e_msg').css('font-style','italic')
			}

}


