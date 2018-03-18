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
    displayErrorMgs('Ваш браузер не поддерживает зрение Захватчика, установите последнюю версию Firefox или Chrome'); // TODO стримить какое-нибудь видео с ютюба
  };

  var displayUI = function displayUI(x) {
    var frag = document.createDocumentFragment();
    console.log(x);
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
      devices.forEach(function (device, i) {
        if (device.kind === 'videoinput') {
          cameras.push(device);
          displayUI(cameras);
        }

        ;
      });

      if (cameras.length === 0) {
        displayErrorMgs('Ваш захватчик не оснащен камерой');
      } else {
        var camsForUi = document.createElement('div');
        camsForUi.classList.add('ui__devices');
      }
    }).catch(function () {
      console.log('не удалось получить список устройств');
    });
  };

  var videoOk = function videoOk(stream) {
    player.srcObject = stream;
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
    audio: false,
    video: true
  }).then(videoOk).catch(videoNO);

  if (navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
    player.addEventListener('play', function () {
      getVideo();
      makeNoize();
    }, false);
    getDevices();
  }
});