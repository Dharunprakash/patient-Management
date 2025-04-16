const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.setMenu(null);
    win.setResizable(false);
    win.webContents.openDevTools();
    const mode = process.env.NODE_ENV;
    const startURL = mode === 'development' ? "http://localhost:5173/" : `file://${path.join(__dirname, 'app/dist/index.html')}`;
    win.loadURL(startURL);
}

// Patient IPC Handlers

// Get all patients
ipcMain.handle("get-patients", async () => {
    return await prisma.patient.findMany();
});

// Create a new patient
ipcMain.handle("create-patient", async (_, patientData) => {
    return await prisma.patient.create({
        data: patientData
    });
});

// Get a patient by ID
ipcMain.handle("get-patient", async (_, id) => {
    return await prisma.patient.findUnique({
        where: { id: parseInt(id) },
        include: { diseases: true }
    });
});

// Update a patient
ipcMain.handle("update-patient", async (_, { id, data }) => {
    return await prisma.patient.update({
        where: { id: parseInt(id) },
        data
    });
});

// Delete a patient
ipcMain.handle("delete-patient", async (_, id) => {
    // First delete related diseases
    await prisma.disease.deleteMany({
        where: { patientId: parseInt(id) }
    });
    
    return await prisma.patient.delete({
        where: { id: parseInt(id) }
    });
});

// Disease IPC Handlers

// Get all diseases by patient ID
ipcMain.handle("get-diseases-by-patient", async (_, patientId) => {
    return await prisma.disease.findMany({
        where: { patientId: parseInt(patientId) }
    });
});

// Create a new disease
ipcMain.handle("create-disease", async (_, diseaseData) => {
    return await prisma.disease.create({
        data: {
            ...diseaseData,
            patientId: parseInt(diseaseData.patientId)
        }
    });
});

// Get a disease by ID
ipcMain.handle("get-disease", async (_, id) => {
    return await prisma.disease.findUnique({
        where: { id: parseInt(id) },
        include: { 
            medicalHistory: true,
            therapies: {
                include: {
                    therapyTools: {
                        include: {
                            yoga: true,
                            pranayama: true,
                            mudras: true,
                            breathingExercises: true
                        }
                    }
                }
            }
        }
    });
});

// Update a disease
ipcMain.handle("update-disease", async (_, { id, data }) => {
    return await prisma.disease.update({
        where: { id: parseInt(id) },
        data: {
            ...data,
            patientId: parseInt(data.patientId)
        }
    });
});

// Delete a disease
ipcMain.handle("delete-disease", async (_, id) => {
    // First delete related medical history
    await prisma.medicalHistory.deleteMany({
        where: { diseaseId: parseInt(id) }
    });
    
    return await prisma.disease.delete({
        where: { id: parseInt(id) }
    });
});

// Medical History IPC Handlers

// Create a new medical history
ipcMain.handle("create-medical-history", async (_, medicalHistoryData) => {
    return await prisma.medicalHistory.create({
        data: {
            ...medicalHistoryData,
            diseaseId: parseInt(medicalHistoryData.diseaseId)
        }
    });
});

// Get a medical history by ID
ipcMain.handle("get-medical-history", async (_, id) => {
    return await prisma.medicalHistory.findUnique({
        where: { id: parseInt(id) }
    });
});

// Update a medical history
ipcMain.handle("update-medical-history", async (_, { id, data }) => {
    return await prisma.medicalHistory.update({
        where: { id: parseInt(id) },
        data: {
            ...data,
            diseaseId: parseInt(data.diseaseId)
        }
    });
});

// Delete a medical history
ipcMain.handle("delete-medical-history", async (_, id) => {
    return await prisma.medicalHistory.delete({
        where: { id: parseInt(id) }
    });
});

// Therapy IPC Handlers

// Get all therapies by disease ID
ipcMain.handle("get-therapies-by-disease", async (_, diseaseId) => {
    return await prisma.therapy.findMany({
        where: { diseaseId: parseInt(diseaseId) }
    });
});

// Create a new therapy
ipcMain.handle("create-therapy", async (_, therapyData) => {
    return await prisma.therapy.create({
        data: {
            ...therapyData,
            diseaseId: parseInt(therapyData.diseaseId)
        }
    });
});

// Get a therapy by ID
ipcMain.handle("get-therapy", async (_, id) => {
    return await prisma.therapy.findUnique({
        where: { id: parseInt(id) },
        include: {
            therapyTools: {
                include: {
                    yoga: true,
                    pranayama: true,
                    mudras: true,
                    breathingExercises: true
                }
            }
        }
    });
});

