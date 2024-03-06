import { useState, useEffect, useRef } from 'react';

import './App.scss';

import audioFile from './OVSKY - Lucky Charm [NCS Release].mp3';

function Audio({ setDataArray, clickAudio }) {

const [playing, setPlaying] = useState(false);

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const audioCtx = useRef(null);
const audioBuffer = useRef(null);
const analyser = useRef(null);
const source = useRef(null);
const gainNode = useRef(null);

/* let audioCtx = null;
let audioBuffer = null;
let analyser = null;
let source = null;
let gainNode = null; */

let time = 300;

const loadAudio = (url) => {
  return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
          audioCtx.current.decodeAudioData(request.response, function(buffer) {
              audioBuffer.current = buffer;
              resolve(audioBuffer.current);
          });
      };
      request.onerror = function() {
          reject(new Error('Network error'));
      };
      request.send();
  });
};

const playAudio = () => {
  gainNode.current = audioCtx.current.createGain();
  gainNode.current.gain.value = 0.15;
  gainNode.current.connect(audioCtx.current.destination);
  source.current = audioCtx.current.createBufferSource();
  analyser.current = audioCtx.current.createAnalyser();
  analyser.current.fftSize = 256;
  source.current.buffer = audioBuffer.current;
  source.current.connect(analyser.current);
  analyser.current.connect(gainNode.current);
  source.current.start(0);
  source.current.stop(time);
  setTimeout(() => {
    setPlaying(false);
  }, time*1000);
};

useEffect(() => {
  console.log(playing);
}, [playing]);

const resumeAudioContext = async () => {
  if (audioCtx.current.state === 'suspended') {
    await audioCtx.current.resume();
  }
};

const analyzeAudio = () => {
  const bufferLength = analyser.current.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  console.log(audioCtx.current.state);
  
  let count = 0;

  const timeout = () => {
    if (count < time*100) {
      analyser.current.getByteFrequencyData(dataArray);
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
    /* if (audioCtx === null && !playing) {
      setPlaying(true);
      audioCtx = new AudioContext();
      await loadAudio(audioFile);
      await resumeAudioContext();
      playAudio();
      setTimeout(() => {
        analyzeAudio();
      }, 50);
      clickAudio();
    } */

    if (audioCtx.current === null) {
      audioCtx.current = new AudioContext();
      await loadAudio(audioFile);
      await resumeAudioContext();
    }

    if (!playing) {
      setPlaying(true);
      playAudio();
      setTimeout(() => {
        analyzeAudio();
      }, 50);
      clickAudio();
    } else {
      if (source) {
        source.current.stop();
        source.current.disconnect();
        source.current = null;
      }
      setPlaying(false);
      if (gainNode) {
        gainNode.current.stop();
        gainNode.current.disconnect();
        gainNode.current = null;
      }
      if (analyser) {
        analyser.current.stop();
        analyser.current.disconnect();
        analyser.current = null;
      }
    }
  } catch (error) {
    console.error('Failed to load audio:', error);
  }
};

  return (
    <div 
    className='control'
    onClick={(playing === false) ? handlePlayButtonClick : handlePlayButtonClick}
    >
      {(playing) ? 'Stop' : 'Play'}
    </div>
  );
}

export default Audio;
