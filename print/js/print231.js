var go = -1;
function goPrint(n){
	if(n == 1){
		setTimeout(function(){
			window.print();
		},300)
	}
};
var reportId = (getQueryString("reportId") || 'KJ20190923103403481');
var viewType = getQueryString("viewType");  //1 打印  2预览
if(viewType == 1){go = 0};
var indexData = analysisreport+'/psyc/report2/printPsyc231Report'



var v = new Vue({
	el:'#app',
	data:function(){
		return{
			res:{},
			moodViewsList:[],
			metricViews:[],
			leidaArr1 : [], // 测量值
	    leidaArr2 : [], // 平均值
	    leidaTitle: [], //名称
		}
	},
	mounted:function(){
		this.getData()
	},
	methods:{
		getData:function(){
			var vm = this
			$.ajax({
				type:"post",
				url: indexData,
				dataType:'Json',
				data:{
					reportId:reportId
				},
				success:function(res){
					vm.res = res.result
					vm.metricViews = res.result.metricViews
					res.result.moodViews.forEach(function(item,index,arr){
						vm.moodViewsList = vm.moodViewsList.concat(item.split('、'))
					})
					
					vm.filterData()
					go++
					goPrint(go)
				},
				error:function(){alert('printPsyc231Report error')}
			});
		},
		filterData: function(){
			var vm = this
			vm.metricViews.forEach(function(item,index,arr){
				vm.leidaArr1.push(item.targetScore)
				vm.leidaArr2.push(item.avgScore)
				vm.leidaTitle.push(item.metricName)
				var ele = 'qu'+index
				var valArray = [],dateArray = [];
				if(item.historyTrendViews){
					for(var i=item.historyTrendViews.length-1;i>=0;i--){
						valArray.push(item.historyTrendViews[i].score)
	          			dateArray.push(item.historyTrendViews[i].inspectDate.substring(5,10))
					}
				};
				console.log(ele,valArray,dateArray);
            	trendChart(ele,valArray,dateArray,100);
				vm.metricViews[index]['jianyi'] = [];
				if(item.threshholdSuggestion){
					vm.metricViews[index]['jianyi']  = item.threshholdSuggestion.split('\n') 
				}
			})
			console.log('测量值',vm.leidaArr1)
			console.log('平均值',vm.leidaArr2)
			gochart();
			gophy();
		}
	}
});

			function trendChart(el,val,date,time){
        setTimeout(function(){
          var qushi = echarts.init(document.getElementById(el));
          var ou = {
                title : {
                    text: '',
                    subtext: ''
                },
                tooltip : {
                    trigger: 'axis',
                    show:false
                },
                legend: {
                    data:['',''],
                    selectedMode:false,
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                //calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : date,
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#9B9B9B',//左边线的颜色
                                width:'1'//坐标线的宽度
                            }
                        },
                        axisLabel: {  
                          //interval:0,  
                          //show: true,
                          textStyle: {
                              color: '#9B9B9B',
                              fontSize:12
                          }
                        },
                        axisTick:{
                          lineStyle:{color:'#9B9B9B'}    // x轴刻度的颜色
                        },

                        splitLine :{    //网格线
                            lineStyle:{
                                type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
                            },
                            show:false //隐藏或显示
                        },
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitNumber:4,
                        // data : ['过高','偏高','适中','偏低','过低'],
                        axisLabel : {
                          // formatter : ['过高','偏高','适中','偏低','过低'],
                          // textStyle : {
                          //   // baseline:'middle'
                          // }
                            formatter: function (value) {
                              var texts = [];
                              if(value==0){
                              texts.push('过低');
                              }
                              else if (value <=25 && value > 0) {
                              texts.push('偏低');
                              }
                              else if (value<= 50 && value > 25) {
                              texts.push('适中');
                              }
                              else if(value<= 75 && value > 50){
                              texts.push('偏高');
                              }
                              else{
                              texts.push('过高');
                              }
                              return texts;
                            },
                            textStyle: {
                              color: '#9B9B9B',
                              fontSize:12
                          }
                        },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#9B9B9B',//左边线的颜色
                                width:'1'//坐标线的宽度
                            }
                        },
                        splitLine :{    //网格线
                            lineStyle:{
                                type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
                            },
                            show:true //隐藏或显示
                        }
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'line',
                        smooth: false,             
                        symbol:'emptyCircle',//拐点样式
                        symbolSize:[3,3],
                        data:val,
                        itemStyle : {  
                          normal : {  
                            color:'#6A7AFB',  
                            lineStyle:{  
                                color:'#6A7AFB'  
                            }  
                          }  
                        }, 
                    }
                ]
            };
            qushi.setOption(ou);
        },time)   
      };
      function gochart(){
        var myChart = echarts.init(document.getElementById('main'))
        var option = {
          title : {
              text: '',
              subtext: ''
          },
          tooltip : {
              trigger: 'axis',
              show:false
          },
          legend: {
              x : 'center',
              data:[''],
              selectedMode:false,
          },
          toolbox: {
              show : true
          },
          calculable : true,
          polar : [
            {
              indicator : [
                { text : '自信', max  : 100 },
                { text : '自我调节', max  : 100 },
                { text : '神经质', max  : 100 },
                { text : '攻击性', max  : 100 },
                { text : '焦虑', max  : 100 },
                { text : '抑郁', max  : 100 },
                { text : '压力', max  : 100 },
                { text : '平衡', max  : 100 },
                { text : '活力', max  : 100}
              ],
              center : ['50%', '50%'],
              radius : 100
            }
          ],
          series : [
            {
              type: 'radar',
              lineStyle: {
                color:'black'
              },
              itemStyle: {
                normal: {
                  color : "#88D4EA", // 图表中各个图区域的边框线拐点颜色
                    areaStyle: {
                      type: 'macarons',
                      color: [
                        'rgba(106,202,229,0.6)'
                      ]
                  }
                }
              },
              data : [
                {
                  value : v.leidaArr1 ,
                  name : '',
                  itemStyle: {
                    normal: {
                      color : "#6ACAE5", // 图表中各个图区域的边框线拐点颜色
                        lineStyle:{
                          color: [
                            'green'
                          ]
                        },
                        areaStyle: {
                          type: 'macarons',
                          color: [
                            'rgba(106,202,229,0.6)'
                          ]
                      }
                    }
                  },
                },
                {
                  value : v.leidaArr2 ,
                  name : '',
                  itemStyle: {
                    normal: {
                      color:'#DC7DEF',
                      lineStyle: {
                        type: 'dashed'
                      }
                    }
                  }
                }
              ]
            }
          ]
          
        };
          myChart.setOption(option); 
      }

      function gophy(){
        var myChart3 = echarts.init(document.getElementById('echa3'));
        // 指定图表的配置项和数据
        var option3 = {
              title : {
                  text: '',
                  subtext: ''
              },
              grid:{
                y2:80,
              },
              tooltip : {
                  trigger: 'axis',
                  show:false
              },
              legend: {
                  data:['',''],
                  selectedMode:false,
              },
              toolbox: {
                  show : false,
                  feature : {
                      mark : {show: true},
                      dataView : {show: true, readOnly: false},
                      magicType : {show: true, type: ['line', 'bar']},
                      restore : {show: true},
                      saveAsImage : {show: true}
                  }
              },
             // calculable : true,
              xAxis : [
                  {
                    type : 'category',
                    boundaryGap : false,
                    data : v.leidaTitle,
                    axisLine: {
                      lineStyle: {
                        type: 'solid',
                        color: '#9B9B9B',//左边线的颜色
                        width:'1'//坐标线的宽度
                      }
                    },
                    axisLabel: {  
                      interval:0,  
                      formatter:function(value){
                        return value.split("").join("\n");
                      },
                      textStyle:{
                        color:'#4A4A4A'
                      }
                    },
                    axisTick:{
                        lineStyle:{color:'#9B9B9B'}    // x轴刻度的颜色
                      },
                    splitLine :{    //网格线
                      lineStyle:{
                        type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
                      },
                      show:false //隐藏或显示
                    },
                  }
              ],
              yAxis : [
                  {
                      type : 'value',
                      splitNumber:5,
                      axisLabel : {
                          
                          formatter: function (value) {
                            var texts = [];
                            if(value==0){
                            texts.push('低');
                            }
                            else if (value <=25) {
                            texts.push(' ');
                            }
                            else if (value<= 50) {
                            texts.push(' ');
                            }
                            else if(value<= 75){
                            texts.push(' ');
                            }
                            else if(value == 100){
                            texts.push('高');
                            }
                            return texts;
                          },
                          textStyle:{
                            color:'#4A4A4A'
                          }
                    },
                      axisLine: {
                          lineStyle: {
                              type: 'solid',
                              color: '#9B9B9B',//左边线的颜色
                              width:'1'//坐标线的宽度
                          }
                      },
                      splitLine :{    //网格线
                          lineStyle:{
                              type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
                          },
                          show:true //隐藏或显示
                      }
                    
                  }
              ],
              series : [
                  {
                      name:'',
                      type:'line',
                      smooth: true,  //true 为平滑曲线，false为直线
                      symbol:'circle',//拐点样式
                      data:v.leidaArr1,
                      itemStyle : {  
                        normal : {  
                          color:'#7489FA',  
                          lineStyle:{  
                              color:'#7489FA'  
                          }  
                        }  
                      }, 
                  },
                  {
                      name:'',
                      type:'line',
                      data:v.leidaArr2,
                      smooth: true,  //true 为平滑曲线，false为直线
                      symbol:'circle',//拐点样式
                      itemStyle : {  
                        normal : {  
                          color:'#FA7979',  
                          lineStyle:{  
                              color:'#FA7979'  
                          }  
                        }  
                      }, 
                  }
              ]
          };
        myChart3.setOption(option3);
      };
			
//截取URL
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};