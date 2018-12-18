//-----测试-----
/*var dataUrl = 'http://csh.jiankangzhan.com'; //数据接口
 * 
var testHealthUrl = 'http://kj101-tt.jiankangzhan.com'; //大机器

var bit_testHealthUrl = 'http://kj201-tt.jiankangzhan.com'; //小机器

var couponData = 'http://coupon-tt.jiankangzhan.com'; //优惠券*/

//---生产-----
var dataUrl='';


switch (saasId)
{	
	case '195518': //预生产
	  	dataUrl='http://saas-ysc.jiankangzhan.com';
	  	break;
	case '100067':  //素问 康加帮
	  	dataUrl='http://sc.jiankangzhan.com';
	  	break;
	case '208653':  // 草珊瑚
	  	dataUrl='http://csh.jiankangzhan.com';
	  	break;
	case '215563': // 御膳堂
	 	dataUrl='http://yst.jiankangzhan.com';
	  	break;
	case '208654': // 之源健康
	  	dataUrl='http://zyjk.jiankangzhan.com';
	  	break;
	case '214913':  // 探险家
	  	dataUrl='http://txj.jiankangzhan.com';
	  	break;
	case '215802': //爱齿口腔
	  	dataUrl='http://ackq.jiankangzhan.com';
	  	break;
	case '217094': //湖南力菲
	  	dataUrl='http://lf.jiankangzhan.com';
	  	break;
	default:
		alert('saasId='+saasId);
	  	dataUrl='http://wx.jiankangzhan.com';  
}




var testHealthUrl = 'http://kj101.jiankangzhan.com'; //大机器

var bit_testHealthUrl = 'http://kj201.jiankangzhan.com'; //小机器

var couponData = 'http://coupon.jiankangzhan.com'; //优惠券

var channel = 'http://pay.jiankangzhan.com'; //支付通道  wx
//var channel = 'http://47.94.14.217:8765'; //支付通道  -tt
//var channel = 'http://39.107.74.133:8081'; //支付通道  -ycs




var shareImgUrl = 'http://image.jiankangzhan.com'; //分享图片