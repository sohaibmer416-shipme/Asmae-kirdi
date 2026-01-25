
export enum ComponentClassification {
  INTERNAL = 'Internal',
  EXTERNAL = 'External'
}

export interface PCComponent {
  id: string;
  name: string;
  classification: ComponentClassification;
  color: string;
  scale: [number, number, number];
  description: string;
  sketchfabId: string; // The ID of the model on Sketchfab
}

export enum GameStage {
  INSPECTING = 'inspecting',
  NAMING = 'naming',
  CLASSIFYING = 'classifying',
  ROLE = 'role',
  NEXT_READY = 'next_ready',
  GAME_OVER = 'game_over'
}

export interface EvaluationResult {
  correct: boolean;
  reason: string;
}
