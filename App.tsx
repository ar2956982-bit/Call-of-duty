import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import HUD from './components/HUD';
import LoadoutMenu from './components/LoadoutMenu';
import Terminal from './components/Terminal';
import Button from './components/Button';
import { generateMissionBriefing, resolveCombatAction } from './services/geminiService';
import { PlayerState, Weapon, Mission, GamePhase, CombatLog } from './types';

// Hardcoded Weapons Data
const WEAPONS: Weapon[] = [
  { id: 'm4a1', name: 'M4A1', type: 'ASSAULT', damage: 42, mobility: 60, description: 'Fully automatic all-purpose battle rifle.', image: '' },
  { id: 'mp5', name: 'MP5', type: 'SMG', damage: 30, mobility: 85, description: '9mm submachine gun. High fire rate.', image: '' },
  { id: 'ax50', name: 'AX-50', type: 'SNIPER', damage: 95, mobility: 20, description: 'Hard hitting .50 cal bolt action.', image: '' },
];

const App: React.FC = () => {
  // Game State
  const [phase, setPhase] = useState<GamePhase>(GamePhase.MENU);
  const [mission, setMission] = useState<Mission | null>(null);
  const [logs, setLogs] = useState<CombatLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>({
    health: 100,
    armor: 100,
    ammo: 120,
    maxAmmo: 210,
    primaryWeapon: null,
    secondaryWeapon: null,
    tactical: 'FLASH',
    lethal: 'FRAG'
  });

  // Helper to add logs
  const addLog = (sender: CombatLog['sender'], message: string, type: CombatLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36),
      sender,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type
    }]);
  };

  // Start Game Flow
  const handleStartCampaign = async () => {
    setPhase(GamePhase.LOADOUT);
    addLog('SYSTEM', 'Connecting to secure network...', 'info');
  };

  const handleWeaponSelect = (weapon: Weapon) => {
    setPlayerState(prev => ({ ...prev, primaryWeapon: weapon, ammo: weapon.type === 'SNIPER' ? 30 : 210, maxAmmo: weapon.type === 'SNIPER' ? 30 : 210 }));
    setPhase(GamePhase.BRIEFING);
    initializeMission();
  };

  const initializeMission = async () => {
    setIsProcessing(true);
    addLog('HQ', 'Generating mission parameters. Stand by...', 'info');
    
    // Call Gemini to create a mission
    const newMission = await generateMissionBriefing('REGULAR');
    setMission(newMission);
    
    setIsProcessing(false);
    addLog('HQ', `MISSION ORDER: ${newMission.codename}`, 'success');
    addLog('HQ', `LOC: ${newMission.location} | OBJ: ${newMission.objective}`, 'info');
    addLog('HQ', newMission.description, 'info');
    addLog('SYSTEM', 'Press "EXECUTE" or type "START" to begin insertion.', 'warning');
  };

  const handleCommand = async (cmd: string) => {
    if (phase === GamePhase.BRIEFING) {
      if (cmd.toLowerCase().includes('start') || cmd.toLowerCase().includes('copy')) {
         setPhase(GamePhase.COMBAT);
         addLog('SQUAD', 'Touchdown. We are active. Awaiting orders.', 'success');
         return;
      }
    }

    if (phase === GamePhase.COMBAT && mission) {
      setIsProcessing(true);
      addLog('SQUAD', cmd, 'info');

      // AI Resolution
      // Note: We pass recent logs as history context
      const history = logs.slice(-5).map(l => `${l.sender}: ${l.message}`);
      const result = await resolveCombatAction(cmd, playerState, mission, history);

      // Update State based on AI result
      setPlayerState(prev => ({
        ...prev,
        health: Math.max(0, prev.health - (result.damageTaken || 0)),
        ammo: Math.max(0, prev.ammo - (result.ammoUsed || 0))
      }));

      // Output narration
      addLog('AI_GAMEMASTER', result.narration, result.damageTaken > 0 ? 'warning' : 'info');

      // Check mission status
      if (result.missionStatus === 'COMPLETED') {
         addLog('HQ', 'Objective complete. RTB for debrief.', 'success');
         setPhase(GamePhase.DEBRIEF);
      } else if (result.missionStatus === 'FAILED' || (playerState.health - result.damageTaken) <= 0) {
         addLog('HQ', 'MIA. Mission Failed.', 'critical');
         setPhase(GamePhase.DEBRIEF);
      }

      setIsProcessing(false);
    }
  };

  // Render Logic
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden selection:bg-emerald-500 selection:text-black">
      
      {/* Background Ambience (Static Image or Canvas) */}
      <div className="absolute inset-0 z-0">
        <img 
           src="https://picsum.photos/1920/1080?grayscale&blur=2" 
           alt="Background" 
           className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
      </div>

      {/* Main Menu */}
      {phase === GamePhase.MENU && (
        <div className="absolute inset-0 z-50 flex flex-col justify-center items-start pl-20 bg-black/80">
          <h1 className="font-teko text-9xl text-white uppercase tracking-tighter mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            WEB<span className="text-yellow-500">WARFARE</span>
          </h1>
          <div className="flex flex-col gap-4 w-96">
            <Button onClick={handleStartCampaign}>CAMPAIGN</Button>
            <Button variant="secondary" disabled>MULTIPLAYER (OFFLINE)</Button>
            <Button variant="ghost">OPTIONS</Button>
          </div>
          <p className="fixed bottom-10 right-10 text-white/20 font-mono-tech text-xs">
             VER 1.0.0 // TASK FORCE 141 // ECHO
          </p>
        </div>
      )}

      {/* Loadout Screen */}
      {phase === GamePhase.LOADOUT && (
        <LoadoutMenu weapons={WEAPONS} onSelect={handleWeaponSelect} />
      )}

      {/* Game HUD (Active during Briefing, Combat, Debrief) */}
      {(phase === GamePhase.BRIEFING || phase === GamePhase.COMBAT || phase === GamePhase.DEBRIEF) && mission && (
        <>
           <HUD playerState={playerState} mission={mission} />
           <Terminal logs={logs} isProcessing={isProcessing} onCommand={handleCommand} />
           
           {/* Visual overlay for combat impact */}
           {playerState.health < 30 && (
             <div className="absolute inset-0 border-[50px] border-red-900/50 pointer-events-none animate-pulse z-40 blur-sm mix-blend-overlay"></div>
           )}
        </>
      )}

      {/* Debrief Modal */}
      {phase === GamePhase.DEBRIEF && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur">
            <div className="text-center">
               <h2 className="font-teko text-8xl text-white mb-4">
                  {playerState.health <= 0 ? 'K.I.A.' : 'MISSION OVER'}
               </h2>
               <Button onClick={() => setPhase(GamePhase.MENU)}>RETURN TO BASE</Button>
            </div>
         </div>
      )}

    </div>
  );
};

export default App;
