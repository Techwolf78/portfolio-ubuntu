import React, { Component } from 'react';

export class Nautilus extends Component {
    constructor() {
        super();
        this.state = {
            currentFolder: 'Home',
            selectedFile: null,
            folders: {
                'Home': [
                    { name: 'Documents', type: 'folder' },
                    { name: 'Pictures', type: 'folder' },
                    { name: 'Projects', type: 'folder' },
                    { name: 'README.md', type: 'file', content: '# Welcome to Ajay\'s Files\nDouble click files or click folders to explore. Enjoy this Nautilus file manager replica!' }
                ],
                'Documents': [
                    { name: 'skills.txt', type: 'file', content: 'Skills & Tech Stack:\n- Frontend: React, Next.js, JavaScript (ES6+), TypeScript, Tailwind CSS, HTML5, CSS3\n- Backend: Node.js, Express, REST APIs, Python\n- Tools: Git, VS Code, Vercel, npm' },
                    { name: 'experience.txt', type: 'file', content: 'Experience Summary:\n- Built high-performance responsive web applications.\n- Designed custom Ubuntu OS mock environment.\n- Dedicated to optimizing UI layout components & frontend speed.' }
                ],
                'Pictures': [
                    { name: 'avatar.svg', type: 'image', content: 'avatar' },
                    { name: 'wallpaper.jpg', type: 'image', content: 'wallpaper' }
                ],
                'Projects': [
                    { name: 'ubuntu-portfolio.txt', type: 'file', content: 'Ubuntu OS Portfolio:\n- Interactive desktop environment.\n- Integrated mock Terminal, Gedit, Chrome, VS Code.\n- Pure React and Tailwind CSS implementation.' },
                    { name: 'personal-website.txt', type: 'file', content: 'Official Web Portfolio:\n- Hosted at: https://ajay-pawar.vercel.app/\n- Showcasing key production work, assets, and contacts.' }
                ]
            }
        };
    }

    selectFolder = (folderName) => {
        this.setState({ currentFolder: folderName, selectedFile: null });
    }

    selectFile = (file) => {
        this.setState({ selectedFile: file });
    }

    renderFilePreview = (file) => {
        if (file.type === 'file') {
            return (
                <div className="p-4 bg-ub-grey rounded border border-gray-800 text-gray-200 text-xs font-mono whitespace-pre-wrap h-full overflow-y-auto">
                    {file.content}
                </div>
            );
        } else if (file.type === 'image') {
            if (file.name === 'avatar.svg') {
                return (
                    <div className="flex flex-col items-center justify-center p-4 bg-ub-grey rounded border border-gray-800 h-full">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg animate-pulse mb-3">
                            AP
                        </div>
                        <span className="text-gray-300 text-xs font-mono">Ajay Pawar (Avatar)</span>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col items-center justify-center p-4 bg-ub-grey rounded border border-gray-800 h-full">
                        <div className="w-full h-32 rounded bg-cover bg-center border border-gray-700" style={{ backgroundImage: "url('./images/wallpapers/wall-9.jpg')" }}></div>
                        <span className="text-gray-300 text-xs font-mono mt-2">Ubuntu Jammy Jellyfish</span>
                    </div>
                );
            }
        }
        return null;
    }

    render() {
        const items = this.state.folders[this.state.currentFolder] || [];

        return (
            <div className="h-full w-full flex bg-ub-cool-grey text-white text-sm select-none">
                {/* Left Sidebar */}
                <div className="w-1/4 min-w-[120px] bg-ub-grey border-r border-gray-900 flex flex-col py-3">
                    <span className="px-4 text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Places</span>
                    {['Home', 'Documents', 'Pictures', 'Projects'].map((folder) => (
                        <div
                            key={folder}
                            onClick={() => this.selectFolder(folder)}
                            className={`px-4 py-2 flex items-center cursor-pointer hover:bg-ub-warm-grey hover:bg-opacity-20 transition-all ${this.state.currentFolder === folder ? 'bg-ubb-orange bg-opacity-30 border-l-4 border-ubb-orange font-semibold' : ''}`}
                        >
                            <img className="w-4 h-4 mr-2" src={folder === 'Pictures' ? "./themes/Yaru/system/user-home.png" : "./themes/Yaru/system/folder.png"} alt="folder" />
                            <span>{folder}</span>
                        </div>
                    ))}
                </div>

                {/* Main View Area */}
                <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                    <div className="flex items-center text-xs text-gray-400 mb-4 border-b border-gray-800 pb-2">
                        <span>nautilus</span>
                        <span className="mx-2">&gt;</span>
                        <span className="text-gray-200 font-semibold">{this.state.currentFolder}</span>
                    </div>

                    <div className="flex-1 grid grid-cols-3 gap-4 items-start">
                        {/* File grid */}
                        <div className="col-span-2 grid grid-cols-3 gap-3">
                            {items.map((item) => (
                                <div
                                    key={item.name}
                                    onClick={() => {
                                        if (item.type === 'folder') {
                                            this.selectFolder(item.name);
                                        } else {
                                            this.selectFile(item);
                                        }
                                    }}
                                    onDoubleClick={() => {
                                        if (item.type === 'folder') {
                                            this.selectFolder(item.name);
                                        } else {
                                            this.selectFile(item);
                                        }
                                    }}
                                    className={`flex flex-col items-center p-2 rounded cursor-pointer transition-all border border-transparent ${this.state.selectedFile?.name === item.name ? 'bg-ubb-orange bg-opacity-20 border-ubb-orange border-opacity-50' : 'hover:bg-ub-warm-grey hover:bg-opacity-10'}`}
                                >
                                    <img
                                        className="w-10 h-10 mb-1"
                                        src={item.type === 'folder' ? "./themes/Yaru/system/folder.png" : "./themes/Yaru/apps/gedit.png"}
                                        alt={item.name}
                                    />
                                    <span className="text-xs text-center text-gray-200 break-all">{item.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* File Preview Panel */}
                        <div className="col-span-1 h-full flex flex-col">
                            {this.state.selectedFile ? (
                                <div className="flex flex-col h-full">
                                    <div className="text-xs font-bold text-ubb-orange mb-2 uppercase tracking-wide">File Preview</div>
                                    <div className="flex-1 min-h-[160px]">
                                        {this.renderFilePreview(this.state.selectedFile)}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full border border-dashed border-gray-800 rounded flex flex-col items-center justify-center p-4 text-center text-xs text-gray-500">
                                    <img className="w-8 h-8 opacity-30 mb-2" src="./themes/Yaru/system/folder.png" alt="select" />
                                    Select a file to preview contents
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Nautilus;

export const displayNautilus = () => {
    return <Nautilus></Nautilus>;
};
