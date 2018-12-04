var reportId = GetQueryString("reportId");
var openId = GetQueryString('openId');
var userId = GetQueryString("userId");
var userOropen = userId;
if(userId == null || userId == ''){
	userOropen = openId;
};
var edition=GetQueryString("edition");
if(edition==null){
	edition = '';
};
/*扫码转增优惠券用  带userId*/
var voucherId = GetQueryString("voucherId"); //优惠券id
var customerId = GetQueryString("customerId"); //转增人id
/*扫码获得优惠券用 带userId*/
var spreadUserId = GetQueryString("spreadUserId");  //优惠券发券人ID
var ruleId = GetQueryString("ruleId");  //规则ID
//埋点 t
zhuge.track('进入注册页面', {
	'openId' : openId,
	'渠道' : '微信'
});

$('#age').blur(function(){
	setTimeout(function() {	
		const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;  //解决微信浏览器键盘收回页面下不来的问题
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));  //解决微信浏览器键盘收回页面下不来的问题

		var age = parseInt($('#age').val());
		if(age < 18 || age >80 ||  isNaN(age)){
			showMask('请输入18到80之间的有效年龄');
			return;
		}
	}, 100);
	
});

//点击获取短信验证码
$('#sendMsg').on("click",function(){
	//手机号校验
	var mobile = $('#mobile').val();
	if(!(/^1[3456789]\d{9}$/.test(mobile))){ 
		showMask('请输入正确的手机号码');
		return false;
	}else{
		$(this).attr("disabled",true);
		$.ajax({
			url : dataUrl + "/api/v1/messageCode/getCode",
			type : "post",
			dataType : 'json',
	        data : {
	        	userId: userOropen
	        },
			success : function(codeData) {
				if(codeData.code == 200){
					$('#getCode').val(codeData.data);
					getYzm();
				}else{
					showMask('获取短信码失败 getCode code='+codeData.code);
					$("#sendMsg").attr("disabled",false)
				}
			},
			error: function(){
				alert('获取短信码 getCode error'); $("#sendMsg").attr("disabled",false)
			}
		});  
	}	
});

function getYzm(){
	var yzmVal = $('#getCode').val();
	var mobile = $('#mobile').val();
	var userInfo = {
		mobile : mobile,
		code : yzmVal,
		userId : userOropen
	};
	$.ajax({
		url : dataUrl + "/api/v1/messageCode/kjSendMsg",
		type : "post",
		dataType : 'json',
        data : userInfo,
		success : function(userData){
			if(userData.code == 200){
				console.log('发送短信成功');
				time($("#sendMsg"));
			}else if(userData.code == 300){
				showMask('发送短信验证码失败');
				$("#sendMsg").attr("disabled",false);
			}else{
				showMask('发送短信失败的code ' + userData.code);
				$("#sendMsg").attr("disabled",false);
			}
		},
		error : function(){alert('kjSendMsg error')}
	});
};

$('#dxYzm').on("change focus keyup keypress propertychange oninput",function(){ 
	var dxYzm = $('#dxYzm').val();
	if(dxYzm != ''){
		$('#nextAll').removeClass('off').attr("disabled",false);
	}else{
		$('#nextAll').addClass('off').attr("disabled",true);
	}
});
$('#dxYzm , #mobile').blur(function(){
	setTimeout(function() {	
		const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;  //解决微信浏览器键盘收回页面下不来的问题
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));  //解决微信浏览器键盘收回页面下不来的问题
	}, 100);
});

$('#nextAll').on("click",function(){
	var age = parseInt($('#age').val());
	if(age < 18 || age >80 ||  isNaN(age)){
		showMask('请输入18到80之间的有效年龄');
		return;
	}else{
		$('.v_overlay').css({"visibility":"visible","opacity":"1"});
		$('#showNotice').css({"visibility":"visible","opacity":"1"});
	}
});

$('.tongyifo span').on("click",function(){
	$(this).addClass('on').siblings().removeClass('on');
	var tongyifo = $(this).index();
	if(tongyifo ==0){
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
	}else if(tongyifo ==1){	
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});		
		var age = parseInt($('#age').val());
		var mobile = $('#mobile').val();
		var dxYzm = $.trim($('#dxYzm').val());
		var checkCode = '';
		if(userId == null || userId == ''){
			creatUser(mobile,age,dxYzm,checkCode)
		}else{
			subAll(mobile,age,dxYzm,checkCode)
		}
	}
});

