$(function(){
      var url = analysisreport + '/psyc/report/queryPsycIndex'
      var reportId = getQueryString('reportId') //'KJ20190705144905021'
      var customerId = getQueryString('userId') //1662
			var openId = getQueryString('openId');
			var reportType = getQueryString('reportType');
			var saasId = getQueryString('saasId');
			var clientType = getQueryString("clientType"); 
      var resource = getQueryString("resource");
      var source = (getQueryString('source') || '');  //通过解析获得

      var gohistoryUrl = dataUrl+ '/wxUser/wxUserReport?jumpUrl=uiHistory&userId='+customerId+'&reportId='+reportId+'&openId='+openId+'&saasId='+saasId+'&resource='+resource+'&source='+source
      if(!openId){
        //alert('now in app');
        gohistoryUrl = 'historyRecord.html?userId='+customerId+'&saasId='+saasId+'&resource='+resource+'&clientType='+clientType+'&source='+source
      }

      // 雷达图
      function go(){
      var myChart = echarts.init(document.getElementById('main'))
      var myChart1 = echarts.init(document.getElementById('echa1'))
      var myChart2 = echarts.init(document.getElementById('echa2'))
      var option = {
        title : {
            text: '',
            subtext: ''
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            x : 'center',
            data:['']
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
      var option1 = {
        // 提示框
        // tooltip : {
        //     trigger: 'item',
        // },
        color: ['#8491FF','#F47572','#EBAA6D'],
        legend: {
          orient : 'horizontal',
          x : 'center',
          y : 'bottom',
          // data:['正性','负性','中性']
          data:[]
        },
        toolbox: {
          show : false,
          feature : {
            mark : {show: false},
            dataView : {show: false, readOnly: true},
            magicType : {
              show: false, 
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'center',
                  max: 100
                }
              }
            },
            restore : {show: true},
            saveAsImage : {show: true}
          }
        },
        series : [
          {
            name:'',
            type:'pie',
            radius: ['75%', '40%'],
            itemStyle : {
              normal : {
                label : {
                  show : true,
                  position : 'inner',
                  formatter : function(a){
                    var text = Math.floor(a.percent) + '%'
                    return text;
                  },
                  textStyle : {
                      color:'#333',
                      fontSize : '12',
                      fontWeight : 'bold'
                  }
                },
                labelLine : {
                  show : false
                }
              }
            },
            data: v.pieArr1
          }
        ]
      };
      var option2 = {
        color: ['#8491FF','#F47572','#EBAA6D'],
        legend: {
          orient : 'horizontal',
          x : 'center',
          y : 'bottom',
          data:[]
        },
        toolbox: {
          show : false,
          feature : {
            mark : {show: false},
            dataView : {show: false, readOnly: true},
            magicType : {
              show: false, 
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'center',
                  max: 100
                }
              }
            },
            restore : {show: true},
            saveAsImage : {show: true}
          }
        },
        series : [
          {
            name:'访问来源',
            type:'pie',
            radius: ['75%', '40%'],
            itemStyle : {
              normal : {
                label : {
                  show : true,
                  position : 'inner',
                  formatter : function(a){
                    var text = Math.floor(a.percent) + '%'
                    return text;
                  },
                  textStyle : {
                      color:'#333',
                      fontSize : '12',
                      fontWeight : 'bold'
                  }
                },
                labelLine : {
                  show : false
                }
              }
            },
            data: v.pieArr2
          }
        ]
      };
        myChart.setOption(option); 
        myChart1.setOption(option1); 
        myChart2.setOption(option2); 
      
      }
      // 获取url参数方法
      function getQueryString(name) {
          var    result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
          if (result == null || result.length < 1) {
              return "";
          }
          return result[1];
      };
      // 
      var v = new Vue({
        el:'#app',
        data:function(){
          return{
            info : {},
            leidaArr1 : [], // 测量值
            leidaArr2 : [], // 平均值
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
            //leidaNo : 雷达图顺序 jdNo： 进度条顺序 celiangNum ： 测量值 pingjunNum ： 平均值 leidaH： 提示 leidaT 提示内容 title 小贴士 biaoqian 进度条 偏高 textD 总结 left ： 测量值滑块 leftP ： 平均值滑块 
            pieArr1 : [
                {value:20, name:'正性'},
                {value:10, name:'负性'},
                {value:10, name:'中性'}
              ],
            pieArr2 : [
              {value:310, name:'正性'},
              {value:234, name:'负性'},
              {value:135, name:'中性'}
            ],  // 环形图
            press : [], // 进度条顺序
            valueMax : 100,
            valueMin : 0,
            zhinan : '1、本潜在情绪测试报告可协助您了解自身的各类情绪状态，建议您认真阅读。如果在阅读的过程中有不明白的地方或疑问，可向专业人士咨询。<br>2、本测试报告可作为您评估自身情绪状态的一个参考，而不是诊断。如果需要，强烈建议您向专业人士作进一步的检查和咨询。<br>3、本测试报告正文内容分为两大部分。第一部分为各情绪维度的解读，您可了解到自身9类情绪的水平、所在同年龄段人群位置及其详细建议；第二部分为整体情绪状态解读，您可了解到自身正、负性等情绪状态分布及其建议。' //指南
          }
        }
        ,
        methods:{
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
          getData : function(){
            var that = this
            $.ajax({
              url : url,
              type : 'POST',
              data : {
                reportId : reportId,
                customerId : customerId,
                saasId: saasId
              },
              success : function(res){
                if(res.code == 200){
                  that.info = res.result
                    that.filterData()
                }else if(res.code == 201){
                  console.log('支付');
                  alert('支付')
                	//location.href = ''
                }else{
                	alert('queryPsycIndex code= '+res.code)
                }
              },
              error : function(err){
                
              }
            })
          },
          // history
          gohistory : function(){
            window.location = gohistoryUrl;
          }
          , 
          filterData : function(){
            var that = this 
            that.info.inspectDate = that.info && that.info.inspectDate && that.info.inspectDate.split(' ')[0]
            that.info.totalExplain = that.info && that.info.totalExplain != null ? that.info.totalExplain.split('\n') :that.info.totalExplain
            //处理数据
            $.each(that.leidaObj1,function(index,item){
              $.each(that.info.metricViews,function(a,b){
                if(b.metricName == item.leidaName){
                  item.celiangNum = b.targetScore > that.valueMax ? that.valueMax :  b.targetScore < that.valueMin ? that.valueMin : b.targetScore
                  item.pingjunNum = b.avgScore > that.valueMax ? that.valueMax :  b.avgScore < that.valueMin ? that.valueMin : b.avgScore
                  item.biaoqian = b.threshholdType 
                  var text1 = []
                  var text = '';
                  (function(){
                    if(b.explainTip && b.explainTip!= null ){
                      text = b.explainTip.split('\n').join('<br>')
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
                  // 进度条动画效果
                  setTimeout(function(){
                    var width =  (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin) >  0 ? ((1 - (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin))  * 5.23 ) + .045 : ((1 - (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin))  * 5.23 )
                    item.width = 'width:' + width + 'rem;'
                    var left = (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100 <= 0 ? 0 : (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100 >=  100 ? (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1 : (item.celiangNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1
                    item.left = 'left:'+ left  + '%;'
                  },100)
                  var leftP = (item.pingjunNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100 <= 0 ? 0 : (item.pingjunNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100 >=  100 ? (item.pingjunNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1 : (item.pingjunNum - that.valueMin ) / (that.valueMax - that.valueMin) * 100  - 1
                  item.leftP = 'left:'+ leftP  + '%;'
                  return true;
                }
              })
            })
            // 测量值
            $.each(that.leidaObj1,function(index,item){
              that.leidaArr1[item.leidaNo] = item.celiangNum
            })
            // 平均值
            $.each(that.leidaObj1,function(index,item){
              that.leidaArr2[item.leidaNo] = item.pingjunNum
            })
            // 进度条
            that.press = that.leidaObj1.concat()
            that.press = that.press.sort(function(a,b){
              return a.jdNo - b.jdNo
            })
            // 情感分布图
            // 实时
            // 实时情绪数组求和，不满足100 中性补满100
            var realTimeEmotion = 0,
                developEmotion = 0;
            $.each(that.info.stateMap.realTimeEmotion,function(index,item){
              realTimeEmotion = realTimeEmotion + item.score 
            })
            $.each(that.info.stateMap.developEmotion,function(index,item){
              developEmotion = developEmotion + item.score 
            })
            $.each(that.info.stateMap.realTimeEmotion,function(index,item){
              if(item.metricName == '实时中性'){
                realTimeEmotion = 100 - realTimeEmotion + (function(item){var t = item['score'];return t})(item)
              } 
              $.each(that.pieArr1,function(a,b){
                if(item.metricName == '实时正面' && b['name'] == '正性' ){
                  b.value = item.score
                }
                if(item.metricName == '实时负面' && b['name'] == '负性' ){
                  b.value = item.score
                }
                if(item.metricName == '实时中性' && b['name'] == '中性' ){
                  b.value = realTimeEmotion
                }
              })
            })
            // 发展
            $.each(that.info.stateMap.developEmotion,function(index,item){
              if(item.metricName == '发展中性'){
                developEmotion = 100 - developEmotion + (function(item){var t = item['score'];return t})(item)
              }
              $.each(that.pieArr2,function(a,b){
                if(item.metricName == '发展正面' && b['name'] == '正性' ){
                  b.value = item.score
                }
                if(item.metricName == '发展负面' && b['name'] == '负性' ){
                  b.value = item.score
                }
                if(item.metricName == '发展中性' && b['name'] == '中性' ){
                  b.value =  developEmotion
                }
              })
            })
            $('.loadmore').css({
              'display':'none'
            })
            $('#app').css({
              'display':'block'
            })
            setTimeout(function(){
              go()
            },500)
          }
        },
        mounted: function(){
          this.getData()
        }
      })
    }) 
  