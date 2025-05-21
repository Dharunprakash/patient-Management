import React, { useState, useEffect } from 'react';
import { MedicalReport } from '../types';

interface MedicalReportFileUploaderProps {
  diseaseId?: number;
  medicalHistoryId?: number;
  onFileUploaded?: (report: MedicalReport) => void;
  className?: string;
}

const MedicalReportFileUploader: React.FC<MedicalReportFileUploaderProps> = ({
  diseaseId,
  medicalHistoryId,
  onFileUploaded,
  className
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ipcRenderer = (window as any).electronAPI;

  const handleChooseFile = async () => {
    try {
      setIsUploading(true);
      setError(null);

      // Open file dialog
      const filePath = await ipcRenderer.invoke('choose-medical-report-file');
      if (!filePath) {
        setIsUploading(false);
        return; // User canceled
      }

      // Upload the file
      const uploadedReport = await ipcRenderer.invoke('upload-medical-report', {
        filePath,
        diseaseId,
        medicalHistoryId
      });

      if (onFileUploaded) {
        onFileUploaded(uploadedReport);
      }

    } catch (err: any) {
      setError(err.message || 'Error uploading file');
      console.error('Error in file upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`${className || ''}`}>
      <button
        type="button"
        onClick={handleChooseFile}
        disabled={isUploading}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isUploading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="-ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Medical Report (PDF, JPG, PNG)
          </>
        )}
      </button>

      <p className="mt-1 text-xs text-gray-500">
        Supported file types: PDF, JPG, JPEG, PNG
      </p>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
};

export default MedicalReportFileUploader; 