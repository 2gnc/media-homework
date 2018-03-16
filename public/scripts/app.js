"use strict";

window.addEventListener('DOMContentLoaded', function (e) {
  var player = document.getElementById('player');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var ui = document.querySelector('ui__robo-ui');
  var canvasWidth = canvas.clientWidth;
  var canvasHeight = canvas.clientHeight;
  var resizeTimeout;

  var getCanvasDimentions = function getCanvasDimentions() {
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;
  };

  var resizeThrottler = function resizeThrottler() {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null;
        getCanvasDimentions();
      }, 300);
    }
  };

  window.addEventListener('resize', resizeThrottler, false);

  var displayErrorMgs = function displayErrorMgs(msg) {
    var message = document.createElement('p');
    message.innerText = msg;
    message.classList.add('msg');
    document.querySelector('header').appendChild(message);
  };

  var videoNO = function videoNO() {
    displayErrorMgs('Ваш браузер не поддерживает зрение Захватчика, установите Яндекс Браузер или Chrome');
  };

  var displayUI = function displayUI() {
    getDevices();
  };

  var getDevices = function getDevices() {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      var cameras = [];
      devices.forEach(function (device, i) {
        if (device.kind === 'videoinput') {
          cameras.push(device);
        }
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

  var getVideo = function getVideo(video, cont, width, height) {
    cont.drawImage(video, 0, 0, width, height);
    setTimeout(getVideo, 20, video, cont, width, height);
  };

  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  }).then(videoOk).catch(videoNO);
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  if (!navigator.getUserMedia) {
    videoNO();
  }

  if (navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
    player.addEventListener('play', function (e) {
      getVideo(e.target, context, canvasWidth / 3.6, canvasHeight / 3.6);
    }, false); // запустить видео
    // отрисовать интерфейс

    displayUI();
  }
});