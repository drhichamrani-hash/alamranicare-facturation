export const AMI_VALUE = 25;
export const SEUIL_KM = 6.6;
export const FORFAIT = 20;
export const TARIF_KM = 3;
export const MAJORATION = 25;

export type MajorationType = "NONE" | "NUIT" | "DIMANCHE" | "FERIE";

export function calcDeplacement(km: number): number {
  if (!km || km <= 0) return 0;
  if (km <= SEUIL_KM) return FORFAIT;
  return km * TARIF_KM; // >6.6 => 3 MAD/km on full distance
}

export function calcMajoration(t: MajorationType): number {
  return t === "NONE" ? 0 : MAJORATION;
}
