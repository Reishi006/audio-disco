import { useState, useEffect, useRef } from 'react';

import Warning from './Warning';
import Audio from './Audio';
import Canvas from './Canvas';

import './App.scss';


function App() {
  const controlsRef = useRef(null);
  const cBorderRad = useRef(null);

  const UintArray = useRef(null);

  const bgAnim = useRef(null);
  const upAnim = useRef(null);
  const midAnim = useRef(null);
  const downAnim = useRef(null);
  const bubbleAnim = useRef(null);

  const bubbles = useRef([]);

  const timeouts = useRef({
    upTimeout: 0,
    midTimeout: 0,
    downTimeout: 0,
    bgTimeout: 0,
    bubbleTimeout: 0,
  });


  const copyrightRef = useRef(null);
  const audioErrorRef = useRef(null);

  const audioPauseRef = useRef(null);

  const [animate, setAnimate] = useState(false);

  const [displayed, setDisplayed] = useState(false);
  const [display, setDisplay] = useState('none');

  const [colorsState, setcolorsState] = useState({
    red: 50,
    green: 192,
    blue: 192,
    hueRotate: 0,
  });

  const [buttonClick, setButtonClick] = useState({
    up: false,
    mid: false,
    down: false,
    bubble: false,
  });


  useEffect(() => {
    if (displayed === true) setDisplay('flex');
  }, [displayed]);

  const handleAnimate = () => {
    if (animate) {
      setAnimate(false);
    } else if (!animate) {
      setAnimate(true);
    }
  }
  

  //Animations ----->

  let baseTime = 400;

  const animBg = () => {
    let time = baseTime;

    if (timeouts.current.bgTimeout) {
      clearTimeout(timeouts.current.bgTimeout);
    }

    let el = bgAnim.current;
    el.style.display = 'flex';
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = `${time/1000}s fading 1 backwards`;

    timeouts.current.bgTimeout = setTimeout(() => {
      el.style.display = `none`;
    },  time - 10);

  }

  const animKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        setDisplayed(true);
      }

      if (!animate) return; //don't animate when toggled

      if (e.key === 'a' || e.key === 'z') {
        displayed && upAnimation();
      }
      if (e.key === 's' || e.key === 'x') {
        displayed && midAnimation();
      }
      if (e.key === 'd' || e.key === 'c') {
        displayed && downAnimation();
      }
      if (e.key === 'b') {
        displayed && bubbleAnimation();
      }
  }

  useEffect(() => {
    if (!animate) return;
      document.addEventListener('keydown', animKey);

      return () => {
        document.removeEventListener('keydown', animKey);
      };
  }, [displayed, animate]);

  
  let controlBorderRadius = null;

  useEffect(() => {
    controlBorderRadius = window.getComputedStyle(controlsRef.current).borderRadius;
    cBorderRad.current = Number(controlBorderRadius.slice(0, controlBorderRadius.length - 2));
    //console.log(controlsRef.current.offsetWidth);
    let inc = 2;
    const interval = setInterval (() => {
      setcolorsState((prevColors) => ({
        hueRotate: (prevColors.hueRotate + inc) % 360,
      }));
      
    }, 50);
    return () => clearInterval(interval);
  }, []);


  const getGradientStyle = (anim) => {
    if (anim === 'up') {
      let up = `linear-gradient(0deg, rgba(0, 0, 0, 0.0), rgb(${colorsState.red}, ${colorsState.green}, ${colorsState.blue}))`;
      return up;
    }
    if (anim === 'mid') {
      let mid = `linear-gradient(0deg, rgba(0, 0, 0, 0.0) 0%, rgb(${colorsState.red}, ${colorsState.green}, ${colorsState.blue}) 50%, rgba(0, 0, 0, 0.0) 100%)`
      return mid;
    }
    if (anim === 'down') {
      let down = `linear-gradient(180deg, rgba(0, 0, 0, 0.0), rgb(${colorsState.red}, ${colorsState.green}, ${colorsState.blue}))`;
      return down;
    }
  }


  const styles = {
    bgAnim: {
      background: `radial-gradient(circle, #36383f00 0%, #777c8c 100%)`,
    },
    controlContainer: {
      filter: `hue-rotate(${colorsState.hueRotate}deg)`,
    },
    notActiveButton: {
      boxShadow: `0px 0px 10px rgb(0, 0, 0)`,
      backgroundColor: `rgb(29, 31, 39)`,
      color: `rgb(200, 200, 200)`,
    },
    activeButton: {
      boxShadow: `0px 0px 10px rgb(35, 37, 46)`,
      backgroundColor: `rgb(35, 37, 46)`,
      color: `rgb(240, 240, 240)`,
    },
    upAnim: {
      background: getGradientStyle('up'),
      filter: `hue-rotate(${colorsState.hueRotate}deg)`,
    },
    midAnim: {
      background: getGradientStyle('mid'),
      filter: `hue-rotate(${colorsState.hueRotate}deg)`,
    },
    downAnim: {
      background: getGradientStyle('down'),
      filter: `hue-rotate(${colorsState.hueRotate}deg)`,
    },
    bubbleAnim: {
      background: `radial-gradient(circle, rgb(${colorsState.red}, ${colorsState.green}, ${colorsState.blue}) 0%, #00000000 50%)`,
      filter: `hue-rotate(${colorsState.hueRotate}deg)`,
    }
  }

  const elements = ['', '', '', '', '', ''];

  const bubbleReposition = () => {
    const getBubblesPosition = () => {
      let xWin = window.innerWidth;
      let yWin = window.innerHeight;

      const x = Math.floor(Math.random() * xWin);
      const y = Math.floor(Math.random() * yWin);

      return { x, y };
    }

    bubbles.current.forEach((ref) => {
      const { x, y } = getBubblesPosition();
      ref.style.position = 'absolute';
      ref.style.left = `${x}px`;
      ref.style.top = `${y}px`;
      ref.style.transform = `translate(-50%, -50%)`;
      let r = colorsState.red + (Math.random() * 10);
      let g = colorsState.green + (Math.random() * 50);
      let b = colorsState.blue + (Math.random() * 50);
      ref.style.background = `radial-gradient(circle, rgb(${r}, ${g}, ${b}) 0%, #00000000 50%)`;
    });
  }

  const handleAnimation = (t, tout, elm, btnclick, bubble) => {

    //console.log(`timer: ${timeouts.current[tout]}`);
    if (timeouts.current[tout]) {
      clearTimeout(timeouts.current[tout]);
    }

    bubble && bubbleReposition();

    setButtonClick({...buttonClick, 
      [btnclick]: true,
    });

    elm.style.animation = 'none';
    void elm.offsetWidth;

    elm.style.display = `flex`;
    elm.style.animation = `${t/1000}s fading 1 backwards`;

    setTimeout(() => {
      setButtonClick({...buttonClick,
        [btnclick]: false,
      });
    }, t/3);

    timeouts.current[tout] = setTimeout(() => {
      elm.style.display = `none`;
    },  t-10);

    animBg();
  }
  

  const upAnimation = () => {
    handleAnimation(baseTime, 'upTimeout', upAnim.current, 'up', false);
  }
  const midAnimation = () => {
    handleAnimation(baseTime, 'midTimeout', midAnim.current, 'mid', false);
  }
  const downAnimation = () => {
    handleAnimation(baseTime, 'downTimeout', downAnim.current, 'down', false);
  }
  const bubbleAnimation = () => {
    handleAnimation(500, 'bubbleTimeout', bubbleAnim.current, 'bubble', true);
  }


  const setOpacity = (ref, t, op, d, animation) => {
    let time = t;
    setTimeout(() => {
      ref.style.opacity = op;
    }, time);
    ref.style.animation = `${time/1000}s ${animation}`;
  }

  const setDataArray = (dataArray) => {
    UintArray.current = dataArray;
  }

  const setAudioPause = (pauseData) => {
    audioPauseRef.current = pauseData;
  }

  const runningRef = useRef(false);

  useEffect(() => {
    let bpm = 122;
    let index = 14;

    if (UintArray.current !== null && animate) {

      //----> Mapping animations to array values in some indexes
      
      if (UintArray.current[index] > 215 && !runningRef.current) {
        runningRef.current = true;
        setTimeout(() => {
          runningRef.current = false
        }, bpm/2);
        !audioPauseRef.current && bubbleAnimation();
      }
      if ((UintArray.current[100] > 90 && UintArray.current[101] > 90) && !runningRef.current) {
        runningRef.current = true;
        setTimeout(() => {
          runningRef.current = false
        }, bpm/2);
        !audioPauseRef.current && upAnimation();
      }
      if ((UintArray.current[79] > 120 && UintArray.current[80] > 120) && !runningRef.current) {
        runningRef.current = true;
        setTimeout(() => {
          runningRef.current = false
        }, bpm/2);
        !audioPauseRef.current && midAnimation();
      }
      if ((UintArray.current[0] > 254 
        && UintArray.current[1] > 254) && !runningRef.current) {
        runningRef.current = true;
        setTimeout(() => {
          runningRef.current = false
        }, bpm);
        !audioPauseRef.current && downAnimation();
      }
    }
  }, [setDataArray]);

  return (
    <>
      {(!displayed) ? <Warning setDisplayed={setDisplayed}></Warning> : ''}

      <div className='app'>
        {(displayed) ? 
          <Canvas 
            width={controlsRef.current.offsetWidth - (cBorderRad.current*2)} 
            height={500} 
            display={{display}}
            huerotate={colorsState.hueRotate} /* to be removed? */
            uintarray={UintArray.current}
            style={styles.controlContainer}
            ></Canvas> 
          : ''}
        <div className='controls-container' ref={controlsRef} style={styles.controlContainer}>
            <div>
              <div 
                className='control'
                onKeyDown={animKey} 
                onClick={animate ? upAnimation : undefined}
                style={buttonClick.up ? styles.activeButton : styles.notActiveButton}
              >Up</div>
              <div 
                className='control' 
                onKeyDown={animKey}  
                onClick={animate ? midAnimation : undefined}
                style={buttonClick.mid ? styles.activeButton : styles.notActiveButton}
              >Mid</div>
              <div 
                className='control' 
                onKeyDown={animKey}  
                onClick={animate ? downAnimation : undefined}
                style={buttonClick.down ? styles.activeButton : styles.notActiveButton}
              >Down</div>
            </div>
            <div>
              <div 
                className='control' 
                onKeyDown={animKey} 
                onClick={animate ? bubbleAnimation : undefined}
                style={
                  (buttonClick.bubble) ? styles.activeButton : styles.notActiveButton
                }
              >B</div>
              <Audio 
                setDataArray={setDataArray}
                uIntArray={UintArray.current}
                setOpacity={() => setOpacity(copyrightRef.current, 3000, 1, 'block', 'fading-reverse 1 backwards')}
                setFadeout={() => setOpacity(copyrightRef.current, 1000, 0, 'none', 'fading 1 forwards')}
                setErrorIn={() => setOpacity(audioErrorRef.current, 1000, 1, 'block', 'fading-reverse 1 backwards')}
                setErrorOut={() => setOpacity(audioErrorRef.current, 3000, 0, 'none', 'fading 1 forwards')}
                setAudioPause={setAudioPause}
              ></Audio>
            </div>
        </div>
        <div className='instructions-container'>
          <kbd>A</kbd>&#160;<kbd>Z</kbd>&#160; - Upper animation&emsp;
          <kbd>S</kbd>&#160;<kbd>X</kbd>&#160; - Middle animation&emsp;
          <kbd>D</kbd>&#160;<kbd>C</kbd>&#160; - Lower animation&emsp;
          <kbd>B</kbd>&#160; - 'Bubble' animation
        </div>
      </div>

      

      <div className='anim-container'>
        <div className='horizontal-anim'>
          <div
            ref={upAnim} 
            className='up-anim'
            style={styles.upAnim}
          ></div>
        </div>

        <div className='horizontal-anim'>
          <div 
            ref={midAnim}
            className='mid-anim'
            style={styles.midAnim}
          ></div>
        </div>

        <div className='horizontal-anim'>
          <div
          ref={downAnim}
          className='down-anim'
          style={styles.downAnim}
          ></div>
        </div>

        <div 
          className='bg-anim' 
          ref={bgAnim} 
          style={styles.bgAnim}
        ></div>

        <div className='bubble-anim' ref={bubbleAnim}>
          {elements.map((element, index) => (
            <div
              key={index}
              ref={(el) => {
                bubbles.current[index] = el;
              }}
              style={styles.bubbleAnim}
            >
              {element}
            </div>
          ))}
        </div>
      </div>
      
      <div 
        className='copyright'
        ref={copyrightRef}
      >
        <pre>
          Song: <b style={{
            filter: `hue-rotate(${colorsState.hueRotate}deg)`,
            color: `rgb(50, 192, 192)`,
            }}>OVSKY - Lucky Charm [NCS Release]</b><br></br>
          Music provided by NoCopyrightSounds<br></br>
          Free Download/Stream: <a href='http://NCS.io/LuckyCharm'>http://NCS.io/LuckyCharm</a><br></br>
          Watch: <a href='http://youtu.be/'>http://youtu.be/</a>
        </pre>
      </div>

      <div 
        className='audio-error'
        ref={audioErrorRef}
        >
        Song is not currently playing
      </div>

      {displayed ? 
        <div className='checkbox'>
          Toggle background animations <button onClick={() => handleAnimate()}>{animate ? 'On' : 'Off'}</button>
        </div> :
        ''
      }
    </>
  );
}

export default App;
