const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create specific directories for medical reports
const medicalReportsDir = path.join(uploadsDir, 'medical-reports');
if (!fs.existsSync(medicalReportsDir)) {
    fs.mkdirSync(medicalReportsDir, { recursive: true });
}

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
    // Extract diseases from data if present
    const { diseases, ...patientData } = data;
    
    // Update only the patient data
    return await prisma.patient.update({
        where: { id: parseInt(id) },
        data: patientData
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
    // Extract medicalReports if it exists (it should be a relation, not a string)
    const { medicalReports, ...diseaseDataClean } = diseaseData;
    
    return await prisma.disease.create({
        data: {
            ...diseaseDataClean,
            patientId: parseInt(diseaseDataClean.patientId)
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
    // Extract medicalReports if it exists (it should be a relation, not a string)
    const { medicalReports, ...updateData } = data;
    
    return await prisma.disease.update({
        where: { id: parseInt(id) },
        data: {
            ...updateData,
            patientId: parseInt(updateData.patientId)
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
    // Extract medicalReports if it exists (it should be a relation, not a string)
    const { medicalReports, ...medicalHistoryDataClean } = medicalHistoryData;
    
    return await prisma.medicalHistory.create({
        data: {
            ...medicalHistoryDataClean,
            diseaseId: parseInt(medicalHistoryDataClean.diseaseId)
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
    // Extract medicalReports if it exists (it should be a relation, not a string)
    const { medicalReports, ...updateData } = data;
    
    return await prisma.medicalHistory.update({
        where: { id: parseInt(id) },
        data: {
            ...updateData,
            diseaseId: parseInt(updateData.diseaseId)
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
    // Extract fields that should not be directly included in the update
    const { id: therapyId, therapyTools, createdAt, updatedAt, ...updateData } = data;
    
    return await prisma.therapy.update({
        where: { id: parseInt(id) },
        data: {
            ...updateData,
            diseaseId: parseInt(updateData.diseaseId)
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
    // Extract nested objects that need to be created separately
    const { yoga, pranayama, mudras, breathingExercises, ...therapyToolsData } = data;
    
    // Create the therapy tools first
    const createdTherapyTools = await prisma.therapyTools.create({
        data: {
            therapyId: parseInt(therapyToolsData.therapyId),
            mantras: therapyToolsData.mantras,
            meditationTypes: therapyToolsData.meditationTypes,
            bandhas: therapyToolsData.bandhas
        }
    });
    
    // Now we have the therapyTools ID, we can create the nested related records
    let createdYoga = null;
    let createdPranayama = null;
    let createdMudras = null;
    let createdBreathingExercises = null;
    
    // Create yoga if provided
    if (yoga && (yoga.poses || yoga.repeatingTimingsPerDay)) {
        createdYoga = await prisma.yoga.create({
            data: {
                therapyToolsId: createdTherapyTools.id,
                poses: yoga.poses || "",
                repeatingTimingsPerDay: yoga.repeatingTimingsPerDay ? parseInt(yoga.repeatingTimingsPerDay) : null
            }
        });
    }
    
    // Create pranayama if provided
    if (pranayama && (pranayama.techniques || pranayama.repeatingTimingsPerDay)) {
        createdPranayama = await prisma.pranayama.create({
            data: {
                therapyToolsId: createdTherapyTools.id,
                techniques: pranayama.techniques || "",
                repeatingTimingsPerDay: pranayama.repeatingTimingsPerDay ? parseInt(pranayama.repeatingTimingsPerDay) : null
            }
        });
    }
    
    // Create mudras if provided
    if (mudras && (mudras.mudraNames || mudras.repeatingTimingsPerDay)) {
        createdMudras = await prisma.mudras.create({
            data: {
                therapyToolsId: createdTherapyTools.id,
                mudraNames: mudras.mudraNames || "",
                repeatingTimingsPerDay: mudras.repeatingTimingsPerDay ? parseInt(mudras.repeatingTimingsPerDay) : null
            }
        });
    }
    
    // Create breathing exercises if provided
    if (breathingExercises && (breathingExercises.exercises || breathingExercises.repeatingTimingsPerDay)) {
        createdBreathingExercises = await prisma.breathingExercises.create({
            data: {
                therapyToolsId: createdTherapyTools.id,
                exercises: breathingExercises.exercises || "",
                repeatingTimingsPerDay: breathingExercises.repeatingTimingsPerDay ? parseInt(breathingExercises.repeatingTimingsPerDay) : null
            }
        });
    }
    
    // Return the therapy tools with all the created nested objects
    return {
        ...createdTherapyTools,
        yoga: createdYoga,
        pranayama: createdPranayama,
        mudras: createdMudras,
        breathingExercises: createdBreathingExercises
    };
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
    // Extract nested objects and fields that shouldn't be in the update
    const { 
        id: toolId, 
        yoga, 
        pranayama, 
        mudras, 
        breathingExercises,
        therapyId,
        ...updateData 
    } = data;
    
    // Update the main therapy tools record
    const updatedTherapyTools = await prisma.therapyTools.update({
        where: { id: parseInt(id) },
        data: updateData
    });
    
    // Now update or create the nested related records
    let updatedYoga = null;
    let updatedPranayama = null;
    let updatedMudras = null;
    let updatedBreathingExercises = null;
    
    // Handle yoga
    if (yoga) {
        if (yoga.id) {
            // Update existing yoga
            updatedYoga = await prisma.yoga.update({
                where: { id: parseInt(yoga.id) },
                data: {
                    poses: yoga.poses,
                    repeatingTimingsPerDay: yoga.repeatingTimingsPerDay ? parseInt(yoga.repeatingTimingsPerDay) : null
                }
            });
        } else if (yoga.poses || yoga.repeatingTimingsPerDay) {
            // Create new yoga
            updatedYoga = await prisma.yoga.create({
                data: {
                    therapyToolsId: updatedTherapyTools.id,
                    poses: yoga.poses || "",
                    repeatingTimingsPerDay: yoga.repeatingTimingsPerDay ? parseInt(yoga.repeatingTimingsPerDay) : null
                }
            });
        }
    }
    
    // Handle pranayama
    if (pranayama) {
        if (pranayama.id) {
            // Update existing pranayama
            updatedPranayama = await prisma.pranayama.update({
                where: { id: parseInt(pranayama.id) },
                data: {
                    techniques: pranayama.techniques,
                    repeatingTimingsPerDay: pranayama.repeatingTimingsPerDay ? parseInt(pranayama.repeatingTimingsPerDay) : null
                }
            });
        } else if (pranayama.techniques || pranayama.repeatingTimingsPerDay) {
            // Create new pranayama
            updatedPranayama = await prisma.pranayama.create({
                data: {
                    therapyToolsId: updatedTherapyTools.id,
                    techniques: pranayama.techniques || "",
                    repeatingTimingsPerDay: pranayama.repeatingTimingsPerDay ? parseInt(pranayama.repeatingTimingsPerDay) : null
                }
            });
        }
    }
    
    // Handle mudras
    if (mudras) {
        if (mudras.id) {
            // Update existing mudras
            updatedMudras = await prisma.mudras.update({
                where: { id: parseInt(mudras.id) },
                data: {
                    mudraNames: mudras.mudraNames,
                    repeatingTimingsPerDay: mudras.repeatingTimingsPerDay ? parseInt(mudras.repeatingTimingsPerDay) : null
                }
            });
        } else if (mudras.mudraNames || mudras.repeatingTimingsPerDay) {
            // Create new mudras
            updatedMudras = await prisma.mudras.create({
                data: {
                    therapyToolsId: updatedTherapyTools.id,
                    mudraNames: mudras.mudraNames || "",
                    repeatingTimingsPerDay: mudras.repeatingTimingsPerDay ? parseInt(mudras.repeatingTimingsPerDay) : null
                }
            });
        }
    }
    
    // Handle breathing exercises
    if (breathingExercises) {
        if (breathingExercises.id) {
            // Update existing breathing exercises
            updatedBreathingExercises = await prisma.breathingExercises.update({
                where: { id: parseInt(breathingExercises.id) },
                data: {
                    exercises: breathingExercises.exercises,
                    repeatingTimingsPerDay: breathingExercises.repeatingTimingsPerDay ? parseInt(breathingExercises.repeatingTimingsPerDay) : null
                }
            });
        } else if (breathingExercises.exercises || breathingExercises.repeatingTimingsPerDay) {
            // Create new breathing exercises
            updatedBreathingExercises = await prisma.breathingExercises.create({
                data: {
                    therapyToolsId: updatedTherapyTools.id,
                    exercises: breathingExercises.exercises || "",
                    repeatingTimingsPerDay: breathingExercises.repeatingTimingsPerDay ? parseInt(breathingExercises.repeatingTimingsPerDay) : null
                }
            });
        }
    }
    
    // Return the updated therapy tools with all the updated nested objects
    return {
        ...updatedTherapyTools,
        yoga: updatedYoga,
        pranayama: updatedPranayama,
        mudras: updatedMudras,
        breathingExercises: updatedBreathingExercises
    };
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

// Medical Report IPC Handlers

// Open file dialog and choose a file to upload
ipcMain.handle("choose-medical-report-file", async () => {
    try {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Documents', extensions: ['pdf'] },
                { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] }
            ]
        });
        
        if (canceled || filePaths.length === 0) {
            return null;
        }
        
        return filePaths[0];
    } catch (error) {
        console.error('Error choosing file:', error);
        throw error;
    }
});

// Upload/copy file to app directory and save reference in DB
ipcMain.handle("upload-medical-report", async (_, { filePath, diseaseId, medicalHistoryId }) => {
    try {
        // Generate a unique filename
        const fileExt = path.extname(filePath);
        const fileName = `medical-report-${Date.now()}${fileExt}`;
        const destPath = path.join(medicalReportsDir, fileName);
        
        // Copy the file to our app's storage
        fs.copyFileSync(filePath, destPath);
        
        // Create record in the database
        const reportRecord = await prisma.medicalReport.create({
            data: {
                filePath: destPath,
                diseaseId: diseaseId ? parseInt(diseaseId) : null,
                medicalHistoryId: medicalHistoryId ? parseInt(medicalHistoryId) : null
            }
        });
        
        return reportRecord;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
});

// Get all medical reports for a disease
ipcMain.handle("get-medical-reports-by-disease", async (_, diseaseId) => {
    return await prisma.medicalReport.findMany({
        where: {
            diseaseId: parseInt(diseaseId)
        }
    });
});

// Get all medical reports for a medical history
ipcMain.handle("get-medical-reports-by-medical-history", async (_, medicalHistoryId) => {
    return await prisma.medicalReport.findMany({
        where: {
            medicalHistoryId: parseInt(medicalHistoryId)
        }
    });
});

// Open a medical report file
ipcMain.handle("open-medical-report", async (_, filePath) => {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }
        
        // Return file data as base64 string
        const fileData = fs.readFileSync(filePath);
        return {
            data: fileData.toString('base64'),
            fileType: path.extname(filePath).toLowerCase(),
            fileName: path.basename(filePath)
        };
    } catch (error) {
        console.error('Error opening file:', error);
        throw error;
    }
});

// Delete a medical report
ipcMain.handle("delete-medical-report", async (_, id) => {
    try {
        // Get the report first to find the file path
        const report = await prisma.medicalReport.findUnique({
            where: { id: parseInt(id) }
        });
        
        if (!report) {
            throw new Error('Report not found');
        }
        
        // Delete the physical file if it exists
        if (fs.existsSync(report.filePath)) {
            fs.unlinkSync(report.filePath);
        }
        
        // Delete the database record
        return await prisma.medicalReport.delete({
            where: { id: parseInt(id) }
        });
    } catch (error) {
        console.error('Error deleting report:', error);
        throw error;
    }
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