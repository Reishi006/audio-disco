import { useState, useEffect, useRef } from 'react';

import './App.scss';

import audioFile from './OVSKY - Lucky Charm [NCS Release].mp3';

function Audio({ setDataArray, setOpacity, setFadeout }) {

const [playing, setPlaying] = useState(false);

const audioCtx = useRef(null);
const audioBuffer = useRef(null);
const analyser = useRef(null);
const source = useRef(null);
const gainNode = useRef(null);

const timeoutRef = useRef(null);

let bufferLength;

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

  source.current.onended = function() {
    if (source !== null) {
      setFadeout();
      source.current = null;
    }
    setPlaying(false);
  }
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
  bufferLength = analyser.current.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  console.log(audioCtx.current.state);
  
  let count = 0;

  const timeout = () => {
    if (count < time*100 && analyser) {
      analyser.current.getByteFrequencyData(dataArray);
      setDataArray(dataArray);
      count++;
      timeoutRef.current = setTimeout(timeout, 10);
    }
  }
  
  timeout();
}

const handlePlayButtonClick = async () => {
  try {
    if (audioCtx.current === null) {
      audioCtx.current = new AudioContext();
      await loadAudio(audioFile);
      await resumeAudioContext();
    }

    if (!playing) {
      setPlaying(true);
      playAudio();
      analyzeAudio();
      setOpacity();
    } else {
      if (source) {
        setFadeout();
        source.current.stop();
        source.current.disconnect();
        source.current = null;
      }

      setDataArray(new Uint8Array(bufferLength));
      clearTimeout(timeoutRef.current);

      if (audioCtx) {
        audioCtx.current = null;
        audioBuffer.current = null;
        analyser.current = null;
        gainNode.current = null;
      }
      setPlaying(false);
    }
  } catch (error) {
    console.error('Failed to load audio:', error);
  }
};

const handlePauseButtonClick = () => {
  if (audioCtx.current) {
    if (audioCtx.current.state === 'running' && playing) {
      audioCtx.current.suspend();
    } else if (audioCtx.current.state === 'suspended' && playing) {
      audioCtx.current.resume();
    }
  }
}

  return (
    <>
      <div 
      className='control'
      onClick={handlePlayButtonClick}
      >
        <div>
          {(playing) ? '⏹' : '⏵'}
        </div>
      </div>
      <div 
      className='control'
      onClick={handlePauseButtonClick}
      >
        <div
          style={
            (playing) ? {filter: `brightness(1.0)`} : {filter: `brightness(0.4)`}
          }
        >⏯</div>
      </div>
    </>
  );
}

export default Audio;
