import { useState, useRef, useEffect } from 'react';

function Canvas(props) {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);

    const draw = () => {
        ctx.fillStyle = 'rgb(50, 192, 192)';
        ctx.filter = `hue-rotate(${props.huerotate}deg)`;
        ctx.fillRect(0, 0, 100, 100);
    }

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            setCtx(context);
        }
    }, []);

    useEffect(() => {
        let frameId;

        if (ctx) {
            const render = () => {
                draw();
                frameId = window.requestAnimationFrame(render);
            }
            render();
        }
        return () => {
            window.cancelAnimationFrame(frameId);
        }
    }, [draw, ctx]);

    return (
    <canvas 
        ref={canvasRef} 
        {...props}
    />
    );
}

export default Canvas;
