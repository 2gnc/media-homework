window.addEventListener('DOMContentLoaded', (e) => {

  const player = document.getElementById('player');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const ui = document.querySelector('ui__robo-ui');

  //   const videoOk = (stream) => {
  //     player.srcObject = stream;
  //   };
  //
  const displayErrorMgs = (msg) => {
    const message = document.createElement('p');
    message.innerText = msg;
    message.classList.add('msg');
    document.querySelector('header').appendChild(message);
  }

  const videoNO = () => {
    displayErrorMgs('Ваш браузер не поддерживает зрение Захватчика, установите Яндекс Браузер или Chrome');
  };

  const displayUI = () => {
    getDevices();

  }

  const getDevices = () => {
    navigator.mediaDevices.enumerateDevices()
      .then( (devices) => {

        let cameras = [];

        devices.forEach( (device, i) => {

          if (device.kind === 'videoinput') {
            cameras.push( device );
          }

        });

        if(cameras.length === 0) {
          displayErrorMgs('Ваш захватчик не оснащен камерой');
        } else {
          let camsForUi = document.createElement('div');
          camsForUi.classList.add('ui__devices');
        }
        console.log( cameras.length );

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
    // запустить видео
    // отрисовать интерфейс
    displayUI();
  }
});

