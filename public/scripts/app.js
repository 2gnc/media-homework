"use strict";

window.addEventListener('DOMContentLoaded', function () {
  var player = document.createElement('video');
  player.autoplay = true;
  player.muted = true;
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var noized = document.getElementById('ui__noized');
  var noize;
  var camlist = document.getElementById('camlist');
  var soundBox = document.getElementById('soundbar');

  var displayErrorMgs = function displayErrorMgs(msg) {
    var message = document.createElement('p');
    message.innerText = msg;
    message.classList.add('msg');
    document.querySelector('header').appendChild(message);
  };

  var randInt = function randInt(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
  };

  var videoNO = function videoNO() {
    displayErrorMgs('Ваш браузер не поддерживает видео из встроенной камеры, установите последнюю версию Firefox или Chrome');
  };

  var displayUI = function displayUI(x) {
    var frag = document.createDocumentFragment();
    x.forEach(function (cam) {
      var ico = document.createElement('i');
      ico.className = 'fas fa-circle-notch fa-spin';
      frag.appendChild(ico);
      var el = document.createElement('p');
      el.classList.add('robo-ui__camname');
      el.innerText = cam.label.replace(/\n/m, '') + '; ';
      frag.appendChild(el);
    });
    camlist.appendChild(frag);
  };

  var getDevices = function getDevices() {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      var cameras = [];
      devices.forEach(function (device) {
        if (device.kind === 'videoinput') {
          cameras.push(device);
          displayUI(cameras);
        }
      });

      if (cameras.length === 0) {
        displayErrorMgs('Ваш захватчик не оснащен камерой');
      } else {
        var camsForUi = document.createElement('div');
        camsForUi.classList.add('ui__devices');
      }
    }).catch(function () {
      displayErrorMgs('не удалось получить список устройств');
    });
  };

  var videoOk = function videoOk(stream) {
    player.srcObject = stream;
    return stream;
  };

  var audioOk = function audioOk(stream) {
    var audio = stream.getAudioTracks();

    if (audio.length > 0) {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      var audioCtx = new AudioContext(); // источник звука
      // узел для анализа аудио

      var analyser = audioCtx.createAnalyser(); // процессор

      var processor = audioCtx.createScriptProcessor(2048, 1, 1); // источник звука

      var source = audioCtx.createMediaStreamSource(stream);
      var wi = 600;
      var hei = 100;
      source.connect(analyser);
      source.connect(processor);
      processor.connect(audioCtx.destination);
      analyser.fftSize = 2048;
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
      var canvasCtx = soundBox.getContext('2d');
      canvasCtx.clearRect(0, 0, wi, hei);

      var drawSound = function drawSound() {
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        canvasCtx.fillRect(0, 0, wi, hei);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
        canvasCtx.beginPath();
        var sliceWidth = wi * 1.0 / bufferLength;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = v * hei / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
        requestAnimationFrame(drawSound);
      };

      drawSound();
    }

    ;
  };

  var getVideo = function getVideo() {
    context.drawImage(player, 0, 0, 300, 200);
    var image = context.getImageData(0, 0, 300, 200);
    var data = image.data;

    for (var i = 0; i < data.length; i += 4) {
      var r = data[i];
      var g = data[i + 1];
      var b = data[i + 2];
      var v = 0.2126 * r + 0.9152 * g + 0.1722 * b;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i] = 180;
    }

    context.putImageData(image, 0, 0);
    requestAnimationFrame(getVideo);
  };

  var makeNoize = function makeNoize() {
    var filters = ['grayscale(100%)', 'sepia(100%)', 'hue-rotate(270deg)', 'invert(100%)', 'url(#posterize)'];
    noize = canvas.toDataURL();
    noized.style.backgroundImage = 'url(' + noize + ')';
    noized.style.filter = filters[randInt(0, 5)];
    setTimeout(function () {
      noized.style.backgroundImage = '';
    }, 400);
    setTimeout(makeNoize, randInt(5000, 15000));
  };

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  }).then(videoOk).then(audioOk).catch(videoNO);

  if (navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
    player.addEventListener('play', function () {
      getVideo();
      makeNoize();
    }, false);
    getDevices();
  }
});