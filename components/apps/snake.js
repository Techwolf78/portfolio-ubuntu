import React, { Component } from 'react';

export class Snake extends Component {
    constructor() {
        super();
        this.inputQueue = [];
        this.state = this.getInitialState();
    }

    getInitialState = () => {
        const highScore = typeof window !== 'undefined' ? (parseInt(localStorage.getItem('snake_highscore')) || 0) : 0;
        const soundEnabled = typeof window !== 'undefined' ? (localStorage.getItem('snake_sound') !== 'false') : true;
        
        // Initial snake: head at 10,10 and body extending downwards
        const initialSnake = [
            { x: 10, y: 10 },
            { x: 10, y: 11 },
            { x: 10, y: 12 }
        ];

        return {
            snake: initialSnake,
            food: { x: 10, y: 5 },
            direction: { x: 0, y: -1 }, // moving Up
            gameState: 'idle', // idle, playing, paused, gameover
            score: 0,
            highScore: highScore,
            soundEnabled: soundEnabled,
            isFocused: false
        };
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
        clearTimeout(this.gameTimeout);
    }

    playSound = (type) => {
        if (!this.state.soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (type === 'eat') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                osc.start();
                osc.stop(ctx.currentTime + 0.08);
            } else if (type === 'die') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.35);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                osc.start();
                osc.stop(ctx.currentTime + 0.35);
            }
        } catch (e) {
            console.error("Audio error:", e);
        }
    };

    spawnFood = (snake) => {
        let newFood;
        let attempts = 0;
        while (attempts < 200) {
            const x = Math.floor(Math.random() * 20);
            const y = Math.floor(Math.random() * 20);
            if (!snake.some(segment => segment.x === x && segment.y === y)) {
                newFood = { x, y };
                break;
            }
            attempts++;
        }
        // Fallback in case snake takes whole board
        if (!newFood) {
            newFood = { x: -1, y: -1 };
        }
        return newFood;
    }

    tick = () => {
        if (this.state.gameState !== 'playing') return;
        this.moveSnake();
        const nextSpeed = Math.max(55, 140 - Math.floor(this.state.score / 2) * 6);
        this.gameTimeout = setTimeout(this.tick, nextSpeed);
    }

    moveSnake = () => {
        let nextDir = this.state.direction;
        if (this.inputQueue.length > 0) {
            const candidateDir = this.inputQueue.shift();
            // Prevent 180-degree turns
            if (candidateDir.x !== -nextDir.x || candidateDir.y !== -nextDir.y) {
                nextDir = candidateDir;
            }
        }

        const head = this.state.snake[0];
        const newHead = {
            x: head.x + nextDir.x,
            y: head.y + nextDir.y
        };

        // Collision Check: Walls
        if (newHead.x < 0 || newHead.x >= 20 || newHead.y < 0 || newHead.y >= 20) {
            this.handleGameOver();
            return;
        }

        // Collision Check: Self (excluding the tail if we don't eat food, but simple check is fine)
        if (this.state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            this.handleGameOver();
            return;
        }

        const { food, snake, score, highScore } = this.state;
        const ateFood = newHead.x === food.x && newHead.y === food.y;

        if (ateFood) {
            const newSnake = [newHead, ...snake];
            const nextScore = score + 1;
            const nextHighScore = Math.max(nextScore, highScore);
            
            localStorage.setItem('snake_highscore', nextHighScore);
            this.playSound('eat');

            this.setState({
                snake: newSnake,
                food: this.spawnFood(newSnake),
                score: nextScore,
                highScore: nextHighScore,
                direction: nextDir
            });
        } else {
            const newSnake = [newHead, ...snake.slice(0, -1)];
            this.setState({
                snake: newSnake,
                direction: nextDir
            });
        }
    }

    handleGameOver = () => {
        this.playSound('die');
        this.setState({ gameState: 'gameover' });
        clearTimeout(this.gameTimeout);
    }

    resetGame = () => {
        clearTimeout(this.gameTimeout);
        this.inputQueue = [];
        this.setState(this.getInitialState(), () => {
            this.setState({ gameState: 'playing', isFocused: true });
            this.tick();
        });
    }

    togglePause = () => {
        if (this.state.gameState === 'playing') {
            this.setState({ gameState: 'paused' });
            clearTimeout(this.gameTimeout);
        } else if (this.state.gameState === 'paused') {
            this.setState({ gameState: 'playing' }, () => {
                this.tick();
            });
        }
    }

    toggleSound = () => {
        const nextSound = !this.state.soundEnabled;
        localStorage.setItem('snake_sound', nextSound);
        this.setState({ soundEnabled: nextSound });
    }

    handleKeyDown = (e) => {
        // Only run controls if the game has focus or is clicked
        if (!this.state.isFocused) return;

        // Skip input handling if typing in text/input fields
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable)) {
            return;
        }

        if (this.state.gameState === 'gameover') {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.resetGame();
            }
            return;
        }

        let nextDir = null;
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                nextDir = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                nextDir = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                nextDir = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                nextDir = { x: 1, y: 0 };
                break;
            case ' ':
                e.preventDefault();
                this.togglePause();
                return;
            default:
                return;
        }

        if (nextDir) {
            e.preventDefault(); // Stop window scrolling

            if (this.state.gameState === 'idle') {
                this.setState({ gameState: 'playing', direction: nextDir }, () => {
                    this.tick();
                });
                return;
            }

            if (this.state.gameState === 'playing') {
                // Buffer inputs
                if (this.inputQueue.length < 2) {
                    this.inputQueue.push(nextDir);
                }
            }
        }
    }

    handleDpadClick = (x, y) => {
        if (!this.state.isFocused) {
            this.setState({ isFocused: true });
        }

        const nextDir = { x, y };

        if (this.state.gameState === 'gameover') {
            this.resetGame();
            return;
        }

        if (this.state.gameState === 'idle') {
            this.setState({ gameState: 'playing', direction: nextDir }, () => {
                this.tick();
            });
            return;
        }

        if (this.state.gameState === 'playing') {
            if (this.inputQueue.length < 2) {
                this.inputQueue.push(nextDir);
            }
        }
    }

    render() {
        const { snake, food, gameState, score, highScore, soundEnabled, isFocused } = this.state;

        // Generate cells
        const cells = [];
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 20; x++) {
                const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
                let isBody = false;
                let bodyIndex = -1;
                
                for (let i = 1; i < snake.length; i++) {
                    if (snake[i].x === x && snake[i].y === y) {
                        isBody = true;
                        bodyIndex = i;
                        break;
                    }
                }
                
                const isFood = food.x === x && food.y === y;
                cells.push({ x, y, isHead, isBody, bodyIndex, isFood });
            }
        }

        return (
            <div 
                className="h-full w-full bg-ub-cool-grey flex flex-col items-center justify-center p-4 text-white select-none focus:outline-none"
                tabIndex={0}
                onFocus={() => this.setState({ isFocused: true })}
                onBlur={() => {
                    this.setState({ isFocused: false });
                    if (gameState === 'playing') this.togglePause();
                }}
            >
                <div className="bg-ub-grey border border-gray-900 rounded-lg p-4 shadow-2xl flex flex-col items-center max-w-sm w-full relative">
                    
                    {/* Header Panel */}
                    <div className="flex justify-between items-center w-full mb-3 px-2 bg-black bg-opacity-30 py-1.5 rounded border border-gray-800">
                        <div className="text-emerald-400 font-mono font-bold text-xs flex items-center gap-1">
                            🍎 <span className="text-gray-200">{String(score).padStart(3, '0')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={this.toggleSound}
                                className="text-xs bg-gray-800 hover:bg-gray-700 active:bg-gray-900 border border-gray-700 rounded px-2 py-0.5 transition-all cursor-pointer font-mono"
                                title="Toggle Sound"
                            >
                                {soundEnabled ? '🔊 ON' : '🔇 OFF'}
                            </button>
                            {gameState !== 'gameover' && gameState !== 'idle' && (
                                <button
                                    onClick={this.togglePause}
                                    className="text-xs bg-gray-800 hover:bg-gray-700 active:bg-gray-900 border border-gray-700 rounded px-2 py-0.5 transition-all cursor-pointer font-mono"
                                    title="Pause / Resume"
                                >
                                    {gameState === 'playing' ? '⏸️ PAUSE' : '▶️ PLAY'}
                                </button>
                            )}
                        </div>

                        <div className="text-yellow-500 font-mono font-bold text-xs flex items-center gap-1">
                            🏆 <span className="text-gray-200">{String(highScore).padStart(3, '0')}</span>
                        </div>
                    </div>

                    {/* Game Grid Box */}
                    <div className="relative overflow-hidden bg-slate-950 p-[3px] rounded-lg border-2 border-slate-900 shadow-inner">
                        <div 
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(20, 1fr)',
                                gridTemplateRows: 'repeat(20, 1fr)',
                                width: '260px',
                                height: '260px',
                                gap: '1px'
                            }}
                        >
                            {cells.map((cell, idx) => {
                                let cellStyle = "bg-slate-900/60 rounded-[1px]";
                                let innerNode = null;

                                if (cell.isHead) {
                                    cellStyle = "bg-emerald-400 rounded-sm shadow-md shadow-emerald-400/50 z-10 flex items-center justify-center";
                                    // Add tiny snake eyes based on direction
                                    const { direction } = this.state;
                                    let eyeClass = "flex gap-0.5 justify-around w-full px-0.5";
                                    if (direction.x !== 0) eyeClass = "flex flex-col gap-0.5 justify-around h-full py-0.5";
                                    innerNode = (
                                        <div className={eyeClass}>
                                            <div className="w-1 h-1 bg-black rounded-full"></div>
                                            <div className="w-1 h-1 bg-black rounded-full"></div>
                                        </div>
                                    );
                                } else if (cell.isBody) {
                                    // Fade body colors towards the tail
                                    const opacity = Math.max(0.4, 1 - (cell.bodyIndex / snake.length) * 0.6);
                                    cellStyle = "bg-emerald-500 rounded-[2px] shadow-sm";
                                    innerNode = <div className="w-full h-full bg-emerald-500 rounded-[2px]" style={{ opacity }}></div>;
                                } else if (cell.isFood) {
                                    cellStyle = "bg-transparent flex items-center justify-center";
                                    innerNode = (
                                        <div className="w-3.5 h-3.5 bg-rose-500 rounded-full shadow-lg shadow-rose-500/70 animate-pulse flex items-center justify-center">
                                            <div className="w-1 h-1 bg-white rounded-full opacity-60 translate-x-[-1px] translate-y-[-1px]"></div>
                                        </div>
                                    );
                                }

                                return (
                                    <div 
                                        key={idx} 
                                        className={`w-full h-full transition-all duration-75 ${cellStyle}`}
                                    >
                                        {innerNode}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Blur overlay for defocus state */}
                        {!isFocused && gameState !== 'gameover' && (
                            <div 
                                className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-20 cursor-pointer"
                                onClick={() => this.setState({ isFocused: true })}
                            >
                                <span className="text-2xl mb-1.5">🖱️</span>
                                <h3 className="text-xs font-bold text-gray-200">CLICK TO FOCUS</h3>
                                <p className="text-[9px] text-gray-400 mt-1 max-w-[200px]">Click inside the game window to enable keyboard controls.</p>
                            </div>
                        )}

                        {/* Welcome/Idle screen */}
                        {gameState === 'idle' && isFocused && (
                            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-center p-4 z-20">
                                <span className="text-4xl mb-2 animate-bounce">🐍</span>
                                <h2 className="text-sm font-bold text-emerald-400 tracking-wider">SNAKE GAME</h2>
                                <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">Press Arrow keys or WASD to start moving.</p>
                                <div className="mt-4 text-[9px] text-gray-500 bg-gray-900 border border-gray-800 rounded px-2 py-1">
                                    Space to pause/resume
                                </div>
                            </div>
                        )}

                        {/* Game Over Screen */}
                        {gameState === 'gameover' && (
                            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-4 z-20">
                                <span className="text-4xl mb-2 animate-bounce">💀</span>
                                <h2 className="text-sm font-bold text-red-500">GAME OVER</h2>
                                <p className="text-[10px] text-gray-400 mt-1">You crashed the snake!</p>
                                
                                <div className="bg-gray-900 border border-gray-800 rounded px-3 py-1.5 my-3 w-32 font-mono text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Score:</span>
                                        <span className="text-emerald-400 font-bold">{score}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Best:</span>
                                        <span className="text-yellow-400 font-bold">{highScore}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={this.resetGame}
                                    className="px-4 py-1.5 bg-ub-orange hover:bg-orange-600 rounded text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                                >
                                    🔄 Play Again
                                </button>
                            </div>
                        )}

                        {/* Pause Screen Overlay */}
                        {gameState === 'paused' && isFocused && (
                            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-center z-20">
                                <span className="text-3xl mb-1.5">⏸️</span>
                                <h2 className="text-sm font-bold text-gray-300">GAME PAUSED</h2>
                                <button
                                    onClick={this.togglePause}
                                    className="mt-3 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
                                >
                                    ▶️ Resume
                                </button>
                            </div>
                        )}
                    </div>

                    {/* D-Pad Buttons for Touch / Mouse click */}
                    <div className="mt-4 flex flex-col items-center justify-center w-full max-w-[160px] bg-black bg-opacity-20 py-2.5 rounded-xl border border-gray-800/40">
                        {/* Up button */}
                        <div className="flex justify-center w-full">
                            <button
                                onClick={() => this.handleDpadClick(0, -1)}
                                className="w-9 h-9 bg-gray-800 active:bg-orange-600 hover:bg-gray-700 border border-gray-700 active:border-orange-500 rounded-lg flex items-center justify-center font-bold text-lg transition-all cursor-pointer shadow-md select-none"
                            >
                                ▲
                            </button>
                        </div>
                        {/* Left & Right buttons */}
                        <div className="flex justify-between w-full px-2 my-1">
                            <button
                                onClick={() => this.handleDpadClick(-1, 0)}
                                className="w-9 h-9 bg-gray-800 active:bg-orange-600 hover:bg-gray-700 border border-gray-700 active:border-orange-500 rounded-lg flex items-center justify-center font-bold text-lg transition-all cursor-pointer shadow-md select-none"
                            >
                                ◄
                            </button>
                            <button
                                onClick={() => this.handleDpadClick(1, 0)}
                                className="w-9 h-9 bg-gray-800 active:bg-orange-600 hover:bg-gray-700 border border-gray-700 active:border-orange-500 rounded-lg flex items-center justify-center font-bold text-lg transition-all cursor-pointer shadow-md select-none"
                            >
                                ►
                            </button>
                        </div>
                        {/* Down button */}
                        <div className="flex justify-center w-full">
                            <button
                                onClick={() => this.handleDpadClick(0, 1)}
                                className="w-9 h-9 bg-gray-800 active:bg-orange-600 hover:bg-gray-700 border border-gray-700 active:border-orange-500 rounded-lg flex items-center justify-center font-bold text-lg transition-all cursor-pointer shadow-md select-none"
                            >
                                ▼
                            </button>
                        </div>
                    </div>

                    {/* Footer instructions */}
                    <div className="mt-3 text-[9px] text-gray-500 text-center font-mono max-w-[240px]">
                        Move: Arrow Keys / WASD / D-pad
                        <br />
                        Pause: Space. auto-pause when clicking outside.
                    </div>
                </div>
            </div>
        );
    }
}

export default Snake;

export const displaySnake = () => {
    return <Snake></Snake>;
};
