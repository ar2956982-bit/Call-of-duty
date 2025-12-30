import React from 'react';
import { Weapon } from '../types';
import Button from './Button';

interface LoadoutMenuProps {
  onSelect: (weapon: Weapon) => void;
  weapons: Weapon[];
}

const LoadoutMenu: React.FC<LoadoutMenuProps> = ({ onSelect, weapons }) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-40 flex overflow-hidden">
       {/* Left Panel - List */}
       <div className="w-1/3 h-full border-r border-white/10 bg-black/20 backdrop-blur-md p-10 flex flex-col overflow-y-auto pt-20">
          <h1 className="font-teko text-5xl uppercase mb-8 text-white border-b border-white/20 pb-4">
             Select Loadout
          </h1>
          
          <div className="flex flex-col gap-2">
             {weapons.map((w) => (
               <button
                 key={w.id}
                 onClick={() => onSelect(w)}
                 className="group text-left p-4 hover:bg-white/5 border-l-2 border-transparent hover:border-yellow-500 transition-all"
               >
                 <span className="block font-teko text-2xl group-hover:text-yellow-400 group-hover:translate-x-2 transition-transform">
                   {w.name}
                 </span>
                 <span className="block font-mono-tech text-xs text-white/40 group-hover:text-white/60">
                   {w.type} | DMG: {w.damage} | MOB: {w.mobility}
                 </span>
               </button>
             ))}
          </div>
       </div>

       {/* Right Panel - Preview (Abstract) */}
       <div className="flex-1 relative">
          <div className="absolute bottom-20 right-20 text-right">
             <h2 className="font-teko text-9xl text-white/5 uppercase select-none">
                Armory
             </h2>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             {/* Simple weapon silhouette using CSS or SVG */}
             <div className="w-96 h-48 bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="font-mono-tech text-white/20">WEAPON PREVIEW OFFLINE</span>
             </div>
          </div>
       </div>
    </div>
  );
};

export default LoadoutMenu;
