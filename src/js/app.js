window.addEventListener('DOMContentLoaded', () => {

  const player = document.createElement('video');
  player.autoplay = true;
  player.muted = true;

  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  const noized = document.getElementById('ui__noized');
  let noize;

  const camlist = document.getElementById('camlist');
  const soundBox = document.getElementById('sound');

  const displayErrorMgs = (msg) => {
    const message = document.createElement('p');
    message.innerText = msg;
    message.classList.add('msg');
    document.querySelector('header').appendChild(message);
  };

  const randInt = (min, max) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
  };

  const videoNO = () => {
    displayErrorMgs('Ваш браузер не поддерживает видео из встроенной камеры, установите последнюю версию Firefox или Chrome');
  };

  const displayUI = (x) => {
    let frag = document.createDocumentFragment();
    x.forEach( (cam) => {
      let ico = document.createElement('i');
      ico.className = 'fas fa-circle-notch fa-spin';
      frag.appendChild(ico);
      let el = document.createElement('p');
      el.classList.add('robo-ui__camname');
      el.innerText = cam.label.replace(/\n/m, '') + '; ';
      frag.appendChild(el);
    });
    camlist.appendChild(frag);
  };

  const getDevices = () => {

    navigator.mediaDevices.enumerateDevices()
      .then( (devices) => {
        let cameras = [];
        devices.forEach( (device, i) => {
          if (device.kind === 'videoinput') {
            cameras.push( device );
            displayUI(cameras);
          };
        });
        if (cameras.length === 0) {
          displayErrorMgs('Ваш захватчик не оснащен камерой');
        } else {
          let camsForUi = document.createElement('div');
          camsForUi.classList.add('ui__devices');
        }
      })
      .catch( () => {
        displayErrorMgs( 'не удалось получить список устройств' );
    });

  };

  const videoOk = (stream) => {
    player.srcObject = stream;
    return stream;
  };

  const audioOk = (stream) => {

    let audio = stream.getAudioTracks();

    if(audio.length > 0) {
      let AudioContext = window.AudioContext || window.webkitAudioContext;
      let audioCtx = new AudioContext();
      //источник звука
      let audioSource = audioCtx.createMediaStreamSource(stream);
      //узел для анализа аудио
      let analyser = audioCtx.createAnalyser();
      // процессор
      let processor = audioCtx.createScriptProcessor(2048, 1, 1);
      // источник звука
      let source = audioCtx.createMediaStreamSource(stream);

      source.connect(analyser);
      source.connect(processor);
      analyser.connect(audioCtx.destination);
      processor.connect(audioCtx.destination);

      analyser.fftSize = 128;

      let data = new Uint8Array(analyser.frequencyBinCount);
      processor.onaudioprocess = () => {
        analyser.getByteFrequencyData(data);
        //console.log(data);
      };
    };

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

    context.putImageData(image, 0, 0);

    requestAnimationFrame(getVideo);
  };

  const makeNoize = () => {
    const filters = [
      'grayscale(100%)',
      'sepia(100%)',
      'hue-rotate(270deg)',
      'invert(100%)',
      'url(#posterize)',
    ];
    noize = canvas.toDataURL();
    noized.style.backgroundImage = 'url(' + noize + ')';
    noized.style.filter = filters[randInt(0, 5)];
    setTimeout(() => {
      noized.style.backgroundImage = '';
      }, 400);
    setTimeout(makeNoize, randInt(5000, 15000) );
  };

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })
  .then(videoOk)
  .then(audioOk)
  .catch(videoNO);

  if (navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
    player.addEventListener('play', () => {
      getVideo();
      makeNoize();
    }, false);
    getDevices();
  };
});

