//将时间戳变为2018/02/10 00:00格式
let dateAndTime = (time, connector) => {
  var dateTime = formatTime(time, !connector ? "-" : connector, true);
  return dateTime;
}

//将时间戳变为2018/02/10格式
let changeTime = (time, connector) => {
  var dateTime = formatTime(time, !connector ? "-" : connector);
  return dateTime;
}

//将时间戳变为09-09 18:30格式
let timeNoYear = (time, connector) => {
  var str = !connector ? "-" : connector;
  var dateTime = formatTime(time, str, true);
  var returnStr = dateTime.split(str)
  return returnStr[0] + str + returnStr[1] + str + returnStr[2];
}

let strStartAndEnd = (str, strart, end) => {
  if (!str) {
    return;
  }
  if (!end) {
    end = str.length;
  }
  str = str.substring(strart, end);
  return str.replace(' - ', '-');
}

//截取字符串
let substr = (str, num) => {
  if (!str) {
    return;
  }
  var text = '';
  if (str.length > 0) {
    if (str.length <= num) {
      text = str;
    } else {
      text = str.substring(0, num) + '...';
    }
    return text;
  } else {
    return str;
  }
}

//截取拼接的字符串
let subSplit = (str, type) => {
  if (!str) {
    return false;
  }
  var arr = str.split(type);
  return arr;
}

// 返回名字
let getName = (str) =>{
  if(!str) return
  if(str.length<=2){
    return str;
  }else{
    return str.substr(str.length -2 ,2)
  }
}

