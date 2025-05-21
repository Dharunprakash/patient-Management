import React, { useState, useEffect } from 'react';
import { MedicalReport } from '../types';
import path from 'path-browserify';

interface MedicalReportFileViewerProps {
  diseaseId?: number;
  medicalHistoryId?: number;
  className?: string;
}

const MedicalReportFileViewer: React.FC<MedicalReportFileViewerProps> = ({
  diseaseId,
  medicalHistoryId,
  className
}) => {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<{
    data: string;
    fileType: string;
    fileName: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const ipcRenderer = (window as any).electronAPI;

  useEffect(() => {
    fetchReports();
  }, [diseaseId, medicalHistoryId]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      let reportData: MedicalReport[] = [];

      if (diseaseId) {
        reportData = await ipcRenderer.invoke('get-medical-reports-by-disease', diseaseId);
      } else if (medicalHistoryId) {
        reportData = await ipcRenderer.invoke('get-medical-reports-by-medical-history', medicalHistoryId);
      }

      setReports(reportData);
    } catch (err: any) {
      setError(err.message || 'Error loading medical reports');
      console.error('Error fetching medical reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async (report: MedicalReport) => {
    try {
      const fileData = await ipcRenderer.invoke('open-medical-report', report.filePath);
      setSelectedReport(fileData);
      setShowPreview(true);
    } catch (err: any) {
      setError(err.message || 'Error loading file');
      console.error('Error opening file:', err);
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await ipcRenderer.invoke('delete-medical-report', reportId);
      // Refresh the list
      fetchReports();
    } catch (err: any) {
      setError(err.message || 'Error deleting report');
      console.error('Error deleting report:', err);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedReport(null);
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading medical reports...</div>;
  }

  return (
    <div className={`${className || ''}`}>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      {reports.length === 0 ? (
        <div className="text-sm text-gray-500">No medical reports uploaded yet.</div>
      ) : (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Medical Reports</h4>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
            {reports.map((report) => (
              <li key={report.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm">{report.fileName || path.basename(report.filePath)}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewReport(report)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id!)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* File Preview Modal */}
      {showPreview && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full h-[90vh] max-h-[90vh] flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">{selectedReport.fileName}</h3>
              <button onClick={closePreview} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-grow p-4 overflow-auto">
              {selectedReport.fileType.match(/\.(pdf)$/i) ? (
                <iframe
                  src={`data:application/pdf;base64,${selectedReport.data}`}
                  className="w-full h-full min-h-[75vh]"
                  title={selectedReport.fileName}
                />
              ) : (
                <img
                  src={`data:image/${selectedReport.fileType.replace('.', '')};base64,${selectedReport.data}`}
                  alt={selectedReport.fileName}
                  className="max-w-full max-h-[75vh] mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalReportFileViewer; 