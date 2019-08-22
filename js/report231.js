$(function(){
      var url = analysisreport + '/psyc/report2/queryPsyc231Index'
      var reportId = (getQueryString('reportId') || 'KJ20190710152833739');
      var customerId = (getQueryString('userId') || '163'); 
      var openId = getQueryString('openId');
      var reportType = getQueryString('reportType');
      var saasId = getQueryString('saasId');
      var clientType = getQueryString("clientType"); 
      var reportSource = getQueryString("reportSource"); //通过解析获得
      var resource = getQueryString("resource");
      var source = (getQueryString('source') || '');  //通过解析获得 或 app传递
      var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&openId='+openId+'&saasId='+saasId+'&clientType='+clientType+'&source='+source
      if(!openId || clientType){
        //alert('now in app');
        gohistoryUrl = 'historyRecord.html?userId='+customerId+'&saasId='+saasId+'&resource='+resource+'&clientType='+clientType+'&source='+source
      }
      function go(){
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
                { text : '', max  : 100 },
                { text : '', max  : 100 },
                { text : '', max  : 100 },
                { text : '', max  : 100 },
                { text : '', max  : 100 },
                { text : '', max  : 100 },
                { text : '', max  : 100 },
                { text : '', max  : 100 },
                { text : '', max  : 100}
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

      function pys(){
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
              calculable : true,
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
                calculable : true,
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
                          interval:0,  
                          show: true,
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

      function swi(){
        var swiper = new Swiper('.swiper-container', {
          slidesPerView: 3,
          spaceBetween: 0,
          centeredSlides: true,
          loop: false,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },on: {
            slideChangeTransitionEnd: function(){
              // console.log(this.activeIndex + 1); 
              $('.jiedu').hide()
              $('.jie' + (this.activeIndex + 1) ).show()
            },
          },
        });
      }
      function ban(){
        $('.btn').on('click',function(){
          var targ = $(this).attr('data-go')
          $(this).parents('[data-target=tu]').hide()
          $('.'+targ).show()
        })
      }
      


      // 获取url参数方法
      function getQueryString(name) {
        var    result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
      };

      var v = new Vue({
        el : '#app',
        data : function(){
          return {
            nickName: '',
            inspectDate:'',
            inspectDateStr: '',
            metricId:'',
            sex:'',
            info : {},
            leidaArr1 : [], // 测量值
            leidaArr2 : [], // 平均值
            leidaTitle: [], //名称
            leidaObj1 : [
              {leidaNo : 0 , jdNo : 4 , celiangNum : -2 , pingjunNum : -1 , left: 0 , leftP : 0 , width : 0 , leidaH : '攻击性' ,   leidaT : '123' , title : '' , Max: 0 , Min : 0 , biaoqian : '' , textD : '' , leidaName : '攻击性'},
              {leidaNo : 1 , jdNo : 3 , celiangNum : -2 , pingjunNum : -1 , left: 0 , leftP : 0 , width : 0 , leidaH : '神经质' ,   leidaT : '' , title : '' , Max: 0 , Min : 0 , biaoqian : '' , textD : '' , leidaName : '神经质'},
              {leidaNo : 2 , jdNo : 2 , celiangNum : -2 , pingjunNum : -1 , left: 0 , leftP : 0 , width : 0 , leidaH : '抑郁' ,     leidaT : '' , title : '' , Max: 0 , Min : 0 , biaoqian : '' , textD : '' , leidaName : '抑郁'},
              {leidaNo : 3 , jdNo : 7 , celiangNum : -2 , pingjunNum : -1 , left: 0 , leftP : 0 , width : 0 , leidaH : '自我调节' , leidaT : '' , title : '' , Max: 0 , Min : 0 , biaoqian : '' , textD : '' , leidaName : '自我调节'},
              {leidaNo : 4 , jdNo : 6 , celiangNum : -2 , pingjunNum : -1 , left: 0 , leftP : 0 , width : 0 , leidaH : '活力' ,     leidaT : '' , title : '' , Max: 0 , Min : 0 , biaoqian : '' , textD : '' , leidaName : '活力'},
              {leidaNo : 5 , jdNo : 5 , celiangNum : -2 , pingjunNum : -1 , left: 0 , leftP : 0 , width : 0 , leidaH : '自信' ,     leidaT : '' , title : '' , Max: 0 , Min : 0 , biaoqian : '' , textD : '' , leidaName : '自信'},
              {leidaNo : 6 , jdNo : 8 , celiangNum : -2 , pingjunNum : -1 , left: 0 , leftP : 0 , width : 0 , leidaH : '平衡' ,     leidaT : '' , title : '' , Max: 0 , Min : 0 , biaoqian : '' , textD : '' , leidaName : '平衡'},
              {leidaNo : 7 , jdNo : 1 , celiangNum : -2 , pingjunNum : -1 , left: 0 , leftP : 0 , width : 0 , leidaH : '焦虑' ,     leidaT : '' , title : '' , Max: 0 , Min : 0 , biaoqian : '' , textD : '' , leidaName : '焦虑'},
              {leidaNo : 8 , jdNo : 0 , celiangNum : -2 , pingjunNum : -1 , left: 0 , leftP : 0 , width : 0 , leidaH : '压力' ,     leidaT : '' , title : '' , Max: 0 , Min : 0 , biaoqian : '' , textD : '' , leidaName : '压力'}
            ],
            valueMax : 100,
            valueMin : 0,
            zhinan : '1、本潜在情绪测试报告可协助您了解自身的各类情绪状态，建议您认真阅读。如果在阅读的过程中有不明白的地方或疑问，可向专业人士咨询。<br/>2、本测试报告可作为您评估自身情绪状态的一个参考，而不是诊断。如果需要，强烈建议您向专业人士做进一步的咨询和帮助。<br/>3、本测试报告分为四大部分。第一部分为情绪画像。您可快速了解自己的情绪关键特征；第二部分为情绪指数。通过雷达图和曲线图，您可直观了解自己的情绪状态；第三部分为情绪解读。您可了解到各情绪指标的详细解读、建议、分析、历史测试变化趋势等信息。', //指南
            moodViews:[],
            moodViewsList:[],
            metricViews:[],

          }
        },
        methods: {
          // history
          gohistory : function(){
            window.location = gohistoryUrl;
          },
          Touchmove:function(){
            $('.mask').removeClass('show');
            $('.popup').removeClass('show');
            $('body').css({'position':'static'}); 
            $(window).scrollTop(sTop);
          },
          stopTouchmove:function(event){
            $('.mask').addClass('show');
            $('.popup').addClass('show');
            sTop = $(window).scrollTop();
            $('body').css({'position':'fixed','top':-sTop,'width':'7.5rem'});      
            var curr = $(event.currentTarget) 
            $('.popup h1').text(curr.attr('data-h'))
            $('.popup .huadong').html(curr.attr('data-t'))
          },
          //请求数据
          queryPsyc231Index: function(){
            var vm = this;
            var that = this;
            $.ajax({
              type:'post',
              url:url,
              dataType:'Json',
              data:{
                reportId:reportId,
                customerId:customerId,
                saasId:saasId
              },
              success:function(res){
                
                if(res.code == 200){
                  vm.nickName = res.result.nickName
                  vm.inspectDateStr = res.result.inspectDateStr
                  vm.sex = res.result.sex
                  vm.moodViews = res.result.moodViews
                  vm.metricId = res.result.metricId
                  setTimeout(function(){vm.filterData()},1000)
                  for(var i = 0; i<vm.moodViews.length; i++){
                    vm.moodViewsList = vm.moodViewsList.concat(vm.moodViews[i].split('、'));
                    console.log(vm.moodViewsList);
                  }
                  vm.metricViews = res.result.metricViews
                  
                  for(var i=0; i< vm.metricViews.length;i++){
                    var ele = 'qu'+(i+1);
                    console.log(ele);
                    var valArray = [],dateArray = [];
                    if(vm.metricViews[i].historyTrendViews){
                      for(var n=vm.metricViews[i].historyTrendViews.length-1;n>=0;n--){
                        valArray.push(vm.metricViews[i].historyTrendViews[n].score)
                        dateArray.push(vm.metricViews[i].historyTrendViews[n].inspectDate.substring(5,10))
                      };
                    }
                    console.log(valArray,dateArray);
                    trendChart(ele,valArray,dateArray,1000); 
                  };
                  $.each(vm.metricViews,function(index,item){
                    console.log(item)
                    // that.leidaObj1[index].left = item.celiangNum / 100
                    setTimeout(function(){
                      var width =  (item.targetScore - that.valueMin ) / (that.valueMax - that.valueMin) >  0 ? ((1 - (item.targetScore - that.valueMin ) / (that.valueMax - that.valueMin))  * 5.23 ) + .045 : ((1 - (item.targetScore - that.valueMin ) / (that.valueMax - that.valueMin))  * 5.23 )
                      vm.metricViews[index]['width'] = 'width:' + width + 'rem;'
                      var left = (item.targetScore - that.valueMin ) / (that.valueMax - that.valueMin) * 100 <= 0 ? 0 : (item.targetScore - that.valueMin ) / (that.valueMax - that.valueMin) * 100 >=  100 ? (item.targetScore - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1 : (item.targetScore - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1
                      vm.metricViews[index]['left'] = 'left:'+ left  + '%;'
                      console.log(item.left)
                    },100)
                    var leftP = (item.avgScore - that.valueMin ) / (that.valueMax - that.valueMin) * 100 <= 0 ? 0 : (item.avgScore - that.valueMin ) / (that.valueMax - that.valueMin) * 100 >=  100 ? (item.avgScore - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1 : (item.avgScore - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1
                    vm.metricViews[index]['leftP'] = 'left:'+ leftP  + '%;'
                    if(item.threshholdSuggestion && item.threshholdSuggestion!= null ){
                      vm.metricViews[index]['jianyi']  = item.threshholdSuggestion.split('\n') 
                    }
                    console.log(item)
                  })
            // 进度条动画效果
                  console.log(vm.metricViews)
                }else if(res.code == 201){
                  alert('需要支付')
                }
              },
              error:function(){console.log('queryPsyc231Index error')}
            })
          },
          filterData: function(){
            var that = this;
            $.each(that.leidaObj1,function(index,item){
              $.each(that.metricViews,function(a,b){
                if(b.metricName == item.leidaName){
                  item.celiangNum = b.targetScore
                  item.pingjunNum = b.avgScore
                  item.biaoqian = b.threshholdType 
                  var text1 = []
                  var text = '';
                  (function(){
                    if(b.metricExplain && b.metricExplain!= null ){
                      text = b.metricExplain.split('\n').join('<br>')
                    }
                    if(b.threshholdExplain && b.threshholdExplain!= null ){
                      text1 = b.threshholdExplain.split('\n') 
                    }
                  })();
                  item.title = text;
                  item.textD = text1;
                  item.Max = that.valueMax
                  item.Min = that.valueMin
                  item.leidaT = b.metricExplain
                  //console.log(item.leidaT)
                  // 进度条动画效果
                  return true;
                }
              })
            })
            // 测量值
            $.each(that.leidaObj1,function(index,item){
              that.leidaArr1[item.leidaNo] = item.celiangNum
            })
            console.log('测量值'+that.leidaArr1)
            // 平均值
            $.each(that.leidaObj1,function(index,item){
              that.leidaArr2[item.leidaNo] = item.pingjunNum
            })
            console.log('平均值'+that.leidaArr2)
            //
            $.each(that.leidaObj1,function(index,item){
              that.leidaTitle[item.leidaNo] = item.leidaName
            })
            // $.each(that.leidaObj1,function(index,item){
            //   console.log(item)
            //   // that.leidaObj1[index].left = item.celiangNum / 100
            //   setTimeout(function(){
            //   var width =  (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin) >  0 ? ((1 - (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin))  * 5.23 ) + .045 : ((1 - (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin))  * 5.23 )
            //   item.width = 'width:' + width + 'rem;'
            //   var left = (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100 <= 0 ? 0 : (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100 >=  100 ? (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1 : (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1
            //   item.left = 'left:'+ left  + '%;'
            //   console.log(item.left)

            // },100)
            // var leftP = (item.pingjunNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100 <= 0 ? 0 : (item.pingjunNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100 >=  100 ? (item.pingjunNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1 : (item.pingjunNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1
            // item.leftP = 'left:'+ leftP  + '%;'
            // console.log(item.leftP)
            // })
            // 进度条动画效果
            setTimeout(function(){
                    $('#app').show()
                    $('.loadmore').hide()
                    go()
                    pys()
                    swi()
                    ban()
                    // $('.ssw').css({
                    //   'margin-right':'0'
                    // })
                  },1500)
            console.log('名称'+that.leidaTitle)
          },


        },
        mounted: function(){
          this.queryPsyc231Index()
        }
      });

    })