function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}:{a}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()
  const diff = (d-now) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
        d.getMonth() +
        1 +
        '月' +
        d.getDate() +
        '日' +
        d.getHours() +
        '时' +
        d.getMinutes() +
        '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
function param(json) {
  if (!json) return ''
  return cleanArray(
      Object.keys(json).map(key => {
        if (json[key] === undefined) return ''
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
      })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
      '{"' +
      decodeURIComponent(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"')
          .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
        classString.substr(0, nameIndex) +
        classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

function faultTime(faultDate, completeTime) {
      var stime = Date.parse(new Date(faultDate));
      var etime = Date.parse(new Date(completeTime));
      // 两个时间戳相差的毫秒数
      var usedTime = etime - stime;
      // 计算相差的天数  
      var days = Math.floor(usedTime / (24 * 3600 * 1000));
      // 计算天数后剩余的毫秒数
      var leave1 = usedTime % (24 * 3600 * 1000);  
      // 计算出小时数  
      var hours = Math.floor(leave1 / (3600 * 1000));
      // 计算小时数后剩余的毫秒数
      var leave2 = leave1 % (3600 * 1000);        
      // 计算相差分钟数
      var minutes = Math.floor(leave2 / (60 * 1000));
	 if(days == 0){
		 if(hours == 0){
			 var time = minutes + "分";
		 }else{
			 var time = hours + "时" + minutes + "分";
		 }
	 }else{
		 var time = days + "天" + hours + "时" + minutes + "分";
	 }
	 if(minutes < 0){
		 time = '来迟'
	 }
      return time;
 }

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}


function isIdCard(str) {
  /**
   * @author hmagic
   * @date 2018-12-24
   * @description 判断身份证
   * @param { str } 身份证号码
   * @returns { boolean }
  */
  if (!str) return false;
  // const reg = new RegExp(this.idCardReg)
  // return reg.test(str)
  var main = {
    vcity: {
      11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
      21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
      33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
      42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
      51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
      63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
    },
    checkCard: function checkCard(str) {
      //校验长度，类型
      if (this.isCardNo(str) === false) {
        return false;
      }
      //检查省份
      if (this.checkProvince(str) === false) {
        return false;
      }
      //校验生日
      if (this.checkBirthday(str) === false) {
        return false;
      }
      //检验位的检测
      if (this.checkParity(str) === false) {
        return false;
      }
      return true;
    },
    //检查号码是否符合规范，包括长度，类型
    isCardNo: function isCardNo(str) {
      //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
      if (reg.test(str) === false) {
        return false;
      }
      return true;
    },
    //取身份证前两位,校验省份
    checkProvince: function checkProvince(str) {
      var province = str.substr(0, 2);
      if (this.vcity[province] == undefined) {
        return false;
      }
      return true;
    },
    //检查生日是否正确
    checkBirthday: function checkBirthday(str) {
      var len = str.length;
      //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
      if (len == '15') {
        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
        var arr_data = str.match(re_fifteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date('19' + year + '/' + month + '/' + day);
        return this.verifyBirthday('19' + year, month, day, birthday);
      }
      //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
      if (len == '18') {
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        var arr_data = str.match(re_eighteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date(year + '/' + month + '/' + day);
        return this.verifyBirthday(year, month, day, birthday);
      }
      return false;
    },
    verifyBirthday: function verifyBirthday(year, month, day, birthday) {
      var now = new Date();
      var now_year = now.getFullYear();
      //年月日是否合理
      if (birthday.getFullYear() == year && birthday.getMonth() + 1 == month && birthday.getDate() == day) {
        //判断年份的范围（3岁到100岁之间)
        var time = now_year - year;
        if (time >= 0 && time <= 130) {
          return true;
        }
        return false;
      }
      return false;
    },
    //校验位的检测
    checkParity: function checkParity(str) {
      //15位转18位
      str = this.changeFivteenToEighteen(str);
      var len = str.length;
      if (len == '18') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0,
            i,
            valnum;
        for (i = 0; i < 17; i++) {
          cardTemp += str.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[cardTemp % 11];
        if (valnum == str.substr(17, 1)) {
          return true;
        }
        return false;
      }
      return false;
    },
    //15位转18位身份证号
    changeFivteenToEighteen: function changeFivteenToEighteen(str) {
      if (str.length == '15') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0,
            i;
        str = str.substr(0, 6) + '19' + str.substr(6, str.length - 6);
        for (i = 0; i < 17; i++) {
          cardTemp += str.substr(i, 1) * arrInt[i];
        }
        str += arrCh[cardTemp % 11];
        return str;
      }
      return str;
    }
  };
  return main.checkCard(str);
}