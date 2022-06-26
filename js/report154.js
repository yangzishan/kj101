var reqUrl = window.location.href;
var view_Width = $(window).width();
 if(view_Width > 750){view_Width = 750}
console.log('window w='+view_Width);
var reportId = getQueryString("reportId") || 'KH503KS0000086U211130095818262';
var userId = getQueryString("userId");
var openId = getQueryString("openId");
var saasId = getQueryString("saasId");
var clientType = getQueryString("clientType");
var reportType = getQueryString("reportType");
$('.load-overlay').css("display","block");
$('.my_view').css("visibility","hidden");
var myapp = new Vue({
	el: '.my_view',
	data: function(){
		return{
			deviceSnNum:'',
			sex:'',
			map:{},
			indexPage: {},
			firstPages:[],
			otherPages:[],
			diseases:[],
			deviceInfo:{}, //设备信息
			my_thirdPages:[],
			inspectSkinView:{},
			heartLines:[],
			xlist:[],
			yylist:[], //心电图数据
			bloodOxygenValue:{},
			ecg:{},
			loopSys:[],
			mianyili:{},
			feiGongneng:{},
			inspectSkinView:{},
			skinColor:{
				'toubai':'透白',
				'baixi':'白皙',
				'ziran':'自然',
				'xiaomai':'小麦',
				'anchen':'暗沉',
				'youhei':'黝黑',
			},
			diseaseResultArr:{
				'CC':'痤疮',
				'MGJF':'敏感皮肤',
				'PY':'皮炎',
				'NONE':'健康'
			},
			diseaseResult:[],
			someTit:'', //弹框用
			someTxt:'', //弹框用
			showNao:false, showFei:false,showWei:false,showGuge:false,
			printUrl: testHealthUrl+'/print/print151.html?reportId='+reportId+'&viewType=2'+'&reportType='+reportType+'&printReportType=2',
		}
	},
	mounted: function(){
		this.getIndexData();
		//this.getDeviceInfo();
		this.bloodOxygen();
		this.getLoopSystem();
		this.getMianyiSystem();
		this.getFeiSystem();
	},
	methods:{
		getIndexData:function(){
			var vm = this;
			$.ajax({
				type:"post",
				url: dataUrl+"/api/azy/reportData/indexAll",
				dataType:"Json",
				data:{
					reportId: reportId,
					customerId: userId
				},
				success:function(res){
					if(res.code == 200){
						$('.my_view').css("visibility","visible");
						$('.load-overlay').css("display","none");
						var arraySlnl=[],arrayXt=[];
						res.data.firstPages.forEach(function(el,index){
							if(el.targetFirstId != 3087 && el.targetFirstId != 9001 ){  //去掉微循环和循环系统 
								if(el.targetFirstName == '循环系统' && el.score < 90){
									vm.showNao = true
								}else if(el.targetFirstName == '呼吸系统' && el.score < 90){
									vm.showFei = true
								}else if(el.targetFirstName == '消化系统' && el.score < 90){
									vm.showWei = true
								}else if(el.targetFirstName == '骨骼系统' && el.score < 90){
									vm.showGuge = true
								};
								
								vm.firstPages.push(el)
								if(el.physiologicalAge !=null){
									arraySlnl.push(el.physiologicalAge);
									arrayXt.push(el.targetFirstName);
								}
							}
						});
						vm.indexPage = res.data.indexPage;
						vm.circleProScore(res.data.indexPage.totalScore);
						vm.my_thirdPages = res.data.thirdPages;
						vm.sex = res.data.map.sex,
						vm.inspectSkinView = res.data.inspectSkinView;
						if(vm.inspectSkinView){
							$.each(vm.inspectSkinView.diseaseResult.split(','),function(index,item){
									vm.diseaseResult.push(vm.diseaseResultArr[vm.inspectSkinView.diseaseResult.split(',')[index]]);
							})
						}	
						vm.map = res.data.map;
						vm.diseases = res.data.diseases;
						res.data.otherPages.forEach(function(el,index){
							if(el.targetThirdId != "3232"){  //去掉酸碱度
								if(el.targetThirdId == "3230"){
									el.targetThirdName = "心情"
								}else if(el.targetThirdId == "3231"){
									el.targetThirdName = "记忆力"
								}
								vm.otherPages.push(el)
							}
						});
						//生理年龄图
						createChart(arrayXt,arraySlnl,vm.indexPage.age,500);
					}
				},
				error:function(){
					alert("indexAll error")
				}
			});
		},
		//查询设备信息
		getDeviceInfo: function(){
			var vm = this;
			$.ajax({
				type:"post",
				url: dataUrl+"/api/azy/reportData/getNeByReportId",
				dataType:"Json",
				data:{
					reportId: reportId
				},
				success:function(res){
					if(res.code == 200){
						vm.deviceInfo = res.data
					}
				},
				error:function(){
					alert("getNeByReportId error")
				}
			});
		},
		//微循环功能 心血管功能
		bloodOxygen: function(){
			var vm = this;
			$.ajax({
				type:"post",
				url: dataUrl+"/api/azy/reportData/bloodOxygenValue",
				dataType:"Json",
				data:{
					inspectCode: reportId
				},
				success:function(res){
					if(res.code == 200){
						vm.bloodOxygenValue = res.data.bloodOxygenValue;
						vm.ecg = res.data.ecg;
						vm.heartLines = JSON.parse(res.data.ecg.heartLines);
						vm.heartLines.forEach(function(el,index){
							if(index <= 1500){
								vm.xlist.push(index)
								vm.yylist.push(el)
							}
							
						})
						creatChart('main',vm.xlist,vm.yylist)
					}
				},
				error:function(){
					alert("bloodOxygenValue error")
				}
			});
		},
		//肺功能
		getFeiSystem: function(){
			var vm = this;
			$.ajax({
				type:"post",
				url: dataUrl+"/api/v1/reportIndex/getTargetByFirst",
				dataType:"Json",
				data:{
					reportId: reportId,
					targetFirstId:3108
				},
				success:function(res){
					if(res.code == 200){
						vm.feiGongneng = res.data.secondPages[0]
					}
				},
				error:function(){
					alert("getTargetByFirst error")
				}
			});
		},
		//免疫功能
		getMianyiSystem: function(){
			var vm = this;
			$.ajax({
				type:"post",
				url: dataUrl+"/api/v1/reportIndex/getTargetByFirst",
				dataType:"Json",
				data:{
					reportId: reportId,
					targetFirstId:3135
				},
				success:function(res){
					if(res.code == 200){
						vm.mianyili = res.data.secondPages[0]
					}
				},
				error:function(){
					alert("getTargetByFirst error")
				}
			});
		},
		//循环系统
		getLoopSystem: function(){
			var vm = this;
			$.ajax({
				type:"post",
				url: dataUrl+"/api/v1/reportIndex/getTargetByFirst",
				dataType:"Json",
				data:{
					reportId: reportId,
					targetFirstId:3087
				},
				success:function(res){
					if(res.code == 200){
						res.data.secondPages[0].thirdPages.forEach(function(el,index){
							if(el.targetThirdId != "3207"){
								vm.loopSys.push(el)
							}
						})
						//vm.loopSys = res.data.secondPages[0].thirdPages;
						//console.log(vm.loopSys)
						if(vm.loopSys && vm.loopSys.length>0){
							setTimeout(function(){
								vm.loopSys.forEach(function(el,index){
									vm.circleProItem('#item'+index, el.score)
								})
							},500)
						}
						
					}
				},
				error:function(){
					alert("getTargetByFirst error")
				}
			});
		},
		circleProScore: function(val){
			var bg_img = './img/154/pro_m.png';
			var txt_color = "#333333"
			if(val >= 95){
				bg_img = './img/154/tscore01.png';
				txt_color = '#24A8BC';
			}else if(val >= 90 && val < 95){
				bg_img = './img/154/tscore02.png';
				txt_color = '#4CCFDB';
			}else if(val >= 85 && val < 90){
				bg_img = './img/154/tscore03.png';
				txt_color = '#4072DB';
			}else if(val >= 80 && val < 85){
				bg_img = './img/154/tscore04.png';
				txt_color = '#FFA418';
			}else if(val < 80){
				bg_img = './img/154/tscore05.png';
				txt_color = '#F97D34';
			}
			$('.circleScore').circleProgress({
			    value: val/100,
					size: (110/375)*view_Width,
					thickness:9,
					lineCap:"round",
					startAngle:Math.PI*2.536,
					emptyFill: "#fefefe",
					fill: {
					    color: 'rgba(0, 0, 0, .1)', // fallback color when image is not loaded
					    image: bg_img
					},
			}).on('circle-animation-progress', function(event, progress, stepValue) {
			    $('#totalScore').html(parseInt(100 * stepValue));
					$(this).find('.sco').css("color",txt_color);
			});
		},
		circleProItem: function(el,val){
			var img_url = "./img/154/pro_m.png";
			if(val >= 90){
				img_url = "./img/154/cir-z.png";
			}else if(val < 90 && val >= 80){
				img_url = "./img/154/cir-l.png";
			}else if(val < 80){
				img_url = "./img/154/cir-m.png";
			}
			$(el).circleProgress({
			    value: val/100,
					size: (95/375)*view_Width,
					thickness:8,
					lineCap:"round",
					startAngle:Math.PI*2.53,
					emptyFill: "#fefefe",
					fill: {
					    color: 'rgba(0, 0, 0, .1)', // fallback color when image is not loaded
					    image: img_url
					},
			}).on('circle-animation-progress', function(event, progress, stepValue) {
			    //$(this).find('#totalScore').html(parseInt(100 * stepValue));
			});
		},
		goSecond: function(item){ //埋点  十大系统点击
			var vm = this;
			if(item.targetFirstId == 9001){
				location.href = 'loop_az.html?reportId='+reportId+'&userId='+userId+'&targetFirstId='+item.targetFirstId+'&reportType='+reportType+'&deviceSn='+vm.deviceSnNum+'&'+new Date().getTime()
			}else{
				location.href = 'second3.html?reportId='+reportId+'&userId='+userId+'&targetFirstId='+item.targetFirstId+'&reportType='+reportType+'&deviceSn='+vm.deviceSnNum+'&'+new Date().getTime()
			}
		},
		goThird2: function(item){
			location.href = 'third.html?reportId='+reportId+'&targetId='+ item.targetId + '&userId='+userId+'&deviceSn='+this.deviceSnNum+'&reportType='+reportType+'&'+new Date().getTime()
		},
		goThird: function(item){
			if(item.targetThirdId == '3230'){
				console.log('情绪指数不跳转')
			}else{
				location.href = 'third.html?reportId='+reportId+'&targetId='+ item.targetThirdId + '&userId='+userId+'&deviceSn='+this.deviceSnNum+'&reportType='+reportType+'&'+new Date().getTime()
			}
		},
		goZhongji: function(item){
			location.href = 'second_zj.html?reportId='+reportId+'&diseaseId='+ item.diseaseId + '&userId='+userId+'&deviceSn='+this.deviceSnNum
		},
		getSuggest: function(e){ //健康建议
			location.href = 'z_pop.html?reportId='+reportId
		},
		getRecipesData: function(e){ //健康食谱
			location.href = 'recipes.html?reportId='+reportId+'&reportType='+reportType
		},
		gotoSkin:function(){
			location.href = 'skin_new.html?reportId='+reportId+'&reportType='+reportType+'&clientType='+clientType
		},
		originImg: function(){
			showMask()
			$('.orginImg').css({"visibility":"visible","opacity":"1"})
		},
		explain: function(){ //说明
			showMask();
			$('#showExplain').css({"visibility":"visible","opacity":"1"});
		},
		explain2: function(){ //说明
			showMask();
			$('#showNotice').css({"visibility":"visible","opacity":"1"});
		},
		godayin: function(){
			location.href = 'print/print151.html?reportId='+reportId+'&viewType=2'+'&reportType='+reportType+'&printReportType=2'
		},
		showSome: function(tit,txt){
			txt = txt.replace(/\/n|\\n/g,'<br>')
			this.someTit = tit
			this.someTxt = txt
			showMask();
			$('#showSome').css({"visibility":"visible","opacity":"1"});
		},
		closeall: function(){
			console.log('sss')
			tocloseall();
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

//生理年龄柱状图
function createChart (xarr,yarr,age,time){
	setTimeout(function(){
		var myChart = echarts.init(document.getElementById('ageChart'));
		var option = {
		    title: {
		       text: '',
		       show: false
		    },
		    tooltip: {},
		    legend: {
		        data:['十大系统']
		    },
				grid: {
					  top:20,
				    left: 15,
				    right: 20,
				    bottom:80
				},
		    xAxis: {
		        type:'category',
		        axisLabel:{
		            interval:0,
		            formatter:function(value){  
		               return value.split("").join("\n");  
		            } 
		        },
		        axisTick:{
		          show:false,  
		        },
		        axisLine:{
		          lineStyle:{
		              color:'#9b9b9b'
		          }
		        },
		        data: xarr
		    },
		    yAxis: {
						show: false,
		        name:'生理年龄（岁）',
		        nameLocation:'middle',
		        scale:true,
		        min:12,
		        axisTick:{
		            show:false,
		        },
		        axisLabel:{
		            show:false
		        },
		        axisLine:{
		            lineStyle:{
		                color:'#9b9b9b'
		            }
		        },
		        splitLine:{
		        	lineStyle:{
		        		color:'#eeeeee'
		        	}
		        }
		    },
		    series: [{
		        name: '',
		        type: 'bar',
		        color:'#5EA8DC',
		        barWidth: 15,
		        label:{
		            show:true,
		            position:'top',
		            formatter:'{c}岁',
								color:'#EDB57F'
		        },
		        markLine:{
		        	lineStyle:{
		                type:'solid',
		            },
		            data:[
		                {
		                    name: '平均线',
		                    yAxis: age,
		                    symbol:'none',
		                    symbolSize:2
		                }
		            ]
		        },
		        data: yarr
		    }]
		}; 
		myChart.setOption(option);
	},time)
};
//作脉搏图
function creatChart(el,xlist,ylist,){
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
    type: 'category',
    data: xlist,
		show:false,
  },
  yAxis: {
    type: 'value',
		show:false
  },
  series: [
    {
      data: ylist,
      type: 'line',
			showSymbol:false,
			lineStyle: {
				color:'#306FB7',
				width:1
			},
    }
  ]
};
  // 绘制图表
  myChart.setOption(option);
}

//截取URL 获取 getQueryString  //截取str 获取参数 getParameter