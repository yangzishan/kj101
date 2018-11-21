//截取URL 获取
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
};
var indexUrl = window.location.href;
var myreportId=GetQueryString("reportId");
var mypackageId=GetQueryString("packageId");
var myuserId=GetQueryString("userId");
var myopenId=GetQueryString("openId");
var orderNum=GetQueryString("orderNum");
var payChannelId=GetQueryString("payChannelId");
var payChannelType=GetQueryString("payChannelType");  //1微信 7招行一网通
if(payChannelType == 1){
	var payTypeName = '微信支付'
}else if(payChannelType == 7){
	var payTypeName = '一网通支付'
}else{
	var payTypeName = '支付'
};

var tp=GetQueryString("tp");  //判断kj201
var edition=GetQueryString("edition"); //判断用哪一版页面显示首页
if(edition==null){
	edition = '';
};
var myurl = window.location;
var useurl = decodeURI(myurl);
var start =useurl.indexOf('name=');
var stop =useurl.indexOf('&',start);
var myname = useurl.substring(start+5,stop);
var myprice=GetQueryString("price");
var myApp = new Vue({
  el: '#appVUE',
  data: {
  	name: myname, 
    price: myprice,
    payTypeName: payTypeName
    
  }
});
var voucherId = '';
//点击支付
$(document).on("click","#goWxPay",function(){
	//alert('go');
	var truePrice = $('#subprice').text();
	$(this).attr("disabled",true);  //新加防呆
		$.ajax({
	    url:channel + "/pay/v1/channel/payOrder",
	    type : "POST",
		dataType : 'json',
		data : {
		    attach : myopenId, 
		    orderNum : orderNum,
		    payChannelId : payChannelId,
		    payPrice : truePrice,
		    userId : myuserId,
		    voucherId: 0
		},
	    success : function(result) {
	    	if(payChannelType == 1){ //weixin
	    		if(result.code == 0) {
		            WeixinJSBridge.invoke('getBrandWCPayRequest',{  
		                "appId" : result.result.appId,              //公众号名称，由商户传入  
		                "timeStamp": result.result.timeStamp,       //时间戳，自 1970 年以来的秒数  
		                "nonceStr" : result.result.nonceStr,        //随机串  
		                "package" : result.result.package,          //商品包信息 
		                "signType" : result.result.signType,       //微信签名方式
		                "paySign" : result.result.sign            //微信签名  
		                },function(res){
		                	//debugger;
		                    if(res.err_msg == "get_brand_wcpay_request:ok" ) { //支付成功
		                    	
		                    	if(tp == 201){
			                		window.location.href=bit_testHealthUrl + "/index.html?reportId="+myreportId + '&openId=' + myopenId;
			                	}else{
			                		if(edition == 100){
			                			window.location.href="fund/index.html?reportId="+myreportId + '&openId=' + myopenId;
			                		}else{
			                			window.location.href="index"+edition+".html?reportId="+myreportId + '&openId=' + myopenId;
			                		}
			                	}
		                        // 支付成功回调
		                        /*$.ajax({
		                        	//async: false,
					                url:dataUrl + "/api/v1/reportWxPay/successCallback",
					              	type : "POST",
					              	dataType : 'json',
									data : {
									    orderNum : orderNum, 
									    voucherId: voucherId
									},
					                success : function(payreuslt) {
					                	if(tp == 201){
					                		window.location.href=bit_testHealthUrl + "/index.html?reportId="+myreportId + '&openId=' + myopenId;
					                	}else{
					                		if(edition == 100){
					                			window.location.href="fund/index.html?reportId="+myreportId + '&openId=' + myopenId;
					                		}else{
					                			window.location.href="index"+edition+".html?reportId="+myreportId + '&openId=' + myopenId;
					                		}
					                	}
					                },
					                error:function(){alert('successCallback error');}
		                       	});*/
		                       	
		                       	/////////
		                    }else if (res.err_msg == "get_brand_wcpay_request:cancel") {
								alert("支付取消");
								$('#goWxPay').attr("disabled",false);  //新加防呆
							}else if (res.err_msg == "get_brand_wcpay_request:fail") {
								alert("支付失败："+res.err_desc);
								$('.wxpay .dtit i').addClass('fail');
								$('.wxpay .dtit span').html('支付失败');
								$('#goWxPay').attr("disabled",false);  //新加防呆
							}
		                }
		            ); 
		        }else{
		            alert(result.msg);
		            $('#goWxPay').attr("disabled",false);  //新加防呆
		        }
	    	///////////
	    	}else if(payChannelType == 7){ //yiwangtong
	    		if(result.code ==0){
	    			//一网通支付操作
	    			var form = document.getElementById('ywt');
	    			form.action = result.url;
	    			var _val = result.result;
	    			$('#ywtVal').val(_val);
	    			form.submit();
	    		}
	    	//////////
	    	}
	    	
		    	
	    }
	});
});

//判断优惠卷是否可用,返回有效期最短的优惠券
$.ajax({
	url : couponData + "/v1/use/coupon/isUsableByCustomerIdAndNeId",
    type : "POST",
	dataType : 'json',
	data : {
	    inspectCode : myreportId, //报告ID
	    customerId : myuserId
	},
	success: function(data){
		//alert('yhq');
		var discount=0;
		if(data.data == null || data.data == ''){
			$('#usecoupon').css("display","none");
		}else{
			$('#xgj').text('小计');
			$('#usecoupon').css("display","block");
			if(data.data.discountType == 1){
				discount = data.data.discountNum;
			}else if(data.data.discountType == 2){
				discount = myprice-(myprice*data.data.discountNum)
			};
			voucherId = data.data.voucherId;
			$('#discount').text('￥-'+ discount);
			$('#subprice').text((myprice-discount).toFixed(2));
		};
	},
	error: function(){
		console.log('查询可用优惠券出错');
	}
});

//再次进去页面判断调取接口判断报告是否是已经支付
$.ajax({
	url : dataUrl + "/api/v1/reportWxPay/findPackage",
    type : "POST",
	dataType : 'json',
	data : {
	    reportId : myreportId, 
	    openId : myopenId
	},
	success: function(data){
		if(data.code == 200){
			if(edition == 100){
    			window.location.href="fund/index.html?reportId="+myreportId + '&openId=' + myopenId;
    		}else{
    			window.location.href="index"+edition+".html?reportId="+myreportId + '&openId=' + myopenId;
    		}
		}
	}
});
