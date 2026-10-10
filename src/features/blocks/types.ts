import { KiboVariant } from "@/components/kibo/KiboAvatar";
import { BlockType } from "@/data/challenges";

export interface BlockItem {
  id: string; // Unique id for React key in workspace list
  type: BlockType;
}

export type StepExecutionStatus = "idle" | "running" | "step_done" | "error" | "completed";

export interface SimulationStep {
  stepIndex: number;
  blockType: BlockType;
  kiboPosition: number;
  lampActive: boolean;
  status: "success" | "failure";
  message: string;
  kiboMood: KiboVariant;
}

export interface SimulationResult {
  success: boolean;
  finalPosition: number;
  lampActive: boolean;
  steps: SimulationStep[];
  feedbackMessage: string;
  kiboMood: KiboVariant;
  starsEarned: number;
}