//时间戳转时间
let getDate = (dateTimeStamp) => {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date();
  var diffValue = now - (dateTimeStamp);
  if (diffValue < 0) {
    //若日期不符则弹出窗口告之
    //alert("结束日期不能小于开始日期！");
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  var result = "";

  if (monthC >= 1) {
    if (monthC <= 12)
      result = "" + parseInt(monthC) + "月前";
    else {
      result = formatTime(dateTimeStamp, "-");

    }
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else {
    result = "刚刚";

  }
  return result;
}

//保留小数
let _toFixed = (text, num, amount = 100) => {
  var str = null;
  !num ? num = 2 : num;
  if (text != undefined || text != '' || text != null) {
    str = ((text * amount).toFixed(0) / amount).toFixed(num);
    return isNaN(str) ? '0.00' : str;
  }
}

let timeStyle = (dateTime, style, type, layout) => {
  dateTime = dateTime.replace(/-/g, '/')
  //时间格式
  if (layout == 'str') {
    var arr = [],
      arr2;
    arr = dateTime.split(' ');
    if (type == "onlyMd") {
      arr2 = arr[0].split('-');
      return arr2[1] + '-' + arr2[2]
    } else if (type == "onlyHm") {

      arr2 = arr[1].split(':');
      return arr2[1] + ':' + arr2[2]
    }
  } else { //时间戳格式
    var date = new Date(); //返回当前时间对象
    date = new Date(dateTime);
    var year = date.getFullYear() //这个
    var month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    var day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
    var hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()
    var minute = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
    var second = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
    if (type == 'onlyYear') {
      return year;
    } else if (type == "noYear") {
      return month + style + day + ' ' + hour + ":" + minute;
    } else if (type == "onlyMd") {
      return month + style + day;
    } else if (type == "onlyHm") {
      return hour + ":" + minute;
    } else {
      return year + style + month + style + day + ' ' + hour + ":" + minute + ':' + second;
    }
  }
}

function formatTime(dateTime, style, hasTime) {
  dateTime = dateTime.replace(/-/g, '/')
  var date = new Date(); //返回当前时间对象
  date = new Date(dateTime);
  var year = date.getFullYear() //这个
  var month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  var day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
  var hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()
  var minute = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
  var second = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
  if (hasTime) {
    return year + style + month + style + day + ' ' + hour + ":" + minute;
  }
  return year + style + month + style + day;
}

// vin 打码
function changeVinStr(vin) {
  if (!vin) return;
  var newVin = vin.replace(vin.substring(vin.length - 11, vin.length - 5), '******');
  return newVin;
}

// 获取缩略图
// 获取缩略图 
import { agentUrl } from '@/api/url'
function littleImg(url, width, height) {
  if (!url) return;
  url = url.replace('http://','https://');
  var idx = url.lastIndexOf('.');
  var type = url.substring(idx, url.length);
  let backUrl = '';
  // let ossShuiYin = '2020/06/17/_282f4492-ad4e-4546-8170-79d339c048c5.png';  // oss 水印图片，转为base64 = MjAyMC8wNi8xNy9fMjgyZjQ0OTItYWQ0ZS00NTQ2LTgxNzAtNzlkMzM5YzA0OGM1LnBuZw==
  let base64Img
  if(agentUrl.includes('testagent')){
    base64Img = '2020/06/17/_282f4492-ad4e-4546-8170-79d339c048c5.png'
  }else{
    base64Img = '2020/06/17/_5f32ddb7-5b58-4a46-80e5-1619fff3ad55.png'
  }
  let base64ImgCode = window.btoa(base64Img)
  if (url.includes('oss-cn-')) {
    // oss 图片
    if (width && height) {
      backUrl = `${url}?x-oss-process=image/resize,m_lfit,w_${width},h_${height},limit_0/watermark,image_${base64ImgCode},t_90,g_se,x_10,y_10`
    } else if (width) {
      backUrl = `${url}?x-oss-process=image/resize,m_mfit,w_${width},limit_0/watermark,image_${base64ImgCode},t_90,g_se,x_10,y_10`
    } else if (height) {
      backUrl = `${url}?x-oss-process=image/resize,m_lfit,h_${height},limit_0/watermark,image_${base64ImgCode},t_90,g_se,x_10,y_10`
    } else {
      backUrl = `${url}?x-oss-process=image/resize,m_lfit,w_200,limit_0/watermark,image_${base64ImgCode},t_90,g_se,x_10,y_10`
    }
  } else {
    // 非 oss 图片
    if (width && height) {
      backUrl = url + '_' + 200 + 'x' + 200 + type;
    } else if (height) {
      backUrl = url + '_-' + height + type;
    } else if (width) {
      backUrl = url + '_' + width + '-' + type
    } else {
      backUrl = url + '_' + 200 + '-' + type
    }
  }
  return backUrl
}

// 没有水印
function littleImg2(url, width, height) {
  if (!url) return;
  url = url.replace('http://','https://');
  var idx = url.lastIndexOf('.');
  var type = url.substring(idx, url.length);
  let backUrl = '';
  if (url.includes('oss-cn-')) {
    // oss 图片
    if (width && height) {
      backUrl = `${url}?x-oss-process=image/resize,m_lfit,w_${width},h_${height}`
    } else if (width) {
      backUrl = `${url}?x-oss-process=image/resize,m_mfit,w_${width}`
    } else if (height) {
      backUrl = `${url}?x-oss-process=image/resize,m_lfit,h_${height}`
    } else {
      backUrl = `${url}?x-oss-process=image/resize,m_lfit,w_200`
    }
  } else {
    // 非 oss 图片
    if (width && height) {
      backUrl = url + '_' + 200 + 'x' + 200 + type;
    } else if (height) {
      backUrl = url + '_-' + height + type;
    } else if (width) {
      backUrl = url + '_' + width + '-' + type
    } else {
      backUrl = url + '_' + 200 + '-' + type
    }
  }
  return backUrl
}

// 价格打星号
function filterPrice(price) {
  if (price) {
    if (price < 10) {
      price = parseInt(price) + '.**';
    } else {
      var priceArr = (price + '').split('.');
      let after = priceArr[1] || '00'
      price = priceArr[0].substring(0, priceArr[0].length - 1) + '*.' + after
    }
    return price
  }
}

export {
  dateAndTime,
  changeTime,
  substr,
  getDate,
  _toFixed,
  subSplit,
  timeNoYear,
  timeStyle,
  strStartAndEnd,
  changeVinStr,
  littleImg,
  littleImg2,
  filterPrice,
  getName
}
