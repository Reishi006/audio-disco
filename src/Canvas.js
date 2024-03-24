import { useState, useRef, useEffect } from 'react';

function Canvas(props) {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);

    const xRef = useRef(0);
    const yRef = useRef(props.height);

    const draw = () => {
        ctx.clearRect(0,  0, canvasRef.current.width, canvasRef.current.height);

        const between = 1;
        if (props.uintarray != null) {
            const size = Math.floor(props.width / (props.uintarray.length)) - between;
            if (xRef.current === 0) {
                const offset = 
                (
                    canvasRef.current.offsetWidth 
                    - (props.uintarray.length
                        * (size + between))
                ) / 2;
                xRef.current = offset;
            }
            
            for (let i = 0; i < props.uintarray.length; i++) {

                ctx.fillStyle = 'rgb(50, 192, 192)';
                //ctx.filter = `hue-rotate(${props.huerotate}deg)`;
                ctx.fillRect(xRef.current, yRef.current, size, -size);

                ctx.fillStyle = 'rgb(50, 192, 192)';
                //ctx.filter = `hue-rotate(${props.huerotate}deg)`;
                ctx.fillRect(xRef.current, yRef.current-size, size, -props.uintarray[i]);
                xRef.current += size + between;
            }
            xRef.current = 0;
        }
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

        if (ctx && props.uintarray !== null) {
            const render = () => {
                draw();
                frameId = window.requestAnimationFrame(render);
            }
            render();
            return () => {
                window.cancelAnimationFrame(frameId);
            }
        }
    }, [draw, ctx, props.uintarray]);

    return (
    <canvas 
        ref={canvasRef}
        {...props}
    />
    );
}

export default Canvas;
