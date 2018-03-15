window.addEventListener( 'DOMContentLoaded', ( e ) => {

  const player = document.getElementById('player');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  //let vendorURL = window.URL || window.webkitURL;


  const videoOk = (stream) => {
    player.srcObject = stream;
  };

  const videoNO = () => {
    let msg = document.createElement('p');
    msg.innerText = 'Ваш браузер не поддерживает зрение Захватчика, установите Яндекс Браузер';
    msg.classList.add('msg');
    document.querySelector('header').appendChild(msg);
  };

  const draw = (video, context, width, height) => {
    context.drawImage(video, 0, 0, width, height);
    setTimeout(draw, 10, video, context, width, height);
  };

  navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(videoOk).catch(videoNO);

  player.addEventListener('play', (e) => {
    draw(e.target, context, 300, 200);
  }, false)

});