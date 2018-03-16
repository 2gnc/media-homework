"use strict";

window.addEventListener('DOMContentLoaded', function (e) {
  var player = document.getElementById('player');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d'); //   const videoOk = (stream) => {
  //     player.srcObject = stream;
  //   };
  //

  var videoNO = function videoNO() {
    var msg = document.createElement('p');
    msg.innerText = 'Ваш браузер не поддерживает зрение Захватчика, установите Яндекс Браузер';
    msg.classList.add('msg');
    document.querySelector('header').appendChild(msg);
  };

  var getDevices = function getDevices() {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      var cameras = [];
      var audio = [];
      devices.forEach(function (device, i) {
        if (device.kind === 'videoinput') {
          cameras.push(device);
        }

        ;

        if (device.kind === 'audioinput') {
          audio.push(device);
        }

        ;
      });
      console.log('video', cameras);
      console.log('audio', audio);
    }).catch(function () {
      console.log('не удалось получить список устройств');
    });
  }; //
  //   const draw = (video, context, width, height) => {
  //     context.drawImage(video, 0, 0, width, height);
  //     setTimeout(draw, 10, video, context, width, height);
  //   };
  //
  //   navigator.mediaDevices.getUserMedia({ audio: false, video: true })
  //     .then(videoOk).catch(videoNO);
  //
  //   player.addEventListener('play', (e) => {
  //     draw(e.target, context, 300, 200);
  //   }, false)
  //


  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  if (!navigator.getUserMedia) {
    videoNO();
  }

  if (navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
    // апустить видео
    // отрисовать интерфейс
    getDevices();
  }
});