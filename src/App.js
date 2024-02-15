import { useState, useEffect, useRef } from 'react';

import './App.scss';

function App() {

  const upAnim = useRef(null);
  const midAnim = useRef(null);
  const downAnim = useRef(null);

  const [colorsRef, setColorsRef] = useState({
    red: 50,
    green: 192,
    blue: 192,
  });
  //const col = colorsRef.current;

  const animKey = (e) => {
    if (e.key === 'a' || e.key === 'z') {
      handleUp();
    }
    if (e.key === 's' || e.key === 'x') {
      handleMiddle();
    }
    if (e.key === 'd' || e.key === 'c') {
      handleDown();
    }
  }


  useEffect(() => {
    let inc = 10
    const interval = setInterval (() => {
      setColorsRef((prevColors) => ({
        red: (prevColors.red + inc) %  256,
        green: (prevColors.green + inc) %  256,
        blue: (prevColors.blue +  inc) %  256,
      }));

      
    }, 500);
    console.log(`interval: ${colorsRef.red}`);
    return () => clearInterval(interval);
  }, []);

  const getGradientStyle = (anim) => {
    if (anim === 'up') {
      let up = `linear-gradient(0deg, rgba(0, 0, 0, 0.0), rgb(${colorsRef.red}, ${colorsRef.green}, ${colorsRef.blue}))`;
      return up;
    }
    if (anim === 'mid') {
      let mid = `linear-gradient(0deg, rgba(0, 0, 0, 0.0) 0%, rgb(${colorsRef.red}, ${colorsRef.green}, ${colorsRef.blue}) 50%, rgba(0, 0, 0, 0.0) 100%)`
      return mid;
    }
    if (anim === 'down') {
      let down = `linear-gradient(180deg, rgba(0, 0, 0, 0.0), rgb(${colorsRef.red}, ${colorsRef.green}, ${colorsRef.blue}))`;
      return down;
    }
  }

  const styles = {
    upAnim: {
      background: getGradientStyle('up'),
    },
    midAnim: {
      background: getGradientStyle('mid'),
    },
    downAnim: {
      background: getGradientStyle('down'),
    },
  }

  useEffect(() => {
    document.addEventListener('keydown', animKey);
    document.addEventListener('keydown', animKey);
    document.addEventListener('keydown', animKey);

    return () => {
      document.removeEventListener('keydown', animKey);
      document.removeEventListener('keydown', animKey);
      document.removeEventListener('keydown', animKey);
    };
  }, []);

  const handleUp = () => {
    let time = 300;
    
    const el = upAnim.current;

    el.style.display = `flex`;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = `.${time/100}s fading 1 backwards`;

    setTimeout(() => {
      el.style.display = `none`;
    },  time);
    console.log('Up');
  }

  const handleMiddle = () => {
    let time = 300;
    
    const el = midAnim.current;

    el.style.display = `flex`;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = `.${time/100}s fading 1 backwards`;

    setTimeout(() => {
      el.style.display = `none`;
    },  time);
    console.log('Mid');
  }

  const handleDown = () => {
    let time = 300;
    
    const el = downAnim.current;

    el.style.display = `flex`;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = `.${time/100}s fading 1 backwards`;

    setTimeout(() => {
      el.style.display = `none`;
    },  time);
    console.log('Down');
  }

  return (
    <>
      <div className='app'>
        <div className='controls-container'>
            <div className='control' onKeyDown={animKey} onClick={handleUp}>Up</div>
            <div className='control' onKeyDown={animKey} onClick={handleMiddle}>Mid</div>
            <div className='control' onKeyDown={animKey} onClick={handleDown}>Down</div>
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
      </div>
    </>
  );
}

export default App;
