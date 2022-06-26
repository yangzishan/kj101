var JsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();  //获取系统语言
if(JsSrc.indexOf('zh')>=0){
	var language = zh;
	var languageStr = 'zh';
}else if(JsSrc.indexOf('en')>=0){
    var language = en;
    var languageStr = 'en';
    document.title = 'Pay'
}else{
	var language = en;
    var languageStr = 'en';
    document.title = 'Pay'
};

var saasId=getQueryString("saasId");
var reportId=getQueryString("reportId");
var reportType=getQueryString("reportType"); //版本 新
var packageId=getQueryString("packageId");
var userId=getQueryString("userId");
var openId=getQueryString("openId");
var orderNum=getQueryString("orderNum");
var payChannelId=getQueryString("payChannelId");
var payChannelType=getQueryString("payChannelType");  //1微信 7招行一网通
var relationUrl=(getQueryString("relationUrl") || '');  //是否跳转关联

if(payChannelType == 1){
	var payTypeName = '微信支付'
}else if(payChannelType == 7){
	var payTypeName = '一网通支付'
}else{
	var payTypeName = '支付'
};
var tp=getQueryString("tp");  //判断kj201

var myurl = window.location;
var useurl = decodeURI(myurl);
var start =useurl.indexOf('name=');
var stop =useurl.indexOf('&',start);
var myname = useurl.substring(start+5,stop);
var myApp = new Vue({
  	el: '#appVUE',
  	data: function(){
  		return{
  			saasId:saasId,
  			reportId: reportId,
  			reportType: reportType,
  			openId: openId,
  			userId: userId,
  			packageId: packageId,
  			orderNum: orderNum,
  			payChannelId: payChannelId,
  			payChannelType: payChannelType,
	  		name: myname, 
		    price: 0,
		    payTypeName: payTypeName,
				subprice: 0,
				language: language,
				paymentGoodsPayOrder:{} //订单信息
  		}
  	},
  	methods:{
			getdataInfo: function(){
				this.paymentGoodsPayOrder = JSON.parse(sessionStorage.getItem("paymentGoodsPayOrder"));
				this.price = this.paymentGoodsPayOrder.orderPrice
				this.subprice = this.paymentGoodsPayOrder.orderPrice
			},
  		//爱展业报告数据推送 支付成功后调用
  		azySendReportSaas: function(){
  			var vm = this;
				$.ajax({
					type:"post",
					url:dataUrl+"/weiXin/azySendReportSaas",
					dataType:'Json',
					data:{
						saasId:vm.saasId,
						reportId: vm.reportId
					},
					success: function(res){
						if(res.code == "200"){
							console.log('success')
						}
					},
					error: function(){console.log('azySendReportSaas error')}
				});
  		},
  		//查看报告来源
			getReportSource: function(){
				var vm = this;
				$.ajax({
					type:"post",
					url:dataUrl+"/api/v1/report/getReportSource",
					dataType:'Json',
					data:{
						reportCode: reportId
					},
					success: function(res){
						if(res.code == "200"){
							if(relationUrl){
								location.href = "relationUrl.html?relationUrl="+relationUrl
							}else{
								if(res.data == 5){ //金管家 5
									location.href = "jinguanjia.html"
								}else{
									vm.goReport(reportId,'',userId,openId,saasId,'')
								}
							}
						}
					},
					error: function(){console.log('getReportSource error')}
				});
			},
  		
  		//更新SaaS用户最近一份报告ID
  		updateCustomerSaas: function(){
  			var vm = this;
  			$.ajax({
  				type:"post",
  				url: dataUrl+"/api/v1/ne/updateCustomerSaas",
  				dataType : 'json',
  				data:{
  					saasId: saasId,
  					openId: openId,
  					reportId: reportId
  				},
  				success: function(res){
  					vm.getReportSource();
  					console.log(res);
  				},
  				error: function(){
  					alert('updateCustomerSaas error');
  					vm.getReportSource();
  				}
  			});
  		},
  		// 根据报告id获取openId
  		getOpenIdByReportId: function() {
  			var vm = this;
  			$.ajax({
  				type:"post",
  				url: dataUrl+"/api/v1/neUnLock/getOpenIdByReportId",
  				dataType : 'json',
  				data:{
  					reportId: reportId
  				},
  				success: function(res){
					if(res.code == 200){
						if(!openId){
							vm.openId = res.data
						}
					}
  				},
  				error: function(){
  					console.log('getOpenIdByReportId error');
  				}
  			});
  		},
  		gotoPay: function(e){ //点击支付
  			zhuge.track('订单提交页面支付按钮点击', { //埋点t
					'提交方式': '微信/一网通',
				});
  			var vm = this;
			//$(e.target).attr("disabled",true);//新加防呆
				$.ajax({
			    url:channel + "/pay/v1/commodity/payOrder",
			    type : "POST",
					dataType : 'json',
					data : {
							attach : vm.openId, 
							//attach : 'oDOut0aocy2VoHhsO3FmQHtsbFW4', 
							orderNum : this.paymentGoodsPayOrder.orderNum,
							payChannelId : payChannelId,
							payPrice : vm.price,
							userId : userId
					},
			    success : function(result) {
			    	if(result.code == 0){
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
					                    	zhuge.track('支付成功', {
																	'方式': '微信'
																},function(){
																	location.href = "cardOrderDetail.html?orderId="+vm.paymentGoodsPayOrder.orderId
																	//vm.updateCustomerSaas()
																	//vm.azySendReportSaas() //改后台调用
																});
					                    }else if (res.err_msg == "get_brand_wcpay_request:cancel") {
																alert("支付取消");
																zhuge.track('支付取消', {
																	'方式': '微信'
																});
																$('#goWxPay').attr("disabled",false);  //新加防呆
															}else if (res.err_msg == "get_brand_wcpay_request:fail") {
																alert("支付失败："+res.err_desc);
																zhuge.track('支付失败', {
																	'方式': '微信'
																});
																$('.wxpay .dtit i').addClass('fail');
																$('.wxpay .dtit span').html('支付失败');
																$('#goWxPay').attr("disabled",false);  //新加防呆
															}else{
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
				    		}else{
				    			alert(result.msg);
				    		}
				    	//////////
				    	}else if(payChannelType == 12){ //微信-H5 支付
				    		if(result.code ==0){
				    			window.location.href = result.mweb_url
				    		}else{
				    			alert(result.msg);
				    		}
				    	}else if(payChannelType == 8){  //天津农商行
				    		location.href = result.result
				    	}
			    	}else{
			    		alert('payOrder code='+result.code+result.msg)
			    	}
				    	
			    },
			    error: function(){alert('payOrder error');$('#goWxPay').attr("disabled",false);}
			});	
  		},
  		findPackage: function(){ //再次进去页面判断调取接口判断报告是否是已经支付
  			var vm = this;
				$.ajax({
					url : dataUrl + "/api/v1/reportWxPay/findPackage",
						type : "POST",
					dataType : 'json',
					data : {
							reportId : reportId, 
							openId : openId
					},
					success: function(data){
						if(data.code == 200){
							if(reportType == 121 || reportType == 122 || reportType == 12001 || reportType == 123){
								location.href='report120.html?reportId='+reportId+'&userId='+userId+'&reportType='+reportType+'&openId='+openId+'&saasId='+saasId
							}else if(reportType == 501 || reportType == 502 || reportType == 5021 || reportType == 505 || reportType == 503){
								location.href='report500.html?reportId='+reportId+'&userId='+userId+'&reportType='+reportType+'&openId='+openId+'&saasId='+saasId
							}else{
								location.href='report'+reportType+'.html?reportId='+reportId+'&userId='+userId+'&reportType='+reportType+'&openId='+openId+'&saasId='+saasId
							}
						}
					}
				});
  		},
  		//跳转报告逻辑
  		goReport: function(report,sendCustom,user,open,saas,language){
			var vm = this;
			$.ajax({
				type:"post",
				url:dataUrl + "/api/v1/reportIndex/analysisReportFace",
				dataType:"json",
				data:{
					reportId: report,
					sendCustomerId: sendCustom,
					customerId: user,
					openId: open,
					saasId: saas,
					language: language
				},
				success:function(res){
					if(res.code == 200){
						var visible = res.data.visible; //是否可查看 0不可查看
						var reportType = res.data.reportType;
						var source = res.data.source; //来源
						var reportSource = res.data.reportSource //来源 （判断金管家 5）
						var reportUrl = '?reportId='+report+'&userId='+res.data.customerId+'&openId='+open+"&reportType="+reportType+'&saasId='+saas+'&source='+source+'&reportSource='+reportSource;
						if(visible == 0){
							$('.v_overlay').css({"visibility":"visible","opacity":"1"});
							$('.daifu_d').css("display","block");	
							$('.daifu_d .tit').text('亲，您目前无法查看该份报告，请您联系你的业务员');
							$('.daifu_d .tip').remove();
							$('#iknow').click(function(){
								$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
								$('.daifu_d').css("display","none");
							});
						}else{
							//志农谷支付后 跳转下载引导页面
							if(reportSource == 9){
								location.href = "https://www.zngst.com/code/#/bgGuide"
								return
							}
							
							if(reportType == 121 || reportType == 122 || reportType == 12001 || reportType == 123){
							location.href = 'report120.html'+reportUrl
							}else if(reportType == 501 || reportType == 502 || reportType == 5021 || reportType == 505 || reportType == 503){
								location.href = 'report500.html'+reportUrl
							}else if(reportType < 5){
								location.href = 'report5.html'+reportUrl
							}else{
								location.href = 'report'+reportType+'.html'+reportUrl
							}
						}
					}else{
						console.log('analysisReportFace code='+res.code+' msg='+res.msg)
					}
				},
				error: function(){alert('analysisReportFace error')}
			});
		},
  		
  	},
  	mounted:function(){
  		//this.findPackage();
  		this.getOpenIdByReportId();
			this.getdataInfo();
  	}
});
//截取URL 获取
function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
};