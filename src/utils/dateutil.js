// plugins/dateutil.js

export const dateutil = {
  getWeekArea: (value, date) => {
    if (date == '') date = new Date();
    else date = new Date(date);
    var day = date.getDay(), _date = date.getDate(),
      mondy = _date - (day == 0 ? 7 : day) + 1,
      t1 = new Date(date.getTime()),
      t2 = new Date(date.getTime());
    t1.setDate(mondy);
    t2.setDate(mondy + 6);
    var t1month =
      t1.getMonth() + 1 < 10 ? "0" + (t1.getMonth() + 1) : t1.getMonth() + 1;
    var t1strDate = t1.getDate() < 10 ? "0" + t1.getDate() : t1.getDate();
    var mon = t1.getFullYear() + "-" + t1month + "-" + t1strDate;
    var t2month =
      t2.getMonth() + 1 < 10 ? "0" + (t2.getMonth() + 1) : t2.getMonth() + 1;
    var t2strDate = t2.getDate() < 10 ? "0" + t2.getDate() : t2.getDate();
    var sun = t2.getFullYear() + "-" + t2month + "-" + t2strDate;
    if (value == 'mon') return mon;
    else if (value == 'sun') return sun;
    else return { mon, sun };
  },
  curdate: () => {
    var date = new Date();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var d = date.getFullYear() + "-" + month + "-" + strDate;
    return d;
  },
  curdatenear: (addday) => {
    var now = new Date();
    now.setDate(now.getDate() + addday);
    let month = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
    let day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    var d = now.getFullYear() + "-" + month + "-" + day;
    return d;
  },
  curdateX: (start, type, X) => {
    var now = new Date(start);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    if (type === "year") {
      year = year + X;
    } else if (type === "month") {
      month = (month + X) < 10 ? "0" + (month + X) : (month + X);
    } else if (type === "day") {
      day = (day + X) < 10 ? "0" + (day + X) : day + X;
    }
    var d = year + "-" + month + "-" + day;
    return d;
  },
  curmonth: () => {
    var date = new Date();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var d = date.getFullYear() + "-" + month;
    return d;
  },
  curmon: () => {
    var tempArr = [];
    var now = new Date();
    var nowMonth = now.getMonth();
    var nowYear = now.getFullYear();
    var month = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
    var monthstart = now.getFullYear() + "-" + month + "-" + "01";
    tempArr.push(monthstart);
    var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
    var day = monthEndDate.getDate();
    var monthend = now.getFullYear() + "-" + month + "-" + day;
    tempArr.push(monthend);
    return tempArr;
  },
  predate: () => {
    let tempArr = [];
    let now = new Date();
    let dateStart = new Date(now.getTime() - 12 * 24 * 3600 * 1000);
    let dateEnd = new Date(now.getTime() - 6 * 24 * 3600 * 1000);

    let year = dateStart.getFullYear();
    let month = dateStart.getMonth() + 1;
    let day = dateStart.getDate() < 10 ? "0" + dateStart.getDate() : dateStart.getDate();
    tempArr.push(year + "-" + month + "-" + day);
    year = dateEnd.getFullYear();
    month = dateEnd.getMonth() + 1;
    day = dateEnd.getDate() < 10 ? "0" + dateEnd.getDate() : dateEnd.getDate();
    tempArr.push(year + "-" + month + "-" + day);

    return tempArr;
  },
  curtime: () => {
    var date = new Date();
    var t = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return t;
  },
  curdatetime: () => {
    var date = new Date();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var dt = date.getFullYear() + "-" + month + "-" + strDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return dt;
  },
  curdatetime2: () => {
    var date = new Date();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var dt = date.getFullYear() + month + strDate + date.getHours() + date.getMinutes() + date.getSeconds();
    return dt;
  },
  FormatDate: (dateparams) => {
    var time = new Date(dateparams);
    var y = time.getFullYear();
    var m = time.getMonth() < 9 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
    var d = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    var formatDate = y + "-" + m + "-" + d;
    return formatDate;
  }
};

export default {
  install(app) {
    app.config.globalProperties.$dateutil = dateutil;
  }
};
