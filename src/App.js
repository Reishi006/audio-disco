import './App.scss';

function App() {

  const handleUp = () => {
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
      </div>
    </>
  );
}

export default App;
