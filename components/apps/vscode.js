import React, { useState, useEffect, useRef } from 'react';

function VsCode() {
    const [editorCode, setEditorCode] = useState('');
    const [terminalLines, setTerminalLines] = useState([]);
    const [activeTab, setActiveTab] = useState('main.js');
    const terminalEndRef = useRef(null);

    const fullCode = `const security = require('security-override');
const mainframe = require('ajay-central-db');

async function initiateBypass() {
    console.log("Locating security nodes...");
    let nodes = await security.scanNodes();
    
    for (let node of nodes) {
        if (node.isProtected) {
            await security.injectPayload(node.ip);
            console.log(\`Payload injected into Node: \${node.ip}\`);
        }
    }
    
    // Connect to database
    await mainframe.connect({
        user: "AjayPawar",
        accessKey: "ROOT_OVERRIDE_0x7FFA",
        bypassFirewall: true
    });
    
    console.log("Access Granted. Welcome, Ajay.");
}

initiateBypass();`;

    const logs = [
        "ajay@mainframe:~$ ./exploit_core.sh --target=mainframe.local",
        "[INFO] Initiating decryption sequence...",
        "[INFO] Target: mainframe.local (192.168.1.99)",
        "[INFO] Establishing initial tunnel via port 22...",
        "[SUCCESS] SSH tunnel established.",
        "[INFO] Elevating privileges...",
        "[WARNING] Local system firewall detected.",
        "[INFO] Deploying firewall bypass payload: bypass_v2.bin",
        "[SUCCESS] Firewall bypassed successfully. Node: 0x7FFA",
        "[INFO] Injecting root exploit...",
        "[STATUS] Extracting system hash keys...",
        "[STATUS] Decrypting database hashes (1/4)...",
        "[STATUS] Decrypting database hashes (2/4)...",
        "[STATUS] Decrypting database hashes (3/4)...",
        "[STATUS] Decrypting database hashes (4/4)...",
        "[SUCCESS] Extraction complete. 142 hashes decrypted.",
        "[INFO] Executing mainframe root shell override...",
        "[SUCCESS] Access level: ROOT_SYSTEM",
        "---------------------------------------------",
        "ACCESS GRANTED: Welcome, Ajay Pawar.",
        "---------------------------------------------",
        "ajay@mainframe:~$ "
    ];

    // Typing effect for the editor
    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setEditorCode((prev) => prev + fullCode.charAt(index));
            index++;
            if (index >= fullCode.length) {
                clearInterval(interval);
                // Restart typing after a delay
                setTimeout(() => {
                    setEditorCode('');
                }, 5000);
            }
        }, 35);
        return () => clearInterval(interval);
    }, [editorCode === '']);

    // Scrolling effect for terminal logs
    useEffect(() => {
        let currentLine = 0;
        setTerminalLines([logs[0]]);
        
        const interval = setInterval(() => {
            currentLine++;
            if (currentLine >= logs.length) {
                currentLine = 0;
                setTerminalLines([logs[0]]);
            } else {
                setTerminalLines((prev) => [...prev, logs[currentLine]]);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [terminalLines]);

    return (
        <div className="w-full h-full flex bg-[#1e1e1e] text-gray-300 font-mono select-none text-xs md:text-sm overflow-hidden">
            {/* 1. Activity Bar (narrow leftmost bar) */}
            <div className="w-10 md:w-12 bg-[#333333] flex flex-col items-center py-2 space-y-4 border-r border-[#252526]">
                <div className="cursor-pointer p-1 text-white border-l-2 border-white hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                </div>
                <div className="cursor-pointer p-1 text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <div className="cursor-pointer p-1 text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="cursor-pointer p-1 text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
            </div>

            {/* 2. Sidebar Explorer */}
            <div className="w-36 md:w-48 bg-[#252526] flex flex-col border-r border-[#1e1e1e] hidden sm:flex">
                <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Explorer</div>
                <div className="flex-1 overflow-y-auto px-2 space-y-1">
                    <div className="text-gray-300 font-semibold flex items-center space-x-1 py-1">
                        <span>▼</span>
                        <span>ajay-hack-system</span>
                    </div>
                    <div className="pl-3 space-y-1">
                        <div className="text-gray-400 flex items-center space-x-1 py-0.5">
                            <span>▼</span>
                            <span>📁 src</span>
                        </div>
                        <div className="pl-4 space-y-0.5">
                            <div className={`cursor-pointer flex items-center space-x-1 py-0.5 px-1 rounded ${activeTab === 'main.js' ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:bg-[#2a2d2e]'}`} onClick={() => setActiveTab('main.js')}>
                                <span className="text-yellow-500 text-xs">JS</span>
                                <span>main.js</span>
                            </div>
                            <div className={`cursor-pointer flex items-center space-x-1 py-0.5 px-1 rounded ${activeTab === 'core.py' ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:bg-[#2a2d2e]'}`} onClick={() => setActiveTab('core.py')}>
                                <span className="text-blue-400 text-xs">PY</span>
                                <span>core.py</span>
                            </div>
                        </div>
                        <div className="text-gray-400 flex items-center space-x-1 py-0.5">
                            <span>▶</span>
                            <span>📁 payloads</span>
                        </div>
                        <div className="text-gray-400 flex items-center space-x-1 py-0.5">
                            <span>▶</span>
                            <span>📁 keys</span>
                        </div>
                        <div className="text-gray-300 flex items-center space-x-1 py-0.5">
                            <span className="text-red-500">⚙</span>
                            <span>config.json</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Editor & Terminal Main Content */}
            <div className="flex-grow flex flex-col bg-[#1e1e1e]">
                {/* Editor Tabs */}
                <div className="h-9 bg-[#2d2d2d] flex items-end border-b border-[#1e1e1e]">
                    <div className="flex items-center bg-[#1e1e1e] text-white px-3 py-1.5 border-t border-t-[#007acc] border-r border-[#252526] space-x-2">
                        <span className="text-yellow-500 text-[10px]">JS</span>
                        <span className="text-xs">{activeTab}</span>
                        <span className="text-gray-500 hover:text-white cursor-pointer text-[10px]">×</span>
                    </div>
                    <div className="hidden md:flex items-center text-gray-500 px-3 py-1.5 space-x-2">
                        <span className="text-blue-400 text-[10px]">PY</span>
                        <span className="text-xs">core.py</span>
                    </div>
                </div>

                {/* Code Window Area */}
                <div className="flex-1 p-4 overflow-auto font-mono text-[#4ec9b0] relative flex flex-col justify-start">
                    {/* Matrix Digital Aesthetic Overlay */}
                    <div className="absolute inset-0 bg-radial-gradient opacity-5 pointer-events-none"></div>
                    
                    {/* Text Gutter and Typing Code */}
                    <div className="flex items-start space-x-3 w-full">
                        <div className="text-gray-600 select-none text-right w-6 hidden md:block">
                            {fullCode.split('\n').map((_, i) => (
                                <div key={i}>{i + 1}</div>
                            ))}
                        </div>
                        <pre className="flex-grow text-[#9cdcfe] leading-relaxed whitespace-pre-wrap select-text font-mono">
                            {activeTab === 'main.js' ? (
                                <code>
                                    {editorCode}
                                    <span className="w-1.5 h-4 bg-green-400 inline-block animate-ping ml-0.5"></span>
                                </code>
                            ) : (
                                <code className="text-gray-500">
                                    {`# Exploit configuration template
# Host: mainframe.local
# Status: Idle`}
                                </code>
                            )}
                        </pre>
                    </div>
                </div>

                {/* 4. Hacker Terminal Panel */}
                <div className="h-44 bg-[#0c0c0c] border-t border-[#333333] flex flex-col p-2 font-mono text-green-400 overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] text-gray-500 border-b border-[#252526] pb-1 px-1 mb-1.5">
                        <span>TERMINAL (ajay@mainframe)</span>
                        <div className="flex space-x-2">
                            <span className="cursor-pointer hover:text-white">＋</span>
                            <span className="cursor-pointer hover:text-white">🗑</span>
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-gray-800">
                        {terminalLines.map((line, idx) => (
                            <div key={idx} className={line.includes('[SUCCESS]') || line.includes('GRANTED') ? 'text-green-300 font-bold' : line.includes('[WARNING]') ? 'text-yellow-400' : 'text-green-500'}>
                                {line}
                            </div>
                        ))}
                        <span className="w-2 h-4 bg-green-400 inline-block ml-0.5 animate-pulse"></span>
                        <div ref={terminalEndRef} />
                    </div>
                </div>

                {/* 5. VS Code Status Bar */}
                <div className="h-6 bg-[#007acc] flex justify-between items-center px-2 text-[11px] text-white">
                    <div className="flex items-center space-x-3">
                        <div className="bg-[#1f8ad2] px-1 hover:bg-[#2d9cdb] cursor-pointer flex items-center space-x-1">
                            <span>⊗</span>
                            <span>0</span>
                            <span>⚠</span>
                            <span>0</span>
                        </div>
                        <span className="hover:underline cursor-pointer">✔ Master</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span>Ln 1, Col 1</span>
                        <span>Spaces: 4</span>
                        <span>UTF-8</span>
                        <span>LF</span>
                        <span>JavaScript</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function displayVsCode() {
    return <VsCode />;
}
