window.addEventListener('DOMContentLoaded', (e) => {

  const player = document.getElementById('player');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const ui = document.querySelector('ui__robo-ui');

  let canvasWidth = canvas.clientWidth;
  let canvasHeight = canvas.clientHeight;

  let resizeTimeout;

  const getCanvasDimentions = () => {
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;
  };

  const resizeThrottler = () => {
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        getCanvasDimentions();
      }, 300);
    }
  };

  window.addEventListener( 'resize', resizeThrottler, false );

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
      })
      .catch( () => {
        console.log( 'не удалось получить список устройств' );
    } );
  };

  const videoOk = (stream) => {
    player.srcObject = stream;
  };


  const getVideo = (video, cont, width, height) => {
    cont.drawImage( video, 0, 0, width, height );
    setTimeout(getVideo, 20, video, cont, width, height)
  };

  navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    })
    .then(videoOk)
    .catch(videoNO);

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  if (!navigator.getUserMedia) {
    videoNO();
  }

  if (navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
    player.addEventListener('play', (e) => {
      getVideo(e.target, context, canvasWidth/3.6, canvasHeight/3.6);

    }, false)
    // запустить видео
    // отрисовать интерфейс
    displayUI();

  }
});

