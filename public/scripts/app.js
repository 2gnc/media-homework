"use strict";

window.addEventListener('DOMContentLoaded', function (e) {
  var player = document.getElementById('player');
  var canvas = document.getElementById('canvas');

  var videoOk = function videoOk(stream) {
    player.srcObject = stream;
  };

  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  }).then(videoOk);
  canvas.getContext('2d').drawImage(player, 0, 0);
});