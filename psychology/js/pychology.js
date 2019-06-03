$(function(){
    // 跳转历史
      var HisHref = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf0ae7f7bf54aae56&redirect_uri=http%3A%2F%2Fpsyc-t.konstarmall.com%2Fwx%2Fredirect%2Fwxf0ae7f7bf54aae56%2Fuser&response_type=code&scope=snsapi_userinfo&state=&connect_redirect=1#wechat_redirect'
      var Description = getQueryString('inspectCode') //'KJ20190507105901173'
      var url = 'http://psyc-t.konstarmall.com/report/v1/queryH5Report'
      var leida_arr = []
      // 获取url参数方法
      function getQueryString(name) {
          var    result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
          if (result == null || result.length < 1) {
              return "";
          }
          return result[1];
      };
      // 雷达图初始化
      function go(){
        var myChart = echarts.init(document.getElementById('main'))
        option = {
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
              {text : '', max  : 100},
              {text : '', max  : 100},
              {text : '', max  : 100},
              {text : '', max  : 100},
              {text : '', max  : 100},
              {text : '', max  : 100}
            ],
            radius : 130
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
                value : leida_arr,
              }
            ]
          }
        ]
      };
      myChart.setOption(option); 
    }
    new Vue({
      el:'#app',
      data () {
        return {
          setHtml : {
            coordinate : {
              '不稳定-外向' : 'left:1rem;top:-.01rem;',
              '不稳定-内向' : 'left:-0.5rem;top:-.01rem;',
              '稳定-内向' : 'left:-0.5rem;top:1.5rem;',
              '稳定-外向' : 'left:1rem;top:1.5rem;' 
            },
            bg_img : {
              '不稳定-外向' : './img/zbz_1.png',
              '不稳定-内向' : './img/zbz_2.png',
              '稳定-内向' : './img/zbz_3.png',
              '稳定-外向' : './img/zbz_4.png'
            },
            new_img : {
              '不稳定-外向' : './img/new_b1.png',
              '不稳定-内向' : './img/new_b2.png',
              '稳定-内向' : './img/new_b3.png',
              '稳定-外向' : './img/new_b4.png'
            },
            leidatu_text : {
              1 :   {'text':'自信度','score':100,'jd':'left:;','img':''},
              2 :   {'text':'自控度','score':100,'jd':'left:;','img':''},
              3 :   {'text':'敏感度','score':100,'jd':'left:;','img':''},
              4 : {'text':'易激惹','score':100,'jd':'left:;','img':''},
              5 : {'text':'焦虑度','score':100,'jd':'left:;','img':''},
              6 : {'text':'忧郁度','score':100,'jd':'left:;','img':''}
            }
            ,
            zz_deg : {
              3 : '0deg',
              2 : '72deg',
              1 : '143deg',
              5 : '214deg',
              4 : '287deg'
            },
            zz : '',
            em : '',
            shenglue : '',
            yibiaopan : {z : '-35deg' , p : '0deg' },
            leida_zidian : {
              1 : {
                'data_h' :'自信度', 
                'data_alter' : '自信是一种内在的涵养, 是一种既不过高地评估自己, 也不过低地无视自己的态度, 是一种不为外界环境所影响, 有着自己的实力朝着自己的目标奋斗的行为。'
              },
              2 : {
                'data_h' :'自控度', 
                'data_alter' : '自控能力是指人们通过内部机制理智地控制和调节自我行为和心理状态的能力，是对原有行为反应方式的一种改变和控制，包括标准、监控和行为改变的能力。'
              },
              3 : {
                'data_h' :'敏感度', 
                'data_alter' : '太过于在乎自己的缺点和太在意别人看自己的态度，是敏感的主要原因。缺乏自信也是导致敏感的重要因素。'
              },
              4 : {
                'data_h' :'易激惹', 
                'data_alter' : '易激惹是一种心理特征，是一种意图，是人格中所具有的产生攻击的内在可能性，每个人在特定环境和情绪状态中都可能出现激惹表现。'
              },
              5 : {
                'data_h' :'焦虑度', 
                'data_alter' : '焦虑是指个体因预感到某种不利情况出现时而产生的一种担忧、紧张、不安、恐惧、不愉快等综合情绪体验。每个人在特定环境和情绪状态中都可能出现不同程度的焦虑情绪体验、反应和表现。'
              },
              6 : {
                'data_h' :'抑郁度', 
                'data_alter' : '忧郁是无效应对生活压力的后果，以情绪失调为核心，常伴有焦虑、激越、无价值感、无助感、绝望感、意志力减退、精神运动迟滞、失眠等阶段反复性症状。每个人在特定环境和情绪状态中都可能出现不同程度的忧郁情绪体验、反应和表现。'
              }
            },
            jindutiao : {
              1 : {'min' : 40 , 'max' : 100},
              2 : {'min' : 50 , 'max' : 100},
              3 : {'min' : 0 , 'max' : 65},
              4 : {'min' : 0 , 'max' : 50},
              5 : {'min' : 15 , 'max' : 40},
              6 : {'min' : 10 , 'max' : 40}
            }
          },
          info : {}
        }
      },
      methods:{
        setH: function () {
          var listS = $('.qizhi_box .center span ')
          var that = this
          listS.each(function(index,item){
            var ll = $(item).text().length
            var rad = Math.random()
            $(item).css({'line-height':ll*100+'%',
            'padding':rad*3+'px'
            })
          })
        },
        lert: function () {
          console.log(event.currentTarget)
        },
        Touchmove:function(){
            $('.mask').removeClass('show');
            $('.popup').removeClass('show');
            $('body').css({'position':'static'}); 
            $(window).scrollTop(sTop);
        },
        stopTouchmove:function(){
            $('.mask').addClass('show');
            $('.popup').addClass('show');
            sTop = $(window).scrollTop();
            $('body').css({'position':'fixed','top':-sTop,'width':'7.5rem'});      
            var curr = $(event.currentTarget) 
            $('.popup h1').text(curr.attr('data-h'))
            $('.popup .huadong').text(curr.attr('data-alter'))
            if(curr.attr('data-h') == '详解'){
              $('.popup .huadong').text(this.info.personalityTypology.typologyFeature)
            }
          },
        getData : function (){
            var that = this
            $.ajax({
              url : url,
              type : 'GET',
              data : {
                inspectCode  : Description
              },
              success : function (res) {
                if(res.code == 200){
                  that.info = res.data
                  if(that.info.personalityTypology != undefined){ var key = that.info.personalityTypology['typologyId']
                  var val = that.setHtml.zz_deg
                  setTimeout(function(){
                    that.setHtml.zz = val[key]
                  },350)
                  //轮盘
                  if(that.info.personalityTypology.typologyId == 1 ){
                    that.setHtml.em = '217deg'
                  }
                  //省略号
                  that.info.personalityTypology.typologyKeyword = res.data.personalityTypology.typologyKeyword.split('，')
                  that.setHtml.shenglue = that.info.personalityTypology.typologyFeature
                  if(that.info.personalityTypology.typologyFeature.length > 52 ){
                    that.setHtml.shenglue = that.info.personalityTypology.typologyFeature.substring(0,51) + '…'
                  }
                } 
                  
                  //气质
                  //mew
                  // that.info.constantTemperament 
                  // that.info.constantTemperament.explain = that.info.constantTemperament.explain.split('、')
                  // setTimeout(function(){
                  //   that.setH()
                  // })
                  // jd
                  $.each(that.info.realtimeThreshholdList,function(index,item){
                    var val =  item.score == that.setHtml.jindutiao[index+1]['max']  ? parseInt(that.setHtml.jindutiao[index+1]['max']) -1 : item.score == that.setHtml.jindutiao[index+1]['min'] ?  parseInt(that.setHtml.jindutiao[index+1]['min']) + 1 : item.score > that.setHtml.jindutiao[index+1]['max'] ? that.setHtml.jindutiao[index+1]['max'] : item.score < that.setHtml.jindutiao[index+1]['min'] ? that.setHtml.jindutiao[index+1]['min'] :  item.score
                    // that.setHtml.leidatu_text[item.metricId]['img'] = val  <=  that.setHtml.jindutiao[index+1]['min'] ?  './img/red.png' : './img/lvhuakuai.png'
                    // that.setHtml.leidatu_text[item.metricId]['img'] = val  >=  that.setHtml.jindutiao[index+1]['max'] ?  './img/red.png' : './img/lvhuakuai.png'
                    if(val  <=  that.setHtml.jindutiao[index+1]['min']){
                      that.setHtml.leidatu_text[item.metricId]['img'] = './img/red.png'
                    }else if(val  >=  that.setHtml.jindutiao[index+1]['max']){
                      console.log()
                      that.setHtml.leidatu_text[item.metricId]['img'] = './img/red.png'
                    }else {
                      that.setHtml.leidatu_text[item.metricId]['img'] = './img/lvhuakuai.png'
                    }
                    if(item.metricId == 6 || item.metricId == 5 && val  <=  that.setHtml.jindutiao[index+1]['min']){
                      that.setHtml.leidatu_text[item.metricId]['img'] = './img/lvhuakuai.png'
                    }
                  })  
                  //雷达图
                  $.each(that.info.realtimeThreshholdList,function(index,item){
                    $.each(that.setHtml.leida_zidian,function(key,val){
                      if(key == item.metricId){
                        that.setHtml.leida_zidian[key]['score'] = item.score
                        leida_arr.push(item.score)
                      }
                    })
                  })
                  setTimeout(function(){
                    go()
                  },500)
                  $('#app').css('display','block')
                  $('.loadmore ').css('display','none')
                }
              },
              error : function (err) {
                console.log(err)
                console.log('请求错误')
              }
            })
          }
          ,
          addList : function () {
          var that = this
          setTimeout(function(){
            var val = that.info.realtimeThreshholdList[5].score > 40 ? 40 : that.info.realtimeThreshholdList[5].score < 10 ? 10 : that.info.realtimeThreshholdList[5].score
            // var k =(((that.info.realtimeThreshholdList[5].score > 100 ? 100 : that.info.realtimeThreshholdList[5].score) - that.info.realtimeThreshholdList[5].valueMin) / ((that.info.realtimeThreshholdList[5].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[5].valueMax ) - that.info.realtimeThreshholdList[5].valueMin )) * 5.4 - 0.01 
            var k =(((val) - 10) / (40 - 10)) * 5.44 - 0.1 
            that.setHtml.leidatu_text[that.info.realtimeThreshholdList[5].metricId]['left'] = 'left:' + k
            $('[data-index=em5]').css('left',k+'rem')   

            var val = that.info.realtimeThreshholdList[4].score > 40 ? 40 : that.info.realtimeThreshholdList[4].score < 15 ? 15 : that.info.realtimeThreshholdList[4].score
              // var k =(((that.info.realtimeThreshholdList[4].score > 100 ? 100 : that.info.realtimeThreshholdList[4].score) - that.info.realtimeThreshholdList[4].valueMin) / ((that.info.realtimeThreshholdList[4].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[4].valueMax ) - that.info.realtimeThreshholdList[4].valueMin )) * 5.4 - 0.01 
              var k =(((val) - 15) / (40 - 15)) * 5.44 - 0.1 
              that.setHtml.leidatu_text[that.info.realtimeThreshholdList[4].metricId]['left'] = 'left:' + k
              $('[data-index=em4]').css('left',k+'rem') 

              var val = that.info.realtimeThreshholdList[3].score > 50 ? 50 : that.info.realtimeThreshholdList[3].score < 0 ? 0 : that.info.realtimeThreshholdList[3].score
              // var k =(((that.info.realtimeThreshholdList[3].score > 100 ? 100 : that.info.realtimeThreshholdList[3].score) - that.info.realtimeThreshholdList[3].valueMin) / ((that.info.realtimeThreshholdList[3].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[3].valueMax ) - that.info.realtimeThreshholdList[3].valueMin )) * 5.4 - 0.01 
              var k =(((val) - 0) / (50 - 0)) * 5.44 - 0.1 
              that.setHtml.leidatu_text[that.info.realtimeThreshholdList[3].metricId]['left'] = 'left:' + k
              $('[data-index=em3]').css('left',k+'rem')  

              var val = that.info.realtimeThreshholdList[2].score > 65 ? 65 : that.info.realtimeThreshholdList[2].score < 0 ? 0 : that.info.realtimeThreshholdList[2].score
              // var k =(((that.info.realtimeThreshholdList[2].score > 100 ? 100 : that.info.realtimeThreshholdList[2].score) - that.info.realtimeThreshholdList[2].valueMin) / ((that.info.realtimeThreshholdList[2].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[2].valueMax ) - that.info.realtimeThreshholdList[2].valueMin )) * 5.4 - 0.01 
              var k =(((val) - 0) / (65 - 0)) * 5.44 - 0.1 
              that.setHtml.leidatu_text[that.info.realtimeThreshholdList[2].metricId]['left'] = 'left:' + k
              $('[data-index=em2]').css('left',k+'rem')  

              var val = that.info.realtimeThreshholdList[1].score > 100 ? 100 : that.info.realtimeThreshholdList[1].score < 50 ? 50 :   that.info.realtimeThreshholdList[1].score
              // var k =(((that.info.realtimeThreshholdList[1].score > 100 ? 100 : that.info.realtimeThreshholdList[1].score) - that.info.realtimeThreshholdList[1].valueMin) / ((that.info.realtimeThreshholdList[1].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[1].valueMax ) - that.info.realtimeThreshholdList[1].valueMin )) * 5.4 - 0.01 
              var k =(((val) - 50) / (100 - 50)) * 5.44 - 0.1 
              that.setHtml.leidatu_text[that.info.realtimeThreshholdList[1].metricId]['left'] = 'left:' + k
              $('[data-index=em1]').css('left',k+'rem')   

              var val = that.info.realtimeThreshholdList[0].score > 100 ? 100 : that.info.realtimeThreshholdList[0].score < 40 ? 40 : that.info.realtimeThreshholdList[0].score
              var k =(((val) - 40) / (100 - 40)) * 5.44 - 0.1 
              that.setHtml.leidatu_text[that.info.realtimeThreshholdList[0].metricId]['left'] = 'left:' + k
              $('[data-index=em0]').css('left',k+'rem')   

              if(that.info.constantCharacterList &&  that.info.constantCharacterList[1] != undefined){
                that.setHtml.yibiaopan = that.info.constantCharacterList[1].resultId == 6 ? {z : '142deg' , p : '180deg' } : that.info.constantCharacterList[1].resultId == 7 ? {z : '103deg' , p : '138deg' } :  that.info.constantCharacterList[1].resultId == 8 ? {z : '53deg' , p : '88deg' } :  that.info.constantCharacterList[1].resultId == 9 ? {z : '5deg' , p : '41deg' } : that.info.constantCharacterList[1].resultId == 10 ? {z : '-30deg' , p : '0deg' } : {z : '-30deg' , p : '0deg' }
              }

              if( that.info.constantCharacterList && that.info.constantCharacterList != undefined && $('[data-in='+that.info.constantCharacterList[0].resultId+']').length > 0){
                var big = $('[data-in='+that.info.constantCharacterList[0].resultId+']')
                $('.jd i').css({
                  'left' : big.attr('data-left'),
                  'background' : big.attr('data-color')
                })
                $('.small .list'+that.info.constantCharacterList[0].resultId).css('visibility','hidden')
                $('.big .list'+that.info.constantCharacterList[0].resultId).css('display','block')
              }

          },300)
          $(document).on('scroll',function(){
            setTimeout(function(){
            var sop = $(this).scrollTop()
            var wh = $(window).height()  
            if($('.xingge').length > 0 ){
              var xingge = $('.xingge').offset().top
            }
            if($('.qingxu').length > 0){var yibq = $('.qingxu').offset().top}
            var last_5 = $('[data-last=last_5]').offset().top
            var last_4 = $('[data-last=last_4]').offset().top
            var last_3 = $('[data-last=last_3]').offset().top
            var last_2 = $('[data-last=last_2]').offset().top
            var last_1 = $('[data-last=last_1]').offset().top
            var last_0 = $('[data-last=last_0]').offset().top
            // if((last_5 - sop)  < (wh * 4.5 / 5)){
            //   setTimeout(function(){
            //     var val = that.info.realtimeThreshholdList[5].score > 40 ? 40 : that.info.realtimeThreshholdList[5].score < 10 ? 10 : that.info.realtimeThreshholdList[5].score
            //     // var k =(((that.info.realtimeThreshholdList[5].score > 100 ? 100 : that.info.realtimeThreshholdList[5].score) - that.info.realtimeThreshholdList[5].valueMin) / ((that.info.realtimeThreshholdList[5].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[5].valueMax ) - that.info.realtimeThreshholdList[5].valueMin )) * 5.4 - 0.01 
            //     var k =(((val) - 10) / (40 - 10)) * 5.44 - 0.1 
            //     that.setHtml.leidatu_text[that.info.realtimeThreshholdList[5].metricId]['left'] = 'left:' + k
            //     $('[data-index=em5]').css('left',k+'rem')   
            //   },50)
            // }else if((last_4 - sop) < (wh * 4.5 / 5) ){
            //   setTimeout(function(){
            //     var val = that.info.realtimeThreshholdList[4].score > 40 ? 40 : that.info.realtimeThreshholdList[4].score < 15 ? 15 : that.info.realtimeThreshholdList[4].score
            //     // var k =(((that.info.realtimeThreshholdList[4].score > 100 ? 100 : that.info.realtimeThreshholdList[4].score) - that.info.realtimeThreshholdList[4].valueMin) / ((that.info.realtimeThreshholdList[4].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[4].valueMax ) - that.info.realtimeThreshholdList[4].valueMin )) * 5.4 - 0.01 
            //     var k =(((val) - 15) / (40 - 15)) * 5.44 - 0.1 
            //     that.setHtml.leidatu_text[that.info.realtimeThreshholdList[4].metricId]['left'] = 'left:' + k
            //     $('[data-index=em4]').css('left',k+'rem')   
            //   },50)
            // }else if((last_3 - sop) < (wh * 4.5 / 5)){
            //   setTimeout(function(){
            //     var val = that.info.realtimeThreshholdList[3].score > 50 ? 50 : that.info.realtimeThreshholdList[3].score < 0 ? 0 : that.info.realtimeThreshholdList[3].score
            //     // var k =(((that.info.realtimeThreshholdList[3].score > 100 ? 100 : that.info.realtimeThreshholdList[3].score) - that.info.realtimeThreshholdList[3].valueMin) / ((that.info.realtimeThreshholdList[3].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[3].valueMax ) - that.info.realtimeThreshholdList[3].valueMin )) * 5.4 - 0.01 
            //     var k =(((val) - 0) / (50 - 0)) * 5.44 - 0.1 
            //     that.setHtml.leidatu_text[that.info.realtimeThreshholdList[3].metricId]['left'] = 'left:' + k
            //     $('[data-index=em3]').css('left',k+'rem')   
            //   },50)
            // }else if((last_2 - sop) < (wh * 4.5 / 5) ){
            //   setTimeout(function(){
            //     var val = that.info.realtimeThreshholdList[2].score > 65 ? 65 : that.info.realtimeThreshholdList[2].score < 0 ? 0 : that.info.realtimeThreshholdList[2].score
            //     // var k =(((that.info.realtimeThreshholdList[2].score > 100 ? 100 : that.info.realtimeThreshholdList[2].score) - that.info.realtimeThreshholdList[2].valueMin) / ((that.info.realtimeThreshholdList[2].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[2].valueMax ) - that.info.realtimeThreshholdList[2].valueMin )) * 5.4 - 0.01 
            //     var k =(((val) - 0) / (65 - 0)) * 5.44 - 0.1 
            //     that.setHtml.leidatu_text[that.info.realtimeThreshholdList[2].metricId]['left'] = 'left:' + k
            //     $('[data-index=em2]').css('left',k+'rem')   
            //   },50)
            // }else if((last_1 - sop) < (wh * 4.5 / 5)){
            //   setTimeout(function(){
            //     var val = that.info.realtimeThreshholdList[1].score > 100 ? 100 : that.info.realtimeThreshholdList[1].score < 50 ? 50 :   that.info.realtimeThreshholdList[1].score
            //     // var k =(((that.info.realtimeThreshholdList[1].score > 100 ? 100 : that.info.realtimeThreshholdList[1].score) - that.info.realtimeThreshholdList[1].valueMin) / ((that.info.realtimeThreshholdList[1].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[1].valueMax ) - that.info.realtimeThreshholdList[1].valueMin )) * 5.4 - 0.01 
            //     var k =(((val) - 50) / (100 - 50)) * 5.44 - 0.1 
            //     that.setHtml.leidatu_text[that.info.realtimeThreshholdList[1].metricId]['left'] = 'left:' + k
            //     $('[data-index=em1]').css('left',k+'rem')   
            //   },50)
            // }
            // if((last_0 - sop) < (wh * 3 / 5)){
            //   setTimeout(function(){
            //     var val = that.info.realtimeThreshholdList[0].score > 100 ? 100 : that.info.realtimeThreshholdList[0].score < 40 ? 40 : that.info.realtimeThreshholdList[0].score
            //     var k =(((val) - 40) / (100 - 40)) * 5.44 - 0.1 
            //     that.setHtml.leidatu_text[that.info.realtimeThreshholdList[0].metricId]['left'] = 'left:' + k
            //     $('[data-index=em0]').css('left',k+'rem')   
            //   },50)
            // }else if( yibq - sop  < wh / 3 * 2 ){
            //   //仪表盘
            //   setTimeout(function(){
            //     that.setHtml.yibiaopan = that.info.constantCharacterList[1].resultId == 6 ? {z : '142deg' , p : '180deg' } : that.info.constantCharacterList[1].resultId == 7 ? {z : '103deg' , p : '138deg' } :  that.info.constantCharacterList[1].resultId == 8 ? {z : '53deg' , p : '88deg' } :  that.info.constantCharacterList[1].resultId == 9 ? {z : '5deg' , p : '41deg' } : that.info.constantCharacterList[1].resultId == 10 ? {z : '-30deg' , p : '0deg' } : {z : '-30deg' , p : '0deg' }
            //   },50)
            // }else if(xingge -sop  < wh / 3 * 2){
            //   setTimeout(function(){
            //     var big = $('[data-in='+that.info.constantCharacterList[0].resultId+']')
            //     $('.jd i').css({
            //       'left' : big.attr('data-left'),
            //       'background' : big.attr('data-color')
            //     })
            //     $('.small .list'+that.info.constantCharacterList[0].resultId).css('visibility','hidden')
            //     $('.big .list'+that.info.constantCharacterList[0].resultId).css('display','block')
            //   },50)
            // }
            // setTimeout(function(){
            //   var val = that.info.realtimeThreshholdList[5].score > 40 ? 40 : that.info.realtimeThreshholdList[5].score < 10 ? 10 : that.info.realtimeThreshholdList[5].score
            //   // var k =(((that.info.realtimeThreshholdList[5].score > 100 ? 100 : that.info.realtimeThreshholdList[5].score) - that.info.realtimeThreshholdList[5].valueMin) / ((that.info.realtimeThreshholdList[5].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[5].valueMax ) - that.info.realtimeThreshholdList[5].valueMin )) * 5.4 - 0.01 
            //   var k =(((val) - 10) / (40 - 10)) * 5.44 - 0.1 
            //   that.setHtml.leidatu_text[that.info.realtimeThreshholdList[5].metricId]['left'] = 'left:' + k
            //   $('[data-index=em5]').css('left',k+'rem')   

            //   var val = that.info.realtimeThreshholdList[4].score > 40 ? 40 : that.info.realtimeThreshholdList[4].score < 15 ? 15 : that.info.realtimeThreshholdList[4].score
            //     // var k =(((that.info.realtimeThreshholdList[4].score > 100 ? 100 : that.info.realtimeThreshholdList[4].score) - that.info.realtimeThreshholdList[4].valueMin) / ((that.info.realtimeThreshholdList[4].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[4].valueMax ) - that.info.realtimeThreshholdList[4].valueMin )) * 5.4 - 0.01 
            //     var k =(((val) - 15) / (40 - 15)) * 5.44 - 0.1 
            //     that.setHtml.leidatu_text[that.info.realtimeThreshholdList[4].metricId]['left'] = 'left:' + k
            //     $('[data-index=em4]').css('left',k+'rem') 

            //     var val = that.info.realtimeThreshholdList[3].score > 50 ? 50 : that.info.realtimeThreshholdList[3].score < 0 ? 0 : that.info.realtimeThreshholdList[3].score
            //     // var k =(((that.info.realtimeThreshholdList[3].score > 100 ? 100 : that.info.realtimeThreshholdList[3].score) - that.info.realtimeThreshholdList[3].valueMin) / ((that.info.realtimeThreshholdList[3].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[3].valueMax ) - that.info.realtimeThreshholdList[3].valueMin )) * 5.4 - 0.01 
            //     var k =(((val) - 0) / (50 - 0)) * 5.44 - 0.1 
            //     that.setHtml.leidatu_text[that.info.realtimeThreshholdList[3].metricId]['left'] = 'left:' + k
            //     $('[data-index=em3]').css('left',k+'rem')  

            //     var val = that.info.realtimeThreshholdList[2].score > 65 ? 65 : that.info.realtimeThreshholdList[2].score < 0 ? 0 : that.info.realtimeThreshholdList[2].score
            //     // var k =(((that.info.realtimeThreshholdList[2].score > 100 ? 100 : that.info.realtimeThreshholdList[2].score) - that.info.realtimeThreshholdList[2].valueMin) / ((that.info.realtimeThreshholdList[2].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[2].valueMax ) - that.info.realtimeThreshholdList[2].valueMin )) * 5.4 - 0.01 
            //     var k =(((val) - 0) / (65 - 0)) * 5.44 - 0.1 
            //     that.setHtml.leidatu_text[that.info.realtimeThreshholdList[2].metricId]['left'] = 'left:' + k
            //     $('[data-index=em2]').css('left',k+'rem')  

            //     var val = that.info.realtimeThreshholdList[1].score > 100 ? 100 : that.info.realtimeThreshholdList[1].score < 50 ? 50 :   that.info.realtimeThreshholdList[1].score
            //     // var k =(((that.info.realtimeThreshholdList[1].score > 100 ? 100 : that.info.realtimeThreshholdList[1].score) - that.info.realtimeThreshholdList[1].valueMin) / ((that.info.realtimeThreshholdList[1].valueMax > 100 ? 100 : that.info.realtimeThreshholdList[1].valueMax ) - that.info.realtimeThreshholdList[1].valueMin )) * 5.4 - 0.01 
            //     var k =(((val) - 50) / (100 - 50)) * 5.44 - 0.1 
            //     that.setHtml.leidatu_text[that.info.realtimeThreshholdList[1].metricId]['left'] = 'left:' + k
            //     $('[data-index=em1]').css('left',k+'rem')   

            //     var val = that.info.realtimeThreshholdList[0].score > 100 ? 100 : that.info.realtimeThreshholdList[0].score < 40 ? 40 : that.info.realtimeThreshholdList[0].score
            //     var k =(((val) - 40) / (100 - 40)) * 5.44 - 0.1 
            //     that.setHtml.leidatu_text[that.info.realtimeThreshholdList[0].metricId]['left'] = 'left:' + k
            //     $('[data-index=em0]').css('left',k+'rem')   

            //     // that.setHtml.yibiaopan = that.info.constantCharacterList[1].resultId == 6 ? {z : '142deg' , p : '180deg' } : that.info.constantCharacterList[1].resultId == 7 ? {z : '103deg' , p : '138deg' } :  that.info.constantCharacterList[1].resultId == 8 ? {z : '53deg' , p : '88deg' } :  that.info.constantCharacterList[1].resultId == 9 ? {z : '5deg' , p : '41deg' } : that.info.constantCharacterList[1].resultId == 10 ? {z : '-30deg' , p : '0deg' } : {z : '-30deg' , p : '0deg' }

            //     // var big = $('[data-in='+that.info.constantCharacterList[0].resultId+']')
            //     // $('.jd i').css({
            //     //   'left' : big.attr('data-left'),
            //     //   'background' : big.attr('data-color')
            //     // })
            //     // $('.small .list'+that.info.constantCharacterList[0].resultId).css('visibility','hidden')
            //     // $('.big .list'+that.info.constantCharacterList[0].resultId).css('display','block')

            // },50)

            },50)
          })
        }
        ,
        goHis : function (event,customerId,inspcetCode) {
          location.href = HisHref
        },
        fenXiang : function (){
          var that = this;
          var url = decodeURI(location.href.split('#')[0]);
          console.log(url)
          $.ajax({
              url:'http://psyc-t.konstarmall.com/tool/v1/wxf0ae7f7bf54aae56/config',
              type:'GET',
              data:{
                  url:url
              },
              success:function(res){
                var sss = JSON.parse(res)
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: sss.appId, // 必填，公众号的唯一标识
                    timestamp: sss.timestamp, // 必填，生成签名的时间戳
                    nonceStr: sss.nonceStr, // 必填，生成签名的随机串
                    signature: sss.signature,// 必填，签名
                    jsApiList: ['checkJsApi','updateAppMessageShareData','updateTimelineShareData'] // 必填，需要使用的JS接口列表
                });
                wx.ready(function () {      //需在用户可能点击分享按钮前就先调用
                    wx.updateTimelineShareData({ 
                        title: '性格档案', // 分享标题
                        link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: './img/未标题-1.png', // 分享图标
                        success: function () {
                          // 设置成功
                        }
                    });
                    wx.updateAppMessageShareData({ 
                        title: '性格档案', // 分享标题
                        desc: '遇见更好的自己遇见更好的自己遇见更好的自己遇见更好的自己遇见更好的自己', // 分享描述
                        link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: './img/未标题-1.png', // 分享图标
                        success: function () {
                          // 设置成功
                        }
                    })
                });
              },
              error: function(){alert('wxConfig error')}
          })
        }
      },
      mounted () {
        var that = this
        setTimeout(function(){
          that.getData()
          that.addList()
          // that.fenXiang()
        })
      }
    })
  })
