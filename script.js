let audioIN = { audio: true };
navigator.mediaDevices.getUserMedia(audioIN)

.then(function (mediaStreamObj) {
  
  let audioURLs = [];
  let fileIndex = 0;
  let dataArray = [];
  let audioSrc;
  let samplers = []; // for tone

  var randomWord = '';

  let audio = document.querySelector('audio');

  if ("srcObject" in audio) {audio.srcObject = mediaStreamObj;}
  else {audio.src = window.URL.createObjectURL(mediaStreamObj);}

  let recordButton = document.getElementById('btnStart');
  let mixButton = document.getElementById('btnMix');
  let clearButton = document.getElementById('stopMix');
  const rateSlider = document.getElementById("rate-slider");

  let mediaRecorder = new MediaRecorder(mediaStreamObj);
  let isRecording = false;

  recordButton.addEventListener('click', function (ev) {
    if (isRecording) {
      //stop recording
      document.getElementById("myImg").setAttribute("src", "idle.gif");
      mediaRecorder.stop();
      isRecording = false;
      recordButton.textContent = 'RECORD!'; //change button text
    } else {
      //start recording
      document.getElementById("myImg").setAttribute("src", "record.gif");
      dataArray = []; //empty data array to use again
      mediaRecorder.start();
      isRecording = true;
      recordButton.textContent = 'STOP RECORDING!'; //change button text
    }
  });

//MIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXER
//MIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXER
mixButton.addEventListener('click', function (ev) {
  document.getElementById("myImg").setAttribute("src", "mix.gif");

  const reverb = new Tone.Reverb({
    decay: 30,
    wet: 0.1,
  }).toDestination();
  const filter = new Tone.AutoFilter(1).start();
  const distortion = new Tone.Distortion(0.7);
  const echo = new Tone.FeedbackDelay('2n', 0.7);
  filter.connect(reverb);
  distortion.connect(reverb);
  echo.connect(reverb);
  const synth = new Tone.Synth().toDestination();
  const compNotes = [40, 45];

  const eq = new Tone.EQ3({
    low: -1, // the cut-off frequency of the low band, in decibels
    mid: -5, // the cut-off frequency of the mid band, in decibels
    high: -3 // the cut-off frequency of the high band, in decibels
  });

  // connect it to a sound source
  eq.connect(reverb);

  eq.low.value = -5; // decrease the level of the low frequencies
  eq.mid.value = 0; // boost the level of the mid frequencies
  eq.high.value = -6; // decrease the level of the high frequencies

  const notes = ["C4", "D#4", "F#4", "A4"]; // replace with your desired notes

  for (let i = 0; i < audioURLs.length; i++) {
    const midiNote = i + 60; // start at MIDI note 60 (C4)
    const urls = {};
    urls[midiNote] = audioURLs[i];
    const sampler = new Tone.Sampler({
      urls: urls,
      release: 1,
      baseUrl: "",
    }).connect(distortion);
    samplers.push(sampler);
  }

  Tone.Transport.scheduleRepeat((time) => {
    const noteNames = samplers.map((sampler, i) => notes[i % notes.length]);
    samplers.forEach((sampler, i) => {
      const noteName = noteNames[i];
      const duration = Tone.Time("4n") + Tone.Time(Math.random() * 0.1 + 4);
      const attack = Tone.Time(Math.random() * 0.05);
      const release = Tone.Time(Math.random() * 0.1 + 0.1);
      sampler.triggerAttackRelease(noteName, duration, time + attack, 0.5 + release);
    });
  }, "2n");

  Tone.Transport.start();

});

const slider = document.getElementById("myRange");
slider.addEventListener("input", function() {
  Tone.Transport.bpm.value = +this.value;
});

//MIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXER
//MIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXERMIXER

clearButton.addEventListener('click', function(ev) {
  document.getElementById("myImg").setAttribute("src", "idle.gif");
  Tone.Transport.stop(Tone.now());
  samplers.forEach((sampler) => {
    sampler.dispose();
  });
  samplers = [];
  audioURLs = [];
  var list = document.getElementById('recordingList');
  recordingList.innerHTML = '';
})


  mediaRecorder.ondataavailable = function (ev) {
    dataArray.push(ev.data);
  };

  mediaRecorder.onstop = function (ev) {
    fetch('words.txt')
    .then(response => response.text())
    .then(text => {
      const lines = text.split('\n');
      const randomIndex = Math.floor(Math.random() * lines.length);
      randomWord = lines[randomIndex];
    })
    .catch(error => console.error(error));

    let audioData = new Blob(dataArray,
          { 'type': 'audio/wav;' });

    dataArray = []; //empty data array to use again
    audioSrc = window.URL.createObjectURL(audioData); // Creating audio url with reference of created blob named 'audioData'
    audioURLs.push(audioSrc); //store audio
    let filename = "X_" + randomWord + '.wav'; //create filename
    let li = document.createElement('li'); //create new list item
    li.textContent = filename; //set list item text to filename
    recordingList.appendChild(li); //add list item to recording list
  }

})


.catch(function (err) {
  console.log(err.name, err.message);
});




