export const arrayColor: any = {
  slate: ['#cbd5e1', '#1e293b'],
  red: ['#fecaca', '#991b1b'],
  green: ['#bbf7d0', '#166534'],
  blue: ['#bfdbfe', '#1e40af'],
  indigo: ['#c7d2fe', '#3730a3'],
  purple: ['#e9d5ff', '#6b21a8'],
  pink: ['#fbcfe8', '#9d174d'],
  yellow: ['#fef08a', '#854d0e'],
  orange: ['#fed7aa', '#9a3412'],
  amber: ['#fde68a', '#92400e'],
  lime: ['#d9f99d', '#3f6212'],
  emerald: ['#a7f3d0', '#065f46'],
  teal: ['#99f6e4', '#115e59'],
  cyan: ['#a5f3fc', '#155e75'],
  sky: ['#bae6fd', '#075985'],
  violet: ['#ddd6fe', '#5b21b6'],
  fuchsia: ['#f5d0fe', '#86198f'],
  rose: ['#fecdd3', '#9f1239'],
};

export function getRandomColorToDB() {
  const keys = Object.keys(arrayColor);
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

export function getDarkenColorClass(color: string) {
  return arrayColor[color][1];
}

export function getLightenColorClass(color: string) {
  return arrayColor[color][0];
}
