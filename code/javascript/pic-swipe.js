var PicSlide = function (el, swipe, options) {
  this.options = options || {}; //可选函数
  this.current = 0; //当前页面索引
  this.pageX; //横向的手指落点
  this.pageY; //纵向的手指落点
  this.height; //设备高度
  this.width; //设备宽度
  this.flag; //判断滑动方向的变量
  this.move; //滑动的距离
  this.pics = el; //当前页面的对象
  this.allPics = el.querySelector('li');
  this.swipe = swipe || 'X'; //滑动方向参数
  this.resize().init().bindEvents();
};

PicSlide.prototype.resize = function () {
  this.width = window.innerWidth;
  this.height = this.width;
  return this;
};

PicSlide.prototype.init = function () {
  var current = this.pics.firstElementChild;
  var pics = this.pics.children;
  var total = pics.length;
  console.log(pics);
  console.log(pics[3]);

  this.setX(current, 0.2, 'rem');
  this.setX(pics[total - 1], -3.25, 'rem');
  this.setX(pics[1], 3.65, 'rem');

  for (var i = 2; i < total - 1; i++) {
    this.setX(pics[i], 3.76, 'rem');
  }
  return this;
};

PicSlide.prototype.bindEvents = function () {
  var self = this;
  window.addEventListener('resize orientationchange', this.resize.bind(this), false);
  'touchstart touchmove touchend touchcancel'.split(' ').forEach(function (evn) {
    //将四个触控函数（申明在后面）绑定到每个页面
    self.pics.addEventListener(evn, self[evn].bind(self), false);
  });
}

PicSlide.prototype.getCurrent = function () {
  return this.pics.children[this.current];
};

PicSlide.prototype.touchstart = function (ev) {
  var touches = ev.touches[0];
  //触控开始
  this.flag = null;
  this.move = 0;
  //记录落点
  this.pageX = touches.pageX;
  this.pageY = touches.pageY;
};

PicSlide.prototype.touchmove = function (ev) {
  var touches = ev.touches[0];
  var X = touches.pageX - this.pageX;
  var Y = touches.pageY - this.pageY;
  var current = this.getCurrent();

  var next = this.getNext();
  var prev = this.getPrev();

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

  if (this.flag === this.swipe) {
    ev.preventDefault();
    ev.stopPropagation();
    this.move = X;

    this.setX(current, 0.2 + X / 100, 'rem');
    this.setX(next, 3.65 + X / 100, 'rem');
    this.setX(prev, -3.25 + X / 100, 'rem');

    if (X < -335) {
      //左滑,要显示出next 的next
      var nextnext = this.getNextNext();
      if (nextnext) {
        this.setX(nextnext, 7.2 + X / 100, 'rem');
      }
    } else if (X > 335) {
      //右滑,显示出prev的prev
      var prevprev = this.getPrevPrev();
      if (prevprev) {
        this.setX(prevprev, X / 100 - 6.7, 'rem');
      }
    }
  }
}

PicSlide.prototype.getNextNext = function () {
  var total = this.pics.children.length;

  if (this.current + 2 < total) {
    console.log(this.current + 2);
    return this.pics.children[this.current + 2];
  } else {
    return this.pics.children[(this.current + 2) % total];
  }
}

PicSlide.prototype.getPrevPrev = function () {
  var total = this.pics.children.length;

  if (this.current - 2 > -1) {
    return this.pics.children[this.current - 2];
  } else {
    return this.pics.children[this.current - 2 + total];
  }
}

PicSlide.prototype.touchend = function (ev) {
  minRange = 187.5;
  //应该是总屏幕宽度的一半的,但是这样一写就是px为单位了.
  var move = this.move;
  var current = this.getCurrent();
  var next = this.getNext();
  var prev = this.getPrev();

  current.classList.remove('moving');
  next && next.classList.remove('moving');
  prev && prev.classList.remove('moving');
  if (!this.flag) return;
  ev.preventDefault();

  //滑动结束前往下一页面,next()方法调用了go()方法
  if (move < -minRange && next) {
    return this.next()
  } else if (move > minRange && prev) {
    return this.prev()
  } else {
    return this.backtoPlace();
  };
}

PicSlide.prototype.touchcancel = function (ev) {}

PicSlide.prototype.backtoPlace = function () {
  //将current next prev都放回原位
  var self = this;
  var curr = this.getCurrent();
  var prev = this.getPrev();
  var next = this.getNext();

  curr.classList.add('toCenter');
  next.classList.add('toRight');
  prev.classList.add('toLeft');

  setTimeout(function () {
    curr.classList.remove('toCenter');
    next.classList.remove('toRight');
    prev.classList.remove('toLeft');
    self.setX(curr, 0.2, 'rem');
    self.setX(prev, -3.25, 'rem');
    self.setX(next, 3.65, 'rem');
  }, 300);
}

PicSlide.prototype.next = function () {
  
  var self = this;
  var curr = this.getCurrent();
  var prev = this.getPrev();
  var next = this.getNext();
  var nextnext = this.getNextNext();

  curr.classList.add('toLeft');
  next.classList.add('toCenter');
  nextnext.classList.add('toRight');
  this.setX(prev, 3.75, 'rem');

  this.current++;
  var total = this.pics.children.length;
  this.current = this.current % total;

  setTimeout(function () {
    curr.classList.remove('toLeft');
    next.classList.remove('toCenter');
    nextnext.classList.remove('toRight');
    self.setX(curr, -3.25, 'rem');
    self.setX(nextnext, 3.65, 'rem');
    self.setX(next, 0.2, 'rem');
  }, 300);
}

PicSlide.prototype.prev = function () {
  var self = this;
  var curr = this.getCurrent();
  var prev = this.getPrev();
  var next = this.getNext();
  var prevprev = this.getPrevPrev();

  curr.classList.add('toRight');
  prev.classList.add('toCenter');
  prevprev.classList.add('toLeft');
  this.setX(next, 3.75, 'rem');

  this.current--;
  if(this.current< 0){
    this.current = this.pics.children.length-1;
  }

  setTimeout(function () {
    curr.classList.remove('toRight');
    prev.classList.remove('toCenter');
    prevprev.classList.remove('toLeft');
    self.setX(curr, 3.65, 'rem');
    self.setX(prev, 0.2, 'rem');
    self.setX(prevprev, -3.25, 'rem');
  }, 300);

}
PicSlide.prototype.setX = function (el, x, unit) {
  el && (el.style.webkitTransform = 'translate3d(' + x + (unit || 'px') + ',0,0)');
};

PicSlide.prototype.getNext = function () {
  var current = this.getCurrent();
  if (current.nextElementSibling) {
    return current.nextElementSibling;
  } else {
    return current.parentNode.firstElementChild;
  }
}
PicSlide.prototype.getPrev = function () {
  var current = this.getCurrent();
  if (current.previousElementSibling) {
    return current.previousElementSibling;
  } else {
    return current.parentNode.lastElementChild;
  }
}

var piclist = new PicSlide(document.querySelector('.pics'), 'X');