var myapp = new Vue({
	el:'#app',
	data:function(){
		return {
			allData:[],
			one_list:{}, oneChart:[],
			two_list:{}, twoChart:[],
			three_list:{}, threeChart:[],
			four_list:{}, fourChart:[],
			five_list:[], fiveChart:[],
			six_list:[],sixChart:[],six2_list:[],six2Chart:[],
			seven_list:[],sevenChart:[],
			eight_list:[],eightChart:[],
			nine_list:[], nineChart:[],nine2_list:[],
			ten_list:[], tenlab:[],tenMan:[],tenWoman:[],
		}
	},
	methods:{
		findEnterpriseBrainReport:function(){
			var vm = this
			$.ajax({
				url : "http://kj2000-ysc.jiankangzhan.com/findEnterpriseBrainReport",
				type : "POST",
				dataType : 'json',
				data : {
				   search_key:'hOVxNOYVGm'
				},
				success : function(res) {
					if(res.code == 200){
						vm.allData = res.data
						vm.splitData()
					}
				},
				error : function(obj,msg){
					console.log('findEnterpriseBrainReport error')
					console.log(obj,msg)
				}
			});
		},
		//拆分
		splitData: function(){
			var vm = this
			vm.allData.forEach(function(item){
				if(item.tableId == 100){
					vm.one_list = item;
					item.data.forEach(function(site){
						var bid = {
							value: site.totalCnt,
							name: site.inspectCntName
						}
						vm.oneChart.push(bid)
					})
					creatPicChart('main',item.tableName,vm.oneChart)
				}else if(item.tableId == 200){
					vm.two_list = item
					item.data.forEach(function(site){
						var bid = {
							value: site.totalCnt,
							name: site.scoreName
						}
						vm.twoChart.push(bid)
					})
					creatPicChart('main1',item.tableName,vm.twoChart)
				}else if(item.tableId == 210){
					vm.three_list = item
					item.data.forEach(function(site){
						var bid = {
							value: site.totalCnt,
							name: site.scoreName
						}
						vm.threeChart.push(bid)
					})
					creatPicChart('main2',item.tableName,vm.threeChart)
				}else if(item.tableId == 220){
					vm.four_list = item
					item.data.forEach(function(site){
						var bid = {
							value: site.totalCnt,
							name: site.scoreName
						}
						vm.fourChart.push(bid)
					})
					creatPicChart('main3',item.tableName,vm.fourChart)
				}else if(item.tableId == 300){ 
					vm.five_list = item
					item.data.forEach(function(site){
						var bid = {
							product: site.age_name,
							'90分以上': site.goodCnt,
							'85到89分': site.mildCnt,
							'85分以下': site.moderateCnt
						}
						vm.fiveChart.push(bid)
					})
					creatZhuChart('main5',item.tableName,vm.fiveChart)
				}else if(item.tableId == 310){
					vm.six2_list = item
					item.data.forEach(function(site){
						var bid = {
							product: site.age_name,
							'90分以上': site.goodCnt,
							'85到89分': site.mildCnt,
							'85分以下': site.moderateCnt
						}
						vm.six2Chart.push(bid)
					})
					creatZhuChart('main6_2',item.tableName,vm.six2Chart)
				}else if(item.tableId == 320){
					vm.six_list = item
					item.data.forEach(function(site){
						var bid = {
							product: site.age_name,
							'90分以上': site.goodCnt,
							'85到89分': site.mildCnt,
							'85分以下': site.moderateCnt
						}
						vm.sixChart.push(bid)
					})
					creatZhuChart('main6',item.tableName,vm.sixChart)
				}else if(item.tableId == 400){
					vm.eight_list = item
					item.data.forEach(function(site,index){
						var list = [
							{value: site.goodCnt,name: '正常'},
							{value: site.mildCnt,name: '轻度风险'},
							{value: site.moderateCnt,name: '中度风险'}
						]
						creatPicChart2('xt'+index,site.metric_name,list)
					})
					
				}else if(item.tableId == 510){
					vm.nine2_list = item
					item.data.forEach(function(site,index){
						var list = [
							{value: site.goodCnt,name: '正常'},
							{value: site.mildCnt,name: '轻度风险'},
							{value: site.moderateCnt,name: '中度风险'}
						]
						creatPicChart3('man_yc'+index,'',list)
					})
				}else if(item.tableId == 520){
					vm.nine_list = item
					item.data.forEach(function(site,index){
						var list = [
							{value: site.goodCnt,name: '正常'},
							{value: site.mildCnt,name: '轻度风险'},
							{value: site.moderateCnt,name: '中度风险'}
						]
						creatPicChart3('nv_yc'+index,'',list)
					})
				}else if(item.tableId == 600){
					vm.ten_list = item
					item.data.forEach(function(site){
						vm.tenlab.push(site.age_name)
						vm.tenMan.push(site.manCnt)
						vm.tenWoman.push(site.womanCnt)
					})
					creatSexchart('main7',item.tableName,vm.tenlab,vm.tenMan,vm.tenWoman)
				}
			})
		}
	},
	mounted:function(){
		this.findEnterpriseBrainReport()
	}
});

