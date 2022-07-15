var companyId = getQueryString('companyId');
var suiteId = getQueryString('suiteId');
var code = getQueryString('code');
// var state = getQueryString('state');
var localUrl = window.location.href;
var app = new Vue({
	el: '#app',
	data: function(){
		return{
			showLoading: true,
			showNotfund:false,
			userId:'',
			getSignature_sta:'',
			getAgentSignature_sta:'no contact',
			agentConfigParams:'',
			
			sta1:'s1',
			sta2:'s2',
			sta3:'s3',
			sta4:'s4',
			errSta:'',
			queryByExternalUserid_sta:'',
		}
	},
	methods:{
		//获取访问用户身份-根据CODE
		getUserinfo3rd: function(){
			var vm = this;
			$.ajax({
				type: "post",
				url: qywx+'/qw/auth/getUserinfo3rd/ww3bbdf70367551c6e',
				dataType: "Json",
				data:{
					code: code,
					suiteId:suiteId
				},
				success: function(){
					
				},
				error: function(){}
			});
		},
		getSignature: function(){
			var vm = this;
			$.ajax({
				type:"post",
				url: qywx+"/qw/h5/signature",
				dataType:"Json",
				data:{
					companyId: companyId,
					reqUrl: localUrl,
					type: "1"
				},
				success: function(res){
					vm.sta1 = 'd1'
					vm.agentConfigParams = 'appId='+res.data.appId+' timestamp='+res.data.timestamp+' nonceStr='+res.data.nonceStr+' signature='+res.data.signature+' url='+localUrl;
					wx.config({
							beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
							debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: res.data.appId, // 必填，企业微信的corpID
							timestamp: res.data.timestamp, // 必填，生成签名的时间戳
							nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
							signature: res.data.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
							jsApiList: ['getContext','getCurExternalContact','agentConfig'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
					});
					wx.ready(function(res){
						console.log('wx.ready ok')
						//vm.getAgentSignature();
							// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
					});
					wx.error(function(res){
						vm.errSta ='e3'
						console.log('wx.error '+res)
							// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
					});
					
					wx.checkJsApi({
							jsApiList: ['getContext','getCurExternalContact','agentConfig'], // 需要检测的JS接口列表
							success: function(res) {
									// 以键值对的形式返回，可用的api值true，不可用为false
									// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
							}
					});
				},
				error: function(obj,msg){
					this.getSignature_sta = 'error'
				}
			});
		},
		getAgentSignature: function(){
			var vm = this;
			vm.sta2 = 'd2'
			$.ajax({
				type:"post",
				url: qywx+"/qw/h5/signature",
				dataType:"Json",
				data:{
					companyId: companyId,
					reqUrl: localUrl,
					type: "2"
				},
				success: function(res){
					vm.agentConfigParams = 'agentid='+res.data.agentId + 'appId='+res.data.appId+' timestamp='+res.data.timestamp+' nonceStr='+res.data.nonceStr+' signature='+res.data.signature+' url='+localUrl;
					//alert('agentid='+res.data.agentId + 'appId='+res.data.appId+' timestamp='+res.data.timestamp+' nonceStr='+res.data.nonceStr+' signature='+res.data.signature+' url='+localUrl);
					vm.sta3 = 'd3';
					wx.agentConfig({
						corpid: res.data.appId, // 必填，企业微信的corpid，必须与当前登录的企业一致
						agentid: res.data.agentId, // 必填，企业微信的应用id （e.g. 1000247）
						timestamp: res.data.timestamp, // 必填，生成签名的时间戳
						nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
						signature: res.data.signature,// 必填，签名，见附录-JS-SDK使用权限签名算法
						jsApiList: ['getCurExternalContact'], //必填，传入需要使用的接口名称
						success: function() {
							vm.sta4 = 'd4'
							wx.invoke('getCurExternalContact', {}, function(cures){
									if(cures.err_msg == "getCurExternalContact:ok"){
											vm.userId  = cures.userId ; //返回当前外部联系人userId
											//alert(vm.userId)
											vm.queryByExternalUserId(cures.userId);
									}else {
											//错误处理
									}
							});
							// 回调
						},
						fail: function(res) {
							vm.errSta = ' agentConfig fail'
							if(res.errMsg.indexOf('function not exist') > -1){
									alert('版本过低请升级')
							}
						}
					});
				},
				error: function(){
					this.getAgentSignature_sta = "error"
				}
			});
		},
		queryByExternalUserId: function(id){
			var vm = this;
			$.ajax({
				type: "post",
				url: quanpinUrl+ "/measured/queryByExternalUserId",   
				dataType:"Json",
				data:{
					externalUserId: id,
					companyId: companyId,
				},
				success: function(res){
					//alert(res.code);
					//alert(res.result);
					if(res.code == 200){
						//location.href = "http:"+testHealthUrl+ "/aijiankangshi/qw_historylist.html?customId="+res.result+"&companyId="+companyId+"&shareUrl=1"+'&externalUserid='+id
						location.href = "http:"+testHealthUrl+ "/jiankangshi/qw_historylist.html?customId="+res.result+"&companyId="+companyId+"&shareUrl=1"+'&externalUserid='+id
					}else{
						//vm.queryByExternalUserid_sta = 'code !=200';
						vm.queryByExternalUserid_sta = res.code;
						vm.showNotfund = true;
						vm.showLoading = false;
						//alert('找不到该用户');
					}
				},
				error: function(){
					vm.queryByExternalUserid_sta = 'error'
				}
			});
		},
	},
	mounted: function(){
		/* if(suiteId && code){
			this.getUserinfo3rd();
		}else{
			this.getAgentSignature();
		} */
		this.getAgentSignature();
		
		//this.getSignature()
	},
})