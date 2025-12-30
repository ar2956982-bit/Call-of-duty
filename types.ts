export enum GamePhase {
  MENU = 'MENU',
  LOADOUT = 'LOADOUT',
  BRIEFING = 'BRIEFING',
  COMBAT = 'COMBAT',
  DEBRIEF = 'DEBRIEF'
}

export interface Weapon {
  id: string;
  name: string;
  type: 'ASSAULT' | 'SMG' | 'SNIPER' | 'SHOTGUN' | 'LMG';
  damage: number;
  mobility: number;
  description: string;
  image: string; // Placeholder URL
}

export interface PlayerState {
  health: number;
  armor: number;
  ammo: number;
  maxAmmo: number;
  primaryWeapon: Weapon | null;
  secondaryWeapon: Weapon | null;
  tactical: 'FLASH' | 'STUN' | 'SMOKE' | 'SPOTTER';
  lethal: 'FRAG' | 'SEMTEX' | 'C4' | 'CLAYMORE';
}

export interface Mission {
  id: string;
  codename: string;
  location: string;
  time: string;
  objective: string;
  difficulty: 'RECRUIT' | 'REGULAR' | 'HARDENED' | 'VETERAN';
  description: string;
}

export interface CombatLog {
  id: string;
  sender: 'HQ' | 'SQUAD' | 'SYSTEM' | 'ENEMY' | 'AI_GAMEMASTER';
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'critical' | 'success';
}