function creatPicChart(el,titname,arr){
	setTimeout(function(){
		var myChart = echarts.init(document.getElementById(el));
		var option = {
		    title: {
		        text: titname,
		        subtext: '',
		        left: 'center'
		    },
		    tooltip: {
		        trigger: 'item',
		        formatter: '{a} <br/>{b} : {c} ({d}%)'
		    },
		    legend: {
		        //orient: 'vertical',
		        left: 'center',
		        top:28
		    },
		    series: [
		        {
		            name: '占比',
		            type: 'pie',
		            radius: '55%',
		            center: ['50%', '60%'],
		            data: arr,
		            emphasis: {
		                itemStyle: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		};
		myChart.setOption(option);
	},500)	
};
function creatPicChart2(el,titname,arr){
	setTimeout(function(){
		var myChart = echarts.init(document.getElementById(el));
		var option = {
		    title: {
		        text: titname,
		        subtext: '',
		        left: 'center'
		    },
		    color:['#7fab54','#4f81bd', '#fc817b', '#d48265'],
		    tooltip: {
		        trigger: 'item',
		        formatter: '{a} <br/>{b} : {c} ({d}%)'
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'center',
		        bottom:0
		    },
		    series: [
		        {
		            name: '占比',
		            type: 'pie',
		            radius: '55%',
		            center: ['50%', '40%'],
		            radius:70,
		            label: {
		                position: 'inner',
		                formatter: '{d}%',
		            },
		            data: arr,
		            emphasis: {
		                itemStyle: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		};
		myChart.setOption(option);
	},500)	
};
function creatPicChart3(el,titname,arr){
	setTimeout(function(){
		var myChart = echarts.init(document.getElementById(el));
		var option = {
		    title: {
		        text: titname,
		        subtext: '',
		        left: 'center'
		    },
		    color:['#7fab54','#4f81bd', '#fc817b', '#d48265'],
		    tooltip: {
		        trigger: 'item',
		        formatter: '{a} <br/>{b} : {c} ({d}%)'
		    },
		    legend: {
		        orient: 'horizontal',
		        left: 'center',
		        bottom:0
		    },
		    series: [
		        {
		            name: '占比',
		            type: 'pie',
		            radius: '55%',
		            center: ['50%', '40%'],
		            radius:68,
		            label: {
		                position: 'inner',
		                formatter: '{d}%',
		            },
		            data: arr,
		            emphasis: {
		                itemStyle: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		};
		myChart.setOption(option);
	},500)	
}

function creatZhuChart(el,titname,arr){
	setTimeout(function(){
		var myChart = echarts.init(document.getElementById(el));
		var optionzhu = {
		    legend: {},
		    tooltip: {},
		    dataset: {
		        dimensions: ['product', '90分以上', '85到89分', '85分以下'],
		        source: arr
		    },
		    xAxis: {type: 'category'},
		    yAxis: {},
		    // Declare several bar series, each will be mapped
		    // to a column of dataset.source by default.
		    series: [
		        {type: 'bar'},
		        {type: 'bar'},
		        {type: 'bar'}
		    ]
		};
		myChart.setOption(optionzhu);	
	},500)
}


//var myChart6 = echarts.init(document.getElementById('main6'));
//var optionzhu = {
//  legend: {},
//  tooltip: {},
//  dataset: {
//      dimensions: ['product', '2015', '2016', '2017'],
//      source: [
//          {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
//          {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
//          {product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5},
//          {product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1}
//      ]
//  },
//  xAxis: {type: 'category'},
//  yAxis: {},
//  // Declare several bar series, each will be mapped
//  // to a column of dataset.source by default.
//  series: [
//      {type: 'bar'},
//      {type: 'bar'},
//      {type: 'bar'}
//  ]
//};
//myChart6.setOption(optionzhu);

function creatSexchart(el,titname,arrlab,arr1,arr2){
	setTimeout(function(){
		var myChart = echarts.init(document.getElementById(el));
		var optionzhe = {
		    title: {
		        text: ''
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data: ['男性', '女性']
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    toolbox: {
		        feature: {
		            saveAsImage: {}
		        }
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: arrlab
		    },
		    yAxis: {
		        type: 'value'
		    },
		    series: [
		        {
		            name: '男性',
		            type: 'line',
		            stack: '总量',
		            data: arr1
		        },
		        {
		            name: '女性',
		            type: 'line',
		            stack: '总量',
		            data: arr2
		        },
		    ]
		};
		myChart.setOption(optionzhe);
	},500)
}