//完善用户
function subAll(mobile,age,dxYzm,checkCode){
	var userInfo = {
		mobile : mobile,
		age : age,
		userId : userId,
		height : parseInt($('#_height').val()),
		weight : parseInt($('#_weight').val()),
		nickName : $('#nickName').val(),
		relatedNo : $('#relatedNo').val(),
		idCardNo : $('#identity').val(),
		openId : openId
	}
	$.ajax({
		url : dataUrl + "/api/v1/reportUser/perfectUserInfo?code="+dxYzm+"&checkCode="+checkCode,
		type : "post",
		dataType : 'json',
		contentType : 'application/json',
        data : JSON.stringify(userInfo),
		success : function(userData) {
			console.log('请求完善用户接口');
			if(userData.code == 200){
				//判断是否是通过优惠券扫码过来
				if(voucherId != null && voucherId != '' && voucherId!='null'){
					turnCouponByWeChat(mobile) //转增优惠券接口
				}else if(spreadUserId){
					SendCouponByFlushQR(mobile) //扫码得优惠券接口 一码多用
				}else{
					zhuge.identify(mobile, { //埋点 i  完善用户信息
						'用户id': userId,
						'openId': openId
					});
					zhuge.track('完善用户信息注册成功', { //埋点 t   完善用户信息注册成功 然后跳转
						'用户id': userId,
						'openId': openId,
						'渠道' : '微信'
					},function(){
						if(edition == 100){
							window.location.href="fund/index.html?reportId="+reportId + "&openId=" + openId;
						}else{
							window.location.href="index"+edition+".html?reportId="+reportId + "&openId=" + openId;
						}
					});
				}	
			}else if(userData.code == 1003){
				showFirm('该手机号已被绑定');
				$('#Firm .psub a').on("click",function(){
					var oindex = $(this).index();
					closeMask();
					if(oindex == 1){ //创建新用户
						subAll(mobile,age,dxYzm,'CNU')
					}else{ //更新用户信息
						subAll(mobile,age,dxYzm,'UOY')
					}
				});		
			}else if(userData.code == 303){
				showMask('验证码错误');
			}else{
				zhuge.track('注册失败，查看验证码是否有误', { //埋点 t 注册失败
					'用户id': userId,
					'openId': openId,
					'渠道' : '微信'
				});
				showMask('登录失败  perfectUserInfo code='+userData.code);
				//$(this).attr("disabled",false);
			}	
		},
		error : function(){alert('perfectUserInfo error')}
	})
};
//创建用户
function creatUser(mobile,age,dxYzm,checkCode){
	var userInfo = {
		mobile : mobile,
		age : age,
		height : parseInt($('#_height').val()),
		weight : parseInt($('#_weight').val()),
		nickName : $('#nickName').val(),
		relatedNo : $('#relatedNo').val(),
		idCardNo : $('#identity').val(),
		openId : openId
	}
	$.ajax({
		url : dataUrl + "/api/v1/reportUser/createUserBySmsCode?code="+dxYzm+"&checkCode="+checkCode,
		type : "post",
		dataType : 'json',
		contentType : 'application/json',
        data : JSON.stringify(userInfo),
		success : function(userData) {
			console.log('请求创建用户接口');
			if(userData.code == 200){
				zhuge.identify(mobile, { //埋点 i  完善用户信息
					'用户id': userId,
					'openId': openId
				});
				zhuge.track('创建用户 注册成功', { //埋点 t   创建用户 注册成功 然后跳转
					'用户id': userId,
					'openId': openId,
					'渠道' : '微信'
				},function(){
					if(edition == 100){
						window.location.href="fund/index.html?reportId="+reportId + "&openId=" + openId;
					}else{
						window.location.href="index"+edition+".html?reportId="+reportId + "&openId=" + openId;
					}
				});
			}else if(userData.code == 1003){
				showFirm('该手机号已被绑定');
				$('#Firm .psub a').on("click",function(){
					var oindex = $(this).index();
					closeMask();
					if(oindex == 1){ //创建新用户
						creatUser(mobile,age,dxYzm,'CNU')
					}else{ //更新用户信息
						creatUser(mobile,age,dxYzm,'UOY')
					}
				});	
			}else if(userData.code == 303){
				showMask('验证码错误');
			}else{
				zhuge.track('注册失败，查看验证码是否有误', { //埋点 t 注册失败
					'用户id': userId,
					'openId': openId,
					'渠道' : '微信'
				});
				showMask('登录失败  createUserBySmsCode code='+userData.code);
				//$(this).attr("disabled",false);
			}	
		},
		error : function(){alert('createUserBySmsCode error')}
	})
}

