import React, { useState } from 'react';
import { backendCodeFiles } from '../services/backendCodeFiles';
import { Copy, Check } from 'lucide-react';

export const CodeViewer: React.FC = () => {
    const [activeFile, setActiveFile] = useState<keyof typeof backendCodeFiles>('app.py');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(backendCodeFiles[activeFile]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto h-[80vh] flex flex-col">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Backend Implementation</h2>
                <p className="text-slate-600 mt-2">
                    Review the Python/Flask code used for the machine learning pipeline. 
                    You can copy this into a real Python environment to run the backend server.
                </p>
            </div>

            <div className="flex-grow flex border border-slate-200 rounded-xl overflow-hidden shadow-lg bg-[#1e1e1e]">
                {/* Sidebar */}
                <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col">
                    <div className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Explorer</div>
                    {Object.keys(backendCodeFiles).map((filename) => (
                        <button
                            key={filename}
                            onClick={() => setActiveFile(filename as any)}
                            className={`px-4 py-2 text-sm text-left font-mono transition-colors ${
                                activeFile === filename 
                                    ? 'bg-[#37373d] text-white border-l-2 border-blue-500' 
                                    : 'text-slate-400 hover:text-white hover:bg-[#2a2d2e]'
                            }`}
                        >
                            {filename}
                        </button>
                    ))}
                </div>

                {/* Code Area */}
                <div className="flex-grow flex flex-col min-w-0">
                    <div className="h-10 bg-[#1e1e1e] border-b border-[#3e3e42] flex items-center justify-between px-4">
                        <span className="text-slate-400 text-xs">{activeFile}</span>
                        <button 
                            onClick={handleCopy}
                            className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs transition-colors"
                        >
                            {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="flex-grow overflow-auto p-4 custom-scrollbar">
                        <pre className="text-sm font-mono leading-relaxed">
                            <code className="text-blue-300">
                                {backendCodeFiles[activeFile]}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};