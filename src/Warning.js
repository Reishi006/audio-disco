

function Warning({ setDisplayed }) {
    const closeWarning = () => {
        setDisplayed(true);
    }

    return (
        <div>
            <div className='invisible-div'  onClick={closeWarning}>
            
            </div>
            <div className='warning-container' >
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