//转增优惠券接口
function turnCouponByWeChat(mobile){
	$.ajax({
		url: couponData+ '/vi/send/coupon/turnCouponByWeChat',
		type: "post",
		dataType :'json',
		data : {
		   	voucherId : voucherId,
		   	customerId : customerId,
		   	openId : openId
		},
		success : function(data){
			//埋点 i  通过扫描优惠券注册
			zhuge.identify(mobile, {
				'用户id': userId,
				'openId': openId
			});
			//埋点 t   通过扫描优惠券注册成功 然后跳转
			zhuge.track('通过扫描优惠券注册成功', {
				'用户id': userId,
				'openId': openId,
				'渠道' : '微信'
			},function(){
				window.location.href="couponList.html?userId="+userId+ "&code=" + data.code;
			});
		},
		error:function(){alert('turnCouponByWeChat error')}
	});
}

//扫码获得优惠券接口 一码多用
function SendCouponByFlushQR(mobile){
	$.ajax({
		url: couponData+ '/vi/send/coupon/SendCouponByFlushQR',
		type: "post",
		dataType :'json',
		data : {
		   	spreadUserId : spreadUserId,
		   	ruleId : ruleId,
		   	userId : userId
		},
		success : function(data){
			//埋点 i  通过扫描优惠券注册
			zhuge.identify(mobile, {
				'用户id': userId,
				'openId': openId
			});
			//埋点 t 通过扫描优惠券注册成功 然后跳转
			zhuge.track('通过扫描优惠券注册成功', {
				'用户id': userId,
				'openId': openId,
				'渠道' : '微信'
			},function(){
				window.location.href="couponList.html?userId="+userId+ "&code=" + data.code;
			});
		},
		error:function(){alert('SendCouponByFlushQR error')}
	});
}

//倒计时读秒
var wait=60;
function time(tm){
	if(wait==0){
		tm.removeAttr("disabled",false);
		tm.text('获取验证码');
		wait=60;
		tm.css({"color":"#1ebeb1","border":"#1ebeb1 solid .02rem"}); //控制样式
	}else{
		tm.css({"color":"#999","border":"#999 solid .02rem"}); //控制样式
		tm.attr("disabled",true);
		tm.text(wait + "秒后重新发送")
		wait--;
		setTimeout(function(){time(tm);},1000);
	}
};

const windowHeightSize = String(document.documentElement.clientHeight || document.body.clientHeight );
if (!(localStorage.getItem('windowHeight'))) {
  localStorage.setItem('windowHeight' , windowHeightSize);
}
const historyWindowHeight = Number(localStorage.getItem('windowHeight'));
console.log('缓存 列表最小高度' + historyWindowHeight);
$('body').css('min-height', historyWindowHeight);



//弹窗 模拟alert
function showMask(msg){
	$('body').css("min-height",historyWindowHeight);
	setTimeout(function(){
		$('.tc-qx').each(function(){
			var w_height = $(window).height();
			var this_height = $(this).height();
			$(this).css("top",(w_height-this_height)/2);
		});
		$('.modal-overlay').css({"visibility":"visible","opacity":"1"});
		$('#alert').css({"visibility":"visible","opacity":"1"});
		$('#alert .pc1').empty().text(msg);
		$('#alert .subBtn').click(function(){closeMask()});
	},20)
	
}//showMask('哈哈哈哈');
function showFirm(msg){
	$('body').css("min-height",historyWindowHeight);
	setTimeout(function(){
		$('.tc-qx').each(function(){
			var w_height = $(window).height();
			var this_height = $(this).height();
			$(this).css("top",(w_height-this_height)/2);
		});
		$('.modal-overlay').css({"visibility":"visible","opacity":"1"});
		$('#Firm').css({"visibility":"visible","opacity":"1"});
		$('#Firm .pc1').empty().text(msg);
	},20)		
}
function closeMask(){
	$('body').css({"position":"static"});
	$('.modal-overlay').css({"visibility":"hidden","opacity":"0"});
	$('.tc-qx').css({"visibility":"hidden","opacity":"0"});
}
//截取URL 获取
function GetQueryString(name){
     var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};