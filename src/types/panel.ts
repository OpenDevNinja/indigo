// src/types/panel.ts
export enum PanelType {
    TWELVE_M2 = '12m²',
    BIG_SIZE = 'Big Size',
    SMALL = 'Petits Panneaux',
    KILOMETER_MARKER = 'Bornes Kilométriques'
  }
  
  export enum PanelCharacter {
    SINGLE_FACE = 'Simple Face',
    DOUBLE_FACE = 'Double Face',
    TRIPLE_FACE = 'Triple Face'
  }
  
  export interface Panel {
    id: string
    type: PanelType
    isStatic: boolean
    location: {
      commune: string
      gpsCoordinates: {
        latitude: number
        longitude: number
      }
    }
    surface: number
    character: PanelCharacter
    direction: string
    format: string
  }
  