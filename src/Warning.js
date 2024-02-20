import { useRef } from 'react';


function Warning({ setDisplayed }) {
    const invisibleDivRef = useRef(null);
    const warningRef = useRef(null);

    const closeWarning = () => {
        invisibleDivRef.current.style.display = 'none';
        warningRef.current.style.display = 'none';

        setDisplayed(true);
    }

    return (
        <div>
            <div className='invisible-div' ref={invisibleDivRef} onClick={closeWarning}>
            
            </div>
            <div className='warning-container' ref={warningRef}>
                <div className='warning-close'>
                    <div onClick={closeWarning}>x</div>
                </div>
                <div>
                    <div>Epilepsy Warning!</div>
                    <div>The functionality applied in this app may potentially trigger seizures for people with photosensitive epilepsy. Viewer discretion is advised.</div>
                </div>
            </div>
        </div>
    );
}

export default Warning;