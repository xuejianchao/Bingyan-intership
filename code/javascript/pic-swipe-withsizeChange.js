//首先看一下动效,不考虑图片的排序
//单纯这样是不行的,首先静态动效不过关,其次手指滑动有一个过程,中间可以停止然后返回原装,这个也做不道.
var centerli = document.querySelector('.centerPic');
var centerimg = document.querySelector('.centerPic img');

var leftli = document.querySelector('.leftPic');
var leftimg = document.querySelector('.leftPic img');

var rightli = document.querySelector('.rightPic');
var rightimg = document.querySelector('.rightPic img');

var body = document.querySelector('body');
var touchEvent = null;
var initCood = {
  x: undefined,
  y: undefined
};

body.addEventListener('touchstart', handleStart);
body.addEventListener('touchmove', handleMove);
body.addEventListener('touchend', handleEnd);

function handleStart(event) {
  touchEvent = event.changedTouches[0];
  console.log(touchEvent);
  initCood.x = touchEvent.clientX;
  initCood.y = touchEvent.clientY;
}

function handleMove(event) {
  var dealt_x = touchEvent.clientX - initCood.x;
  var dealt_y = touchEvent.clientY - initCood.y;
  console.log(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

}

var BoxSlide = function (el, swipe, options) {
  this.options = options || {}; //可选函数
  this.current = 0; //当前页面索引
  this.pageX; //横向的手指落点
  this.pageY; //纵向的手指落点
  this.slideWidth; //滑动的最大宽度,设备宽度的0.92
  this.flag; //判断滑动方向的变量
  this.move; //滑动的距离
  this.$el = el; //当前页面的对象,这个美元符只是用来区别局部变量($el)和形参的
  this.swipe = swipe || 'X'; //滑动方向参数
  this.resize().init().bindEvents(); //初始化
}

BoxSlide.prototype.init = function (i) {
  var current = i ? this.$el.children[i] : this.$el.firstElementChild;
  if (!current) throw 'ERROR';
  //moving类名作为当前滑动页面的标记,也在样式中作滑动的扩展效果
  current.classList.add('moving');
  current.style.webkitTransform = 'translate3d(0,0,0)';

  //以swipe的值预设置其他页面的宽高，获得流畅的交互效果
  //不设置最后一个第一个第二个
  for (var i = 2; i < this.$el.children.length - 1; i++) {
    //调用setX/setY函数,参数由swipe属性决定,通过set函数将各个页面放到初始位置上
    //this['set' + this.swipe](this.$el.children[i], (this.swipe === 'X' ? this.width : this.height))
  };
  setTimeout(function () {
    current.classList.remove('moving')
    current.classList.add('play')
    //设置transform和animation有什么区别呢?
    //区别就是,transform只是静态,没有过度,没有动作.animation会将给定的transform的过程展示出来
  }, 3e2); //就是300,为什么要这么写呢
  return this
};

BoxSlide.prototype.touchstart = function (e) {
  var touches = e.touches[0];
  //触控开始
  this.flag = null;
  this.move = 0;
  //记录落点
  this.pageX = touches.pageX;
  this.pageY = touches.pageY;
};

PageSlide.prototype.touchmove = function (e) {
  var touches = e.touches[0];
  var X = touches.pageX - this.pageX;
  var Y = touches.pageY - this.pageY;
  var current = this.getCurrent();

  var next = current.nextElementSibling;
  if (!next) {
    //开始添加轮询功能
    next = current.parentNode.firstElementChild;
  }

  var prev = current.previousElementSibling;
  if (!prev) {
    prev = current.parentNode.lastElementChild;
  }

  //添加移动样式
  //如果this.flag为null
  if (!this.flag) {
    //只用一个语句就判断了左右划还是上下划
    this.flag = Math.abs(X) > Math.abs(Y) ? 'X' : 'Y';
    if (this.flag === this.swipe) {
      // 如果方向正确,将这三个元素都标上moving
      current.classList.add('moving');
      next && next.classList.add('moving');
      prev && prev.classList.add('moving');
    };
  };

  //如果this.flag不为undefined
  if (this.flag === this.swipe) {
    e.preventDefault();
    e.stopPropagation();

    //swipe horizontal
    this.move = X;
    //设置有关的三个界面的动画效果
    //注意这里用的是X/Y,也就是移动的距离
    //通过给三个元素加上类,来达成一个动画效果!!!!!!!!!!

    if ((window.getComputedStyle(current).x + window.getComputedStyle(current).width / 2) < (window.innerWidth /
        2)) {
      this.setX_left(current, X);
    } else {
      this.setX_right(current, X);
    }
    if ((window.getComputedStyle(next).x + window.getComputedStyle(next).width / 2) < (window.innerWidth /
        2)) {
      this.setX_left(next, X + this.width);
    } else {
      this.setX_right(next, X + this.width);

    }
    if ((window.getComputedStyle(prev).x + window.getComputedStyle(prev).width / 2) < (window.innerWidth /
        2)) {
      this.setX_left(prev, X - this.width);
    } else {
      this.setX_right(prev, X - this.width);
    }
  }
}

BoxSlide.prototype.setX_left = function (el, x, unit) {

  el && (el.style.webkitTransform = 'translate3d(' + x + (unit || 'px') + ',0,0) ' + 'scale(' + Math.abs(x) +
    0.0617 * x + ',' + Math.abs(x) + 0.0617 * x + ')');
};

BoxSlide.prototype.setX_right = function (el, x, unit) {

  el && (el.style.webkitTransform = 'translate3d(' + x + (unit || 'px') + ',0,0) ' + 'scale(' + Math.abs(x) -
    0.0617 * x + ',' + Math.abs(x) - 0.0617 * x + ')');
};

BoxSlide.prototype.bindEvents = function () {
  var self = this;

  'touchstart touchmove touchend touchcancel'.split(' ').forEach(function (evn) {
    //将四个触控函数（申明在后面）绑定到每个页面
    self.$el.addEventListener(evn, self[evn].bind(self), false);
  });
}

BOxSlide.prototype.resize = function () {
  this.slideWidth = window.innerWidth * 0.92;
}