// Update a therapy
ipcMain.handle("update-therapy", async (_, { id, data }) => {
    return await prisma.therapy.update({
        where: { id: parseInt(id) },
        data: {
            ...data,
            diseaseId: parseInt(data.diseaseId)
        }
    });
});

// Delete a therapy
ipcMain.handle("delete-therapy", async (_, id) => {
    return await prisma.therapy.delete({
        where: { id: parseInt(id) }
    });
});

// TherapyTools IPC handlers

// Create therapy tools
ipcMain.handle("create-therapy-tools", async (_, data) => {
    return await prisma.therapyTools.create({
        data: {
            therapyId: parseInt(data.therapyId),
            mantras: data.mantras,
            meditationTypes: data.meditationTypes,
            bandhas: data.bandhas
        },
        include: {
            yoga: true,
            pranayama: true,
            mudras: true,
            breathingExercises: true
        }
    });
});

// Get therapy tools by ID
ipcMain.handle("get-therapy-tools", async (_, id) => {
    return await prisma.therapyTools.findUnique({
        where: { id: parseInt(id) },
        include: {
            yoga: true,
            pranayama: true,
            mudras: true,
            breathingExercises: true
        }
    });
});

// Get therapy tools by therapy ID
ipcMain.handle("get-therapy-tools-by-therapy", async (_, therapyId) => {
    return await prisma.therapyTools.findUnique({
        where: { therapyId: parseInt(therapyId) },
        include: {
            yoga: true,
            pranayama: true,
            mudras: true,
            breathingExercises: true
        }
    });
});

// Update therapy tools
ipcMain.handle("update-therapy-tools", async (_, { id, data }) => {
    return await prisma.therapyTools.update({
        where: { id: parseInt(id) },
        data: {
            mantras: data.mantras,
            meditationTypes: data.meditationTypes,
            bandhas: data.bandhas
        },
        include: {
            yoga: true,
            pranayama: true,
            mudras: true,
            breathingExercises: true
        }
    });
});

// Delete therapy tools
ipcMain.handle("delete-therapy-tools", async (_, id) => {
    return await prisma.therapyTools.delete({
        where: { id: parseInt(id) }
    });
});

// Yoga IPC handlers

// Create yoga
ipcMain.handle("create-yoga", async (_, data) => {
    return await prisma.yoga.create({
        data: {
            therapyToolsId: parseInt(data.therapyToolsId),
            poses: data.poses,
            repeatingTimingsPerDay: data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
        }
    });
});

// Update yoga
ipcMain.handle("update-yoga", async (_, { id, data }) => {
    return await prisma.yoga.update({
        where: { id: parseInt(id) },
        data: {
            poses: data.poses,
            repeatingTimingsPerDay: data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
        }
    });
});

// Pranayama IPC handlers

// Create pranayama
ipcMain.handle("create-pranayama", async (_, data) => {
    return await prisma.pranayama.create({
        data: {
            therapyToolsId: parseInt(data.therapyToolsId),
            techniques: data.techniques,
            repeatingTimingsPerDay: data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
        }
    });
});

// Update pranayama
ipcMain.handle("update-pranayama", async (_, { id, data }) => {
    return await prisma.pranayama.update({
        where: { id: parseInt(id) },
        data: {
            techniques: data.techniques,
            repeatingTimingsPerDay: data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
        }
    });
});

// Mudras IPC handlers

// Create mudras
ipcMain.handle("create-mudras", async (_, data) => {
    return await prisma.mudras.create({
        data: {
            therapyToolsId: parseInt(data.therapyToolsId),
            mudraNames: data.mudraNames,
            repeatingTimingsPerDay: data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
        }
    });
});

// Update mudras
ipcMain.handle("update-mudras", async (_, { id, data }) => {
    return await prisma.mudras.update({
        where: { id: parseInt(id) },
        data: {
            mudraNames: data.mudraNames,
            repeatingTimingsPerDay: data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
        }
    });
});

// Breathing Exercises IPC handlers

// Create breathing exercises
ipcMain.handle("create-breathing-exercises", async (_, data) => {
    return await prisma.breathingExercises.create({
        data: {
            therapyToolsId: parseInt(data.therapyToolsId),
            exercises: data.exercises,
            repeatingTimingsPerDay: data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
        }
    });
});

// Update breathing exercises
ipcMain.handle("update-breathing-exercises", async (_, { id, data }) => {
    return await prisma.breathingExercises.update({
        where: { id: parseInt(id) },
        data: {
            exercises: data.exercises,
            repeatingTimingsPerDay: data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
        }
    });
});

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});