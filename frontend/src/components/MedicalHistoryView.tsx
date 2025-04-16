import React from "react";
import { MedicalHistory } from "../types";

interface MedicalHistoryViewProps {
  medicalHistory: MedicalHistory | null | undefined;
  onEdit: () => void;
}

const MedicalHistoryView = ({ medicalHistory, onEdit }: MedicalHistoryViewProps) => {
  if (!medicalHistory) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Medical History</h2>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Medical History
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          No medical history has been recorded yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Medical History</h2>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Edit Medical History
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {medicalHistory.childhoodIllness && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Childhood Illness</h3>
              <p className="whitespace-pre-line">{medicalHistory.childhoodIllness}</p>
            </div>
          )}

          {medicalHistory.psychiatricIllness && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Psychiatric Illness</h3>
              <p className="whitespace-pre-line">{medicalHistory.psychiatricIllness}</p>
            </div>
          )}

          {medicalHistory.occupationalInfluences && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Occupational Influences</h3>
              <p className="whitespace-pre-line">{medicalHistory.occupationalInfluences}</p>
            </div>
          )}

          {medicalHistory.operationsOrSurgeries && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Operations or Surgeries</h3>
              <p className="whitespace-pre-line">{medicalHistory.operationsOrSurgeries}</p>
            </div>
          )}
        </div>

        <div className="flex items-center py-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${medicalHistory.hereditary ? "bg-blue-500" : "bg-gray-300"
            }`}>
            {medicalHistory.hereditary && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span className="text-sm font-medium">
            {medicalHistory.hereditary ? "Hereditary" : "Not Hereditary"}
          </span>
        </div>

        {medicalHistory.medicalReports && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Medical Reports</h3>
            <p className="whitespace-pre-line">{medicalHistory.medicalReports}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistoryView; 