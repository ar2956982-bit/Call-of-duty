import React, { useEffect, useRef } from 'react';
import { CombatLog } from '../types';

interface TerminalProps {
  logs: CombatLog[];
  isProcessing: boolean;
  onCommand: (cmd: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ logs, isProcessing, onCommand }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current?.value || isProcessing) return;
    onCommand(inputRef.current.value);
    inputRef.current.value = '';
  };

  return (
    <div className="absolute bottom-0 left-0 w-full md:w-1/2 lg:w-1/3 h-[40vh] bg-gradient-to-t from-black via-black/90 to-transparent p-6 z-40 flex flex-col justify-end">
      
      {/* Log Feed */}
      <div className="overflow-y-auto mb-4 space-y-2 max-h-full scrollbar-none mask-image-gradient">
        {logs.map((log) => (
          <div key={log.id} className={`font-mono-tech text-sm leading-relaxed ${
            log.sender === 'HQ' ? 'text-yellow-400' : 
            log.sender === 'ENEMY' ? 'text-red-500' :
            log.sender === 'SYSTEM' ? 'text-blue-400' :
            'text-white/80'
          }`}>
            <span className="opacity-50 text-[10px] mr-2">[{log.timestamp}]</span>
            <span className="font-bold mr-2">{log.sender}:</span>
            <span className={log.type === 'critical' ? 'text-red-400 font-bold' : ''}>
              {log.message}
            </span>
          </div>
        ))}
        {isProcessing && (
           <div className="font-mono-tech text-xs text-emerald-500 animate-pulse">
              > ANALYZING BATTLEFIELD DATA...
           </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Line */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-black/50 border border-white/20 p-2">
        <span className="text-emerald-500 font-mono-tech">{'>'}</span>
        <input 
          ref={inputRef}
          type="text" 
          autoFocus
          placeholder="ENTER TACTICAL COMMAND..."
          className="bg-transparent border-none outline-none text-white font-mono-tech w-full uppercase placeholder-white/20"
          disabled={isProcessing}
        />
        <button 
           type="submit"
           disabled={isProcessing}
           className="text-xs bg-white/10 px-2 py-1 font-teko uppercase hover:bg-white/20 text-white/70"
        >
          EXECUTE
        </button>
      </form>
    </div>
  );
};

export default Terminal;
