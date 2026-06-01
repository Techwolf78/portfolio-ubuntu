import React, { Component } from 'react';

export default class MatrixRain extends Component {
    constructor() {
        super();
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        this.ctx = canvas.getContext('2d');

        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas);

        // Matrix characters
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$@#%&";
        this.charArray = chars.split("");

        this.fontSize = 14;
        this.columns = Math.floor(canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);

        this.animationFrame = setInterval(this.draw, 33); // ~30 FPS
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeCanvas);
        clearInterval(this.animationFrame);
    }

    resizeCanvas = () => {
        const canvas = this.canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.columns = Math.floor(canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    draw = () => {
        const canvas = this.canvasRef.current;
        if (!canvas || !this.ctx) return;

        // Fading background to create trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.ctx.fillStyle = '#0f0'; // green text
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.charArray[Math.floor(Math.random() * this.charArray.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(text, x, y);

            // Random resetting of drop once it reaches bottom
            if (y > canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    render() {
        return (
            <canvas
                ref={this.canvasRef}
                className="absolute top-0 left-0 w-full h-full -z-10 bg-black"
                style={{ display: 'block' }}
            />
        );
    }
}
