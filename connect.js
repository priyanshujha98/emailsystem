
$(document).ready(function(){

	var IDENTITY_POOL_ID = 'ap-south-1_YhnB3TDXt';
	var ACCOUNT_ID = 'ojoravhjdbsa4nhi1d0ifama';
	var REGION = 'ap-south-1';

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
						getSentEmails()
						
					}
					else{
						$('#result').text(err.message)
						$('#result').css('color','red')
						loginedUser = false
						loginusername = null
					}
					
			},

		})

	});

	$("#submitRegister").submit(function(event) {
		
		event.preventDefault();

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
           
	});

	$("#composeEmailDetail").submit(function(event) {
		
		event.preventDefault();
		var action = $(document.activeElement).val();
		var correct = false
		rec = $('#c_e_receivers').val().split(';')
		rec = rec.filter(Boolean)
		if (rec.length >0){
			$.each(rec, function(key,value){

				if (value.includes("@")){
					correct = true
					$('#rec_danger').text('')
					$('#rec_danger').css('display','none')
				}
				else{
					correct = false
					$('#rec_danger').text('* Please enter valid email addres')
					$('#rec_danger').css('display','')
				}
			})
		}
		else{
			$('#rec_danger').text('* Please enter valid email addres')
			$('#rec_danger').css('display','')
		}

		check_cc = $('#c_e_cc').val().split(';')
		check_cc = check_cc.filter(Boolean)
		if (check_cc.length > 0){
			$.each(check_cc, function(key,value){
				if (value.includes("@")){
					correct = true
					$('#cc_danger').text('')
					$('#cc_danger').css('display','none')
				}
				else{
					correct = false
					$('#cc_danger').text('* Please enter valid email addres')
					$('#cc_danger').css('display','')
				}
			})
		}

		check_bcc = $('#c_e_bcc').val().split(';')
		check_bcc = check_bcc.filter(Boolean)
		if (check_bcc.length >0){
			$.each(check_bcc, function(key,value){
				if (value.includes("@")){
					correct = true
					$('#bcc_danger').text('')
					$('#bcc_danger').css('display','none')
				}
				else{
					correct = false
					$('#bcc_danger').text('* Please enter valid email addres')
					$('#bcc_danger').css('display','')
				}
			})
		}


		if (correct){
			$.ajax({
	            url: "https://0g02hvzc46.execute-api.ap-south-1.amazonaws.com/dev/dboperations",
	            data: JSON.stringify({action:action,timestamp:event.timeStamp.toString() ,sender:$('#c_e_sender').val(), receiver:$('#c_e_receivers').val(), cc:$('#c_e_cc').val(),bcc:$('#c_e_bcc').val(),sub:$('#c_e_sub').val(), msg:$('#c_e_msg').val() }),
	            type: 'POST',
	           	crossDomain: true,
	            contentType: 'application/json',
	            dataType: "json",
	            headers: {
					      
					      'Content-Type': 'application/json'
					    },
				
	            success: function(data){
	              alert(data)
	              $('#composeEmailDetail').trigger("reset");
	              
	              $('#c_e_sender').val($('#user').val())

	            }
	          });
		}

	});

})

function getSentEmails(){
	$('#sentEmail').css('display','')
	$.ajax({
		url: "https://0g02hvzc46.execute-api.ap-south-1.amazonaws.com/dev/dboperations",
		data : JSON.stringify({action:"get_sent",sender:$("#loggedinUser").text()}),
		type:"POST",
		crossDomain:true,
		contentType: 'application/json',
		dataType:'json',
		headers:{
			'Content-Type':'application/json'
		},
		success: function (data){
			data = data.reverse()
			$.each(data,function(key,value){
				
				add = `
					<tr>
						<th></th>
						<td>`+value.sender+`</td>
						<td>`+value.receiver+`</td>
						<td>`+value.time_stamp+`</td>
						<td>`+value.cc+`</td>
						<td>`+value.bcc+`</td>
						<td>`+value.subject+`</td>
						<td>`+value.message+`</td>
					</tr>

				`
				$('#detailsSentEmail tbody').append(add)
			})

		},
		error: function(err){
			
			alert(err)
		}
	});
}


function getDraftEmails(){
	$('#draftEmail').css('display','')
	$.ajax({
		url: "https://0g02hvzc46.execute-api.ap-south-1.amazonaws.com/dev/dboperations",
		data : JSON.stringify({action:"get_draft",sender:$("#loggedinUser").text()}),
		type:"POST",
		crossDomain:true,
		contentType: 'application/json',
		dataType:'json',
		headers:{
			'Content-Type':'application/json'
		},
		success: function (data){
			data = data.reverse()
			$.each(data,function(key,value){
				
				add = `
					<tr>
						<th></th>
						<td>`+value.sender+`</td>
						<td>`+value.receiver+`</td>
						<td>`+value.time_stamp+`</td>
						<td>`+value.cc+`</td>
						<td>`+value.bcc+`</td>
						<td>`+value.subject+`</td>
						<td>`+value.message+`</td>
					</tr>

				`
				$('#detailsDraftEmail tbody').append(add)
			})

		},
		error: function(err){
			
			alert(err)
		}
	});
}



function emailnav(fun_name){

	$('#'+fun_name).submit(function(event){
		event.preventDefault();
	})

	if (fun_name == 'sent_email'){
		$('#table_sent_email_body').empty();
		$('#'+fun_name).addClass('active')
		$('#compose_email').removeClass('active')
		$('#logout').removeClass('active')
		$('#ComposeEmail').css('display','none')
		$('#draft_email').removeClass('active')
		$('#sentEmail').css('display','')
		$('#draftEmail').css('display','none')
		$('#table_draft_email_body').empty();
		getSentEmails()
	}

	else if (fun_name == 'compose_email'){

		$('#'+fun_name).addClass('active')
		$('#sent_email').removeClass('active')
		
		$('#draft_email').removeClass('active')
		$('#ComposeEmail').css('display','')
		$('#sentEmail').css('display','none')
		$('#draftEmail').css('display','none')
		$('#table_sent_email_body').empty();
		$('#table_draft_email_body').empty();

	}

	else if (fun_name == 'logout'){

		$('#'+fun_name).addClass('active')
		$('#compose_email').removeClass('active')
		$('#sent_email').removeClass('active')
		$('#table_sent_email_body').empty();
		$('#table_draft_email_body').empty();
		$('#draftEmail').css('display','none')

		location.reload()
		
	}

	else if (fun_name == 'draft_email'){
		$('#table_draft_email_body').empty();
		$('#'+fun_name).addClass('active')
		$('#sent_email').removeClass('active')
		$('#ComposeEmail').css('display','none')
		$('#compose_email').removeClass('active')
		$('#sentEmail').css('display','none')
		$('#table_sent_email_body').empty();
		getDraftEmails()
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


