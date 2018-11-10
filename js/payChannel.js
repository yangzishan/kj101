var reportId = getQueryString("reportId");
var openId = getQueryString("openId");
var sameUser = getQueryString("sameUser");
var edition = getQueryString("edition");
console.log(reportId);
console.log(openId);
console.log(sameUser);
console.log(edition);
$('.my_view').css("display","none");
$('.load-overlay').css("display","block");
var myApp = new Vue({
	 el: '#appVUE',
    data: function() {
		return {
			isShow:false,
			isActive:[],
			reportId:'',
			openId:'',
			sameUser:'',
			edition:'', //版本
			data:{},
			nickName:'',//昵称
			headimgurl:'',
			totalScore:'',//得分
			age:'',
			ranking:'', //排名
			ps:'',//身体状况
			name:'', //套餐名称
			packageId:'',
			price:'', 
			oprice:'', //原价
			description:'', //描述
			isFree: '',
			abnormalNo:'', //全部异常项总数
			litAbnormal:'', //轻度异常
			midAbnormal:'', //中度异常
			firstNames:'', //得分最低两个系统名字
			userId:'',
			userIdstr:'', //逗号分隔显示
			snNum:'', 
			orderNum:'',
			
		}
	},
	mounted: function() {
		//this.initial(),
		this.goLoad()
    },
	methods: {
		goLoad: function() {
			var _this = this 
			$.post(dataUrl + "/api/v1/reportWxPay/findPackage",
				{
					reportId: reportId,
					openId : openId
				},
				function (packageData) {
					if(packageData.code == 200){
						window.location.href="index"+edition+".html?reportId="+reportId+"&openId=" + openId;
					}else if(packageData.code == 201){
						$('.my_view').css("display","block");
						$('.load-overlay').css("display","none");
						_this.reportId = reportId,
						_this.openId = openId,
						_this.sameUser = sameUser,
						_this.edition = edition,
						_this.nickName = packageData.data.mentPage.nickName, //昵称
					  	_this.headimgurl = packageData.data.mentPage.headimgurl, //头像
					  	_this.totalScore = packageData.data.mentPage.totalScore, //总分
					  	_this.age = packageData.data.mentPage.age, //生理年龄
					  	_this.ranking = packageData.data.mentPage.ranking, //排名
					  	_this.ps = packageData.data.mentPage.ps, //身体状况
					  	_this.name = packageData.data.infoView.name, //套餐名称
					  	_this.packageId = packageData.data.infoView.packageId,
					  	_this.price = packageData.data.infoView.price,  //价格
					  	_this.oprice = packageData.data.infoView.originalPrice; //原价
					  	if(_this.oprice == '' || _this.oprice == null){
					  		_this.oprice = _this.price+20; //数据没有原价的情况
					  	};
					  	_this.description = packageData.data.infoView.description; //描述
					  	if(packageData.data.mentPage.abnormal != null && packageData.data.mentPage.abnormal!=''){
					  		_this.abnormalNo = packageData.data.mentPage.abnormal.list3.length+packageData.data.mentPage.abnormal.list2.length, //全部异常项目数
					  		_this.litAbnormal = packageData.data.mentPage.abnormal.list2.length,
					  		_this.midAbnormal = packageData.data.mentPage.abnormal.list3.length
					  	};
					  	_this.firstNames = packageData.data.mentPage.firstNames; //得分最低两个系统名字
					  	_this.userId = packageData.data.infoView.userId,
					  	_this.userIdstr = toThousands(packageData.data.infoView.userId),
					  	_this.isFree = packageData.data.infoView.isFree,
					  	_this.snNum = packageData.data.snNum;
					  	_this.orderNum = packageData.data.orderNum ? packageData.data.orderNum:'15392504132771282';
					  	
					  	//判断笑哭脸样式
						if(_this.ranking!=null && _this.ranking<50){
							$('.fix-tpp p .aa').removeClass('a1').addClass('a2');
						};
						if(packageData.data.infoView == null){
							$('#pay .sub').css("background","#CCCCCC");
						}else{
							if(_this.isFree == 1){
								$('.pay-x-fix .oprice').html('新用户首次免费');
								$('#pay .sub').html('查看');
								$('#pay').click(function(){
									if(edition == 100){
										window.location.href="fund/index.html?reportId="+reportId+"&openId="+openId;
									}else{
										window.location.href="index"+edition+".html?reportId="+reportId+"&openId="+openId;
									}
								});
							};
							//sameUser 1/2 是否显示卡支付 代付提醒
							if(_this.sameUser == 2){
								$('#kaPay').css("display","none");
								$('.v_overlay').css({"visibility":"visible","opacity":"1"});
								$('.daifu_d').css("display","block");
							}else{
								//判断用户有没有可用卡
								$.ajax({
									url : dataUrl + "/api/v1/cardPay/findUserCards",
									type : "POST",
									dataType : 'json',
									data : {
										reportId : reportId,
									   	userId : _this.userId
									},
									success : function(data) {
										//alert('查找用户可用卡');
										if(data.code == 200){
											var cards = data.data.List;
											if(cards == null || cards.length == 0 || cards == ''){
												$('#kaPay').css("display","none");
											};
										}else{
											console.log('查找用户可用支付卡 code= '+ data.code);
										}
									}
								});	
							};
							//查询支付通道
							$.ajax({
								url : channel + "/pay/v1/channel/getPayChannel",
								type : "get",
								dataType : 'json',
								data : {
									neNo : _this.snNum,
								   	terminalType : 1
								},
								success : function(data) {
									if(data.code ==0){
										_this.data = data.data
									}else{console.log('支付通道接口'+data.code)}
								},
								error : function(){alert('getPayChannel error')}
							});
							// 根据价格
							if(_this.price == 0){
								$('#pay').on("click",function(){
									$.ajax({
										url : dataUrl + "/api/v1/reportWxPay/updateFreeOrder",
										type : "post",
										dataType : 'json',
										data : {
										    reportId : reportId,
										    packageId: _this.packageId,
										    userId: _this.userId
										},
										success : function(data) {
											if(data.code==200){
												if(edition == 100){
													window.location.href="fund/index.html?reportId="+reportId+"&openId="+openId;
												}else{
													window.location.href="index"+edition+".html?reportId="+reportId+"&openId="+openId;
												}
											}else{
												alert('支付失败updateFreeOrder code='+data.code);
											}
										}
									})
								});
							}else{
								$('#pay').on("click",function(){
									//选择支付方式
									$('.v_overlay').css({"visibility":"visible","opacity":"1"});
									$('.sl-pay').css({"transform":"translateY(0%)"});
								});
							};
							//关闭 选择方式
							$('.close').click(function(){
								$('.v_overlay').css({"visibility":"hidden","opacity":"0"});$('.sl-pay').css({"transform":"translateY(110%)"});
							});
							//关闭 代付提醒
							$('#iknow').click(function(){
								$('.v_overlay').css({"visibility":"hidden","opacity":"0"});$('.daifu_d').css("display","none");
							});
							//支付跳转 +
							$('#WordPay').attr("href","wordPay.html?reportId="+reportId+"&userId="+_this.userId+"&packageId="+_this.packageId+'&openId='+ openId+"&edition="+edition);
							$('#kaPay').attr("href","selectTycard.html?reportId="+reportId+"&userId="+_this.userId+"&packageId="+_this.packageId+'&openId='+ openId+"&edition="+edition);
						
						}
					}else if(packageData.code == 1001 || packageData.code == 1002){
						$('.v_overlay').css({"visibility":"visible","opacity":"1"});
						$('.daifu_d').css("display","block");	
						$('.daifu_d .tit').text('亲，您的这份报告已经超过48小时未支付，请您再次检测');
						$('.daifu_d .tip').remove();
						$('#iknow').click(function(){
							WeixinJSBridge.call('closeWindow');
						});
					}else{console.log(packageData.msg)} //code 200 201之外
				}
			).error(function(){alert('findPackage error')})
		},
		hrefRouter:function(pay){
			if(pay.payChannelType == 3){
				window.location.href="wordPay.html?reportId="+reportId+"&userId="+this.userId+"&packageId="+this.packageId+'&openId='+ openId+"&edition="+edition
			}else{
				window.location.href='wxPay_new.html?reportId='+reportId+'&userId='+this.userId+
			'&packageId='+this.packageId+'&name='+this.name+'&price='+this.price+'&openId='+openId+
			'&edition='+edition+'&payChannelId='+pay.payChannelId+'&orderNum='+this.orderNum+'&payChannelType='+pay.payChannelType
			}
		}

	}
});
//获取url参数方法
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}
//逗号分隔数字
function toThousands(num) {
     return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};
