$(function(){
    var timer = null
    var clientType = getQueryString("clientType");
    var    reportCode =  getQueryString('reportId');
    var reportType = getQueryString('reportType');
    var    openId = getQueryString('openId');
    var    writing =['清洁是皮肤护理的第一步，温和清洁，善待皮肤，保护肌肤屏障。','保湿是皮肤护理的第二步，合理保湿，皮肤柔软平滑，水润不紧绷。','多数皮肤问题都与日晒有关，防晒没有季节性，一定要尽早。','天气变差更要做好肌肤隔离，避免脏污进入皮肤。','保护肌肤屏障，远离敏感泛红。'];
    var    wriname = ['清洁','保湿','防晒','隔离','防敏感'];
    var moveFlag = true
    // var reportCode='KJ501JS000009BC190522104048104';
    var Purl = dataUrl + '/api/v5/inspectSkinIndex/skinIndexTarget'; 
    new Vue({
        el: '#app',
        data:{
        	openId:openId,
        	reportType:reportType,
        	clientType:clientType,
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
            skinq:'',
            deg: -264,
			score: 0,
			show_left: false,
			show_top: true,
			show_right: true,
            weather:
            {
                "province": "北京",
                "city": "东城区",
                "adcode": "110101",
                "windpower": "≤3",
                "weather": "阴",
                "temperature": "22",
                "humidity": "91",
                "reporttime": "2020-07-27 16:56:16",
                "winddirection": "东",
                "cond_code": "104"
            },
            sex:{
                num:'0',
                color:'color:#FD6BA2;',
                occolor:'color:#F8B126;',
                jccolor:'color:#04CCB1;',

                yibiaopanColor :'background:linear-gradient(0deg,rgba(251,130,176,1) 1%,rgba(253,107,162,1) 100%);',
                yibiaopanImgBiao : 'background: url(./img/new_skin/slices_pink.png) no-repeat center; background-size:100%;',
                yibiaopanImgkeduPan : ' background: url(./img/new_skin/kd_pink.png) no-repeat; background-size: 100%;',

                bgColor:'background-color:#FD6BA2;',
                obgColor:'background-color:#F8B126;',
                jbgColor:'background-color:#04CCB1;',

                qianBg:'background-color:#FDF1F3;',
                oqianBg:'background-color:#FCF6E9;',
                jqianBg:'background-color:#E9F7F5;',

                yinColor:'background: linear-gradient(-90deg, #fdf1f3 1%, #fe629b 100%);',
                oColor:'background:linear-gradient(-90deg,rgba(250,194,58,1) 0%,rgba(255,248,236,1) 100%);',
                jColor:'background:linear-gradient(-90deg,rgba(30,226,200,1) 1%,rgba(230,255,252,1) 100%);',

                face:'./img/new_skin/head.jpg',//没改不确定
                dhFace:'background: url(./img/new_skin/new_w.png) no-repeat 0.1rem .2rem ;background-size: 3rem;',

                CB:'color:#FD6BA2;background-color:#FDF1F3;',
                oCB:'color:#F8B126;background-color:#FCF6E9;',
                jCB:'color:#04CCB1;background-color:#E9F7F5;',

                heitou:'background: url(./img/new_skin/heitou_w.png) no-repeat center;background-size: 3.22rem .84rem;',
                heiyanquan : 'background: url(./img/new_skin/heiyanquan_w.png) no-repeat center;background-size: 2.81rem .67rem;',
                huangheban:'background: url(./img/new_skin/haungheban_w.png) no-repeat center;background-size: 2.76rem .58rem;',
                doudou:'background: url(./img/new_skin/doudou_w.png) no-repeat center;background-size: 2.74rem 1.59rem;',
                zhouwen:'  background: url(./img/new_skin/zhouwen_w.png) no-repeat center;background-size: 2.81rem .77rem;',

                shuifen:'background: url(./img/new_skin/shuifen_w.png) no-repeat center;    background-size: 2.74rem 1.2rem;',
                bandian:'background: url(./img/new_skin/bandian_w.png) no-repeat center;background-size: 2.5rem .69rem;',
                maokong:'background: url(./img/new_skin/maokong_w.png) no-repeat center;background-size: 2.19rem .58rem;',
                wenli:'background: url(./img/new_skin/wenli_w.png) no-repeat center;background-size: 2.81rem .77rem;',
                cucaodu:'background: url(./img/new_skin/cucaodu_w.png) no-repeat center;background-size: 2.76rem .58rem;',

                
                tabAclass:'list_active_w',
                tabDiv:'div_active_w',

                xuxian:'background: url(./img/new_skin/w_xuxian.png) no-repeat center;background-size: .02rem .75rem;',
                oxuxian:'background: url(./img/new_skin/o_xuxian.png) no-repeat center;background-size: .02rem .75rem;',
                jxuxian:'background: url(./img/new_skin/j_xuxian.png) no-repeat center;background-size: .02rem .75rem;',

                dian:'background: url(./img/new_skin/w_dian.png) no-repeat center;background-size: .28rem;',
                odian:'background: url(./img/new_skin/o_dian.png) no-repeat center;background-size: .28rem;',
                jdian:'background: url(./img/new_skin/j_dian.png) no-repeat center;background-size: .28rem;',

                didian:'./img/new_skin/w_didian.png',

                biankuang:'border: 2px solid #FB7EAD;',
                obiankuang:'border: 2px solid #F8B126;',
                jbiankuang:'border: 2px solid #04CCB1;'

            },
            waringIndex:'',
            waringName:''  ,
            info:{}
        },
        mounted:function(){
            this.loadData();
            
        },
        methods:{
            godo: function(){
				var vm = this
				timer = setInterval(function(){
					vm.deg+=1
					if(vm.deg == -214){
						vm.show_top = false
					}else if(vm.deg == -123){
						vm.show_right = false
						vm.show_left = true
					}else if(vm.deg == -Math.round(2.64*(100-vm.score))){
						clearInterval(timer)
					}
				},1)
			},
            // stopTouchmove:function(event,h,text){
            //     console.log(h)
            //     console.log(text)
            //     // $('.mask').addClass('show');
            //     // $('.popup').addClass('show');
            //     // sTop = $(window).scrollTop();
            //     // $('body').css({'position':'fixed','top':-sTop,'width':'7.5rem'}); 
            //     // $('.popup h1').html($(event.path[0]).attr('data-h'))
            //     // var text = $(event.path[0]).attr('data-text').replace('/n','<br>')
            //     // alert(text)
            //     // $('.huadong').html(text)
            // },
            Touchmove:function(){
                $('.mask').removeClass('show');
                $('.popup').removeClass('show');
                $('body').css({'position':'static'}); 
                $(window).scrollTop(sTop);
            },
            // showPhoto:function(){
            //     $('.mask').addClass('show');
            //     $('.photo').addClass('show');
            //     sTop = $(window).scrollTop();
            //     $('body').css({'position':'fixed','top':-sTop,'width':'7.5rem'});
            // },
            hidePhoto:function(){
                $('.mask').removeClass('show');
                $('.photo').removeClass('show');
                $('body').css({'position':'static'}); 
                $(window).scrollTop(sTop);
            },
            loadData:function(){
                var that = this;
                $.ajax({
                    type:'POST',
                    url:Purl,
                    data:{
                        reportCode : reportCode
                    },
                    success : function(res){
                        if(res.code == 200){
                            that.info = res.data
                            that.score = res.data.totalScore
                            that.sex.num = res.data.sex
                            that.sex.face = res.data.fileName
                            $.each(res.data.minList,function(key,val){
                                that.skinq += val.targetName
                            })
                            $.each(res.data.diseaseResult.split(','),function(index,item){
                                that.diseaseResult.push(that.diseaseResultArr[res.data.diseaseResult.split(',')[index]]);
                            })
                            $.each(res.data.minList,function(index,item){
                                $('.'+item.targetName).show()
                            })
                            
                            $('#score').animateNumber({ number: that.score },1100);
                            that.panduan();
                            if(reportType != 151){
                            	//that.getWx();
                            }
                            that.godo();
                            that.inIt();
                            setTimeout(function(){
                                $('#app').css({'display':'block'});
                                $('.loadmore.loading').css({'display':'none'});
                            },500)
                        }
                    }
                })
            },
            getWx:function(){
                var   that = this;
                var   url = decodeURI(window.location.href);
                $.ajax({
                    url:dataUrl + '/weiXin/wxConfig',
                    type:'POST',
                    data:{
                        reqUrl:url
                    },
                    success:function(res){
                        if(res.code==200){
                            wx.config({
                                //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                appId: res.wxParameter.appId, // 必填，公众号的唯一标识
                                timestamp:res.wxParameter.timestamp ,// 必填，生成签名的时间戳
                                nonceStr: res.wxParameter.nonceStr, // 必填，生成签名的随机串
                                signature: res.wxParameter.signature,// 必填，签名
                                jsApiList: ['checkJsApi','getLocation'] // 必填，需要使用的JS接口列表
                            });
                            wx.error(function(res) {
                                alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
                            });
                            wx.ready(function(){
                                wx.getLocation({
                                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                                    success: function (res) {
                                        var    latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                        var    longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                        var    speed = res.speed; // 速度，以米/每秒计
                                        var    accuracy = res.accuracy; // 位置精度
                                        //  alert(latitude+'-----'+longitude);
                                        // 获取天气
                                        //that.getWeather(latitude,longitude);
                                    }
                                });
                            });
                        }
                    },
                    error: function(){alert('wxConfig error')}
                })
            },
            getWeather:function(lat,log){
                console.log(0)
                var   that = this;
                var   str = [];
                var   arr = [];
                $.ajax({
                    //url:dataUrl + '/api/work/workUtil/getWeatherByLogAndLat',
                    url:dataUrl + '/api/gaode/getWeatherInfo',

                    type:'POST',
                    data:{
                        lat:lat,
                        log:log
                    },
                    success:function(res){
                        if(res.code == 200 && res.data){
                            that.weather = res.data.lives[0]
                            if( that.weather.cond_code >= 502 && that.weather.cond_code <= 515){
                                that.waringIndex = '0,1,2,3,4';
                            }else if(that.weather.cond_code >= 205 && that.weather.cond_code <= 213 || that.weather.cond_code == 200){
                                that.waringIndex = '0,1,2,4';
                            }else if(that.weather.cond_code >= 100 && that.weather.cond_code <= 104){
                                that.waringIndex = '0,1,2';
                            }else if(that.weather.cond_code >= 201 && that.weather.cond_code <= 204){
                                that.waringIndex = '0,1,2';
                            }else if(that.weather.cond_code >= 400 && that.weather.cond_code <= 501){
                                that.waringIndex = '0,1,2';
                            }else if(that.weather.cond_code >= 900 && that.weather.cond_code <= 999){
                                that.waringIndex = '0,1,2';
                            }else if(that.weather.cond_code >= 300 && that.weather.cond_code <= 399){
                                that.waringIndex = '0,2';
                            }else{
                                that.waringIndex = '0';
                            }
                            for(var   i = 0;i < that.waringIndex.split(',').length; i++){
                                str.push(writing[that.waringIndex.split(',')[i]]);
                                arr.push(wriname[that.waringIndex.split(',')[i]]);
                            }
                            that.waringIndex = str;
                            that.waringName = arr;
                        }
                    }
                })
            }
            ,inIt:function(){
                var that = this
                setTimeout(function () {
                    var show = $('.list_h').find('div').eq(0).attr('data-name')
                    $('[data-show='+show+']').css('display','inline-block')
                    var win = this
                    var height = $('.shiji_cheng ').height();
                    $('.cheng').height(height)
                    var domObj = {}
                    var tt = $('.cheng .shiji_cheng').offset().top
                    domObj.roughness = $('[data-target=roughness]')
                    domObj.moisture = $('[data-target=moisture]')
                    domObj.texture = $('[data-target=texture]')
                    domObj.pore = $('[data-target=pore]')
                    domObj.wrinkle = $('[data-target=wrinkle]')
                    domObj.spot = $('[data-target=spot]')
                    domObj.blackhead = $('[data-target=blackhead]')
                    domObj.pimple = $('[data-target=pimple]')
                    domObj.darkcircle = $('[data-target=darkcircle]')
                    domObj.fuse  = $('[data-target=fuse]')
                    domObj.skinage = $('[data-target=skinage]')
                    domObj.chloasma = $('[data-target=chloasma]')
                    domObj.xin = $('[data-target=xin]')
                    domObj.gaishan = $('[data-target=gaishan]')
                    domObj.baochi = $('[data-target=baochi]')
                    if($(window).scrollTop() >= tt){$('.cheng .shiji_cheng').addClass('shiji_cheng_fixed');$('.cheng .shiji_cheng').width($('.cheng').width());gundongBT();}
                    // 设置box高度防滚动变形
                    // 浮动
                    function gundongBT(){
                        $('.list_active_o').removeClass('list_active_o')
                        $('.list_active_j').removeClass('list_active_j')
                        if(domObj.roughness.length > 0 && $(win).scrollTop() >= domObj.roughness.offset().top - 2.5*height  && $(win).scrollTop() <= domObj.roughness.offset().top + domObj.roughness.height() - 2*height ){
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=roughness]').attr('data-show') == 'gaishan'){
                                    $('[data-id=roughness]').addClass('list_active_o')
                                }else if($('[data-id=roughness]').attr('data-show') == 'baochi'){
                                    $('[data-id=roughness]').addClass('list_active_j')
                                }else{
                                    $('[data-id=roughness]').addClass(that.sex.tabAclass)
                                }
                            }else if(domObj.moisture.length > 0 && $(win).scrollTop() >= domObj.moisture.offset().top - 2.5*height && $(win).scrollTop() <= domObj.moisture.offset().top + domObj.moisture.height()- 2*height  ){
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=moisture]').attr('data-show') == 'gaishan'){
                                    $('[data-id=moisture]').addClass('list_active_o')
                                }else if($('[data-id=moisture]').attr('data-show') == 'baochi'){
                                    $('[data-id=moisture]').addClass('list_active_j')
                                }else{
                                    $('[data-id=moisture]').addClass(that.sex.tabAclass)
                                }
                            }else if(domObj.texture.length > 0 && $(win).scrollTop() >= domObj.texture.offset().top - 2.5*height && $(win).scrollTop() <= domObj.texture.offset().top + domObj.texture.height()  - 2*height){
                                
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=texture]').attr('data-show') == 'gaishan'){
                                    $('[data-id=texture]').addClass('list_active_o')
                                }else if($('[data-id=texture]').attr('data-show') == 'baochi'){
                                    $('[data-id=texture]').addClass('list_active_j')
                                }else{
                                    $('[data-id=texture]').addClass(that.sex.tabAclass)
                                }
                            }else if(domObj.pore.length > 0 && $(win).scrollTop() >= domObj.pore.offset().top - 2.5*height && $(win).scrollTop() <= domObj.pore.offset().top + domObj.pore.height() - 2*height ){
                                
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=pore]').attr('data-show') == 'gaishan'){
                                    $('[data-id=pore]').addClass('list_active_o')
                                }else if($('[data-id=pore]').attr('data-show') == 'baochi'){
                                    $('[data-id=pore]').addClass('list_active_j')
                                }else{
                                    $('[data-id=pore]').addClass(that.sex.tabAclass)
                                }
                            }else if(domObj.wrinkle.length > 0 && $(win).scrollTop() >= domObj.wrinkle.offset().top - 2.5*height && $(win).scrollTop() <= domObj.wrinkle.offset().top + domObj.wrinkle.height() - 2*height ){
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=wrinkle]').attr('data-show') == 'gaishan'){
                                    $('[data-id=wrinkle]').addClass('list_active_o')
                                }else if($('[data-id=wrinkle]').attr('data-show') == 'baochi'){
                                    $('[data-id=wrinkle]').addClass('list_active_j')
                                }else{
                                    $('[data-id=wrinkle]').addClass(that.sex.tabAclass)
                                }
                            }else if(domObj.spot.length > 0 && $(win).scrollTop() >= domObj.spot.offset().top - 2.5*height && $(win).scrollTop() <= domObj.spot.offset().top + domObj.spot.height()- 2*height  ){
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=spot]').attr('data-show') == 'gaishan'){
                                    $('[data-id=spot]').addClass('list_active_o')
                                }else if($('[data-id=spot]').attr('data-show') == 'baochi'){
                                    $('[data-id=spot]').addClass('list_active_j')
                                }else{
                                    $('[data-id=spot]').addClass(that.sex.tabAclass)
                                }
                            }else if(domObj.blackhead.length > 0 && $(win).scrollTop() >= domObj.blackhead.offset().top - 2.5*height && $(win).scrollTop() <= domObj.blackhead.offset().top + domObj.blackhead.height()- 2*height  ){
                                
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=blackhead]').attr('data-show') == 'gaishan'){
                                    $('[data-id=blackhead]').addClass('list_active_o')
                                }else if($('[data-id=blackhead]').attr('data-show') == 'baochi'){
                                    $('[data-id=blackhead]').addClass('list_active_j')
                                }else{
                                    $('[data-id=blackhead]').addClass(that.sex.tabAclass)
                                }
                            }else if(domObj.pimple.length > 0 && $(win).scrollTop() >= domObj.pimple.offset().top - 2.5*height && $(win).scrollTop() <= domObj.pimple.offset().top + domObj.pimple.height() - 2*height ){
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=pimple]').attr('data-show') == 'gaishan'){
                                    $('[data-id=pimple]').addClass('list_active_o')
                                }else if($('[data-id=pimple]').attr('data-show') == 'baochi'){
                                    $('[data-id=pimple]').addClass('list_active_j')
                                }else{
                                    $('[data-id=pimple]').addClass(that.sex.tabAclass)
                                }
                            }else if(domObj.darkcircle.length > 0 && $(win).scrollTop() >= domObj.darkcircle.offset().top - 2.5*height && $(win).scrollTop() <= domObj.darkcircle.offset().top + domObj.darkcircle.height()- 2*height  ){
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=darkcircle]').attr('data-show') == 'gaishan'){
                                    $('[data-id=darkcircle]').addClass('list_active_o')
                                }else if($('[data-id=darkcircle]').attr('data-show') == 'baochi'){
                                    $('[data-id=darkcircle]').addClass('list_active_j')
                                }else{
                                    $('[data-id=darkcircle]').addClass(that.sex.tabAclass)
                                }
                            }else if(domObj.fuse.length > 0 && $(win).scrollTop() >= domObj.fuse.offset().top - 2.5*height && $(win).scrollTop() <= domObj.fuse.offset().top + domObj.fuse.height()- 2*height  ){
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=fuse]').attr('data-show') == 'gaishan'){
                                    $('[data-id=fuse]').addClass('list_active_o')
                                }else if($('[data-id=fuse]').attr('data-show') == 'baochi'){
                                    $('[data-id=fuse]').addClass('list_active_j')
                                }else{
                                    $('[data-id=fuse]').addClass(that.sex.tabAclass)
                                }
                            }else if(domObj.skinage.length > 0 && $(win).scrollTop() >= domObj.skinage.offset().top - 2.5*height && $(win).scrollTop() <= domObj.skinage.offset().top + domObj.skinage.height() - 2*height ){
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=skinage]').attr('data-show') == 'gaishan'){
                                    $('[data-id=skinage]').addClass('list_active_o')
                                }else if($('[data-id=skinage]').attr('data-show') == 'baochi'){
                                    $('[data-id=skinage]').addClass('list_active_j')
                                }else{
                                    $('[data-id=skinage]').addClass(that.sex.tabAclass)
                                }
                            }else if(domObj.chloasma.length > 0 && $(win).scrollTop() >= domObj.chloasma.offset().top - 2.5*height && $(win).scrollTop() <= domObj.chloasma.offset().top + domObj.chloasma.height() - 2*height ){
                                $('.'+that.sex.tabAclass).removeClass(that.sex.tabAclass)
                                if($('[data-id=chloasma]').attr('data-show') == 'gaishan'){
                                    $('[data-id=chloasma]').addClass('list_active_o')
                                }else if($('[data-id=chloasma]').attr('data-show') == 'baochi'){
                                    $('[data-id=chloasma]').addClass('list_active_j')
                                }else{
                                    $('[data-id=chloasma]').addClass(that.sex.tabAclass)
                                }
                            }
                            if(domObj.xin.length > 0 && $(win).scrollTop() >= domObj.xin.offset().top -1.5* height && $(win).scrollTop() <= domObj.xin.height() + domObj.xin.offset().top- 1.5 * height){
                                $('.list_h div').attr('data-cl','')
                                $('.show1').attr('data-cl',that.sex.tabDiv)
                            }else if(domObj.gaishan.length > 0 && $(win).scrollTop() >= domObj.gaishan.offset().top - 2*height && $(win).scrollTop() <= domObj.gaishan.height() + domObj.gaishan.offset().top -1.5* height){
                                $('.list_h div').attr('data-cl',' ')
                                $('.show2').attr('data-cl','div_active')
                            }else if(domObj.baochi.length > 0 && $(win).scrollTop() >= domObj.baochi.offset().top - 2*height && $(win).scrollTop() <= domObj.baochi.height() + domObj.baochi.offset().top -1.5* height){
                                $('.list_h div').attr('data-cl','')
                                $('.show3').attr('data-cl','div_active')
                            }
                            that.tabAs()
                        }
                            $('.show_question').on('click',function(){
                                console.log($(this))
                                $('.mask').addClass('show');
                                $('.popup').addClass('show');
                                sTop = $(window).scrollTop();
                                $('body').css({'position':'fixed','top':-sTop,'width':'7.5rem'}); 
                                var text = ''
                                if($(this).attr('data-h') && $(this).attr('data-h') !=''){
                                    $('.popup h1').html($(this).attr('data-h'))
                                }
                                if($(this).attr('data-text') && $(this).attr('data-text') != ''){
                                    text = $(this).attr('data-text').replace(/\/n/g,'<br>')
                                }
                                $('.huadong').html(text)
                            })
                            $('.show_image').on('click',function(){
                                var img = $(this).attr('data-img')
                                console.log(img)
                                $('.mask').addClass('show');
                                $('.photo').addClass('show');
                                $('.photo img').attr('src',img)
                                sTop = $(window).scrollTop();
                                $('body').css({'position':'fixed','top':-sTop,'width':'7.5rem'});
                            })
                    $(document).on("scroll",function(){
                        if($(this).scrollTop() >= tt ){
                            $('.cheng .shiji_cheng').addClass('shiji_cheng_fixed')
                            $('.cheng .shiji_cheng').width($('.cheng').width())
                        }else if($(this).scrollTop() < tt){
                            $('.cheng .shiji_cheng').removeClass('shiji_cheng_fixed')
                        }
                        gundongBT()
                    });
                    // 点击跳转
                    $('.list_h').on('click','div',function(){
                        var name = $(this).attr('data-name')
                        var he = $('[data-ta='+name+']').offset().top - 1.5 * height
                        $(document).scrollTop(he)
                        $('.list_h div').attr('data-cl','')
                        if($(this).attr('data-name')=='xin'){
                            $(this).attr('data-cl',that.sex.tabDiv)
                        }else{
                            $(this).attr('data-cl','div_active')
                        }
                        // if(moveFlag){
                        //     that.tabAs()
                        //     $('.list_h div').attr('data-cl','')
                        //     if($(this).attr('data-name')=='xin'){
                        //         $(this).attr('data-cl',that.sex.tabDiv)
                        //     }else{
                        //         $(this).attr('data-cl','div_active')
                        //     }
                        //     moveFlag = false
                        //     var name = $(this).attr('data-name')
                        //     if($('[data-target='+ name +']').length > 0){
                        //             var top = $('[data-target='+ name +']').offset().top - 1.5 * height
                        //             var timer1 = setInterval(function(){
                        //             var dH =parseInt($(document).scrollTop()) 
                        //             var num = dH > top ? -28 : 28
                        //             if( Math.abs((dH + num) - top) <= 20){
                        //                 moveFlag = true
                        //                 clearInterval(timer1)
                        //             }
                        //             $(document).scrollTop(dH + num)
                        //         },1)
                        //     }else{
                        //         moveFlag = true
                        //     }
                        // }
                    })
                    // 小列表点击跳转
                    $('.body_h').on('click','span',function(){
                        var name =  $(this).attr('data-id')
                        var he = $('[data-target='+name+']').offset().top - 1.5 * height
                        $(document).scrollTop(he)
                        $('.body_h span').removeClass(that.sex.tabAclass)
                        $('.body_h span').removeClass('list_active_o')
                        $('.body_h span').removeClass('list_active_j')
                        if($(this).attr('data-show') == 'gaishan'){
                            $(this).addClass('list_active_o')
                        }else if($(this).attr('data-show') == 'baochi'){
                            $(this).addClass('list_active_j')
                        }else{
                            $(this).addClass(that.sex.tabAclass)
                        }
                        // console.log((this))
                        // if(moveFlag){
                        //     moveFlag = false
                        //     $('.body_h span').removeClass(that.sex.tabAclass)
                        //     $(this).addClass(that.sex.tabAclass)
                        //     if(name == '' || name == undefined || top == undefined){
                        //         moveFlag = true
                        //     }
                        //     var name = $(this).attr('data-id')
                        //     if($('[data-target='+ name +']').length > 0){
                        //         var top = $('[data-target='+ name +']').offset().top  - 1.8 * height
                        //         var timer2 = setInterval(function(){
                        //             var dH =parseInt($(document).scrollTop()) 
                        //             var num = dH > top ? -10 : 10
                        //             if( Math.abs((dH + num) - top) <= 20){
                        //                 moveFlag = true
                        //                 clearInterval(timer2)
                        //             }
                        //             $(document).scrollTop(dH + num)
                        //         },1)
                        //     }else{
                        //         moveFlag = true
                        //     }
                        // }
                    })
                }, 600);
            }
            ,panduan:function(){
                var that = this
                if(that.sex.num == 1 ){
                    that.sex.color = 'color:#3991F2;';
                    that.sex.yibiaopanColor = 'background:linear-gradient(0deg,rgba(57,144,242,1) 0%,rgba(85,188,254,1) 100%);';
                    that.sex.yibiaopanImgBiao = 'background: url(./img/new_skin/slices_blue.png) no-repeat center; background-size:5.47rem;';
                    that.sex.yibiaopanImgkeduPan = 'background: url(./img/new_skin/kd_blue.png) no-repeat; background-size: 4.95rem;';
                    that.sex.bgColor = 'background-color:#59A4F8;';
                    that.sex.qianBg = 'background-color:#ECF5FE;';
                    that.sex.yinColor = 'background:linear-gradient(-90deg,rgba(57,145,242,1) 0%,rgba(236,245,254,1) 100%);';
                    that.sex.dhFace = 'background-image: url(./img/new_skin/new_m.png) ;background-repeat:no-repeat ;background-position:center;background-size: 3rem;';
                    that.sex.CB = 'color:#3991F2;background-color:#ECF5FE;';
                    that.sex.heitou = 'background-image: url(./img/new_skin/heitou_m.png) ;background-repeat:no-repeat ;background-position:center;background-size: 3.22rem .84rem;';
                    that.sex.heiyanquan = 'background-image: url(./img/new_skin/heiyanquan_m.png) ;background-repeat:no-repeat ;background-position:center;    background-size: 2.81rem .67rem;';
                    that.sex.huangheban = 'background-image: url(./img/new_skin/haungheban_m.png) ;background-repeat:no-repeat ;background-position:center;    background-size: 2.76rem .58rem;';
                    that.sex.doudou = 'background-image: url(./img/new_skin/doudou_m.png) ;background-repeat:no-repeat ;background-position:center;background-size: 2.74rem 1.59rem;';
                    that.sex.zhouwen = 'background-image: url(./img/new_skin/zhouwen_m.png) ;background-repeat:no-repeat ;background-position:center;background-size: 2.81rem .77rem;';

                    that.sex.shuifen ='background-image: url(./img/new_skin/shuifen_m.png) ;background-repeat:no-repeat ;background-position:center;background-size: 2.74rem 1.2rem;';
                    that.sex.bandian ='background-image: url(./img/new_skin/bandian_m.png) ;background-repeat:no-repeat ;background-position:center;background-size: 2.5rem .69rem;';
                    that.sex.maokong ='background-image: url(./img/new_skin/maokong_m.png) ;background-repeat:no-repeat ;background-position:center;background-size: 2.19rem .58rem;';
                    that.sex.wenli ='background-image: url(./img/new_skin/wenli_m.png) ;background-repeat:no-repeat ;background-position:center;background-size: 2.81rem .77rem;';
                    that.sex.cucaodu ='background-image: url(./img/new_skin/cucaodu_m.png) ;background-repeat:no-repeat ;background-position:center;background-size: 2.76rem .58rem;';


                    that.sex.tabAclass = 'list_active_m';
                    that.sex.tabDiv = 'div_active_m';
                    that.sex.xuxian = 'background-image: url(./img/new_skin/m_xuxian.png) ;background-repeat:no-repeat ;background-position:center;background-size-x: .02rem ';
                    that.sex.dian = 'background-image: url(./img/new_skin/m_dian.png) ;background-repeat:no-repeat ;background-position:center;background-size: .28rem;';
                    that.sex.didian = './img/new_skin/m_didian.png';
                    that.sex.biankuang = 'border: 2px solid #4BA0FF;';
                }
            }
            ,tabAs:function(){
                   
                if($('.show1').attr('data-cl') == 'div_active_m' || $('.show1').attr('data-cl') == 'div_active_w'){
                    $('[data-show=xin]').css('display','none')
                    $('[data-show=gaishan]').css('display','none')
                    $('[data-show=baochi]').css('display','none')
                    $('[data-show=xin]').css('display','inline-block')
                }else if($('.show2').attr('data-cl') == 'div_active'){
                    $('[data-show=xin]').css('display','none')
                    $('[data-show=gaishan]').css('display','none')
                    $('[data-show=baochi]').css('display','none')
                    $('[data-show=gaishan]').css('display','inline-block')
                }else if($('.show3').attr('data-cl') == 'div_active'){
                    $('[data-show=xin]').css('display','none')
                    $('[data-show=gaishan]').css('display','none')
                    $('[data-show=baochi]').css('display','none')
                    $('[data-show=baochi]').css('display','inline-block')
                }
            }
        }
        
    })
    // 获取url参数方法
    function getQueryString(name) {
        var    result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    };
});