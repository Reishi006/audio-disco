import { useRef, useEffect } from 'react';

function Canvas(props) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
    }, []);

    return (
    <canvas 
        ref={canvasRef} 
        width={props.width} 
        height={props.height}
        style={props.display}
    />
    );
}

export default Canvas;