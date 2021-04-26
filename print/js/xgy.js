var reportId = (getQueryString('reportId') || 'MK701IS000000031613891822337');
var reportType = getQueryString('reportType');
var viewType = getQueryString("viewType");
var toPrint = true; 
if(viewType == 2){toPrint = false}
var vm = new Vue({
	el:'#app',
	data:function(){
		return{
			reportId: reportId,
			reportType:reportType,
			userInfoView:{},
			inspectDateStr:'',
			hartViews:[],
			vesselViews:[],
			bloodViews:[],
			mcrViews:[],
			resultViews:[],
			bpView:{},
			analysedWaveform:{},
			xlist:[],
			markLineList:[],
			fei:'',
			resultViewsCopy:[],
			arrMin:0,
			redayNum:0
		}
	},
	methods:{
		getData: function(){
			var vm = this
			$.ajax({
				url : dataUrl + "/api/mk701/print/printReport",
				type : "POST",
				dataType : 'json',
				data : {
				    reportId : reportId
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
						vm.resultViews = res.data.reportStr.resultViews
						vm.resultViews.forEach(function(item,index){
							if(item.data && item.data[0]){
								vm.$set(item,'resultDetail','')
								vm.$set(item,'resultExplain','')
								item.data.forEach(function(i){
									item.resultDetail += i.resultDetail
									item.resultExplain += i.resultExplain
								})
								item.resultExplain = item.resultExplain.replace(/\/n|\\n/g,'<br>')
							}
							if(item.metricType == "6"){
								vm.fei = item.resultex
							}
							if(item.metricType != "6" && item.metricType != "7"){
								vm.resultViewsCopy.push(item)
							}
						});
						vm.analysedWaveform = JSON.parse(res.data.reportStr.analysedWaveform)
						console.log('analysedWaveform',vm.analysedWaveform)
						vm.arrMin = vm.analysedWaveform.pwavedata.min()
						vm.analysedWaveform.pwavedata.forEach(function(i,index){
							vm.xlist.push(index) //作图x坐标轴
							
							vm.analysedWaveform.pmax.forEach(function(n){
								if(n == index && n != 0){
									vm.markLineList.push([{coord:[n,vm.arrMin],lineStyle:{color:'blue'}},{coord:[n,i]}])
								}
							});
							vm.analysedWaveform.pe.forEach(function(n){
								if(n == index && n != 0){
									vm.markLineList.push([{coord:[n,vm.arrMin],lineStyle:{color:'green'}},{coord:[n,i]}])
								}
							});
							vm.analysedWaveform.pf.forEach(function(n){
								if(n == index && n != 0){
									vm.markLineList.push([{coord:[n,vm.arrMin],lineStyle:{color:'#ff0000'}},{coord:[n,i]}])
								}
							});
							vm.analysedWaveform.pmin.forEach(function(n){
								if(n == index && n != 0){
									vm.markLineList.push([{coord:[n,vm.arrMin],lineStyle:{color:'#666666'}},{coord:[n,i]}])
								}
							});
						});
						console.log(vm.markLineList)
						vm.creatChart('chart',vm.xlist,vm.analysedWaveform.pwavedata,vm.markLineList,vm.arrMin)
						vm.redayNum++
						vm.gotoreday(vm.redayNum)
					}
				},
				error : function(obj,msg){alert("mk701/indexAll error")}
			});
		},
		creatChart: function(el,xlist,ylist,markLineList,min){
			var myChart = echarts.init(document.getElementById(el));
			  var option = {
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
			          name: '脉搏(m^3/ms)',
			          type: 'value',
			          min:min
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
			  vm.redayNum++
			  vm.gotoreday(vm.redayNum)
		},
		gotoreday:function(num){
			if(num ==2){
				setTimeout(function(){
					window.status = 'ready_to_print';
					console.log(window.status)
					if(toPrint){window.print();}
				},1000)
			}
		}
		
	},
	mounted:function(){
		this.getData()
	}
})
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
//截取URL
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};