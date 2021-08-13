var reportId = (getQueryString('reportId') || 'MK701IS000000061628146392294');
var openId = getQueryString('openId');
var reportType = getQueryString('reportType');
var customerId = getQueryString('userId');
var saasId = getQueryString('saasId');
var clientType = (getQueryString("clientType") || ''); 
var bank = (getQueryString('bank') || '');
var resource = getQueryString("resource");
var source = (getQueryString('source') || '');  //通过解析获得
var reportSource = (getQueryString('reportSource') || ''); //通过解析获得 判断金管家来源
var cannsee = (getQueryString('cannsee') || ''); //金管家 jgj
var visible = (getQueryString('visible') || 1);
var invite = getQueryString("invite");  //邀约历史查看
var localUrl = location.href;
var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;

$('.load-overlay').css("display","block");
$('.my_view').css("visibility","hidden");
var myApp = new Vue({
	el: ".my_view",
	data: function(){
		return {
			reportId: reportId,
			reportType:reportType,
			openId: openId,
			reportStrData:{}, //总数据
			totalScore:0,
			userInfoView:{},
			inspectDateStr:'',
			hartViews:[],
			vesselViews:[],
			bloodViews:[],
			mcrViews:[],
			resultViews:[],
			bpView:{},
			xueyaresult:'',
			abnormalCount: {},
			someTit:'',
			someTxt:'',
			neReportver:{},
			bvtps:[],
			analysedWaveform:{},
			xlist:[],
			markLineList:[],
			fei: "", //肺功能结果
			floor1List:[],
			floor2List:[],
			invite:invite,
			zong:{},
			viewTab:1,
			offHeight:sessionStorage.getItem("offsetTop")?sessionStorage.getItem("offsetTop"):0,
			arrMin:0,
			count:0,
			videos:[
				{
					videoUrl:'https://cardiotocograph.oss-cn-beijing.aliyuncs.com/xxg/mbb/0962B1020.mp4?versionId=CAEQFRiBgIDg09zqyhciIGFkYmUwODgzZWQ1OTQ1ZDZiZjhjMGNhNjVjMDgxNTBh',
					videoTitle:'脉搏波简介',
					videoImg:'https://cardiotocograph.oss-cn-beijing.aliyuncs.com/xxg/mbb/0962B1020.jpg?versionId=CAEQFRiBgMCy0tzqyhciIDY0MzMwYTJjZmJmYjQ3ZGNiOGQyNGQwMWFkYjU1ZjA1'
				},{
					videoUrl:'https://cardiotocograph.oss-cn-beijing.aliyuncs.com/xxg/mbb/0962B1021.mp4?versionId=CAEQFRiBgIDC09zqyhciIGNkOWUyMzM4NmE2ZjRmNWI5ZTlhMGRhNzMwMGRjZWNk',
					videoTitle:'脉搏波对比 ',
					videoImg:'https://cardiotocograph.oss-cn-beijing.aliyuncs.com/xxg/mbb/0962B1021.jpg?versionId=CAEQFRiBgIC50tzqyhciIDE4NzRjYWI1ZDMzNjRlNDY4ZjYwOWE4NDBmYWU0NzQy'
				},{
					videoUrl:'https://cardiotocograph.oss-cn-beijing.aliyuncs.com/xxg/mbb/0962B1022.mp4?versionId=CAEQFRiBgICt0tzqyhciIDgzZDNkZmYyNmU1MzRiYjdhNmJiNWVhMmZjOGNhYTQ4',
					videoTitle:'脉搏波采集质量 ',
					videoImg:'https://cardiotocograph.oss-cn-beijing.aliyuncs.com/xxg/mbb/0962B1022.jpg?versionId=CAEQFRiBgIC20tzqyhciIDg3NTY3MzM5ZjE3MjQ5MDRiMDllOGM3NjQzNjlhNjgw'
				},{
					videoUrl:'https://cardiotocograph.oss-cn-beijing.aliyuncs.com/xxg/mbb/0962B1023.mp4?versionId=CAEQFRiBgMDs0tzqyhciIGM5NzBhODQ0ZWM0ZjRiMDNhZmI5OWM0ZTNiYzdkZmNm',
					videoTitle:'常见参数解释',
					videoImg:'https://cardiotocograph.oss-cn-beijing.aliyuncs.com/xxg/mbb/0962B1023.jpg?versionId=CAEQFRiBgICN09zqyhciIDcwZWY0ZDc1Y2JlNjQ2MDdhYzFlOTRhNWFlNmZiZWYx'
				}
			],
			xyxList:[],
			diaList:[],//历史低压
			sysList:[],//历史高压
			tabdb:2,//默认显示项目
			bidsTabShow:{ //默认显示项目
				hart:1,
				vesse:1,
				blood:1,
				mcr:1
			},
			zongheVal:''
		}
	},
	mounted: function(){
		var vm = this
		this.getData();
		this.getMk701Video();
		
	},
	
	methods: {
		handlebd: function(n){
			this.tabdb = n
		},
		handleTabCheck: function(str,n){
			this.bidsTabShow[str] = n
		},
		handleItem:function(item){
			sessionStorage.setItem("item", JSON.stringify(item));
			location.href="xgy_item.html?"+'reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
		},
		handleBo: function(){
			sessionStorage.setItem("analysedWaveform", JSON.stringify(this.analysedWaveform));
			location.href="xgy_bo.html?"+'reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
		},
		handleBid:function(bid){
			sessionStorage.setItem("bid", JSON.stringify(bid));
			sessionStorage.setItem("mobile", this.userInfoView.mobile);
			location.href="xgy_bid.html?"+'reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
		},
		handleBmi:function(){
			sessionStorage.setItem("userInfoView", JSON.stringify(this.userInfoView));
			sessionStorage.setItem("mobile", this.userInfoView.mobile);
			location.href="xgy_bmi.html?"+'reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
		},
		handleZhongji: function(){
			location.href = "xgy_item713.html?"+'reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&source='+source;
		},
		swi: function(){
			var swiper = new Swiper('#swiper1', {
		      slidesPerView: 'auto',
		      spaceBetween: 0,
		   });
		},
		swi2: function(){
		    var swiper2 = new Swiper('#swiper2', {
		      slidesPerView: 'auto',
		      spaceBetween: 0,
		    });
		    var swiper3 = new Swiper('#swiper3', {
		      slidesPerView: 'auto',
		      spaceBetween: 0,
		    });
		},
		handleTab: function(n){
			this.viewTab = n
		},
		checkHistory: function(){ //历史报告
			window.location.href = gohistoryUrl
		},
		getData: function(){
			var vm = this
			$.ajax({
				url : dataUrl + "/api/mk701/indexAll",
				type : "POST",
				dataType : 'json',
				data : {
				    reportId : reportId,
				    openId : openId
				},
				success : function(res) {
					if(res.code == 200){
						$('.my_view').css("visibility","visible");
						$('.load-overlay').css("display","none");
						vm.reportStrData = res.data.reportStr
						vm.abnormalCount = res.data.abnormalCount
						vm.totalScore = res.data.reportStr.totalScore
						vm.userInfoView = res.data.reportStr.userInfoView
						vm.inspectDateStr = res.data.reportStr.inspectDateStr
						vm.hartViews = res.data.reportStr.hartViews
						vm.vesselViews = res.data.reportStr.vesselViews
						vm.bloodViews = res.data.reportStr.bloodViews
						vm.mcrViews = res.data.reportStr.mcrViews
						vm.bpView = res.data.reportStr.bpView
						//vm.xueyaresult = vm.bpView.inspectGuideBp6.metricName
						vm.resultViews = res.data.reportStr.resultViews
						//总分动画效果
						setTimeout(function(){
							$('.zhen').css("transform","rotate("+(2.24*vm.totalScore-22)+"deg)");
						},100)
						$('#score').animateNumber({ number: vm.totalScore },1100);
						vm.analysisMk701Report('DIA')
						vm.analysisMk701Report('SYS')
						console.log('xxlist',vm.xyxList)
						console.log('diaList',vm.diaList)
						console.log('sysList',vm.sysList)
						//setTimeout(xueyaChart(['2018-05-02','2018-05-02','2018-05-02','2018-06-09'],[150,150,150,150],[110,50,110,110]),5000)
						//xueyaChart(vm.xyxList,vm.diaList,vm.sysList)
						
						vm.resultViews.forEach(function(item,index){
							if(item.data && item.data[0]){
								/*myApp.$set(item,'resultDetail','')
								myApp.$set(item,'resultExplain','')*/
								item.data.forEach(function(i){
									if(i.resultDetail){
										i.resultDetail = i.resultDetail.replace(/\n/g,'<br/>')
									};
									if(i.name == '综合意见'){vm.zongheVal = i.resultName}
								})
							};
							if(item.metricType == "6"){ //肺功能
								vm.fei = item.resultex
							};
							if(item.metricType == "1"){ //综合意见
								vm.zong = item
							}
						})
						vm.analysedWaveform = JSON.parse(res.data.reportStr.analysedWaveform)
						console.log(vm.analysedWaveform)
						vm.arrMin = vm.analysedWaveform.pwavedata.min()
						vm.analysedWaveform.pwavedata.forEach(function(i,index){
							vm.xlist.push(index) //作图x坐标轴
							
							vm.analysedWaveform.pmax.forEach(function(n){
								if(n == index && n != 0){
									vm.markLineList.push([{coord:[n,0],lineStyle:{color:'blue'}},{coord:[n,i]}])
								}
							});
							vm.analysedWaveform.pe.forEach(function(n){
								if(n == index && n != 0){
									vm.markLineList.push([{coord:[n,0],lineStyle:{color:'green'}},{coord:[n,i]}])
								}
							});
							vm.analysedWaveform.pf.forEach(function(n){
								if(n == index && n != 0){
									vm.markLineList.push([{coord:[n,0],lineStyle:{color:'#ff0000'}},{coord:[n,i]}])
								}
							});
							vm.analysedWaveform.pmin.forEach(function(n){
								if(n == index && n != 0){
									vm.markLineList.push([{coord:[n,0],lineStyle:{color:'#666666'}},{coord:[n,i]}])
								}
							});
						});
						console.log(vm.markLineList)
						
						creatChart('main',vm.xlist,vm.analysedWaveform.pwavedata,vm.markLineList,vm.arrMin)
						vm.swi()
						vm.count++
					}else{
						console.log('code = '+res.code)
					}
				},
				error : function(obj,msg){alert("mk701/indexAll error")}
			});
		},
		//查历史  DIA(收缩压)   SYS(舒张压)
		analysisMk701Report: function(name){
			var vm = this
			$.ajax({
				url : analysisreport + "/mk701/reportIndex/analysisMk701Report",
				type : "POST",
				dataType : 'json',
				data : {
				    targetName : name,
				    mobile:vm.userInfoView.mobile
				},
				success : function(res) {
					if(res.code == 200){
						if(name == 'DIA'){
							res.data.forEach(item => {
								vm.diaList.push(item.DIA)
								vm.xyxList.push(item.createTimeStr) //x轴
							})
						}else if(name == 'SYS'){
							res.data.forEach(item => {
								vm.sysList.push(item.SYS)
							})
						}
					}else{
						console.log('code = '+res.code)
					}
					xueyaChart(vm.xyxList,vm.diaList,vm.sysList)
				},
				error : function(obj,msg){alert("analysisMk701Report error")}
			});
		},
		getMk701Video: function(){
			var vm = this
			$.ajax({
				url : dataUrl + "/api/banner/video/getMk701Video",
				type : "POST",
				dataType : 'json',
				data : {
				    reportId : reportId
				},
				success : function(res) {
					if(res.code == 200){
						if(res.data){
							vm.neReportver = res.data.neReportver
							vm.bvtps = res.data.bvtps
							vm.bvtps.forEach(function(item,index){
								if(item.bannerFloor == 1){
									vm.floor1List.push(item)	
								}else if(item.bannerFloor == 2){
									vm.floor2List.push(item)	
								}
							});
							setTimeout(function(){
					        	vm.swi2()
					        },1000)
						}
						vm.count++
					}else{
						console.log('code = '+res.code)
					}
				},
				error : function(obj,msg){alert("mk701/indexAll error")}
			});
		},
		showSome: function(tit,txt){
			//txt = txt.replace(/\/n|\\n/g,'<br>')
			this.someTit = tit
			this.someTxt = txt
			showMask();
			$('#showSome').css({"visibility":"visible","opacity":"1"});
		},
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
		tocloseall()
	});
};
function tocloseall(){
	$('.v_overlay').css({"visibility":"hidden","opacity":"0"});
	$('.v_overlert').css({"visibility":"hidden","opacity":"0"});
	$('.orginImg').css({"visibility":"hidden","opacity":"0"});
	$("body").css("overflow","auto");
}	
//截取URL
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};

