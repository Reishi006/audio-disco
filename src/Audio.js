import { useState, useEffect } from 'react';

import './App.scss';

import audioFile from './OVSKY - Lucky Charm [NCS Release].mp3';

function Audio({ setDataArray }) {

const [playing, setPlaying] = useState(false);

let audioCtx = null;
let audioBuffer = null;
let analyser = null;
let source = null;

let time = 300;

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
  let gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.2;
  gainNode.connect(audioCtx.destination);
  source = audioCtx.createBufferSource();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  source.buffer = audioBuffer;
  source.connect(analyser);
  analyser.connect(gainNode);
  source.start(0);
  source.stop(time);
  setTimeout(() => {
    setPlaying(false);
  }, time*1000);
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
    if (count < time*100) {
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
        }, 300);
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
