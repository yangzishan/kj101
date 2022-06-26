var reportId = (getQueryString('reportId') || 'MK701IS000000031613891822337');
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
			userInfoView:{},
			inspectDateStr:'',
			hartViews:[],
			vesselViews:[],
			bloodViews:[],
			mcrViews:[],
			resultViews:[],
			bpView:{},
			xueyaresult:'',
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
			//
			banData:[], //轮播广告
			banData1:[], // 头部
			banData2:[], //底部
			banData3:{}, //3 企业微信
			showBanData3: false,
		}
	},
	mounted: function(){
		var vm = this
		this.getData();
		this.getMk701Video();
		// 抓取滚动位置
		//this.offHeight = sessionStorage.getItem("offsetTop");
		console.log('scroll之前='+this.offHeight)
		setTimeout(function(){
			$(window).scroll(function(){ 
				vm.getoffheight()
			});
		},100)
		
	},
	watch:{
		count:function(val){
			if(val == 2){
				console.log('记录上次位置位置'+this.offHeight)
				$(document).scrollTop(this.offHeight)
			}
		}
	},
	methods: {
		handlevideo: function(index){
			$('#img'+index).css('display','none')
			var v = document.getElementById("vid"+index)
			if(v.paused || v.ended) {
                v.play();
            }
		},
		getoffheight: function(){
			//console.log($(window).scrollTop())
			sessionStorage.setItem("offsetTop", $(window).scrollTop());//保存滚动位置
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
		swi: function(){
			var swiper = new Swiper('.swiper-container', {
		      slidesPerView: 'auto',
		      spaceBetween: 2,
		    });
		},
		handleTab: function(n){
			this.viewTab = n
		},
		checkHistory: function(){ //健康档案
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
						vm.userInfoView = res.data.reportStr.userInfoView
						vm.inspectDateStr = res.data.reportStr.inspectDateStr
						vm.hartViews = res.data.reportStr.hartViews
						vm.vesselViews = res.data.reportStr.vesselViews
						vm.bloodViews = res.data.reportStr.bloodViews
						vm.mcrViews = res.data.reportStr.mcrViews
						vm.bpView = res.data.reportStr.bpView
						//vm.xueyaresult = vm.bpView.inspectGuideBp6.metricName
						vm.resultViews = res.data.reportStr.resultViews
						vm.resultViews.forEach(function(item,index){
							if(item.data && item.data[0]){
								/*myApp.$set(item,'resultDetail','')
								myApp.$set(item,'resultExplain','')*/
								item.data.forEach(function(i){
									if(i.resultDetail){
										i.resultDetail = i.resultDetail.replace(/\n/g,'<br/>')
									}
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
						vm.arrMin = vm.analysedWaveform.pwavedata.min();
						console.log(vm.arrMin);
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
						
						vm.wheelsort(res.data.reportStr.deviceSnNum,reportId);
						
						creatChart('main',vm.xlist,vm.analysedWaveform.pwavedata,vm.markLineList,vm.arrMin)
						vm.count++
					}else{
						console.log('code = '+res.code)
					}
				},
				error : function(obj,msg){alert("mk701/indexAll error")}
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
					        	vm.swi()
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
		
		//关注企业微信
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
		wheelsort: function(deviceSn,reportId){ //广告接口  banner_page 1:首页轮播，101膳食 102营养  103运动
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
								console.log(vm.showBanData3)
							}
						});
					}
				},
				error: function(){console.log('wheelsort error')}
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
	$('#showQiye').css({"visibility":"hidden","opacity":"0"});
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
          min: 0,
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


