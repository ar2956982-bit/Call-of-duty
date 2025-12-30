import { GoogleGenAI, Type } from "@google/genai";
import { PlayerState, Mission } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMissionBriefing = async (difficulty: string): Promise<Mission> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Flash is sufficient for simple generation
      contents: `Generate a detailed Call of Duty style mission briefing. Difficulty: ${difficulty}. 
      Return JSON with: codename, location, time (e.g. 0200 HRS), objective, and a gritty description.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            codename: { type: Type.STRING },
            location: { type: Type.STRING },
            time: { type: Type.STRING },
            objective: { type: Type.STRING },
            description: { type: Type.STRING },
          },
        },
      },
    });
    
    const data = JSON.parse(response.text || "{}");
    return {
      id: Math.random().toString(36).substr(2, 9),
      difficulty: difficulty as any,
      ...data
    };
  } catch (error) {
    console.error("Failed to generate mission", error);
    return {
      id: "fallback",
      codename: "OPERATION: SILENT FALLBACK",
      location: "Unknown",
      time: "0000 HRS",
      objective: "Survive",
      description: "Communication with HQ lost. Proceed with caution.",
      difficulty: "REGULAR"
    } as Mission;
  }
};

export const resolveCombatAction = async (
  action: string,
  playerState: PlayerState,
  mission: Mission,
  combatHistory: string[]
): Promise<{ narration: string; damageTaken: number; ammoUsed: number; missionStatus: 'ONGOING' | 'COMPLETED' | 'FAILED' }> => {
  
  // Construct the prompt context
  const context = `
    Role: You are the Game Engine for a high-stakes tactical shooter.
    Context:
    Mission: ${mission.codename} - ${mission.objective}
    Location: ${mission.location}
    Player Status: HP ${playerState.health}%, Armor ${playerState.armor}%, Weapon: ${playerState.primaryWeapon?.name}
    Recent History: ${combatHistory.slice(-3).join(" | ")}
    
    Player Action: "${action}"

    Task:
    1. Analyze the player's tactical decision using advanced reasoning.
    2. Determine the outcome based on realism, weapon type, and difficulty.
    3. Calculate damage taken by player (0-100) and ammo used.
    4. Provide a gritty, intense narration of the result (max 2 sentences).
    5. Decide if the mission is complete, failed, or ongoing.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Use Pro for advanced reasoning/engine simulation
      contents: context,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for complex tactical resolution
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narration: { type: Type.STRING },
            damageTaken: { type: Type.INTEGER },
            ammoUsed: { type: Type.INTEGER },
            missionStatus: { type: Type.STRING, enum: ["ONGOING", "COMPLETED", "FAILED"] }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Combat resolution failed", error);
    return {
      narration: "Smoke clears... tactical readout malfunction. Enemy movement detected.",
      damageTaken: 0,
      ammoUsed: 0,
      missionStatus: 'ONGOING'
    };
  }
};
