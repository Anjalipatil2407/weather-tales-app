
import { GoogleGenAI } from "@google/genai";
import { StoryRequest, StoryResponse, GroundingSource, Genre, WeatherLayers } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWeatherStory = async (request: StoryRequest): Promise<StoryResponse> => {
  const { location, genre, mood } = request;

  let styleInstruction = "";
  if (genre === Genre.SIMPLE) {
    styleInstruction = "Use simple vocabulary, short sentences, and make it easy to understand (max 200 words).";
  }

  const prompt = `
    I need you to do three things:
    1. Find the current real-time weather conditions in ${location} right now. specifically looking for:
       - Air Quality (AQI)
       - UV Index
       - Wind Speed & Direction
       - Chance of Rain/Precipitation
    2. Find the weather forecast for the next 3 days in ${location}.
    3. Write a creative short story (approximately 250-300 words) in the ${genre} genre that is heavily inspired by those specific weather conditions.
    
    The story should evoke a ${mood} mood. 
    ${styleInstruction}
    Incorporate the weather elements (rain, sun, snow, wind, temperature, etc.) directly into the narrative's setting or plot.
    
    Structure the response exactly as follows at the very beginning (keep descriptions brief, max 5-7 words for layers):
    Weather Context: [Brief summary of current weather]
    Forecast: [Brief summary of the 3-day forecast]
    Layer - Air Quality: [Value/Status]
    Layer - UV Index: [Value/Status]
    Layer - Wind: [Speed & Direction]
    Layer - Rain Chance: [Percentage/Probability]
    
    [Then provide the story content below]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType and responseSchema are NOT allowed with googleSearch
      },
    });

    const text = response.text || "No story generated.";
    
    // Extract grounding chunks for sources
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.web) {
          sources.push({
            uri: chunk.web.uri || '#',
            title: chunk.web.title || 'Source',
          });
        }
      });
    }

    // Deduplicate sources based on URI
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(v2 => (v2.uri === v.uri)) === i);

    // Parse specific sections
    const lines = text.split('\n');
    let weatherDescription = '';
    let forecast = '';
    const layers: WeatherLayers = {};
    
    // Simple parsing logic
    lines.forEach(line => {
      const lowerLine = line.trim().toLowerCase();
      if (lowerLine.startsWith('weather context:')) {
        weatherDescription = line.replace(/weather context:/i, '').trim();
      } else if (lowerLine.startsWith('forecast:')) {
        forecast = line.replace(/forecast:/i, '').trim();
      } else if (lowerLine.startsWith('layer - air quality:')) {
        layers.airQuality = line.replace(/layer - air quality:/i, '').trim();
      } else if (lowerLine.startsWith('layer - uv index:')) {
        layers.uvIndex = line.replace(/layer - uv index:/i, '').trim();
      } else if (lowerLine.startsWith('layer - wind:')) {
        layers.wind = line.replace(/layer - wind:/i, '').trim();
      } else if (lowerLine.startsWith('layer - rain chance:')) {
        layers.rainChance = line.replace(/layer - rain chance:/i, '').trim();
      }
    });

    // Remove the metadata lines to get clean story content
    const cleanContent = lines.filter(line => {
      const lowerLine = line.trim().toLowerCase();
      return !lowerLine.startsWith('weather context:') && 
             !lowerLine.startsWith('forecast:') &&
             !lowerLine.startsWith('layer -');
    }).join('\n').trim();

    return {
      content: cleanContent,
      sources: uniqueSources,
      weatherDescription,
      forecast,
      layers
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to weave the story. Please try again.");
  }
};
