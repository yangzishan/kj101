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
	 el: '.my_view',
    data: function() {
		return {
			userState:'',
			isShow:false,
			isActive:[],
			reportId:'', openId:'', sameUser:'', edition:'', //版本
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
			day:'',
			baseInfo:'',
			ablive1:'', ablive2:'',
			reportAdd:'',
			reportDel:'',
			notStr:'新增' , //为改善 新增称呼
			firstlist:'',
			easysize: '', hardsize: '',   //新用户风险指标数目
			doctor:'',
		}
	},
	mounted: function() {
		this.goLoad()
		this.participate(reportId)
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
						if(edition == 100){ //福利基金
							window.location.href="fund/index.html?reportId="+reportId+"&openId=" + openId;
						}else{
							window.location.href="index"+edition+".html?reportId="+reportId+"&openId=" + openId;
						}
					}else if(packageData.code == 201){
						$('.my_view').css("display","block");
						$('.load-overlay').css("display","none");
						_this.reportId = reportId
						_this.openId = openId
						_this.sameUser = sameUser
						_this.edition = edition
	
						_this.nickName = packageData.data.mentPage.nickName //昵称
					  	_this.headimgurl = packageData.data.mentPage.headimgurl //头像
					  	_this.totalScore = packageData.data.mentPage.totalScore //总分
					  	_this.age = packageData.data.mentPage.age //生理年龄
					  	_this.ranking = packageData.data.mentPage.ranking //排名
					  	_this.ps = packageData.data.mentPage.ps //身体状况
					  	_this.name = packageData.data.infoView.name //套餐名称
					  	_this.packageId = packageData.data.infoView.packageId
					  	_this.price = packageData.data.infoView.price  //价格
					  	_this.oprice = packageData.data.infoView.originalPrice //原价
					  	if(_this.oprice == '' || _this.oprice == null){
					  		_this.oprice = _this.price+20; //数据没有原价的情况
					  	}
					  	_this.description = packageData.data.infoView.description //描述
					  	if(packageData.data.mentPage.abnormal != null && packageData.data.mentPage.abnormal!=''){
					  		_this.abnormalNo = packageData.data.mentPage.abnormal.list3.length+packageData.data.mentPage.abnormal.list2.length, //全部异常项目数
					  		_this.litAbnormal = packageData.data.mentPage.abnormal.list2.length,
					  		_this.midAbnormal = packageData.data.mentPage.abnormal.list3.length
					  	}
					  	_this.firstNames = packageData.data.mentPage.firstNames //得分最低两个系统名字
					  	_this.userId = packageData.data.infoView.userId
					  	_this.userIdstr = toThousands(packageData.data.infoView.userId)
					  	_this.isFree = packageData.data.infoView.isFree
					  	_this.snNum = packageData.data.snNum
					  	_this.orderNum = packageData.data.orderNum ? packageData.data.orderNum:'15392504132771282'
					  	_this.userState = packageData.data.userState
					  	_this.doctor = [
					  		{
					  			name:'高岭娣 副教授',
					  			describe:'首都医科大学卫生与教育管理学院体育学系主任'
					  		},
					  		{
					  			name:'潘晓明 中医博士',
					  			describe:'北京大学医学部研究中心学术部副主任'
					  		},
					  		{
					  			name:'肖 荣 博士/教授 博士生导师',
					  			describe:'首都医科大学公共卫生学院营养与食品卫生学系主任'
					  		},
					  		{
					  			name:'佟彤 中医养生专家',
					  			describe:'电视台节目《养生堂》、《名医讲堂》等特约专家'
					  		},
					  		{
					  			name:'顾晓玲 中国首批注册营养师',
					  			describe:'兰州大学营养学硕士 、临床营养师'
					  		},
					  	];
					  	if(!isEmptyObject(packageData.data.dataMap)){
					  		if(packageData.data.userState){
								if(packageData.data.userState == 1){  //新用户
									$('#olduser').remove();
									_this.firstlist = packageData.data.dataMap.abnormalData.firstlist
									_this.easysize = packageData.data.dataMap.abnormalData.easysize
									_this.hardsize = packageData.data.dataMap.abnormalData.hardsize
									
									console.log('新用户')
								}else if(packageData.data.userState == 2){ //老用户
									$('#newuser').remove();
									_this.day = packageData.data.dataMap.day
							  		_this.baseInfo = packageData.data.dataMap.baseInfo
							  		_this.ablive1 = packageData.data.dataMap.ablive1
							  		_this.ablive2 = packageData.data.dataMap.ablive2
							  		_this.reportDel = packageData.data.dataMap.reportDel.slice(0,2)
							  		_this.reportAdd = packageData.data.dataMap.reportAdd.slice(0,2)
							  		_this.reportNot = packageData.data.dataMap.reportNot.slice(0,2)
							  		if(_this.reportAdd){
							  			if(_this.reportAdd.length == 0 || _this.reportAdd == []){
								  			_this.reportAdd = _this.reportNot
								  			_this.notStr = '未改善'
								  		}
							  		}
								  	if(_this.baseInfo){
								  		var dateArr=[],scoreArr=[]
								  		for(var i =0;_this.baseInfo.length > i;i++){
									  		dateArr.push(_this.baseInfo[i].reportDate)
									  		scoreArr.push(_this.baseInfo[i].score)
									  	}
								  		oldUserTrend('graph',dateArr,scoreArr);
								  	}	
									console.log('老用户')
								}
							}

					  		//新用户异常项动画
					  		var w_cir = $(window).width();
							if($(window).width() > 750){w_cir = 750};
							setTimeout(function(){
								$('.new-pay .list-box .abnormal .con .c_li').each(function(index){
						  			var pro =  $(this).find('input').val(), c_se= '';
						  			if($(this).index() == 0){
						  				c_se = '#d42111'
						  			}else if($(this).index() == 1){
						  				c_se = '#f08e33'
						  			}
						  			$(this).find('.circle').circleProgress({
									    value: pro/12,
									    animation: true,
									    fill: { gradient: [c_se] },
									    emptyFill:'#dedbdb',
									    size: 0.176*w_cir,
									    thickness: 9,
									    //lineCap: 'round',
									    startAngle: Math.PI*1.5
									}).on('circle-animation-progress', function(event, progress) {
									    $(this).find('font').html(parseInt(pro * progress));
									});
						  		})
							},200)
					  	};
					  	
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
								_this.findUserCards(reportId,_this.userId)
							};
							//查询支付通道
							_this.getPayChannel(_this.snNum)
							// 根据价格
							if(_this.price == 0){
								$('#pay').on("click",function(){
									_this.updateFreeOrder(reportId,_this.packageId,_this.userId)
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
					}else if(packageData.code == 1001){
						$('.v_overlay').css({"visibility":"visible","opacity":"1"});
						$('.daifu_d').css("display","block");	
						$('.daifu_d .tit').text('亲，您的这份报告已经超过48小时未支付，请您再次检测');
						$('.daifu_d .tip').remove();
						$('#iknow').click(function(){
							WeixinJSBridge.call('closeWindow');
						});
					}else if(packageData.code == 1002){
						alert('findPackage 1002')
					}else{console.log(packageData.msg);alert(packageData.msg)} //code 200 201之外
				}
			).error(function(){alert('findPackage error')})
		},
		//跳转支付
		hrefRouter: function(pay){
			if(pay.payChannelType == 3){
				if(edition == 100){
					window.location.href="../wordPay.html?reportId="+reportId+"&userId="+this.userId+"&packageId="+this.packageId+'&openId='+ openId+"&edition="+edition
				}else{
					window.location.href="wordPay.html?reportId="+reportId+"&userId="+this.userId+"&packageId="+this.packageId+'&openId='+ openId+"&edition="+edition
				}
			}else{
				if(edition == 100){
					window.location.href='../wxPay_new.html?reportId='+reportId+'&userId='+this.userId+
			'&packageId='+this.packageId+'&name='+this.name+'&price='+this.price+'&openId='+openId+
			'&edition='+edition+'&payChannelId='+pay.payChannelId+'&orderNum='+this.orderNum+'&payChannelType='+pay.payChannelType
				}else{
					window.location.href='wxPay_new.html?reportId='+reportId+'&userId='+this.userId+
			'&packageId='+this.packageId+'&name='+this.name+'&price='+this.price+'&openId='+openId+
			'&edition='+edition+'&payChannelId='+pay.payChannelId+'&orderNum='+this.orderNum+'&payChannelType='+pay.payChannelType
				}
			}
		},
		//支付通道
		getPayChannel: function(snNum){
			var vm = this
			$.ajax({
				url : channel + "/pay/v1/channel/getPayChannel",
				type : "get",
				dataType : 'json',
				data : {
					neNo : snNum,
				   	terminalType : 1
				},
				success : function(data) {
					if(data.code ==0){
						vm.data = data.data
					}else{console.log('支付通道接口'+data.code)}
				},
				error : function(){alert('getPayChannel error')}
			})
		},
		//免费订单
		updateFreeOrder: function(reportId,packageId,userId){
			$.ajax({
				url : dataUrl + "/api/v1/reportWxPay/updateFreeOrder",
				type : "post",
				dataType : 'json',
				data : {
				    reportId : reportId,
				    packageId: packageId,
				    userId: userId
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
		},
		//判断用户有没有可用卡来显示卡支付
		findUserCards: function(reportId,userId){
			$.ajax({
				url : dataUrl + "/api/v1/cardPay/findUserCards",
				type : "POST",
				dataType : 'json',
				data : {
					reportId : reportId,
				   	userId : userId
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
			})
		},
		//判断设备是否是发放优惠券
		participate: function (reportId){
			var vm = this
			$.ajax({
				type:"post",
				url: couponData+"/vi/send/coupon/participate",
				dataType : 'json',
				data : {
				    inspectCode : reportId
				},
				success: function(data){
					if(data.code == 0){ vm.isShow = true }
				}
			});
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
//判断空对象
function isEmptyObject(obj){
	for(var key in obj){
		return false
	}
	return true
};

//老用户得分趋势图
function oldUserTrend(el,dateArr,scoreArr){
	setTimeout(function(){ 
		var myChart = echarts.init(document.getElementById(el));
	    var option = {
	      // 距离左右的距离
			grid:{
				left:'10%',
				right:'5%',
				top:28,
				bottom:25
			},
			xAxis: {
				type: 'category',
				data: dateArr,
				splitLine:{
					show:false
				},
				// X轴名称样式
				nameTextStyle:{
					color:'#9f9f9f',
				},
				// X轴字体样式
				axisLabel: {
					show: true,
					textStyle: {
						color :"#adafaf",
						//color: '#4aa59e'
					}
				},
				// 坐标轴样式
				axisLine:{
					lineStyle:{
						color:'#e2e2e2',
						width:'3',
					},
				},
				// 刻度样式
				axisTick:{
					show:false,
					inside:true,
					lineStyle:{
						color:'#1eceb7',
						width:'2'
					}
				},
			},
			yAxis: {
				type: 'value',
				name: '总分',
				min:60,
				max:100,
				splitLine:{
					show:false
				},
				axisTick:{
					show:false
				},
				splitArea:{
					show:true,
					interval:'0',
					areaStyle:{
						color:['rgba(60,199,188,0.9)','rgba(60,199,188,0.7)','rgba(60,199,188,0.4)','rgba(60,199,188,0.2)','rgba(60,199,188,0.1)'] ,
					}
				},
				axisLabel: {
					show: true,
					color :"#adafaf",
				},
				nameTextStyle:{
					color:'#9f9f9f',
				},
				axisLine:{
					lineStyle:{
						//color:'#effafa',
						width:'0',
					},
				},
			},
			series: [{
				data: scoreArr,
				type: 'line',
				smooth: true,
				color:'#58d1c7'
			}],
			
		};
	    // 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		},
	100)
}

