import { useState, useEffect } from "react";
import { Disease, MedicalHistory, Therapy, TherapyTools } from "../types";
import MedicalHistoryView from "./MedicalHistoryView";
import MedicalHistoryForm from "./MedicalHistoryForm";
import TherapyView from "./TherapyView";
import TherapyForm from "./TherapyForm";
import TherapyToolsForm from "./TherapyToolsForm";

interface DiseaseDetailsProps {
  id: number;
  onBack: () => void;
  onEdit: (disease: Disease) => void;
}

type ViewState = "details" | "medical-history-form" | "therapy-form" | "therapy-view" | "therapy-tools-form";

const DiseaseDetails = ({ id, onBack, onEdit }: DiseaseDetailsProps) => {
  const [disease, setDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewState, setViewState] = useState<ViewState>("details");
  const [selectedTherapy, setSelectedTherapy] = useState<Therapy | null>(null);
  const ipcRenderer = (window as any).electronAPI;

  useEffect(() => {
    const fetchDisease = async () => {
      try {
        setLoading(true);
        const fetchedDisease = await ipcRenderer.invoke("get-disease", id);
        setDisease(fetchedDisease);
      } catch (err) {
        console.error("Error fetching disease:", err);
        setError("Failed to load disease data");
      } finally {
        setLoading(false);
      }
    };

    fetchDisease();
  }, [id]);

  const handleEdit = () => {
    onEdit(disease!);
  };

  const handleSaveMedicalHistory = async (medicalHistory: MedicalHistory) => {
    try {
      let savedMedicalHistory;

      if (medicalHistory.id) {
        savedMedicalHistory = await ipcRenderer.invoke("update-medical-history", {
          id: medicalHistory.id,
          data: medicalHistory
        });
      } else {
        savedMedicalHistory = await ipcRenderer.invoke("create-medical-history", medicalHistory);
      }

      // Update the local disease state with the new medical history
      setDisease(prev => prev ? {
        ...prev,
        medicalHistory: savedMedicalHistory
      } : null);

      setViewState("details");
    } catch (err) {
      console.error("Error saving medical history:", err);
      throw err;
    }
  };

  const handleSaveTherapy = async (therapy: Therapy) => {
    try {
      let savedTherapy;

      if (therapy.id) {
        savedTherapy = await ipcRenderer.invoke("update-therapy", {
          id: therapy.id,
          data: therapy
        });
      } else {
        savedTherapy = await ipcRenderer.invoke("create-therapy", therapy);
      }

      // Update the local disease state with the new therapy
      setDisease(prev => {
        if (!prev) return null;

        // Check if we're updating an existing therapy or adding a new one
        if (therapy.id) {
          // Update existing therapy
          const updatedTherapies = prev.therapies ?
            prev.therapies.map(t => t.id === therapy.id ? savedTherapy : t) :
            [savedTherapy];
          return {
            ...prev,
            therapies: updatedTherapies
          };
        } else {
          // Add new therapy
          return {
            ...prev,
            therapies: prev.therapies ? [...prev.therapies, savedTherapy] : [savedTherapy]
          };
        }
      });

      setSelectedTherapy(null);
      setViewState("details");
    } catch (err) {
      console.error("Error saving therapy:", err);
      throw err;
    }
  };

  const handleSaveTherapyTools = async (therapyTools: TherapyTools) => {
    try {
      let savedTherapyTools;

      if (therapyTools.id) {
        savedTherapyTools = await ipcRenderer.invoke("update-therapy-tools", {
          id: therapyTools.id,
          data: therapyTools
        });
      } else {
        savedTherapyTools = await ipcRenderer.invoke("create-therapy-tools", therapyTools);
      }

      // Update the yoga, pranayama, mudras, and breathing exercises if they exist
      if (savedTherapyTools.yoga) {
        if (savedTherapyTools.yoga.id) {
          await ipcRenderer.invoke("update-yoga", {
            id: savedTherapyTools.yoga.id,
            data: {
              ...therapyTools.yoga,
              therapyToolsId: savedTherapyTools.id
            }
          });
        } else if (therapyTools.yoga) {
          await ipcRenderer.invoke("create-yoga", {
            ...therapyTools.yoga,
            therapyToolsId: savedTherapyTools.id
          });
        }
      }

      if (savedTherapyTools.pranayama) {
        if (savedTherapyTools.pranayama.id) {
          await ipcRenderer.invoke("update-pranayama", {
            id: savedTherapyTools.pranayama.id,
            data: {
              ...therapyTools.pranayama,
              therapyToolsId: savedTherapyTools.id
            }
          });
        } else if (therapyTools.pranayama) {
          await ipcRenderer.invoke("create-pranayama", {
            ...therapyTools.pranayama,
            therapyToolsId: savedTherapyTools.id
          });
        }
      }

      if (savedTherapyTools.mudras) {
        if (savedTherapyTools.mudras.id) {
          await ipcRenderer.invoke("update-mudras", {
            id: savedTherapyTools.mudras.id,
            data: {
              ...therapyTools.mudras,
              therapyToolsId: savedTherapyTools.id
            }
          });
        } else if (therapyTools.mudras) {
          await ipcRenderer.invoke("create-mudras", {
            ...therapyTools.mudras,
            therapyToolsId: savedTherapyTools.id
          });
        }
      }

      if (savedTherapyTools.breathingExercises) {
        if (savedTherapyTools.breathingExercises.id) {
          await ipcRenderer.invoke("update-breathing-exercises", {
            id: savedTherapyTools.breathingExercises.id,
            data: {
              ...therapyTools.breathingExercises,
              therapyToolsId: savedTherapyTools.id
            }
          });
        } else if (therapyTools.breathingExercises) {
          await ipcRenderer.invoke("create-breathing-exercises", {
            ...therapyTools.breathingExercises,
            therapyToolsId: savedTherapyTools.id
          });
        }
      }

      // Update local state
      setDisease(prev => {
        if (!prev) return null;

        // Find the therapy we're updating tools for
        const updatedTherapies = prev.therapies?.map(t => {
          if (t.id === therapyTools.therapyId) {
            return {
              ...t,
              therapyTools: savedTherapyTools
            };
          }
          return t;
        });

        return {
          ...prev,
          therapies: updatedTherapies
        };
      });

      setViewState("therapy-view");
    } catch (err) {
      console.error("Error saving therapy tools:", err);
      throw err;
    }
  };

  const handleEditMedicalHistory = () => {
    setViewState("medical-history-form");
  };

  const handleAddTherapy = () => {
    setSelectedTherapy(null);
    setViewState("therapy-form");
  };

  const handleEditTherapy = (therapy: Therapy) => {
    setSelectedTherapy(therapy);
    setViewState("therapy-form");
  };

  const handleViewTherapy = (therapy: Therapy) => {
    setSelectedTherapy(therapy);
    setViewState("therapy-view");
  };

  const handleCancelMedicalHistory = () => {
    setViewState("details");
  };

  const handleCancelTherapy = () => {
    setSelectedTherapy(null);
    setViewState("details");
  };

  const handleEditFromTherapyView = () => {
    setViewState("therapy-form");
  };

  const handleDeleteTherapy = async (therapyId: number) => {
    try {
      await ipcRenderer.invoke("delete-therapy", therapyId);

      // Update local state
      setDisease(prev => {
        if (!prev || !prev.therapies) return prev;
        return {
          ...prev,
          therapies: prev.therapies.filter(t => t.id !== therapyId)
        };
      });
    } catch (err) {
      console.error("Error deleting therapy:", err);
      setError("Failed to delete therapy");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        Disease not found. It may have been deleted.
      </div>
    );
  }

  if (viewState === "medical-history-form") {
    return (
      <MedicalHistoryForm
        initialValues={disease.medicalHistory}
        diseaseId={disease.id!}
        onSave={handleSaveMedicalHistory}
        onCancel={handleCancelMedicalHistory}
      />
    );
  }

  if (viewState === "therapy-form") {
    return (
      <TherapyForm
        initialValues={selectedTherapy}
        diseaseId={disease.id!}
        onSave={handleSaveTherapy}
        onCancel={handleCancelTherapy}
      />
    );
  }

  if (viewState === "therapy-view") {
    return (
      <div>
        <TherapyView
          therapy={selectedTherapy}
          onEdit={handleEditFromTherapyView}
          onSaveTherapyTools={handleSaveTherapyTools}
        />
        <div className="mt-4">
          <button
            onClick={() => setViewState("details")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Back to Disease
          </button>
        </div>
      </div>
    );
  }

  // Helper function to format list items from comma-separated strings
  const formatList = (text?: string) => {
    if (!text) return null;
    return (
      <ul className="list-disc pl-5">
        {text.split(",").map((item, index) => (
          <li key={index} className="mb-1">
            {item.trim()}
          </li>
        ))}
      </ul>
    );
  };

  // Group fields into sections for better organization
  const sections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Disease Name", value: disease.nameOfDisease },
        { label: "Type of Disease", value: disease.typeOfDisease },
        { label: "Chief Complaint", value: disease.chiefComplaint },
        { label: "Time Period", value: disease.timePeriod },
        { label: "Onset of Disease", value: disease.onsetOfDisease },
        { label: "Severity", value: disease.severity },
      ],
    },
    {
      title: "Symptoms and Effects",
      fields: [
        {
          label: "Symptoms",
          value: disease.symptoms,
          format: formatList
        },
        { label: "Location of Pain", value: disease.locationOfPain },
        { label: "Recurrence Timing", value: disease.recurrenceTiming },
        {
          label: "Aggravating Factors",
          value: disease.aggravatingFactors,
          format: formatList
        },
      ],
    },
    {
      title: "References",
      fields: [
        { label: "Anatomical Reference", value: disease.anatomicalReference },
        { label: "Physiological Reference", value: disease.physiologicalReference },
        { label: "Psychological Reference", value: disease.psychologicalReference },
      ],
    },
    {
      title: "Additional Information",
      fields: [
        { label: "Medical Reports", value: disease.medicalReports },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {disease.nameOfDisease || "Unnamed Disease"}
          </h2>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Edit
          </button>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-medium border-b pb-2 mb-4">{section.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) =>
                  field.value ? (
                    <div key={field.label}>
                      <h4 className="text-sm font-medium text-gray-500">{field.label}</h4>
                      <div className="mt-1">
                        {field.format ? field.format(field.value) : <p>{field.value}</p>}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical History Section */}
      <MedicalHistoryView
        medicalHistory={disease.medicalHistory}
        onEdit={handleEditMedicalHistory}
      />

      {/* Therapies Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Therapies</h2>
          <button
            onClick={handleAddTherapy}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Therapy
          </button>
        </div>

        {(!disease.therapies || disease.therapies.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            No therapies have been recorded yet.
          </div>
        ) : (
          <div className="space-y-6">
            {disease.therapies.map((therapy) => (
              <div key={therapy.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{therapy.name} <span className="text-gray-500 text-sm">({therapy.fitnessOrTherapy})</span></h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTherapy(therapy)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTherapy(therapy.id!)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {therapy.homeRemedies && (
                    <div>
                      <span className="font-medium text-gray-500">Home Remedies:</span> {therapy.homeRemedies}
                    </div>
                  )}
                  {therapy.dietReference && (
                    <div>
                      <span className="font-medium text-gray-500">Diet:</span> {therapy.dietReference}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleViewTherapy(therapy)}
                  className="mt-2 text-blue-600 text-sm hover:underline"
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default DiseaseDetails; 