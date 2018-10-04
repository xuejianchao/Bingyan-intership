
// 用来在浏览器窗口宽度发生变化时,改变根元素的font-size
// 使之保持font-size = 100*(变化后的宽度/变化前的宽度)
(function(doc,win){
  var docEI = doc.documentElement,
  resizeEvt = 'orientationchange' in window?'orientataionchange':'resize',//是两个事件选其一么?
  recalc = function(){
    var clientWidth = docEI.clientWidth;
    if(!clientWidth) return;
    var rootfontsize = 0;
    if(window.innerWidth>=767){
      rootfontsize = 50;
    }else{
      rootfontsize = 100;
    }
    docEI.style.fontSize = rootfontsize*(clientWidth/375)+'px';
  }

  if(!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document,window);
