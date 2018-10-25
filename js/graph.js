new Vue({
	el: '.all_view',
   data() {
	   return {
		sex:'',
		userId:'',
		data:'',
		reportId:'',
		openId:''
	   }
   },
   mounted () {
	   this.customerId()
	   this.reverseMessage()
   },
   methods: {
	     // 通过url 请求参数
		customerId(){
			var _this = this 
			var sex = getQueryString("sex");
			var userId = getQueryString("userId");
			var reportId = getQueryString("reportId");
			var openId = getQueryString("openId");
			 _this.sex = sex
			 _this.userId = userId
			 _this.reportId = reportId
			 _this.openId = openId
		},
		// 导航
		indexHref(){
			window.location='index3.html?reportId='+this.reportId+'&openId='+this.openId+'&sex='+this.sex+'&userId='+this.userId
		},
		adviseHref(){
			window.location='z_pop3.html?reportId='+this.reportId+'&openId='+this.openId+'&sex='+this.sex+'&userId='+this.userId
		},
		recipeHref(){
			window.location='recipes3.html?reportId='+this.reportId+'&openId='+this.openId+'&sex='+this.sex+'&userId='+this.userId
		},
		graphHref(){
			window.location='graph.html?reportId='+this.reportId+'&openId='+this.openId+'&sex='+this.sex+'&userId='+this.userId
		},
   		reverseMessage() {
			var _this = this
		$.post(analysisreport+'/v3/select/select',
		   {
				customerId:this.userId
				//sex:0
		   },
		   function (data) {
			   _this.data = data.result
			   var arr=data.result.a1002
				for(var i=0;i<arr.length;i++){
					if(arr[i]>95){
						arr[i] = 2
					}else if(95 >= arr[i]  && arr[i] >= 90){
						arr[i] = 1
					}else{
						arr[i] = 0
					}
					
				}
				var arr1=data.result.a1001
				for(var i=0;i<arr1.length;i++){
					if(arr1[i] ==0){
						arr1[i] = 4
					}else if(arr1[i] ==1){
						arr1[i] = 3
					}else if(arr1[i] ==2){
						arr1[i] = 2
					}else if(arr1[i] ==3){
						arr1[i] = 1
					}else{
						arr1[i] = 0
					}
					
				}
				console.log(arr1);
			   setTimeout(function(){ 
					// 报告总分趋势
					var listA = echarts.init(document.getElementById('listA'));
					optionA = {
						// 距离左右的距离
						grid:{
							left:'15%',
							right:'15%',
						},
						// 标题
						title: {
							left: 'center',
							text: '报告总分',
							textStyle:{
								color:'#4aa59e',
							}
						},
						xAxis: {
							type: 'category',
							name: '时间',
							data: data.result.timeList,
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
									color: '#4aa59e'
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
								show:true,
								inside:true,
								lineStyle:{
									color:'#e2e2e2',
									width:'3'
								}
							},
						},
						yAxis: {
							type: 'value',
							name: '状态',
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
								textStyle: {
									color: '#4aa59e'
								}
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLine:{
								lineStyle:{
									color:'#e2e2e2',
									width:'3',
								},
							},
						},
						series: [{
							data: data.result.totalScore,
							type: 'line',
							color:'#58d1c7'
						}],
						
					};
					listA.setOption(optionA);
					// 快乐指数趋势
					var listB = echarts.init(document.getElementById('listB'));
					optionB = {
						grid:{
							left:'15%',
							right:'15%',
						},
						title: {
							left: 'center',
							text: '快乐指数',
							textStyle:{
								color:'#4aa59e',
							}
						},
						xAxis: {
							type: 'category',
							name: '时间',
							data: data.result.timeList,
							splitLine:{
								show:false
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#4aa59e'
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
								show:true,
								inside:true,
								lineStyle:{
									color:'#e2e2e2',
									width:'3'
								}
							},
						},
						yAxis: {
							type: 'category',
							name: '状态',
							data:['郁闷','压抑','平和','愉悦','快乐'],
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
								textStyle: {
									color: '#4aa59e'
								}
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLine:{
								lineStyle:{
									color:'#e2e2e2',
									width:'3',
								},
							},
						},
						series: [{
							data: data.result.a1001,
							type: 'line',
							color:'#58d1c7'
						}]
					};
					listB.setOption(optionB);

					// 睡眠质量趋势
					var listC = echarts.init(document.getElementById('listC'));
					optionC = {
						grid:{
							left:'15%',
							right:'15%'
						},
						title: {
							left: 'center',
							text: '睡眠质量',
							textStyle:{
								color:'#4aa59e',
							}
						},
						xAxis: {
							type: 'category',
							name: '时间',
							data: data.result.timeList,
							splitLine:{
								show:false
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#4aa59e'
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
								show:true,
								inside:true,
								lineStyle:{
									color:'#e2e2e2',
									width:'3'
								}
							},
						},
						yAxis: {
							type: 'category',
							name: '状态',
							data:['一般','正常','良好'],
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
								textStyle: {
									color: '#4aa59e'
								}
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLine:{
								lineStyle:{
									color:'#e2e2e2',
									width:'3',
								},
							},
						},
						series: [{
							data: arr,
							type: 'line',
							color:'#58d1c7'
						}]
					};
					listC.setOption(optionC);
					// BMI
					var listD = echarts.init(document.getElementById('listD'));
					optionD = {
						grid:{
							left:'15%',
							right:'15%'
						},
						title: {
							left: 'center',
							text: 'BMI趋势',
							textStyle:{
								color:'#4aa59e',
							}
						},
						xAxis: {
							type: 'category',
							name: '时间',
							data: data.result.timeList,
							splitLine:{
								show:false
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#4aa59e'
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
								show:true,
								inside:true,
								lineStyle:{
									color:'#e2e2e2',
									width:'3'
								}
							},
						},
						yAxis: {
							type: 'value',
							name: '状态',
							// data:[18.5,24,28],
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
									color:['rgba(60,199,188,0.9)','rgba(60,199,188,0.7)','rgba(60,199,188,0.4)','rgba(60,199,188,0.2)','rgba(60,199,188,0.1)','rgba(60,199,188,0.05)','rgba(60,199,188,0.05)','rgba(60,199,188,0.05)'] ,
								}
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#4aa59e'
								}
							},
							axisLine:{
								lineStyle:{
									color:'#e2e2e2',
									width:'3',
								},
							},
						},
						series: [{
							data: data.result.a1004,
							type: 'line',
							color:'#58d1c7'
						}]
					};
					listD.setOption(optionD);
					// 营养状态趋势
					var listE = echarts.init(document.getElementById('listE'));
					optionE = {
						grid:{
							left:'15%',
							right:'15%'
						},
						title: {
							left: 'center',
							text: '营养状态',
							textStyle:{
								color:'#4aa59e',
							}
						},
						xAxis: {
							type: 'category',
							name: '时间',
							data: data.result.timeList,
							splitLine:{
								show:false
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#4aa59e'
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
								show:true,
								inside:true,
								lineStyle:{
									color:'#e2e2e2',
									width:'3'
								}
							},
						},
						yAxis: {
							type: 'value',
							name: '状态',
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
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#fff'
								}
							},
							axisLine:{
								lineStyle:{
									color:'#e2e2e2',
									width:'3',
								},
							},
						},
						series: [{
							data: data.result.a1005,
							type: 'line',
							color:'#58d1c7'
						}]
					};
					listE.setOption(optionE);
					// 免疫能力趋势
					var listF = echarts.init(document.getElementById('listF'));
					optionF = {
						grid:{
							left:'15%',
							right:'15%'
						},
						title: {
							left: 'center',
							text: '免疫能力',
							textStyle:{
								color:'#4aa59e',
							}
						},
						xAxis: {
							type: 'category',
							name: '时间',
							data: data.result.timeList,
							splitLine:{
								show:false
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#4aa59e'
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
								show:true,
								inside:true,
								lineStyle:{
									color:'#e2e2e2',
									width:'3'
								}
							},
						},
						yAxis: {
							type: 'value',
							name: '状态',
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
								textStyle: {
									color: '#fff'
								}
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLine:{
								lineStyle:{
									color:'#e2e2e2',
									width:'3',
								},
							},
						},
						series: [{
							data: data.result.a1006,
							type: 'line',
							color:'#58d1c7'
						}]
					};
					listF.setOption(optionF);
					// 消化能力趋势
					var listG = echarts.init(document.getElementById('listG'));
					optionG = {
						grid:{
							left:'15%',
							right:'15%'
						},
						title: {
							left: 'center',
							text: '消化能力',
							textStyle:{
								color:'#4aa59e',
							}
						},
						xAxis: {
							type: 'category',
							name: '时间',
							data: data.result.timeList,
							splitLine:{
								show:false
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#4aa59e'
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
								show:true,
								inside:true,
								lineStyle:{
									color:'#e2e2e2',
									width:'3'
								}
							},
						},
						yAxis: {
							type: 'value',
							name: '状态',
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
								textStyle: {
									color: '#fff'
								}
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLine:{
								lineStyle:{
									color:'#e2e2e2',
									width:'3',
								},
							},
						},
						series: [{
							data: data.result.a1007,
							type: 'line',
							color:'#58d1c7'
						}]
					};
					listG.setOption(optionG);
					// 吸收能力趋势
					var listH = echarts.init(document.getElementById('listH'));
					optionH = {
						grid:{
							left:'15%',
							right:'15%'
						},
						title: {
							left: 'center',
							text: '吸收能力',
							textStyle:{
								color:'#4aa59e',
							}
						},
						xAxis: {
							type: 'category',
							name: '时间',
							data: data.result.timeList,
							splitLine:{
								show:false
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#4aa59e'
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
								show:true,
								inside:true,
								lineStyle:{
									color:'#e2e2e2',
									width:'3'
								}
							},
						},
						yAxis: {
							type: 'value',
							name: '状态',
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
								textStyle: {
									color: '#fff'
								}
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLine:{
								lineStyle:{
									color:'#e2e2e2',
									width:'3',
								},
							},
						},
						series: [{
							data: data.result.a1008,
							type: 'line',
							color:'#58d1c7'
						}]
					};
					listH.setOption(optionH);
					// 代谢能力趋势
					var listI = echarts.init(document.getElementById('listI'));
					optionI = {
						grid:{
							left:'15%',
							right:'15%'
						},
						title: {
							left: 'center',
							text: '代谢能力',
							textStyle:{
								color:'#4aa59e',
							}
						},
						xAxis: {
							type: 'category',
							name: '时间',
							data: data.result.timeList,
							splitLine:{
								show:false
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#4aa59e'
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
								show:true,
								inside:true,
								lineStyle:{
									color:'#e2e2e2',
									width:'3'
								}
							},
						},
						yAxis: {
							type: 'value',
							name: '状态',
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
								textStyle: {
									color: '#fff'
								}
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLine:{
								lineStyle:{
									color:'#e2e2e2',
									width:'3',
								},
							},
						},
						series: [{
							data: data.result.a1009,
							type: 'line',
							color:'#58d1c7'
						}]
					};
					listI.setOption(optionI);
					// 男性功能
					var listJ = echarts.init(document.getElementById('listJ'));
					optionJ = {
						grid:{
							left:'15%',
							right:'15%'
						},
						title: {
							left: 'center',
							text: '男性功能',
							textStyle:{
								color:'#4aa59e',
							}
						},
						xAxis: {
							type: 'category',
							name: '时间',
							data: data.result.timeList,
							splitLine:{
								show:false
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#4aa59e'
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
								show:true,
								inside:true,
								lineStyle:{
									color:'#e2e2e2',
									width:'3'
								}
							},
						},
						yAxis: {
							type: 'value',
							name: '状态',
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
								textStyle: {
									color: '#4aa59e'
								}
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLine:{
								lineStyle:{
									color:'#fff',
									width:'3',
								},
							},
						},
						series: [{
							data: data.result.a1010,
							type: 'line',
							color:'#58d1c7'
						}]
					};
					listJ.setOption(optionJ);
					
					// 女性功能趋势
					var listK = echarts.init(document.getElementById('listK'));
					optionK = {
						grid:{
							left:'15%',
							right:'15%'
						},
						title: {
							left: 'center',
							text: '女性功能',
							textStyle:{
								color:'#4aa59e',
							}
						},
						xAxis: {
							type: 'category',
							name: '时间',
							data: data.result.timeList,
							splitLine:{
								show:false
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#4aa59e'
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
								show:true,
								inside:true,
								lineStyle:{
									color:'#e2e2e2',
									width:'3'
								}
							},
						},
						yAxis: {
							type: 'value',
							name: '状态',
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
								textStyle: {
									color: '#fff'
								}
							},
							nameTextStyle:{
								color:'#9f9f9f',
							},
							axisLine:{
								lineStyle:{
									color:'#e2e2e2',
									width:'3',
								},
							},
						},
						series: [{
							data: data.result.a1011,
							type: 'line',
							color:'#58d1c7'
						}]
					};
					listK.setOption(optionK);
				}, 1000);
			}
	   		)
	   },
	 
   },
})
// 获取url参数方法
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

// 返回上一页
$('#go-back').click(function(){
	window.history.back();
})