-- CreateTable
CREATE TABLE "Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "placeOfResidence" TEXT,
    "referencePerson" TEXT,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "natureOfWork" TEXT,
    "height" REAL,
    "weight" REAL,
    "bmi" REAL,
    "sleepPatterns" TEXT,
    "diet" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "nameOfDisease" TEXT,
    "chiefComplaint" TEXT,
    "timePeriod" TEXT,
    "onsetOfDisease" TEXT,
    "symptoms" TEXT,
    "locationOfPain" TEXT,
    "severity" TEXT,
    "recurrenceTiming" TEXT,
    "aggravatingFactors" TEXT,
    "typeOfDisease" TEXT,
    "anatomicalReference" TEXT,
    "physiologicalReference" TEXT,
    "psychologicalReference" TEXT,
    CONSTRAINT "Disease_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MedicalHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diseaseId" INTEGER NOT NULL,
    "childhoodIllness" TEXT,
    "psychiatricIllness" TEXT,
    "occupationalInfluences" TEXT,
    "operationsOrSurgeries" TEXT,
    "hereditary" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "MedicalHistory_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MedicalReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filePath" TEXT NOT NULL,
    "diseaseId" INTEGER,
    "medicalHistoryId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MedicalReport_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MedicalReport_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "MedicalHistory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Therapy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diseaseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fitnessOrTherapy" TEXT NOT NULL,
    "homeRemedies" TEXT,
    "dietReference" TEXT,
    "lifestyleModifications" TEXT,
    "secondaryTherapy" TEXT,
    "aggravatingPoses" TEXT,
    "relievingPoses" TEXT,
    "flexibilityLevel" TEXT,
    "nerveStiffness" TEXT,
    "muscleStiffness" TEXT,
    "avoidablePoses" TEXT,
    "therapyPoses" TEXT,
    "sideEffects" TEXT,
    "progressiveReport" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Therapy_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TherapyTools" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "therapyId" INTEGER NOT NULL,
    "mantras" TEXT,
    "meditationTypes" TEXT,
    "bandhas" TEXT,
    CONSTRAINT "TherapyTools_therapyId_fkey" FOREIGN KEY ("therapyId") REFERENCES "Therapy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Yoga" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "therapyToolsId" INTEGER NOT NULL,
    "poses" TEXT,
    "repeatingTimingsPerDay" INTEGER,
    CONSTRAINT "Yoga_therapyToolsId_fkey" FOREIGN KEY ("therapyToolsId") REFERENCES "TherapyTools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pranayama" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "therapyToolsId" INTEGER NOT NULL,
    "techniques" TEXT,
    "repeatingTimingsPerDay" INTEGER,
    CONSTRAINT "Pranayama_therapyToolsId_fkey" FOREIGN KEY ("therapyToolsId") REFERENCES "TherapyTools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mudras" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "therapyToolsId" INTEGER NOT NULL,
    "mudraNames" TEXT,
    "repeatingTimingsPerDay" INTEGER,
    CONSTRAINT "Mudras_therapyToolsId_fkey" FOREIGN KEY ("therapyToolsId") REFERENCES "TherapyTools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BreathingExercises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "therapyToolsId" INTEGER NOT NULL,
    "exercises" TEXT,
    "repeatingTimingsPerDay" INTEGER,
    CONSTRAINT "BreathingExercises_therapyToolsId_fkey" FOREIGN KEY ("therapyToolsId") REFERENCES "TherapyTools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicalHistory_diseaseId_key" ON "MedicalHistory"("diseaseId");

-- CreateIndex
CREATE UNIQUE INDEX "TherapyTools_therapyId_key" ON "TherapyTools"("therapyId");

-- CreateIndex
CREATE UNIQUE INDEX "Yoga_therapyToolsId_key" ON "Yoga"("therapyToolsId");

-- CreateIndex
CREATE UNIQUE INDEX "Pranayama_therapyToolsId_key" ON "Pranayama"("therapyToolsId");

-- CreateIndex
CREATE UNIQUE INDEX "Mudras_therapyToolsId_key" ON "Mudras"("therapyToolsId");

-- CreateIndex
CREATE UNIQUE INDEX "BreathingExercises_therapyToolsId_key" ON "BreathingExercises"("therapyToolsId");
