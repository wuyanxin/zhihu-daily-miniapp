const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n;
}

/**
 * @param dateStr {string} eg. '20170215'
 * @return {Date} eg. new Date('2017-02-15')
 */
const string2Date = dateStr => {
  var str = [dateStr.substr(0, 4), dateStr.substr(4, 2), dateStr.substr(6, 2)].join('-');
  return new Date(str);
}

const WEEK = [
  '星期日',  
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
];

const formatDateString = dateStr => {
  var date = string2Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = WEEK[date.getDay()];
  return [year, month, day].map(formatNumber).join('-') + ' ' + week;
};

module.exports = {
  formatTime,
  formatDateString
};
