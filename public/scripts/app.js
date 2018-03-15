"use strict";

window.addEventListener('DOMContentLoaded', function (e) {
  var player = document.getElementById('player');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d'); //let vendorURL = window.URL || window.webkitURL;

  var videoOk = function videoOk(stream) {
    player.srcObject = stream;
  };

  var videoNO = function videoNO() {
    var msg = document.createElement('p');
    msg.innerText = 'Ваш браузер не поддерживает зрение Захватчика, установите Яндекс Браузер';
    msg.classList.add('msg');
    document.querySelector('header').appendChild(msg);
  };

  var draw = function draw(video, context, width, height) {
    context.drawImage(video, 0, 0, width, height);
    setTimeout(draw, 10, video, context, width, height);
  };

  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  }).then(videoOk).catch(videoNO);
  player.addEventListener('play', function (e) {
    draw(e.target, context, 300, 200);
  }, false);
});