//作血压历史图
function xueyaChart(xlist,dialist,syslist){
let myChart = echarts.init(document.getElementById('xueya'));
  	let option = {
	    title: {
	        text: ''
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data: ['收缩压', '舒张压']
	    },
	    grid: {
	    	top:'18%',
	        left: '3%',
	        right: '10%',
	        bottom: '3%',
	        containLabel: true
	    },
	   
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: xlist
	    },
	    yAxis: {
	        type: 'value',
	        min:40
	    },
	    series: [
	        {
	            name: '收缩压',
	            type: 'line',
	           	smooth: true,
	           	showSymbol:false,
	            data: dialist,
	            lineStyle:{
		        	color:"#E88653"
		        },
	        },
	        {
	            name: '舒张压',
	            type: 'line',
	           	smooth: true,
	           	showSymbol:false,
	            data: syslist
	        }
	    ]
	};
  // 绘制图表
  myChart.setOption(option);
}
//作脉搏图
function creatChart(el,xlist,ylist,markLineList,min){
let myChart = echarts.init(document.getElementById('main'));
  let option = {
      title: {
          text: '',
          left: 'center'
      },
      grid: {
      	  top:10,
          left: 5,
          right: 5,
          bottom:10
      },
      xAxis: {
          show:true,
          type: 'category',
          boundaryGap: false,
          axisLine: {
          	onZero: true,
			lineStyle:{
				color:'#D0021B'
			}
          },
          data: xlist,
          axisLabel:{
          	show:false,
          	interval:200
          },
          axisTick:{
          	show:false
          }
      },
      yAxis: {
          show: false,
          scale:true,
          min:0,
          name: '脉搏(m^3/ms)',
          type: 'value',
      },
      series: [
          {
          	lineStyle: {
          		color:'#9AA0D9',
          		width:1
          	},
          	markLine: {
                symbol: ['none', 'none'],
                label: {show: false},
                emphasis:{ //标线高亮显示
                	lineStyle:{
                		width:1,
                		//color:'#000000'
                	}
                },
                lineStyle:{
                	//color:'blue',
                	type:'solid',
                	width:0.75,
                	opacity:0.5
                },
                data: markLineList
            },
          	
            name: '脉搏',
            type: 'line',
            symbolSize: 8,
            showSymbol:false,
            hoverAnimation: false,
            data:ylist
          }
      ]
  };
  // 绘制图表
  myChart.setOption(option);
}

//最小值
Array.prototype.min = function(){
  var min = this[0];
  var len = this.length;
  for(var i=1; i<len; i++){
    if(this[i] < min){
      min = this[i];
    }
  }
  return min;
}


