/**
 * Created by a123 on 2017/2/17.
 */
window.onload = function() {
  leftCategory();
};

function leftCategory() {
  // 1. 拿到相应的标签
  var parentDom = document.getElementsByClassName('category_main_left')[0];
  var childDom = parentDom.getElementsByClassName('category_main_left_con')[0];

  // 2. 求出父标签和子标签的高度
  var parentH = parentDom.offsetHeight;
  var childH = childDom.offsetHeight;
  // console.log(parentH, childH);

  // 3. 确定合理的滚动区间
  var maxY = 0; // 最大滚动区间
  var minY = -(childH - parentH); // 最小滚动的区间
  // console.log(minY);

  // 4. 确定合理的缓冲区间
  var buffer = 150;

  //5. 设置过渡 清除过渡  改变位置
  var addTransition = function() {
    childDom.style.transition = 'all .2s ease';
    childDom.style.webkitTransition = 'all .2s ease';
  };

  var removeTransition = function() {
    childDom.style.transition = 'none';
    childDom.style.webkitTransition = 'none';
  };

  var changeTranslateY = function(y) {
    childDom.style.transform = 'translateY(' + y + 'px)';
    childDom.style.webkitTransform = 'translateY(' + y + 'px)';
  };

  // 6. 滑动起来
  var startY = 0;
  var endY = 0;
  var moveY = 0;
  var currentY = 0; // 时刻记录当前的y的值
  // 6.1 开始触摸
  childDom.addEventListener('touchstart', function(e) {
    // 6.1.1 获取起始位置
    startY = e.touches[0].clientY;
  });
  // 6.2 触摸移动
  childDom.addEventListener('touchmove', function(e) {
    // 6.2.1 获取不断移动产生的结束位置
    endY = e.touches[0].clientY;
    // 6.2.2 计算移动的距离
    moveY = startY - endY;
    // console.log(moveY);

    // 6.2.3 移动起来
    // 确定合理的滚动区间
    if (currentY - moveY < maxY + buffer && currentY - moveY > minY - buffer) {
      removeTransition();
      changeTranslateY(currentY - moveY);
    }
  });
  // 6.3 结束触摸
  childDom.addEventListener('touchend', function(e) {
    // 6.3.1 结合缓冲判断是否在合理滚动区间
    // 向下滚动
    if (currentY - moveY > maxY) {
      currentY = maxY;
      // 添加过渡,改变位置
      addTransition();
      changeTranslateY(currentY);
    } else if (currentY - moveY < minY) {
      currentY = minY;
      // 添加过渡,改变位置
      addTransition();
      changeTranslateY(currentY);
    } else {
      // 正常情况
      currentY = currentY - moveY;
    }

    // 6.3.2 清零
    startY = 0;
    endY = 0;
    moveY = 0;
  });

  // 7. 监听tap事件
  var liList = childDom.getElementsByTagName('li');
  mjd.tap(childDom, function(e) {
    // 7.1 让所有的li标签的className清除
    for (var i = 0; i < liList.length; i++) {
      liList[i].className = '';
      // 去除对应的索引
      liList[i].index = i;
    }

    // 7.2 让当前的被选中
    var li = e.target.parentNode;
    li.className = 'current';

    // 7.3 求出滚动的距离
    var distanceY = -(li.index * 50);

    // 7.4 让childDom在合理的区域滚动
    if (distanceY > minY) {
      addTransition();
      changeTranslateY(distanceY);
      currentY = distanceY;
    } else {
      changeTranslateY(minY);
      currentY = minY;
    }

    // 7.5 模拟数据的加载
    var rightDom = document.getElementsByClassName('category_main_right')[0];
    rightDom.style.transition = 'all .3s ease';
    rightDom.style.webkitTransition = 'all .3s ease';
    rightDom.style.opacity = 0;
    setTimeout(function() {
      rightDom.style.opacity = 1;
    }, 300);
  });
}
