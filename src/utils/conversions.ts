// Conversion utilities for kitchen measurements

export const volumeConversions: Record<string, number> = {
  'tsp': 1,
  'tbsp': 3,
  'fl oz': 6,
  'cup': 48,
  'pint': 96,
  'quart': 192,
  'gallon': 768,
  'ml': 0.202884,
  'liter': 202.884,
};

export const weightConversions: Record<string, number> = {
  'oz': 1,
  'lb': 16,
  'g': 0.035274,
  'kg': 35.274,
};

export const temperatureConvert = (value: number, from: string, to: string): number => {
  let celsius = 0;
  if (from === 'F') celsius = (value - 32) * 5 / 9;
  else if (from === 'C') celsius = value;
  else celsius = value - 273.15;
  
  if (to === 'F') return celsius * 9 / 5 + 32;
  if (to === 'C') return celsius;
  return celsius + 273.15;
};

export const convert = (value: number, from: string, to: string, type: string): number => {
  if (type === 'temperature') return temperatureConvert(value, from, to);
  
  const conversions = type === 'volume' ? volumeConversions : weightConversions;
  const baseValue = value * conversions[from];
  return baseValue / conversions[to];
};
