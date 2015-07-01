// 公共的事件处理
var events = {
  preventDef: function(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  },
  preventBubble: function(e){
    e = e || window.event;
    if(e.stopPropagation){
      e.stopPropagation();
    }
    else{
      e.cancelBubble = true;
    }
  },
  getTarget: function(e) {
    e = e || window.event;
    return e.target || e.srcElement;
  }
}
$(function(){
  var current = $('#ulNav .on');
  var currentIndex = current.index();
  var currentL = current[0].offsetLeft;
  var currentW = current.width();
  $('#ulNav').children('.nav-item').hover(function(){
    var w = $(this).width();
    var left = this.offsetLeft;
    $(this).closest('nav').find('.focus-line').css({'width':w,'left':left});
    $(this).addClass('on').siblings().removeClass('on');
  }, function(){
    $(this).removeClass('on');
    current.addClass('on');
    $(this).closest('nav').find('.focus-line').css({'width':currentW,'left':currentL});
  });
  $('#ulNav').children('.nav-item').on('click', function(){
    $(this).addClass('on').siblings().removeClass('on');
      current = $(this);
      currentIndex = current.index();
      currentL = current[0].offsetLeft;
      currentW = current.width();
  });

});