import React, { Component } from 'react';

export class SystemMonitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'resources',
            cpuHistory: Array(20).fill(25),
            ramHistory: Array(20).fill(40),
            netHistory: Array(20).fill(5),
            processes: [
                { id: 'chrome', name: 'Google Chrome', cpu: 12, mem: '142 MB' },
                { id: 'vscode', name: 'VS Code', cpu: 8, mem: '210 MB' },
                { id: 'spotify', name: 'Spotify', cpu: 3, mem: '95 MB' },
                { id: 'terminal', name: 'Terminal', cpu: 1, mem: '12 MB' },
                { id: 'nautilus', name: 'Files (Nautilus)', cpu: 2, mem: '28 MB' },
                { id: 'system-monitor', name: 'System Monitor', cpu: 4, mem: '45 MB' }
            ]
        };
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick = () => {
        // Randomly simulate resource fluctuations
        this.setState((prevState) => {
            const nextCpu = Math.max(5, Math.min(95, prevState.cpuHistory[prevState.cpuHistory.length - 1] + (Math.random() * 20 - 10)));
            const nextRam = Math.max(30, Math.min(85, prevState.ramHistory[prevState.ramHistory.length - 1] + (Math.random() * 4 - 2)));
            const nextNet = Math.max(0, Math.min(100, prevState.netHistory[prevState.netHistory.length - 1] + (Math.random() * 30 - 15)));

            const newCpuHistory = [...prevState.cpuHistory.slice(1), nextCpu];
            const newRamHistory = [...prevState.ramHistory.slice(1), nextRam];
            const newNetHistory = [...prevState.netHistory.slice(1), nextNet];

            // update process CPU levels randomly
            const updatedProcesses = prevState.processes.map(proc => ({
                ...proc,
                cpu: proc.id === 'system-monitor' ? 4 : Math.max(0, Math.min(60, Math.round(proc.cpu + (Math.random() * 6 - 3))))
            }));

            return {
                cpuHistory: newCpuHistory,
                ramHistory: newRamHistory,
                netHistory: newNetHistory,
                processes: updatedProcesses
            };
        });
    }

    killProcess = (id) => {
        // Remove from list
        this.setState({
            processes: this.state.processes.filter(p => p.id !== id)
        });
        // Call global closeWindow prop if passed
        if (this.props.closed) {
            this.props.closed(id);
        }
    }

    renderSvgGraph = (data, color, maxVal = 100) => {
        const width = 300;
        const height = 100;
        const points = data.map((val, idx) => {
            const x = (idx / (data.length - 1)) * width;
            const y = height - (val / maxVal) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 bg-ub-grey rounded border border-gray-800">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="25" x2={width} y2="25" stroke="#222" strokeWidth="1" />
                <line x1="0" y1="50" x2={width} y2="50" stroke="#222" strokeWidth="1" />
                <line x1="0" y1="75" x2={width} y2="75" stroke="#222" strokeWidth="1" />
                {/* Polyline */}
                <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
            </svg>
        );
    }

    render() {
        const currentCpu = Math.round(this.state.cpuHistory[this.state.cpuHistory.length - 1]);
        const currentRam = Math.round(this.state.ramHistory[this.state.ramHistory.length - 1]);

        return (
            <div className="h-full w-full flex flex-col bg-ub-cool-grey text-white text-sm select-none">
                {/* Header Tab Bar */}
                <div className="flex bg-ub-grey border-b border-gray-900 text-xs">
                    <button
                        onClick={() => this.setState({ activeTab: 'resources' })}
                        className={`px-4 py-2 border-b-2 hover:bg-ub-warm-grey hover:bg-opacity-10 transition-all ${this.state.activeTab === 'resources' ? 'border-ubb-orange text-white font-semibold' : 'border-transparent text-gray-400'}`}
                    >
                        Resources
                    </button>
                    <button
                        onClick={() => this.setState({ activeTab: 'processes' })}
                        className={`px-4 py-2 border-b-2 hover:bg-ub-warm-grey hover:bg-opacity-10 transition-all ${this.state.activeTab === 'processes' ? 'border-ubb-orange text-white font-semibold' : 'border-transparent text-gray-400'}`}
                    >
                        Processes
                    </button>
                </div>

                {/* Tab Contents */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {this.state.activeTab === 'resources' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* CPU */}
                            <div className="bg-ub-warm-grey bg-opacity-10 p-3 rounded border border-gray-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-xs text-gray-300">CPU History</span>
                                    <span className="text-xs text-orange-500 font-bold">{currentCpu}%</span>
                                </div>
                                {this.renderSvgGraph(this.state.cpuHistory, '#f57900')}
                            </div>

                            {/* RAM */}
                            <div className="bg-ub-warm-grey bg-opacity-10 p-3 rounded border border-gray-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-xs text-gray-300">Memory History</span>
                                    <span className="text-xs text-green-500 font-bold">{currentRam}%</span>
                                </div>
                                {this.renderSvgGraph(this.state.ramHistory, '#4e9a06')}
                            </div>

                            {/* Network */}
                            <div className="bg-ub-warm-grey bg-opacity-10 p-3 rounded border border-gray-800 md:col-span-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-xs text-gray-300">Network History (Simulated)</span>
                                    <span className="text-xs text-blue-400 font-bold">Active</span>
                                </div>
                                {this.renderSvgGraph(this.state.netHistory, '#3465a4')}
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-800 text-gray-400">
                                        <th className="py-2">Process Name</th>
                                        <th className="py-2">CPU %</th>
                                        <th className="py-2">Memory</th>
                                        <th className="py-2 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.processes.map((proc) => (
                                        <tr key={proc.id} className="border-b border-gray-900 hover:bg-ub-warm-grey hover:bg-opacity-5">
                                            <td className="py-2.5 font-medium">{proc.name}</td>
                                            <td className="py-2.5">{proc.cpu}%</td>
                                            <td className="py-2.5">{proc.mem}</td>
                                            <td className="py-2.5 text-right">
                                                <button
                                                    onClick={() => this.killProcess(proc.id)}
                                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded text-[10px] font-bold uppercase transition-all"
                                                >
                                                    Kill
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default SystemMonitor;

export const displaySystemMonitor = (windowProps) => {
    return <SystemMonitor closed={windowProps?.closed} openApp={windowProps?.openApp}></SystemMonitor>;
};
