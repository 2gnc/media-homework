window.addEventListener('DOMContentLoaded', () => {

  const player = document.createElement('video');
  player.autoplay = true;
  player.muted = true;

  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const ui = document.querySelector('ui__robo-ui');

  const displayErrorMgs = (msg) => {
    const message = document.createElement('p');
    message.innerText = msg;
    message.classList.add('msg');
    document.querySelector('header').appendChild(message);
  };

  const videoNO = () => {
    displayErrorMgs('Ваш браузер не поддерживает зрение Захватчика, установите последнюю версию Firefox или Chrome');
    // TODO стримить какое-нибудь видео с ютюба
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
        if (cameras.length === 0) {
          displayErrorMgs('Ваш захватчик не оснащен камерой');
        } else {
          let camsForUi = document.createElement('div');
          camsForUi.classList.add('ui__devices');
        }
      })
      .catch( () => {
        console.log( 'не удалось получить список устройств' );
    } );
  };

  const videoOk = (stream) => {
    player.srcObject = stream;
  };

  const getVideo = () => {

    context.drawImage( player, 0, 0, 300, 200 );

    const image = context.getImageData(0, 0, 300, 200);
    const data = image.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const v = (0.2126 * r) + (0.9152 * g) + (0.1722 * b);
      data[i] = data[i + 1] = data[i + 2] = v;

      data[i] = 180;
    }

    context.putImageData(image, 0, 0)

    requestAnimationFrame(getVideo);
  };

  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  })
  .then(videoOk)
  .catch(videoNO);

  if (navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
    player.addEventListener('play', () => {
      getVideo();
    }, false);
    // запустить видео
    // отрисовать интерфейс
    displayUI();
  }
});

