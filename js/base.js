/*公共的文件*/
window.mjd = {};
// 判断过渡之后的临界值
mjd.transitionEnd = function(obj, callBack) {
  // 1. 判断obj是否是对象
  if (typeof obj !== 'object') return;

  // 2. 处理
  obj.addEventListener('transitionEnd', function(e) {
    callBack && callBack(e);
  });

  obj.addEventListener('webkitTransitionEnd', function(e) {
    callBack && callBack(e);
  });
};

/*
   封装tap事件
 */
mjd.tap = function(obj, callback) {
  // 1.1 起始时间
  var startTime = 0;
  // 1.2 是否产生移动
  var isMove = false;

  // 2. 监听常用的触摸事件
  obj.addEventListener('touchstart', function() {
    // 2.1 获取到当前的事件
    startTime = Date.now();
  });

  obj.addEventListener('touchmove', function() {
    isMove = true; // 产生移动
  });

  obj.addEventListener('touchend', function(e) {
    // 判断是否产生tap
    if (Date.now() - startTime < 200 && !isMove) {
      callback && callback(e);
    }

    // 置零
    startTime = 0;
    isMove = false;
  });
};
