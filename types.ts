
export interface GroundingSource {
  uri: string;
  title: string;
}

export interface WeatherLayers {
  airQuality?: string;
  uvIndex?: string;
  wind?: string;
  rainChance?: string;
}

export interface StoryResponse {
  content: string;
  sources: GroundingSource[];
  weatherDescription?: string; // Extracted weather context if possible
  forecast?: string; // Extracted forecast context
  layers?: WeatherLayers; // Detailed weather layers
}

export enum Genre {
  SIMPLE = 'Simple Story',
  FANTASY = 'Fantasy',
  SCI_FI = 'Sci-Fi',
  MYSTERY = 'Mystery',
  ROMANCE = 'Romance',
  HORROR = 'Horror',
  ADVENTURE = 'Adventure',
  POETRY = 'Poetry',
  NOIR = 'Noir'
}

export enum Mood {
  COZY = 'Cozy',
  OMINOUS = 'Ominous',
  MELANCHOLIC = 'Melancholic',
  ENERGETIC = 'Energetic',
  WHIMSICAL = 'Whimsical',
  REFLECTIVE = 'Reflective'
}

export interface StoryRequest {
  location: string;
  genre: Genre;
  mood: Mood;
}
