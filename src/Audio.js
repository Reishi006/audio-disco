import { useState, useEffect } from 'react';

import './App.scss';

import audioFile from './Mega Hyper Ultrastorm.mp3';

function Audio({ setDataArray }) {

const [playing, setPlaying] = useState(false);

let audioCtx = null;
let audioBuffer = null;
let analyser = null;
let source = null;

const loadAudio = (url) => {
  return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
          audioCtx.decodeAudioData(request.response, function(buffer) {
              audioBuffer = buffer;
              resolve(audioBuffer);
          });
      };
      request.onerror = function() {
          reject(new Error('Network error'));
      };
      request.send();
  });
};

const playAudio = () => {
  let time = 3000;
  source = audioCtx.createBufferSource();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  source.buffer = audioBuffer;
  source.connect(analyser);
  analyser.connect(audioCtx.destination)
  source.start(0);
  source.stop(time/1000);
  setTimeout(() => {
    setPlaying(false);
  }, time);
};

useEffect(() => {
  console.log(playing);
}, [playing]);

const resumeAudioContext = async () => {
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  } /* else if (audioCtx.state === 'running') {
    await audioCtx
  } */
};

const analyzeAudio = () => {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  console.log(audioCtx.state);
  
  let count = 0;

  const timeout = () => {
    if (count < 100) {
      analyser.getByteFrequencyData(dataArray);
      //console.log(dataArray);
      setDataArray(dataArray);
      count++;
      setTimeout(timeout, 10);
    }
  }
  
  timeout();

  /* for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i] !== 0) console.log(dataArray[i]);
  } */
}

const handlePlayButtonClick = async () => {
  try {
      if (audioCtx === null) {
        setPlaying(true);
        audioCtx = new AudioContext();
        await loadAudio(audioFile);
        await resumeAudioContext();
        playAudio();
        setTimeout(() => {
          analyzeAudio();
        }, 500);
      }
  } catch (error) {
      console.error('Failed to load audio:', error);
  }
};

  return (
    <div 
    className='control'
    onClick={(playing === false) ? handlePlayButtonClick : undefined}
    >
      Play
    </div>
  );
}

export default Audio;
