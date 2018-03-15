window.addEventListener( 'DOMContentLoaded', ( e ) => {

  const player = document.getElementById('player');
  const canvas = document.getElementById('canvas');

  const videoOk = (stream) => {
    player.srcObject = stream;
  };

  navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(videoOk);

  canvas.getContext('2d').drawImage(player, 0, 0);
});