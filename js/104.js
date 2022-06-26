var reportId = getQueryString('reportId') || "KJ104IS0014014C22040820311860976";
var openId = getQueryString('openId');
var reportType = getQueryString('reportType');
var customerId = getQueryString('userId') || 3009;
var saasId = getQueryString('saasId');
var clientType = (getQueryString("clientType") || '');
var resource = getQueryString("resource");
var source = (getQueryString('source') || ''); //通过解析获得
var reportSource = (getQueryString('reportSource') || ''); //通过解析获得 判断金管家来源
var cannsee = (getQueryString('cannsee') || ''); //金管家 jgj
var visible = (getQueryString('visible') || 1);
var invite = getQueryString("invite");  //邀约历史查看
var localUrl = location.href;
var reportPrintUrl = testHealthUrl+'/print/print120.html?viewType=2&reportId=';
var indexDataUrl = '/api/v1/reportIndex/indexAll2';
if(reportType == '505'){indexDataUrl = '/api/v5/reportData/indexAll2';}
var payStr = '';
var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
if(clientType || !openId){
	//alert('now in app');
	gohistoryUrl = 'historyRecord.html?userId='+customerId+'&saasId='+saasId+'&resource='+resource+'&clientType='+clientType+'&source='+source
};
$('.load-overlay').css("display","block");
$('.my_view').css("visibility","hidden");
var app = new Vue({
	el: '#appx',
	data: function(){
		return {
			reportId: reportId,
			customerId: customerId,
			reportType:reportType,
			openId: openId,
			saasId: saasId,
			userId:customerId,
			//接口数据
			indexPage:{},
			firstPages:[],
			map:{},
			otherPages:[],
			thirdPages:[],
			totalBids:0, //指标总数
			list1:[],
			list2:[],
			list3:[],
			//分离
			saasTel:'',
			mianyiScore:0,
			mianyiList:[],
			mp3data:'', //语音文件路径
			//
			someTit:'',
			someTxt:'',
			videoUrl:'',
			banData:[], //轮播广告
			banData1:[], // 头部
			banData2:[], //底部
			banData3:{}, //3 企业微信
			showBanData3: false,
			//echart
			xlist:[],
			ylist:[]
		}
	},
	methods:{
		// 获取首页数据
		getData: function(){
			var vm = this;
			$.ajax({
				url: dataUrl + indexDataUrl,
				type: "post",
				dataType: "json",
				data: {
					reportId: reportId,
					customerId: customerId
				},
				success: function(res){
					$('.my_view').css("visibility","visible");
					$('.load-overlay').css("display","none");
					vm.indexPage = res.data.indexPage,
					vm.firstPages = res.data.firstPages,
					vm.map = res.data.map,
					vm.totalBids = res.data.map.list1.length+res.data.map.list2.length+res.data.map.list3.length,
					vm.list1 = res.data.map.list1,
					vm.list2 = res.data.map.list2,
					vm.list3 = res.data.map.list3,
					vm.thirdPages = res.data.thirdPages,
					
					res.data.otherPages.forEach(function(el,index){
						if(el.targetThirdId != '3232'){
							vm.xlist.push(el.targetThirdName);
							vm.ylist.push(5-el.abnormalLevel);
						}
					});
					//console.log(vm.xlist,vm.ylist);
					setTimeout(function(){
						document.querySelector('.pro-s').style.transform = 'rotate('+ (1.8*res.data.indexPage.totalScore - 180) +'deg)';
					},100);
					$('#score').animateNumber({ number: res.data.indexPage.totalScore },2000);
					vm.creatYuyin(res.data.indexPage.totalScore,vm.map);
					vm.wheelsort(res.data.map.deviceSnNum,reportId);//轮播广告
					setTimeout(function(){
						creatline(vm.xlist,vm.ylist)
					},500)
					
				},
				error: function(sta){}
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
						if(res.data == 5 && cannsee == ''){ //金管家 5
							location.href = "jinguanjia.html?reportType="+reportType
						}else if(res.data == 6 && cannsee == ''){
							location.href = "haochezhu.html?reportType="+reportType
						}
					}
				},
				error: function(){console.log('getReportSource error')}
			});
		},
		//查询免疫力
		getTargetByFirst: function(){ 
			var vm = this
			$.ajax({
				url : dataUrl + "/api/v1/reportIndex/getTargetByFirst",
				type : "POST",
				dataType : 'json',
				data : {
				    reportId : reportId,
				    targetFirstId : 3135
				},
				success : function(res) {
					if(res.code == 200){
						vm.mianyiScore = res.data.score;
						vm.mianyiList = res.data.secondPages[0].thirdPages;
					}
				},
				error : function(obj,msg){alert("getTargetByFirst error")}
			});
		},
		//语音生成
		creatYuyin: function(score,obj){
			var vm = this
			$.ajax({
				type : "post",
				url : robot + "/IFI/sis/tts/custom?inspectId="+reportId+"&mianyiScore="+score,
				dataType : 'json',
				contentType : "application/json",
				data : JSON.stringify(obj),
				success : function(res) {
					vm.mp3data = res.data;
				},
				error : function(sta,msg){alert("custom error")}
			});
		},
		//查询SaaS信息
		getSaasTenantByCompanyId: function(){
			var vm = this;
			$.ajax({
				type:"post",
				url:saasUrl+ "/api/v1/initTenant/getSaasTenantByCompanyId",
				async:true,
				dataType: 'json',
				data: {
					saasId:saasId
				},
				success: function(res){
					if(res.code == 200){
						if(res.data.saasTel){
							vm.saasTel = res.data.saasTel
							console.log(vm.saasTel)
						}
						//vm.saasName = res.data.saasName
						//vm.saasLogo = res.data.saasLogo
					}
				},
				error: function(){console.log('getSaasTenantByCompanyId error')}
			});
		},
		godayin: function(){
			var vm = this
			location.href = 'print/print125.html?reportId='+reportId+'&viewType=2'+'&reportType='+reportType+'&printReportType=2'
		},
		explain: function(){ //说明
			showMask();
			$('#showExplain').css({"visibility":"visible","opacity":"1"});
		},
		goSecond: function(e,item){ //埋点  十大系统点击
			var vm = this;
			$('#videos').css("visibility","visible")
			vm.videoUrl = 'http://image.jiankangzhan.com/metaverse/128/'+ item.targetFirstId +'.mp4';
			var ssurl = 'second2.html?reportId='+reportId+'&userId='+customerId+'&targetFirstId='+item.targetFirstId+'&reportType='+reportType+'&deviceSn='+vm.deviceSnNum
			
			sessionStorage.setItem('mp4url',vm.videoUrl)
			sessionStorage.setItem('secondurl',ssurl)
			//location.href = 'mp4sys.html';
			
			location.href = 'second2_sp.html?reportId='+reportId+'&userId='+customerId+'&targetFirstId='+item.targetFirstId+'&reportType='+reportType+'&deviceSn='+vm.deviceSnNum
		},
		goThird: function(e,id){
			var vm = this;
			if(id == '3230'){
				console.log('不跳')
			}else{
				location.href = 'third.html?reportId='+reportId+'&targetId='+ id + '&userId='+customerId+'&deviceSn='+vm.deviceSnNum+'&reportType='+reportType
			}
		},
		getSuggest: function(){ //健康建议
			location.href = 'z_pop.html?reportId='+reportId+'&reportType='+reportType
		},
		getRecipesData: function(){ //健康食谱
			location.href = 'recipes.html?reportId='+reportId+'&reportType='+reportType
		},
		checkHistory: function(){ //健康档案
			window.location.href = gohistoryUrl
		},
		goformp4: function(){
			location.href = "104mp4_index.html?"
		},
		showSome: function(tit,txt){
			this.someTit = tit
			this.someTxt = txt
			showMask();
			$('#showSome').css({"visibility":"visible","opacity":"1"});
		},
		showQiyeewm: function(){
			showMask();
			$('.qy_ewm').css({"visibility":"visible","opacity":"1"});
		},
		closeQiye: function(){
			closeMask();
			$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
			$('.qy_ewm').css({"visibility":"hidden","opacity":"0"});
			$("body").css("overflow","auto");
		},
		//广告接口  banner_page 1:首页轮播，101膳食 102营养  103运动
		wheelsort: function(deviceSn,reportId){
			var vm = this;
			$.ajax({
				type: "post",
				url: dataUrl + "/api/banner/wheelsort",
				async: true,
				dataType: 'json',
				data:{
					deviceSn: deviceSn,
					reportId: reportId
				},
				success: function(res){
					if(res.code == 200){
						res.data.forEach(function(el,index){
							if(el.bannerPage == 1){
								vm.banData1.push(el)
							}else if(el.bannerPage == 2){
								vm.banData2.push(el)
							}else if(el.bannerPage == 3){
								vm.banData3 = el;
								vm.showBanData3 = true;
								//console.log(vm.showBanData3)
							}
						})
						//console.log(vm.banData1,vm.banData2)
						vm.banData = res.data;
						setTimeout(function(){
							banSlide(vm.banData1.length,'.gg_head')
							banSlide(vm.banData2.length,'.gg_foot')
						},200)
					}else{
						$('.ban_gg').remove()
					}
				},
				error: function(){console.log('wheelsort error')}
			});
		},
		
	},
	mounted: function(){
		this.getData();
		if(saasId){this.getSaasTenantByCompanyId();}
		this.getTargetByFirst();
		this.getReportSource();
	}
});
//弹窗
function showMask(){
	$("body").css("overflow","hidden");
	$('.v_overlay').css({"visibility":"visible","opacity":"1"});
	closeMask();
};
function closeMask(){
	$('.v_overlay,.v_overlert .close').click(function(){
		$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
		$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
		$('#showQiye').css({"visibility":"hidden","opacity":"0"});
		$("body").css("overflow","auto");
	});
};
//广告轮播
function banSlide(page_count,el){ 
	var page_now=1;
	var page_num=1; //一页显示几个
	var v_width = $(el).width();
	console.log(page_count)
	function next(){	
		if(!$(el+' .v_list').is(':animated')){
			if(page_now == page_count){
				$(el+' .v_list').animate({left:'0px'},'slow');
				page_now=1;
			}else{
				$(el+' .v_list').animate({left:'-='+v_width},'slow');
				page_now++;
			}
		}
	};
	function prev(){
		if(!$(el+' .v_list').is(':animated')){
			if(page_now == 1){
				$(el+' .v_list').animate({left:'-='+v_width*(page_count-1)},'slow');
				page_now=page_count;
			}else{
				$(el+' .v_list').animate({left:'+='+v_width},'slow');
				page_now--;
			}
		}
	};
	var toNext=setInterval(next,3000);
};
//图表
function creatline(xlist,ylist){
	var myChart = echarts.init(document.getElementById('lineChart'));
	var option = {
		title: {},
		grid: {},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: xlist,
			splitLine: {
				show: true,
				lineStyle:{
					color:['#757C9A'],
					width:1
				}
			},
			axisLine:{
				lineStyle:{
					color: '#757C9A'
				}
			},
			axisTick:{
				show: false
			},
			axisLabel:{
				color: '#ffffff',
				interval: 0,
				formatter:function(value,index){
				   return value;  
				} 
			}
		},
		yAxis: {
			type: 'value',
			splitLine: {
				show: false
			},
			axisLine:{
				lineStyle:{
					color: '#757C9A'
				}
			}
		},
		series: [
			{
				name: '销量',
				type: 'line',
				color:'#1DCEB7',
				smooth: true,
				symbol:'circle',
				symbolSize: 6,
				data: ylist,
				lineStyle:{
					color: '#1DCEB7'
				},
				areaStyle:{
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: 'rgba(62, 233, 220, 0.5)'
						},
						{
							offset: 1,
							color: 'rgba(29, 206, 183, 0)'
						}
					])
				}
			}
		]
	};
	myChart.setOption(option);
};
setTimeout(function(){
	creatline()
},200)


