(function($){

  $.fn.knobKnob = function(props){

    var options = $.extend({
      snap: 0,
      value: 0,
      turn: function(){}
    }, props || {});

    var tpl = '<div class="knob">\
      <div class="top"></div>\
      <div class="base"></div>\
      </div>';

    return this.each(function(){

      var el = $(this);
      el.append(tpl);

      var knob = $('.knob',el),
        knobTop = knob.find('.top'),
        startDeg = -1,
        currentDeg = 0,
        rotation = 0,
        lastDeg = 0,
        doc = $(document);

      if(options.value > 0 && options.value <= 359){
        rotation = lastDeg = currentDeg = options.value;
        knobTop.css('transform','rotate('+(currentDeg)+'deg)');
        options.turn(currentDeg/359);
      }

      knob.on('mousedown touchstart', function(e){

        e.preventDefault();

        var offset = knob.offset();
        var center = {
          y : offset.top + knob.height()/2,
          x: offset.left + knob.width()/2
        };

        var a, b, deg, tmp,
          rad2deg = 180/Math.PI;

        knob.on('mousemove.rem touchmove.rem',function(e){

          e = (e.originalEvent.touches) ? e.originalEvent.touches[0] : e;

          a = center.y - e.pageY;
          b = center.x - e.pageX;
          deg = Math.atan2(a,b)*rad2deg;
          if(deg<0){
            deg = 360 + deg;
          }
          if(startDeg == -1){
            startDeg = deg;
          }
          tmp = Math.floor((deg-startDeg) + rotation);
          if(tmp < 0){
            tmp = 360 + tmp;
          }
          else if(tmp > 359){
            tmp = tmp % 360;
          }
          if(options.snap && tmp < options.snap){
            tmp = 0;
          }
          if(Math.abs(tmp - lastDeg) > 180){
            return false;
          }
          currentDeg = tmp;
          lastDeg = tmp;
          knobTop.css('transform','rotate('+(currentDeg)+'deg)');
          options.turn(currentDeg/360);
        });

        doc.on('mouseup.rem  touchend.rem',function(){
          knob.off('.rem');
          doc.off('.rem');
          rotation = currentDeg;
          startDeg = -1;
        });

      });
    });
  };

})(jQuery);
