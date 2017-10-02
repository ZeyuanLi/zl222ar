
var APP = {};
Do('jquery', function() {
	
	APP.recovery = {
		// init
		init: function() {
			
			if(document.getElementById('j_order')) {
				$('body').height(screen.height);
				this.order();
			}
			if(document.getElementById('j_detail')) {
				$('body').height(screen.height);
				this.detail();
			}
			
			if(document.getElementById('j_hospital_list')) {
				this.getHospital();
			}
			
		},
		// info
		info: {
			
		},
		// get hospital
		getHospital: function() {
			var _this = $(this);
			
			$('body').append('<div class="u-loading"></div>');
			var curPage = 1;
			$.ajax({
			   type: "get",
			   url: '/zlyy/srv/mobapp/heaalth/center/public/query/heaalth/center/info.spr?currentPage='+ curPage +'&pageSize=10&request_alg=none&response_alg=none',
			   success: function(data){
			   		//console.log(data);
					if(data.result == '000') {
						$('.u-loading').remove();
						Do('tpl', function() {
							var gettpl = document.getElementById('j_tpl').innerHTML;
							laytpl(gettpl).render(data, function(html){
							    $('#j_hospital_list').append(html);
							    curPage++;
							});
						});
						// imgLazyload
						/*Do('imgLazyload', function() {
							$('img').picLazyLoad({
							    threshold: 100
							});
						});*/
						
					}
					
			   }
			});
			// get info
			$('#j_hospital_list').on('click', 'a', function() {
				var id = $(this).data('id'),
					url = $(this).data('url'),
					name = $(this).data('name');
				
				localStorage.setItem('dataInfo', '{"id": "'+ id +'", "url": "'+ url +'", "name": "'+ name +'"}');
				location.href = './detail.html';
				
			});
		},
		// imgError
		imgError: function(o) {
			o.src = '/cat/resource/img/holder.png';
		},
		// loading
		loading: function() {
			
		},
		// detail
		detail: function() {
			
			// get frame url
			var dataInfo = JSON.parse(localStorage.getItem('dataInfo'));
			
			if(dataInfo.name == '杭州中卫中医肿瘤医院康复诊疗中心') {
				url = './1.html';
			} else {
				url = './2.html';
			}
			$.ajax({
				   type: "get",
				   url: url,
				   before: function() {
					   $('body').append('<div class="u-loading"></div>');
				   },
				   success: function(data){
				   		console.log(data);
						$('#j_detail').html(data);
						$('img').css({'width': '100%'});
						
				   },
				   complete: function(){
					   $('.u-loading').remove();
				   }
				});	

		},
		// order
		order: function() {
			var dataInfo = JSON.parse(localStorage.getItem('dataInfo'));
			$('#j_name_hospital').html(dataInfo.name);
			// submit
			$(document).on('click', function(e) {
				var tar = e.target;
				var disabled = $(tar).hasClass('btn-disabled');
				if(tar.id == 'j_submit' && !disabled) {
					var name = $('#j_name').val(),
						tel = $('#j_tel').val();
						reg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|176|177)\d{8}$/;
					if(name == '') {
						Do('layer', function() {
							layer.open({
							    btn: ['确认'],
							    content:'<p class="f-tc">请填写姓名~</p>'
							    
							});
						});
						return;
					} else if(name.length > 16) {
						Do('layer', function() {
							layer.open({
							    btn: ['确认'],
							    content:'<p class="f-tc">姓名最大长度不能超过16个字符！</p>'
							    
							});
						});
						return;
					} else if(tel == '' || !reg.test(tel)) {
						Do('layer', function() {
							layer.open({
							    btn: ['确认'],
							    content:'<p class="f-tc">请填写正确的手机号码~</p>'
							    
							});
						});
						return;
					} else {
						var hospitalId = dataInfo.id;
						var userName = name;
						var userTel = tel;
						$.ajax({
							   type: "post",
							   url: '/zlyy/srv/mobapp/heaalth/center/public/save/appointment.spr?request_alg=none&response_alg=none',
							   data: JSON.stringify({'body':{'hospitalId': hospitalId, 'userName': userName, 'userTel': userTel}}),
							   success: function(data){
							   		//console.log(data);
									if(data.result == '000') {
										$(tar).addClass('btn-disabled');
										Do('layer', function() {
											layer.open({
											    btn: ['确认'],
											    content:'<p class="f-tc" style="width:15rem">您的预约已提交，我们会在48小时内与您联系确认。</p>',
											    yes: function() {
											    	history.go(-1);
											    }
											    
											});
										});
									} else {
										Do('layer', function() {
											layer.open({
											    btn: ['确认'],
											    content:'<p class="f-tc">您的预约提交失败，请重新提交。</p>'
											    
											});
										});
									}
									
							   }
							});	
					}
				}
			});
		}

	};
	APP.recovery.init();
});