(function(window, $, undefined) {

  var audio = new Audio();
  var musicList = [];
  var index = 0;

  function Audio() {
    this.element = null;
    this.resource = null;
    this.ratio = 0.7;
    this.paused = false;
  }

  Audio.prototype.init = function(element) {
    this.element = $(element);
  };

  Audio.prototype.play = function(resource) {
    $('.imusic-tape-wheel-left').addClass('clockwise');
    $('.imusic-tape-wheel-right').addClass('anticlockwise');
    this.paused = false;
    document.title = resource.name + ' - imusic';
    this.resource = resource;
    this.element.attr('src', resource.path);
    this.element[0].load();
    this.element[0].play();
  };

  Audio.prototype.pause = function() {
    $('#soundAudio')[0].play();
    if(this.paused) {
      $('#pause').removeClass('imusic-control-pressed');
      this.paused = false;
      $('.imusic-tape-wheel-left').addClass('clockwise');
      $('.imusic-tape-wheel-right').addClass('anticlockwise');
      audio.element[0].play();
    } else {
      $('#pause').addClass('imusic-control-pressed');
      this.paused = true;
      $('.imusic-tape-wheel-left').removeClass('clockwise');
      $('.imusic-tape-wheel-right').removeClass('anticlockwise');
      this.element[0].pause();
    }
  };

  Audio.prototype.next = function() {
    $('#soundAudio')[0].play();
    if(index === (musicList.length - 1)) {
      index = 0;
    } else {
      index++;
    }
    audio.play(musicList[index]);
  }

  Audio.prototype.pre = function() {
    $('#soundAudio')[0].play();

    if(index === 0) {
      index = musicList.length - 1;
    } else {
      index--;
    }
    audio.play(musicList[index]);

  }

  Audio.prototype.volume = function(ratio) {
    this.element[0].volume = ratio;
  };

  Audio.prototype.stop = function() {
    $('#soundAudio')[0].play();
    $('#pause').addClass('imusic-control-pressed');
    $('.imusic-tape-wheel-left').removeClass('clockwise');
    $('.imusic-tape-wheel-right').removeClass('anticlockwise');
    this.element[0].pause();

    this.paused = false;
    $('#pause').removeClass('imusic-control-pressed'); 
  };

  var render = function(data) {
    var template = $('#grace-template').html().trim();
    var html = grace.compile(template)({data : data});
    $('#container').html(html);
  };

  $('.item').live('click', function() {
    var music = {
      path: $(this).data('path'),
      name: $(this).html()
    };
    for(var i in musicList) {
      if(musicList[parseInt(i)].path === music.path) {
        index = parseInt(i);
        break;
      }
    }
    audio.play(music);
  });

  var press = function(id) {
    $(`#${id}`).addClass('imusic-control-pressed');
    setTimeout(function() {
      $(`#${id}`).removeClass('imusic-control-pressed');
    },100);
    $('#pause').removeClass('imusic-control-pressed');
  }

  $('body').delegate('.control', 'click', function(e) {
    var target = e.target;

    switch (target.id) {
      case 'play':
        press('play');
        $('#soundAudio')[0].play();
        if(audio.paused) {
          $('.imusic-tape-wheel-left').addClass('clockwise');
          $('.imusic-tape-wheel-right').addClass('anticlockwise');
          audio.element[0].play();
          break;
        } else {
          audio.play(musicList[index]);
          break;
        }
      case 'pause':
        audio.pause();
        break;
      case 'next':
        press('next');
        audio.next();
        break;
      case 'pre':
        press('pre');
        audio.pre();
        break;
      case 'stop':
        press('stop');
        audio.stop();
        break;
    }
  });

  $('.imusic-volume-knob').knobKnob({
    snap : 10,
    value: 359 * 10,
    turn : function(ratio) {
      audio.volume(ratio);
    }
  });

  var getQueryString = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r) {
      return unescape(r[2]);
    }
    return null;
  };

  var localhost = ['localhost', '127.0.0.1'];
  var requestMusic = function() {
    if (!!~localhost.indexOf(document.domain)) {
      console.log('localhost');
      $.ajax({
        type : 'get',
        url : '/api/get_musics',
        data : {
        },
        success : function(result) {
          if (result.success) {
            musicList = result.data;
            render(musicList);
            audio.init('#audio');
            audio.element.on('ended', function() {
              $('#soundAudio')[0].play();
              audio.next();
            });
          }
        }
      });
    } else {
      console.log('network');
      var url = getQueryString('url');

      if (url) {
        musicList.push({
          name: url.substr(url.lastIndexOf('/') + 1),
          path: url
        });
      } else {
        musicList.push({
          name: '美好事物.mp3',
          path: 'http://i-music1.oss-cn-shanghai.aliyuncs.com/%E6%88%BF%E4%B8%9C%E7%9A%84%E7%8C%AB%20-%20%E7%BE%8E%E5%A5%BD%E4%BA%8B%E7%89%A9.mp3?Expires=1478249272&OSSAccessKeyId=TMP.AQGtsesBSoxtaP4QcA10GZfsxtyFaoOi0UN-y3FiIBO2h6pNolyf6ALwBC7UADAtAhRjBVS5dNVV-Xx6kW6WbXJ6E0CkiwIVAJeQFPrAJHnn_7nPlcrP8lEAb4ov&Signature=K8m%2BoccAsYfYIRnH3Kr8ZkYUdfg%3D'
        });
      }
      render(musicList);
      audio.init('#audio');
      audio.element.on('ended', function() {
        $('#soundAudio')[0].play();
        audio.next();
      });
    }
  };

  requestMusic();

})(window, jQuery);
