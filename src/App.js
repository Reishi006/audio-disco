import { useState, useEffect, useRef } from 'react';

import './App.scss';

function App() {
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


  const animBg = () => {
    let time = 300;

    let el = bgAnim.current;
    el.style.display = 'flex';
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = `.${time/100}s fading 1 backwards`;

    setTimeout(() => {
      el.style.display = `none`;
    },  time);

  }

  const animKey = (e) => {
    if (e.key === 'a' || e.key === 'z') {
      upAnimation();
    }
    if (e.key === 's' || e.key === 'x') {
      midAnimation();
    }
    if (e.key === 'd' || e.key === 'c') {
      downAnimation();
    }
    if (e.key === 'b') {
      bubbleAnimation();
    }
  }


  useEffect(() => {
    let inc = 5;
    const interval = setInterval (() => {
      setcolorsState((prevColors) => ({
        /* red: (prevColors.red + inc) %  256,
        green: (prevColors.green + inc) %  256,
        blue: (prevColors.blue +  inc) %  256, */
        hueRotate: (prevColors.hueRotate + inc) % 360,
      }));
      
    }, 250);
    console.log(`interval: ${colorsState.red}`);
    return () => clearInterval(interval);
  }, []);

  /* useEffect(() => {
    console.log(colorsState.hueRotate);
  }, [colorsState.hueRotate]); */

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
      filter: `hue-rotate(${colorsState.hueRotate + 20}deg)`,
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', animKey);

    return () => {
      document.removeEventListener('keydown', animKey);
    };
  }, []);

  const handleUp = () => {
    let time = 300;
    
    const el = upAnim.current;

    setButtonClick({...buttonClick,
      up: true,
    });

    el.style.animation = 'none';
    void el.offsetWidth;

    el.style.display = `flex`;
    el.style.animation = `.${time/100}s fading 1 backwards`;

    setTimeout(() => {
      setButtonClick({...buttonClick,
        up: false,
      });
    }, time/3);

    setTimeout(() => {
      el.style.display = `none`;
    },  time);

    animBg();
    console.log('Up');
  }

  const handleMiddle = () => {
    let time = 300;
    
    const el = midAnim.current;

    setButtonClick({...buttonClick,
      mid: true,
    });

    el.style.animation = 'none';
    void el.offsetWidth;

    el.style.display = `flex`;
    el.style.animation = `.${time/100}s fading 1 backwards`;

    setTimeout(() => {
      setButtonClick({...buttonClick,
        mid: false,
      });
    }, time/3);

    setTimeout(() => {
      el.style.display = `none`;
    },  time);

    animBg();
    console.log('Mid');
  }

  const handleDown = () => {
    let time = 300;
    
    const el = downAnim.current;

    setButtonClick({...buttonClick,
      down: true,
    });

    el.style.animation = 'none';
    void el.offsetWidth;

    el.style.display = `flex`;
    el.style.animation = `.${time/100}s fading 1 backwards`;

    setTimeout(() => {
      setButtonClick({...buttonClick,
        down: false,
      });
    }, time/3);

    setTimeout(() => {
      el.style.display = `none`;
    },  time);

    animBg();
    console.log('Down');
  }

  const elements = [1, 2, 3, 4, 5, 6];

  const bubbleReposition = () => {
    const getBubblesPosition = () => {
      const x = Math.floor(Math.random() * window.innerWidth);
      const y = Math.floor(Math.random() * window.innerHeight);

      return { x, y };
    }

    bubbles.current.forEach((ref) => {
      const { x, y } = getBubblesPosition();
      ref.style.position = 'absolute';
      ref.style.left = `${x}px`;
      ref.style.top = `${y}px`;
      ref.style.transform = `translate(-100%, -100%)`;
      let r = colorsState.red + (Math.random() * 10);
      let g = colorsState.green + (Math.random() * 50);
      let b = colorsState.blue + (Math.random() * 50);
      ref.style.background = `radial-gradient(circle, rgb(${r}, ${g}, ${b}) 0%, #00000000 50%)`;
    });
  }

  /* const handleBubbles = () => {
    let time = 500;

    if (timeouts.bubbleTimeout) {
      clearTimeout(timeouts.bubbleTimeout);
    }

    bubbleReposition();

    const el = bubbleAnim.current;

    setButtonClick({...buttonClick, 
      bubble: true,
    });

    el.style.animation = 'none';
    void el.offsetWidth;

    el.style.display = `flex`;
    el.style.animation = `.${time/100}s fading 1 backwards`;

    setTimeout(() => {
      setButtonClick({...buttonClick,
        bubble: false,
      });
    }, time/3);

    timeouts.bubbleTimeout = setTimeout(() => {
      el.style.display = `none`;
    },  time);

    animBg();
    console.log('Bubbles');
  } */


  /* parameters to the universal function:

  time,
  timeouts object,
  xAnim.current,
  buttonClick.x,

  */

  /* useEffect(() => {
    console.log(timeouts.bubbleTimeout);
  }, [timeouts.bubbleTimeout, buttonClick.bubble]); */

  const handleAnimation = (t, tout, elm, btnclick, bubble) => {

    console.log(`timer: ${timeouts[tout]}`);
    if (timeouts.current[tout]) {
      clearTimeout(timeouts.current[tout]);
      console.log(`timer cleared`);
    }

    bubble && bubbleReposition();

    setButtonClick({...buttonClick, 
      [btnclick]: true,
    });

    elm.style.animation = 'none';
    void elm.offsetWidth;

    elm.style.display = `flex`;
    elm.style.animation = `.${t/100}s fading 1 backwards`;

    setTimeout(() => {
      setButtonClick({...buttonClick,
        [btnclick]: false,
      });
    }, t/3);

    timeouts.current[tout] = setTimeout(() => {
      elm.style.display = `none`;
    },  t-10);

    animBg();
    console.log('handleAnimation');
  }
  

  const upAnimation = () => {
    handleAnimation(300, 'upTimeout', upAnim.current, 'up', false);
  }
  const midAnimation = () => {
    handleAnimation(300, 'midTimeout', midAnim.current, 'mid', false);
  }
  const downAnimation = () => {
    handleAnimation(300, 'downTimeout', downAnim.current, 'down', false);
  }
  const bubbleAnimation = () => {
    handleAnimation(500, 'bubbleTimeout', bubbleAnim.current, 'bubble', true);
  }

  return (
    <>
      
      <div className='app'>
        <div className='controls-container' style={styles.controlContainer}>
            <div 
              className='control'
              onKeyDown={animKey} 
              onClick={upAnimation}
              style={buttonClick.up ? styles.activeButton : styles.notActiveButton}
            >Up</div>
            <div 
              className='control' 
              onKeyDown={animKey} 
              onClick={midAnimation}
              style={buttonClick.mid ? styles.activeButton : styles.notActiveButton}
            >Mid</div>
            <div 
              className='control' 
              onKeyDown={animKey} 
              onClick={downAnimation}
              style={buttonClick.down ? styles.activeButton : styles.notActiveButton}
            >Down</div>
            <div 
              className='control' 
              onKeyDown={animKey} 
              onClick={bubbleAnimation}
              style={buttonClick.bubble ? styles.activeButton : styles.notActiveButton}
            >B</div>
        </div>
      </div>

      

      <div className='anim-container'>
        <div className='horizontal-anim'>
          <div
            ref={upAnim} 
            className='up-anim'
            style={styles.upAnim}
          >Up</div>
        </div>

        <div className='horizontal-anim'>
          <div 
            ref={midAnim}
            className='mid-anim'
            style={styles.midAnim}
          >Mid</div>
        </div>

        <div className='horizontal-anim'>
          <div
          ref={downAnim}
          className='down-anim'
          style={styles.downAnim}
          >Down</div>
        </div>

        <div className='bg-anim' ref={bgAnim} style={styles.bgAnim}>
          Something
        </div>

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
    </>
  );
}

export default App;
