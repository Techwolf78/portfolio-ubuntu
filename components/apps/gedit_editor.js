import React, { Component } from 'react';

export class GeditEditor extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState(props);
    }

    getInitialState = (props) => {
        const fileId = props.appProps?.fileId || null;
        const defaultName = props.appProps?.fileName || 'untitled.txt';
        const defaultContent = props.appProps?.fileContent || '';
        
        const draftKey = fileId ? `gedit_draft_${fileId}` : 'gedit_draft_new';
        const draftNameKey = fileId ? `gedit_draft_name_${fileId}` : 'gedit_draft_name_new';
        
        const draftContent = localStorage.getItem(draftKey);
        const draftName = localStorage.getItem(draftNameKey);
        
        return {
            fileName: draftName !== null ? draftName : defaultName,
            fileContent: draftContent !== null ? draftContent : defaultContent,
            fileId: fileId,
            statusMessage: draftContent !== null ? 'Restored unsaved draft' : 'Ready'
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.appProps !== prevProps.appProps && this.props.appProps) {
            const newState = this.getInitialState(this.props);
            this.setState(newState);
        }
    }

    handleTextChange = (e) => {
        const content = e.target.value;
        this.setState({ fileContent: content });
        
        const key = this.state.fileId ? `gedit_draft_${this.state.fileId}` : 'gedit_draft_new';
        localStorage.setItem(key, content);
    }

    handleNameChange = (e) => {
        const base = e.target.value;
        const fullFileName = base ? `${base}.txt` : '.txt';
        this.setState({ fileName: fullFileName });
        
        const key = this.state.fileId ? `gedit_draft_name_${this.state.fileId}` : 'gedit_draft_name_new';
        localStorage.setItem(key, fullFileName);
    }

    handleSave = () => {
        const { fileName, fileContent, fileId } = this.state;
        const baseName = fileName.replace(/\.txt$/, '').trim();
        if (baseName.length === 0) {
            this.setState({ statusMessage: 'Error: Filename cannot be empty!' });
            return;
        }
        const cleanName = `${baseName}.txt`;

        let savedFiles = localStorage.getItem('desktop_files') ? JSON.parse(localStorage.getItem('desktop_files')) : [];
        let id = fileId;

        // Resolve name conflict with other saved files
        const otherFiles = id ? savedFiles.filter(f => f.id !== id) : savedFiles;
        let finalName = cleanName;
        const baseWithoutExt = cleanName.replace(/\.txt$/, '');
        let counter = 1;
        while (otherFiles.some(f => f.name.toLowerCase() === finalName.toLowerCase())) {
            finalName = `${baseWithoutExt}(${counter}).txt`;
            counter++;
        }

        if (id) {
            // Update existing file
            savedFiles = savedFiles.map(f => f.id === id ? { ...f, name: finalName, content: fileContent } : f);
        } else {
            // Create new file
            id = 'file-' + Date.now();
            savedFiles.push({ id, name: finalName, content: fileContent });
        }

        localStorage.setItem('desktop_files', JSON.stringify(savedFiles));

        // Clear drafts for this document
        const draftKey = fileId ? `gedit_draft_${fileId}` : 'gedit_draft_new';
        const draftNameKey = fileId ? `gedit_draft_name_${fileId}` : 'gedit_draft_name_new';
        localStorage.removeItem(draftKey);
        localStorage.removeItem(draftNameKey);
        
        if (!fileId) {
            localStorage.removeItem('gedit_draft_new');
            localStorage.removeItem('gedit_draft_name_new');
        }
        
        // Dispatch custom event to let Desktop know to reload files
        window.dispatchEvent(new Event('desktop-files-updated'));

        this.setState({ fileId: id, statusMessage: 'Saved successfully!', fileName: finalName });
        setTimeout(() => this.setState({ statusMessage: 'Ready' }), 3000);
    }

    handleNew = () => {
        localStorage.removeItem('gedit_draft_new');
        localStorage.removeItem('gedit_draft_name_new');
        this.setState({
            fileName: 'untitled.txt',
            fileContent: '',
            fileId: null,
            statusMessage: 'New document created'
        });
        setTimeout(() => this.setState({ statusMessage: 'Ready' }), 2000);
    }

    render() {
        const baseName = this.state.fileName.replace(/\.txt$/, '');

        return (
            <div className="h-full w-full flex flex-col text-white text-xs select-none" style={{ backgroundColor: '#2c001e' }}>
                {/* Menu / Tool Bar */}
                <div className="flex justify-between items-center p-2 border-b border-gray-900 font-mono" style={{ backgroundColor: '#1e1e1e' }}>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={this.handleNew}
                            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 rounded font-bold transition-all border border-zinc-700 text-white cursor-pointer"
                        >
                            📄 New
                        </button>
                        <button 
                            onClick={this.handleSave}
                            className="px-3 py-1 bg-[#E95420] hover:bg-orange-600 active:bg-orange-700 rounded font-bold transition-all border border-orange-700 text-white cursor-pointer"
                        >
                            💾 Save to Desktop
                        </button>
                    </div>
                    
                    {/* Filename Input container forcing .txt suffix */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">Filename:</span>
                        <div className="flex items-center rounded px-2.5 py-1 border border-zinc-850" style={{ backgroundColor: '#111111' }}>
                            <input
                                type="text"
                                value={baseName}
                                onChange={this.handleNameChange}
                                className="outline-none bg-transparent w-28 font-mono text-white text-xs"
                                placeholder="untitled"
                            />
                            <span className="text-zinc-500 font-mono text-xs select-none">.txt</span>
                        </div>
                    </div>
                </div>

                {/* Text Editing Area - Force Dark Background and Visible Text */}
                <textarea
                    value={this.state.fileContent}
                    onChange={this.handleTextChange}
                    placeholder="Type your notes here..."
                    className="flex-grow p-4 font-mono border-0 outline-none resize-none text-sm leading-relaxed"
                    style={{ backgroundColor: '#151515', color: '#f3f4f6' }}
                />

                {/* Status Bar */}
                <div className="p-1.5 border-t border-gray-900 flex justify-between text-[10px] text-gray-400 font-mono px-3" style={{ backgroundColor: '#1e1e1e' }}>
                    <span>Gedit Text Editor</span>
                    <span>Status: <span className={this.state.statusMessage.includes('Error') ? 'text-red-400 font-bold' : 'text-green-400'}>{this.state.statusMessage}</span></span>
                </div>
            </div>
        );
    }
}

export default GeditEditor;

export const displayGeditEditor = (windowProps) => {
    return <GeditEditor closed={windowProps?.closed} openApp={windowProps?.openApp} appProps={windowProps?.appProps}></GeditEditor>;
};
