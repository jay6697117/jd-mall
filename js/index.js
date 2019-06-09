/**
 * Created by a123 on 2017/2/16.
 */
window.onload = function() {
  changeNavBarColor();
  secondKill();
  changeBanner();
};

window.onresize = function() {
  setTimeout(function() {
    window.location.reload();
  }, 200);
};

/*
  改变导航条的颜色
*/
function changeNavBarColor() {
  // 1. 获取导航条和焦点图
  var headerBox = document.getElementsByClassName('jd_header_box')[0];
  var banner = document.getElementsByClassName('jd_banner')[0];

  // 2. 求出焦点图的高度
  var bannerH = banner.offsetHeight;

  window.onscroll = function() {
    // 3. 求出页面偏离头部的高度
    var scrollTopH = document.body.scrollTop;

    // 4. 判断
    var opt = 0;
    if (scrollTopH <= bannerH) {
      // 4.0 求出透明度
      opt = (scrollTopH / bannerH) * 0.85;
    } else {
      opt = 0.85;
    }
    // 4.1 设置颜色渐变
    headerBox.style.background = 'rgba(201, 21, 35, ' + opt + ')';
  };
}

/*
   秒杀倒计时
*/
function secondKill() {
  // 1. 获取秒杀标签
  var sencondTime = document.getElementsByClassName('s_kill_time')[0];
  var spans = sencondTime.getElementsByTagName('span');

  // 2. 设置定时器
  var timer = null;
  var time = 8 * 60 * 60;
  timer = setInterval(function() {
    /* 出错点  */
    time--;
    // 2.1 清除定时器
    if (time < 0) {
      clearInterval(timer);
    }

    // 2.2 拆分成时分秒
    var h = Math.floor(time / (60 * 60));
    var m = Math.floor((time % (60 * 60)) / 60);
    var s = time % 60;

    // 2.3 把内容显示到标签上(出错点)
    spans[0].innerHTML = h >= 10 ? Math.floor(h / 10) : 0;
    spans[1].innerHTML = h % 10;

    spans[3].innerHTML = m >= 10 ? Math.floor(m / 10) : 0;
    spans[4].innerHTML = m % 10;

    spans[6].innerHTML = s >= 10 ? Math.floor(s / 10) : 0;
    spans[7].innerHTML = s % 10;
  }, 1000);
}

/*
  首页轮播图
 */
function changeBanner() {
  // 1.获取需要的标签
  var banner = document.getElementsByClassName('jd_banner')[0];
  var bannerW = banner.offsetWidth;
  var imageBox = banner.getElementsByTagName('ul')[0]; // 图片的盒子
  var indicatorBox = banner.getElementsByTagName('ol')[0]; // 指示器的盒子
  var allPoints = indicatorBox.getElementsByTagName('li'); // 所有的圆点

  // 2. 设置过渡效果 清除过渡效果 位置改变
  var addTransition = function() {
    imageBox.style.transition = 'all 1s ease';
    imageBox.style.webkitTransition = 'all 1s ease'; // 兼容手机端老webkit浏览器内核
  };

  var removeTransition = function() {
    imageBox.style.transition = 'none';
    imageBox.style.webkitTransition = 'none'; // 兼容手机端老webkit浏览器内核
  };

  var changeTranslateX = function(x) {
    imageBox.style.transform = 'translateX(' + x + 'px)';
    imageBox.style.webkitTransform = 'translateX(' + x + 'px)';
  };

  // 3. 让图片盒子滚动起来
  var index = 1; // 全局的索引
  var timer = null;
  // timer = setInterval(scrollImg, 1000);
  timer = setInterval(scrollImg, 3000);
  function scrollImg() {
    index++;
    // 设置过渡效果
    addTransition();
    // 改变位置
    changeTranslateX(-index * bannerW);
  }

  // 4. 当图片过渡结束后,临界值
  /*
    imageBox.addEventListener('transitionEnd',function () {
         // 4.1 判断最大最小索引
         if(index >= 9){ // 最大值
             index = 1;
         } else if(index <=0){
             index = 8;
         }

         // 4.2 清除过渡
         removeTransition();
         changeTranslateX(-index * bannerW);

         // 4.3 改变指示器
         changePoints();
    });

    imageBox.addEventListener('webkitTransitionEnd',function () {
        // 4.1 判断最大最小索引
        if(index >= 9){ // 最大值
            index = 1;
        } else if(index <=0){
            index = 8;
        }

        // 4.2 清除过渡
        removeTransition();
        changeTranslateX(-index * bannerW);

        // 4.3 改变指示器
        changePoints();
    });
    */
  mjd.transitionEnd(imageBox, function(e) {
    // 4.1 判断最大最小索引
    if (index >= 9) {
      // 最大值
      index = 1;
    } else if (index <= 0) {
      index = 8;
    }

    // 4.2 清除过渡
    removeTransition();
    changeTranslateX(-index * bannerW);

    // 4.3 改变指示器
    changePoints();
  });

  // 5. 让点跟着滚动
  var changePoints = function() {
    // 5.1 清除圆点上的默认选中样式
    for (var i = 0; i < allPoints.length; i++) {
      allPoints[i].className = '';
    }

    // 5.2 让指示器的索引和图片的索引保持一致
    var pointIndex = index;
    if (pointIndex >= 9) {
      pointIndex = 1;
    } else if (index <= 0) {
      pointIndex = 8;
    }

    // 5.3 让当前的索引对应的指示器被选中  <出错点:pointIndex-1>
    allPoints[pointIndex - 1].className = 'current';
  };

  // 6. 监听手势滑动
  var startX = 0; // 起始触摸水平位置
  var endX = 0; // 结束触摸水平位置
  var distanceX = 0; // 手指滑动的距离

  /*
       出错点: touch 写成了 tounch
    */
  // 6.1  手指触碰屏幕的时候触发
  imageBox.addEventListener('touchstart', function(e) {
    // 6.1.1 清除定时器
    clearInterval(timer);
    // 6.1.2 获取起始位置
    startX = e.touches[0].clientX;
  });

  // 6.2 手指在屏幕中滑动时候连续触发。
  imageBox.addEventListener('touchmove', function(e) {
    // 6.2.1 阻止默认的滚动事件
    e.preventDefault();
    // 6.2.2 获取结束位置
    endX = e.touches[0].clientX;
    // 6.2.3 获取到滑动的距离
    distanceX = startX - endX;
    // console.log(distanceX);
    // 6.2.4 清除过渡效果,改变位置
    removeTransition();
    changeTranslateX(-index * bannerW - distanceX);
  });

  // 6.3 当手指离开屏幕的时候触发
  imageBox.addEventListener('touchend', function() {
    // 6.3.1 判断滑动的距离是否超出了1/3  && 必须处于滑动状态
    if (Math.abs(distanceX) > (1 / 3) * bannerW && endX !== 0) {
      /*--出错点 endX != 0 endX > 0--*/
      // 判断
      if (distanceX > 0) {
        index++;
      } else if (distanceX < 0) {
        index--;
      }
    }

    // 添加过渡效果
    addTransition();
    // 改变位置
    changeTranslateX(-index * bannerW); /*出错点: bannerW --> banner*/

    // 重新开启定时器
    timer = setInterval(scrollImg, 1000);

    // 清除记录值(滑动结束,下次滑动应该是新的值)
    startX = 0;
    endX = 0;
    distanceX = 0;
  });
}
