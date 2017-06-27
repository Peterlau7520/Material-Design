
document.getElementById('toggleProfile').addEventListener('click', function () {
  [].map.call(document.querySelectorAll('.profile'), function(el) {
    el.classList.toggle('profile--open');
  });
});

var toggle_main =  false;
var post_id_list = [];

$('#btn-register').on('click', function(evt){
	//console.log('yo');
	$('#hide-ln').hide();
	$('#hide-fn').hide();
	$('#btn-register').hide();
	var html = `<div class="button raised blue" id="btn-register" style="width: 180px">
        <div class="center" fit>Go back to registration</div>
        <paper-ripple fit></paper-ripple>
      </div>`;
    $('.profile__footer').append($(html));
	$.ajax({
	url: 'https://horizons-facebook.herokuapp.com/api/1.0/users/register',
	async: "true",
	method: 'POST',
	data:{
	fname: $('.firstname').val(),
	lname: $('.lastname').val(),
	email: $('.username').val(),
	password: $('.password').val(),
    },
    success:true
	});
});

$('#btn-login').on('click', function(evt){
	console.log('yo');
    $.ajax({
	url: "https://horizons-facebook.herokuapp.com/api/1.0/users/login",
	asyc:"true",
	method: 'POST',
	success: function(data){
		// id: data.response.id,
		// token: data.response.token,
	},
	data: {
		email: $('.username').val(),
		password: $('.password').val(),
		}
	});
	$('#hide-main').hide();
	$('#img').hide();
	//Append posts; 
	$('div#postlist').append(`<div class="post-box-text" style="border-radius: 6px; margin-bottom: 20px;">
									<div class="row">
									  <div class="post-textarea">
									      <div class="first-half" style="padding-bottom: 2px">
									          <div class="form-group">
									          <label style="color:white">How do you feel today ? </label>
									          <textarea class="form-control text-box" rows="5"></textarea>
									          </div>
									        </div>
									        <div class="second-half">
									          <div style="justify-content: center; display: flex">
									            <button type="button" class="btn btn-default btn-post" arial-label="center">
									                  <span class="glyphicon glyphicon-pencil"></span>
									            </button>
									          </div>
									        </div>
									      </div>
									  </div>
									</div>`);
	$('button.btn-post').mouseenter(function(){
		$this = $('span.glyphicon-pencil');
		$this.removeClass('glyphicon-pencil');
		$this.addClass('glyphicon-play-circle')
	}).mouseleave(function(){
		$this = $('button.btn-post span');
		$this.removeClass('glyphicon-play-circle');
		$this.addClass('glyphicon-pencil');
	}) //animation
	$('.btn-post').on('click', function(){
		var content = $('textarea.text-box').val();
		console.log(content);
		$.ajax({
			url: "https://horizons-facebook.herokuapp.com/api/1.0/posts",
			method: 'POST',
			success: function(data){
				// id: data.response.id,
				// token: data.response.token,
			},
			data: {
				token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InBldGVAZ21haWwuY29tIn0.Oo9MI2kxF3PfmYAb_PO8zFwEQjvTlNkO14AoJZO9AIw",
				content: $('textarea.text-box').val()
			}

		});
	});
	var posts;
	//Continue from here. 

	$.ajax({
			url: "https://horizons-facebook.herokuapp.com/api/1.0/posts",
			method: 'GET',
			async: "false",
			success: function(data){
			  posts =  data.response;
			  console.log(posts);
			  posts.forEach(function(obj){
				var name = obj.poster.name;
				var time_unformatted = obj.createdAt;
				var content = obj.content;
				var num_likes =  obj.likes.length;
				var comments = obj.comments; 
				var post_id =  obj._id; 
				var time = moment(moment(time_unformatted).format()).fromNow();
				//continue from here
				$('div#postlist').append(`<div class="post-box" id="${post_id} style="border-radius: 6px; margin-bottom: 20px;">
					    <div class="first-half" style="padding-bottom: 2px; padding-left:15px">
					    <h2 style="margin-bottom:0"> ${name} </h2>
					    <small> ${time} </small>
					    <p style="margin-bottom:0"> ${content} </p>    
					    <hr style="margin-top:2px; margin-bottom: 2px">
					  </div>
					  <div class="second-half">
					  	<div class="comments" id="${post_id}" style="margin-left:15px; margin-right:15px"></div>
					    <div style="justify-content: center; display: flex; align-items:flex-end">
					      <button type="button" class="btn btn-default like" id="${post_id}" arial-label="center">
					            <span> ${num_likes} </span> <span class="glyphicon glyphicon-thumbs-up"></span>
					      </button>
					      <button type="button" class="btn btn-default replies" id="${post_id}" arial-label="center">
					           <span> ${comments.length} </span>  <span class="glyphicon glyphicon-share-alt"></span>
					      </button>
					    </div>
					  </div>
					</div> `);		
				var button_like = "button.btn.like#" + `${post_id}`;
				comments.forEach(function(item){
						var name = item.poster.name;
						var content = item.content;
						var time = moment(moment(item.createdAt).format()).fromNow();
						$(`div.comments#${post_id}`).append(`<div class="comment">
					        <h4 style="margin-bottom:0;margin-top:0"> ${name} </h4>
					        <small> ${time} </small>
					        <p style="margin-bottom:0"> ${content} </p>    
					        <hr style="margin-top:2px; margin-bottom: 2px">
					    	</div>`);
					});

				$('body').on('click', `button.like#${post_id}`, function(evt){
						$this = $(this); 
						$.ajax({
							url: 'https://horizons-facebook.herokuapp.com/api/1.0/posts/likes/' + `${post_id}`,
							method: 'GET',
							async: "false",
							data:{
								token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InBldGVAZ21haWwuY29tIn0.Oo9MI2kxF3PfmYAb_PO8zFwEQjvTlNkO14AoJZO9AIw',
							}
						});
				});
			    $('body').on('click', `button.replies#${post_id}`, function(evt){
						$this = $(this); 
						console.log(`${post_id}`);
						var replybox =  `<div class="third">
											  <div class="post-box-text" style="border-radius: 6px; margin-bottom: 20px;">
											    <div class="row">
											    <div class="post-textarea">
											        <div class="first-half" style="padding-bottom: 2px">
											            <div class="form-group" border: solid 2px;>
											            <label style="color:white; background-color:skyblue;"> Reply.. </label>
											            <textarea class="form-control text-box" id=${post_id} rows="5"> </textarea>
											            </div>
											          </div>
											          <div class="second-half">
											            <div style="justify-content: center; display: flex">
											              <button type="button" class="btn btn-default btn-reply" id=${post_id} arial-label="center">
											                    <span class="glyphicon glyphicon-pencil"></span>
											              </button>
											            </div>
											          </div>
											        </div>
											    </div>
											  </div>
											</div>`;
						$(`div.comments#${post_id}`).append($(replybox));
						$('body').on('click', `.btn-reply#${post_id}`, function(evt){
							console.log("replying");
							var text  = $(`textarea#${post_id}.form-control.text-box`).val()
							console.log(text);
							$.ajax({
							url: `https://horizons-facebook.herokuapp.com/api/1.0/posts/comments/${post_id}`,
							method: 'POST',
							async: "true",
							data:{
								token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InBldGVAZ21haWwuY29tIn0.Oo9MI2kxF3PfmYAb_PO8zFwEQjvTlNkO14AoJZO9AIw',
								content: text
							}
						  });


						})

				});

				});

			},
			data:{
				token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InBldGVAZ21haWwuY29tIn0.Oo9MI2kxF3PfmYAb_PO8zFwEQjvTlNkO14AoJZO9AIw"
			}

	});
	setInterval(function(){
		$.ajax({
			url: "https://horizons-facebook.herokuapp.com/api/1.0/posts",
			method: 'GET',
			async: "false",
			success: function(data){
			  posts =  data.response;
			  console.log(posts);
			  posts.forEach(function(obj){
				var name = obj.poster.name;
				var time_unformatted = obj.createdAt;
				var content = obj.content;
				var num_likes =  obj.likes.length;
				var comments = obj.comments; 
				var post_id =  obj._id; 
				var time = moment(moment(time_unformatted).format()).fromNow();
				//continue from here
				if($(`#${post_id}`).length === 0){
					console.log('new post');
					$('div#postlist').append(`<div class="post-box" id="${post_id} style="border-radius: 6px; margin-bottom: 20px;">
					    <div class="first-half" style="padding-bottom: 2px; padding-left:15px">
					    <h2 style="margin-bottom:0"> ${name} </h2>
					    <small> ${time} </small>
					    <p style="margin-bottom:0"> ${content} </p>    
					    <hr style="margin-top:2px; margin-bottom: 2px">
					  </div>
					  <div class="second-half">
					  	<div class="comments" id="${post_id}" style="margin-left:15px; margin-right:15px"></div>
					    <div style="justify-content: center; display: flex; align-items:flex-end">
					      <button type="button" class="btn btn-default like" id="${post_id}" arial-label="center">
					            <span> ${num_likes} </span> <span class="glyphicon glyphicon-thumbs-up"></span>
					      </button>
					      <button type="button" class="btn btn-default replies" id="${post_id}" arial-label="center">
					           <span> ${comments.length} </span>  <span class="glyphicon glyphicon-share-alt"></span>
					      </button>
					    </div>
					  </div>
					</div> `);		
					var button_like = "button.btn.like#" + `${post_id}`;
					comments.forEach(function(item){
						var name = item.poster.name;
						var content = item.content;
						var time = moment(moment(item.createdAt).format()).fromNow();
						$(`div.comments#${post_id}`).append(`<div class="comment">
					        <h4 style="margin-bottom:0;margin-top:0"> ${name} </h4>
					        <small> ${time} </small>
					        <p style="margin-bottom:0"> ${content} </p>    
					        <hr style="margin-top:2px; margin-bottom: 2px">
					    	</div>`);
					});

					$('body').on('click', `button.like#${post_id}`, function(evt){
						$this = $(this); 
						$.ajax({
							url: 'https://horizons-facebook.herokuapp.com/api/1.0/posts/likes/' + `${post_id}`,
							method: 'GET',
							async: "false",
							data:{
								token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InBldGVAZ21haWwuY29tIn0.Oo9MI2kxF3PfmYAb_PO8zFwEQjvTlNkO14AoJZO9AIw',
							}
						});
					});
			    	$('body').on('click', `button.replies#${post_id}`, function(evt){
						$this = $(this); 
						console.log(`${post_id}`);
						var replybox =  `<div class="third">
											  <div class="post-box-text" style="border-radius: 6px; margin-bottom: 20px;">
											    <div class="row">
											    <div class="post-textarea">
											        <div class="first-half" style="padding-bottom: 2px">
											            <div class="form-group" border: solid 2px;>
											            <label style="color:white; background-color:skyblue;"> Reply.. </label>
											            <textarea class="form-control text-box" id=${post_id} rows="5"> </textarea>
											            </div>
											          </div>
											          <div class="second-half">
											            <div style="justify-content: center; display: flex">
											              <button type="button" class="btn btn-default btn-reply" id=${post_id} arial-label="center">
											                    <span class="glyphicon glyphicon-pencil"></span>
											              </button>
											            </div>
											          </div>
											        </div>
											    </div>
											  </div>
											</div>`;
						$(`div.comments#${post_id}`).append($(replybox));
						$('body').on('click', `.btn-reply#${post_id}`, function(evt){
							console.log("replying");
							var text  = $(`textarea#${post_id}.form-control.text-box`).val()
							console.log(text);
							$.ajax({
							url: `https://horizons-facebook.herokuapp.com/api/1.0/posts/comments/${post_id}`,
							method: 'POST',
							async: "true",
							data:{
								token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InBldGVAZ21haWwuY29tIn0.Oo9MI2kxF3PfmYAb_PO8zFwEQjvTlNkO14AoJZO9AIw',
								content: text
							}
						  });


						})

					});
				 }
				});

			},
			data:{
				token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InBldGVAZ21haWwuY29tIn0.Oo9MI2kxF3PfmYAb_PO8zFwEQjvTlNkO14AoJZO9AIw"
			}
	});
	}, 3000);
	//var posts_update;
	// $.ajax({
	// 	url: "https://horizons-facebook.herokuapp.com/api/1.0/posts",
	// 	method: 'GET',
	// 	async: "true",
	// 	success: function(data){
	// 	}
	// });

});




// $('button.replies').on('click', function(evt){



// })



