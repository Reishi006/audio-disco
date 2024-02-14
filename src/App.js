import { useState, useEffect, useRef } from 'react';

import './App.scss';

function App() {

  const [isAnimating, setIsAnimating] = useState(false);
  const upAnim = useRef(null);

  const handleUp = () => {
    const el = upAnim.current;

    el.style.display = `flex`;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '.5s fading 1 forwards';

    setTimeout(() => {
      upAnim.current.style.display = `none`;
      console.log(`display`);
      setIsAnimating(false);
    },  500);
    console.log('Up');
  }

  const handleMiddle = () => {
    console.log('Mid');
  }

  const handleDown = () => {
    console.log('Down');
  }

  return (
    <>
      <div className='app'>
        <div className='controls-container'>
            <div className='control' onClick={handleUp}>Up</div>
            <div className='control' onClick={handleMiddle}>Mid</div>
            <div className='control' onClick={handleDown}>Down</div>
        </div>

        <div className='anim-container'>
          <div
            ref={upAnim} 
            className={`up-anim`}
            /* style={{ display: isAnimating ? 'none' : 'flex' }} */
          >Up</div>
          {/* <div className='mid-anim'>Mid</div>
          <div className='down-anim'>Down</div> */}
        </div>
      </div>
    </>
  );
}

export default App;
