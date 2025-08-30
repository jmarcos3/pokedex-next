export const QUOTES = [
  "{name} parece pronto para batalhas intensas.",
  "{name} brilha quando a estratégia certa entra em campo.",
  "{name} pode surpreender adversários despreparados.",
  "Com um bom time, {name} vira ameaça constante.",
  "{name} tende a se destacar nas mãos de quem conhece seus limites.",
];

export function capitalize(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

export function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function pickDeterministic<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}
