var Const = require('./const');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function translateRole(t, role) {
  if(t == Const.GAME.GAME_WOLF) {
    switch(role) {
      case Const.ROLE.WOLF:
        return '狼人';
      case Const.ROLE.ORACLE:
        return '预言家';
      case Const.ROLE.HUNTER:
        return '猎人';
      case Const.ROLE.CUPID:
        return '丘比特';
      case Const.ROLE.GUARD:
        return '守卫';
      case Const.ROLE.WITCH:
        return '女巫';
      case Const.ROLE.IDIOT:
        return '白痴';
      case Const.ROLE.CIVILIAN:
        return '村民';
    }
  } else if(t == Const.GAME.GAME_KILLER) {
    switch(role) {
      case Const.ROLE.POLICE:
        return '警察';
      case Const.ROLE.KILLER:
        return '杀手';
      case Const.ROLE.CIVILIAN:
        return '平民';
    }
  }
}

module.exports = {
  formatTime: formatTime,
  translateRole: translateRole
}
