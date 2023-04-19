let audioIN = { audio: true }; // audio is true, for recording
navigator.mediaDevices.getUserMedia(audioIN) // access the permission for mic use
let audioURLs = [];

.then(function (mediaStreamObj) {

  let dataArray = [];

  // Connect the media stream to the first audio element returns the recorded audio via 'audio' tag
  let audio = document.querySelector('audio');

  //new-browser/old-broswer handling
  if ("srcObject" in audio) {audio.srcObject = mediaStreamObj;}
  else {audio.src = window.URL.createObjectURL(mediaStreamObj);}

  //retrieve html elements
  let start = document.getElementById('btnStart');
  let stop = document.getElementById('btnStop');
  let playAudio = document.getElementById('audioPlay');

  //'MediaRecorder' API passing stream audio
  let mediaRecorder = new MediaRecorder(mediaStreamObj);

  //start, stop, and push data
  start.addEventListener('click', function (ev) {mediaRecorder.start();})
  stop.addEventListener('click', function (ev) {mediaRecorder.stop();});
  mediaRecorder.ondataavailable = function (ev) {dataArray.push(ev.data);}

  // Convert the audio data in to blob after stopping the recording
  mediaRecorder.onstop = function (ev) {
    let audioData = new Blob(dataArray,
          { 'type': 'audio/mp3;' });

    dataArray = []; //empty data array to use again
    let audioSrc = window.URL.createObjectURL(audioData); // Creating audio url with reference of created blob named 'audioData'
    audioURLs.push(audioSrc); //store audio
    playAudio.src = audioSrc; // Pass the audio url to the 2nd video tag
  }

  audioURLs.forEach(url, index) => {
    let audio = new Audio();
    audio.src = url;
    document.body.appendChild(audio);
  }

})

.catch(function (err) {console.log(err.name, err.message);}); //catch any errors
