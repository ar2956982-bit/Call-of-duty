import React from 'react';
import { PlayerState, Mission } from '../types';

interface HUDProps {
  playerState: PlayerState;
  mission: Mission;
}

const HUD: React.FC<HUDProps> = ({ playerState, mission }) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-30">
      
      {/* Top Bar - Compass & Objectives */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="bg-black/60 backdrop-blur-sm p-2 border-l-2 border-yellow-500">
            <h3 className="font-teko text-yellow-500 text-lg leading-none">CURRENT OBJECTIVE</h3>
            <p className="font-mono-tech text-white text-sm uppercase tracking-wider">
              {mission.objective}
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-500 animate-pulse">
            // ENCRYPTED CONNECTION ESTABLISHED
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-black/40 p-2 rounded border border-white/10">
            <span className="font-teko text-2xl text-white">NW 330</span>
          </div>
        </div>
      </div>

      {/* Crosshair (Center) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-8 h-8 opacity-60">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-0.5 bg-white"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-0.5 bg-white"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-white"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-white"></div>
        </div>
      </div>

      {/* Bottom Bar - Stats & Ammo */}
      <div className="flex justify-between items-end">
        {/* Health / Equipment */}
        <div className="flex gap-4 items-end">
           <div className="flex flex-col gap-1">
              <div className="flex gap-2 mb-1">
                 <div className="w-8 h-8 border border-white/30 bg-black/50 flex items-center justify-center text-xs text-white/70 font-bold font-mono">
                    {playerState.tactical === 'FLASH' ? 'Q' : 'Q'}
                 </div>
                 <div className="w-8 h-8 border border-white/30 bg-black/50 flex items-center justify-center text-xs text-white/70 font-bold font-mono">
                    {playerState.lethal === 'FRAG' ? 'G' : 'G'}
                 </div>
              </div>
              <div className="bg-black/60 backdrop-blur p-3 skew-x-12 border-r-4 border-emerald-500 min-w-[200px]">
                 <div className="-skew-x-12">
                    <div className="flex justify-between items-baseline mb-1">
                       <span className="font-teko text-2xl text-white">OPERATOR</span>
                       <span className="font-mono-tech text-emerald-400">{playerState.health}%</span>
                    </div>
                    <div className="w-full bg-white/20 h-2">
                       <div 
                         className="bg-emerald-500 h-full transition-all duration-300" 
                         style={{ width: `${playerState.health}%` }}
                       ></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Weapon / Ammo */}
        <div className="flex flex-col items-end">
           <div className="bg-black/60 backdrop-blur p-4 border-t-2 border-white/20 rounded-tl-3xl">
              <div className="text-right mb-2">
                 <h2 className="font-teko text-3xl uppercase text-white leading-none">
                    {playerState.primaryWeapon?.name || "UNARMED"}
                 </h2>
                 <p className="font-mono-tech text-xs text-white/50 uppercase tracking-widest">
                    {playerState.primaryWeapon?.type || "N/A"} // SEMI-AUTO
                 </p>
              </div>
              <div className="flex items-baseline justify-end gap-2">
                 <span className="font-teko text-6xl text-white leading-none">{playerState.ammo}</span>
                 <span className="font-teko text-3xl text-white/50">/ {playerState.maxAmmo}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HUD;
