export interface Patient {
  id: number;
  name: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  age: number;
  gender: "MALE" | "Female";
  placeOfResidence?: string;
  referencePerson?: string;
  natureOfWork?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  sleepPatterns?: string;
  diet?: string;
  diseases?: Disease[];
}

export interface Disease {
  id?: number;
  patientId: number;
  nameOfDisease?: string;
  chiefComplaint?: string;
  timePeriod?: string;
  onsetOfDisease?: string;
  symptoms?: string;
  locationOfPain?: string;
  severity?: string;
  recurrenceTiming?: string;
  aggravatingFactors?: string;
  medicalReports?: string;
  typeOfDisease?: string;
  anatomicalReference?: string;
  physiologicalReference?: string;
  psychologicalReference?: string;
  medicalHistory?: MedicalHistory;
  therapies?: Therapy[];
}

export interface MedicalHistory {
  id?: number;
  diseaseId: number;
  childhoodIllness?: string;
  psychiatricIllness?: string;
  occupationalInfluences?: string;
  operationsOrSurgeries?: string;
  hereditary: boolean;
  medicalReports?: string;
  medicalReportFiles?: MedicalReport[];
}

export interface MedicalReport {
  id?: number;
  filePath: string;
  diseaseId?: number | null;
  medicalHistoryId?: number | null;
  createdAt?: string;
  fileName?: string;
  fileType?: string;
}

export interface Therapy {
  id?: number;
  diseaseId: number;
  name: string;
  fitnessOrTherapy: string;
  homeRemedies?: string;
  dietReference?: string;
  lifestyleModifications?: string;
  secondaryTherapy?: string;
  aggravatingPoses?: string;
  relievingPoses?: string;
  flexibilityLevel?: string;
  nerveStiffness?: string;
  muscleStiffness?: string;
  avoidablePoses?: string;
  therapyPoses?: string;
  sideEffects?: string;
  progressiveReport?: string;
  therapyTools?: TherapyTools;
}

export interface TherapyTools {
  id?: number;
  therapyId: number;
  yoga?: Yoga;
  pranayama?: Pranayama;
  mudras?: Mudras;
  mantras?: string;
  meditationTypes?: string;
  bandhas?: string;
  breathingExercises?: BreathingExercises;
}

export interface Yoga {
  id?: number;
  therapyToolsId: number;
  poses?: string;
  repeatingTimingsPerDay?: number;
}

export interface Pranayama {
  id?: number;
  therapyToolsId: number;
  techniques?: string;
  repeatingTimingsPerDay?: number;
}

export interface Mudras {
  id?: number;
  therapyToolsId: number;
  mudraNames?: string;
  repeatingTimingsPerDay?: number;
}

export interface BreathingExercises {
  id?: number;
  therapyToolsId: number;
  exercises?: string;
  repeatingTimingsPerDay?: number;
} 