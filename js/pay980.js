var JsSrc =(navigator.language || navigator.browserLanguage).toLowerCase();  //获取系统语言
if(JsSrc.indexOf('zh')>=0){
	var language = zh;
	var languageStr = 'zh';
}else if(JsSrc.indexOf('en')>=0){
    var language = en;
    var languageStr = 'en';
    document.title = 'Pay';
}else{
	var language = en;
    var languageStr = 'en';
    document.title = 'Pay';
};
var reportId = getQueryString("reportId");
var openId = getQueryString("openId");
if(openId == 'undefined' || openId == 'null'){openId = ''};
var userId = getQueryString("userId");
var reportType = getQueryString("reportType");
var sameUser = getQueryString("sameUser");
var edition = getQueryString("edition");
var saasId = getQueryString("saasId");
var clientType = getQueryString("clientType"); 
var source = getQueryString('source');
var terminalType = 1; //终端类型 1、微信 2、APP  'tjnsyh' 天津农商行
var findPackage = "/api/v1/reportWxPay/findPackage2"
var dataInfor = {
	reportId:reportId,
	userId:userId,
	saasId:saasId
}

if(clientType){
	terminalType = 2 //终端类型 1、微信 2、APP  'tjnsyh' 天津农商行
}
zhuge.track('进入支付页面', { //埋点t
	'报告版本': reportType,
	'openId' : openId,
	'渠道' : '微信'
});
$('.my_view').css("display","none");
$('.load-overlay').css("display","block");
var myApp = new Vue({
	 el: '.my_view',
    data: function() {
		return {
			userState:'',
			isShow:false,
			isActive:[],
			reportId: reportId, openId: openId, sameUser: sameUser,reportType:reportType, //版本
			data:{}, //支付通道数据
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
			subprice:'', //优惠券后价
			discount:'',//优惠券金额
			description:'', //描述
			isFree: '',
			abnormalNo:'', //全部异常项总数
			litAbnormal:'', //轻度异常
			midAbnormal:'', //中度异常
			firstNames:'', //得分最低两个系统名字
			userId:userId,
			userIdstr:'', //逗号分隔显示
			snNum:'', 
			orderNum:'',
			day:'',  //距离上次检测天数
			baseInfo:'', //老用户趋势数据
			ablive1:'', ablive2:'',  //本次与上次异常项数目
			reportAdd:'', //新增
			reportDel:'',  //已改善指标
			notStr:'新增' , //为改善 新增称呼
			firstlist:'',
			easysize: '', hardsize: '',   //新用户风险指标数目
			doctor:'',
			clientType:'',
			cardPrice:'', cardUseCount:'', //购买年卡用
			language: language,
			saasPayUrl:'', //判断SaaS支付
		}
	},
	methods: {
		findPackage: function() {
			var _this = this; 
			$.post(dataUrl + findPackage,
				dataInfor,
				function (packageData) {
					if(packageData.code == 201){
						location.href = "pay980.html?reportId="+reportId+'&openId='+openId
					}else if(packageData.code == 200){
						$('.my_view').css("display","block");
						$('.load-overlay').css("display","none");
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
					  	_this.userId = packageData.data.infoView.userId //套餐名称
					  	_this.clientType = packageData.data.mentPage.clientType  //判断支付通道类型用
					  	if(_this.clientType == 'tjnsyh'){
					  		terminalType = 3 //终端类型 1、微信 2、APP  'tjnsyh' 天津农商行
					  	}
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
					  	_this.orderNum = packageData.data.orderNum
					  	_this.userState = packageData.data.userState
					  	_this.doctor = [
					  		{
					  			name:'高岭娣 副教授', describe:'首都医科大学卫生与教育管理学院体育学系主任'
					  		},
					  		{
					  			name:'潘晓明 中医博士', describe:'北京大学医学部研究中心学术部副主任'
					  		},
					  		{
					  			name:'肖 荣 博士/教授 博士生导师', describe:'首都医科大学公共卫生学院营养与食品卫生学系主任'
					  		},
					  		{
					  			name:'佟彤 中医养生专家', describe:'电视台节目《养生堂》、《名医讲堂》等特约专家'
					  		},
					  		{
					  			name:'顾晓玲 中国首批注册营养师', describe:'兰州大学营养学硕士 、临床营养师'
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
							  		if(packageData.data.dataMap.reportDel){_this.reportDel = packageData.data.dataMap.reportDel.slice(0,2)}
							  		if(packageData.data.dataMap.reportAdd){_this.reportAdd = packageData.data.dataMap.reportAdd.slice(0,2)}
							  		if(packageData.data.dataMap.reportNot){_this.reportNot = packageData.data.dataMap.reportNot.slice(0,2)}
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
									    startAngle: Math.PI*1.5
									}).on('circle-animation-progress', function(event, progress) {
									    $(this).find('font').html(parseInt(pro * progress));
									});
						  		})
							},200)
					  	};
					  	
						if(packageData.data.infoView == null){
							$('#pay .sub').css("background","#CCCCCC");
						}else{
							if(_this.isFree == 1){
								$('.pay-x-fix .oprice').html('新用户首次免费');$('#pay .sub').html('查看');
							};
							
							
							
						}
					}else if(packageData.code == 1001){
						$('.v_overlay').css({"visibility":"visible","opacity":"1"});
						$('.daifu_d').css("display","block");	
						$('.daifu_d .tit').text('亲，您的这份报告已经超过48小时未支付，请您再次检测');
						$('.daifu_d .tip').remove();
						$('#iknow').click(function(){
							//WeixinJSBridge.call('closeWindow');
							location.href = 'historyRecord.html?userId='+userId+'&openId='+openId+'&saasId='+saasId;
						});
					}else if(packageData.code == 1002){
						alert('findPackage 1002'+packageData.msg)
					}else{console.log(packageData.msg);alert(packageData.msg)} //code 200 201之外
				}
			).error(function(){alert('findPackage error')})
		},
		
		goReportIndex: function(reportId,userId,reportType){ //跳转查看报告
			var vm = this;
			if(openId){
				location.href='common.html?reportId='+reportId+'&userId='+userId+'&reportType='+reportType+'&openId='+openId+'&saasId='+saasId
			}else{
				if(reportType == 121 || reportType == 122 || reportType == 12001 || reportType == 123){
					location.href='report120.html?reportId='+reportId+'&userId='+userId+'&reportType='+reportType+'&openId='+openId+'&saasId='+saasId
				}else if(reportType == 501 || reportType == 502 || reportType == 5021 || reportType == 505 || reportType == 503){
					location.href='report500.html?reportId='+reportId+'&userId='+userId+'&reportType='+reportType+'&openId='+openId+'&saasId='+saasId
				}else{
					location.href='report'+reportType+'.html?reportId='+reportId+'&userId='+userId+'&reportType='+reportType+'&openId='+openId+'&saasId='+saasId
				}
			}
		},
	},
	mounted: function() {
		this.findPackage();
    },
});
//获取url参数
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
			grid:{// 距离左右的距离
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
				nameTextStyle:{// X轴名称样式
					color:'#9f9f9f',
				},
				axisLabel: {// X轴字体样式
					show: true,
					textStyle: {
						color :"#adafaf",
					}
				},
				axisLine:{// 坐标轴样式
					lineStyle:{
						color:'#e2e2e2',
						width:'3',
					},
				},
				axisTick:{// 刻度样式
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
		myChart.setOption(option);
		},
	100)
}

