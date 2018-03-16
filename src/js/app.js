window.addEventListener('DOMContentLoaded', (e) => {
  const player = document.getElementById('player');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  //   const videoOk = (stream) => {
  //     player.srcObject = stream;
  //   };
  //
  const videoNO = () => {
    const msg = document.createElement('p');
    msg.innerText = 'Ваш браузер не поддерживает зрение Захватчика, установите Яндекс Браузер';
    msg.classList.add('msg');
    document.querySelector('header').appendChild(msg);
  };

  const getDevices = () => {
    navigator.mediaDevices.enumerateDevices()
      .then( (devices) => {
        let cameras = [];
        let audio = [];
        devices.forEach( (device, i) => {
          if (device.kind === 'videoinput') {
            cameras.push( device );
          };
          if (device.kind === 'audioinput') {
            audio.push( device );
          };
        });
        console.log( 'video', cameras );
        console.log( 'audio', audio );
      })
      .catch( () => {
        console.log( 'не удалось получить список устройств' );
    } );
  };
  //
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

