import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DiseaseForm from "./DiseaseForm";
import DiseaseDetails from "./DiseaseDetails";
import { Disease } from "../types";

interface DiseaseListProps {
  patientId: number;
}

type ViewState = "list" | "form" | "details";

const DiseaseList = ({ patientId }: DiseaseListProps) => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewState, setViewState] = useState<ViewState>("list");
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number | null>(null);
  const ipcRenderer = (window as any).electronAPI;

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setLoading(true);
        const diseasesList = await ipcRenderer.invoke("get-diseases-by-patient", patientId);
        setDiseases(diseasesList);
      } catch (err) {
        console.error("Error fetching diseases:", err);
        setError("Failed to load diseases");
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, [patientId]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this disease record?")) {
      try {
        await ipcRenderer.invoke("delete-disease", id);
        setDiseases(diseases.filter(disease => disease.id !== id));
      } catch (err) {
        console.error("Error deleting disease:", err);
        setError("Failed to delete disease");
      }
    }
  };

  const handleSaveDisease = async (disease: Disease) => {
    try {
      let savedDisease: Disease;
      if (disease.id) {
        savedDisease = await ipcRenderer.invoke("update-disease", {
          id: disease.id,
          data: disease
        });
        setDiseases(diseases.map(d => d.id === disease.id ? savedDisease : d));
      } else {
        savedDisease = await ipcRenderer.invoke("create-disease", disease);
        setDiseases([...diseases, savedDisease]);
      }
      setViewState("list");
      setEditingDisease(null);
    } catch (err) {
      console.error("Error saving disease:", err);
      throw err; // Let the form component handle the error
    }
  };

  const handleEdit = (disease: Disease) => {
    setEditingDisease(disease);
    setViewState("form");
  };

  const handleAddNew = () => {
    setEditingDisease(null);
    setViewState("form");
  };

  const handleCancel = () => {
    setViewState("list");
    setEditingDisease(null);
  };

  const handleViewDetails = (id: number | undefined) => {
    if (id) {
      setSelectedDiseaseId(id);
      setViewState("details");
    }
  };

  const handleBackToList = () => {
    setViewState("list");
    setSelectedDiseaseId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (viewState === "form") {
    return (
      <DiseaseForm
        initialValues={editingDisease || undefined}
        patientId={patientId}
        onSave={handleSaveDisease}
        onCancel={handleCancel}
      />
    );
  }

  if (viewState === "details" && selectedDiseaseId !== null) {
    return (
      <DiseaseDetails
        id={selectedDiseaseId}
        onBack={handleBackToList}
        onEdit={(disease) => handleEdit(disease)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Diseases & Conditions</h2>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add New Disease
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {diseases.length === 0 ? (
        <div className="bg-gray-50 p-6 text-center rounded-md border border-gray-200">
          <p className="text-gray-500">No diseases or conditions recorded yet.</p>
          <button
            onClick={handleAddNew}
            className="mt-3 text-blue-600 hover:underline"
          >
            Add the first one
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {diseases.map((disease) => (
            <div
              key={disease.id}
              className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{disease.nameOfDisease || "Unnamed Disease"}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(disease)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => disease.id && handleDelete(disease.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {disease.typeOfDisease && (
                <div className="mt-1 text-sm text-gray-600">
                  Type: {disease.typeOfDisease}
                </div>
              )}

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Chief Complaint</h4>
                  <p className="mt-1">{disease.chiefComplaint || "-"}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Time Period</h4>
                  <p className="mt-1">{disease.timePeriod || "-"}</p>
                </div>

                {disease.severity && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Severity</h4>
                    <p className="mt-1">{disease.severity}</p>
                  </div>
                )}

                {disease.onsetOfDisease && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Onset</h4>
                    <p className="mt-1">{disease.onsetOfDisease}</p>
                  </div>
                )}
              </div>

              <button
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                onClick={() => handleViewDetails(disease.id)}
              >
                View complete details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiseaseList; 