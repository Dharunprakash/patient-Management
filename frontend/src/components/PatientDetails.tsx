import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import DiseaseList from "./DiseaseList";
import { Patient } from "../types";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "diseases">("details");
  const ipcRenderer = (window as any).electronAPI;

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          setLoading(true);
          const fetchedPatient = await ipcRenderer.invoke("get-patient", id);
          setPatient(fetchedPatient);
        } catch (error) {
          console.error("Error fetching patient:", error);
          setError("Failed to load patient data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatient();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await ipcRenderer.invoke("delete-patient", id);
        navigate("/patients");
      } catch (error) {
        console.error("Error deleting patient:", error);
        setError("Failed to delete patient");
      }
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

  if (!patient) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700">Patient not found</h2>
        <Link to="/patients" className="mt-4 text-blue-500 hover:underline">
          Back to Patient List
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-6 bg-blue-700 text-white">
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <div className="flex space-x-3">
          <Link
            to={`/patients/${id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            className={`px-6 py-4 text-sm font-medium ${activeTab === "details"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("details")}
          >
            Patient Details
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium ${activeTab === "diseases"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("diseases")}
          >
            Diseases & Conditions
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "details" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium border-b pb-2 mb-3">Basic Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p className="font-medium">{patient.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registration Date</p>
                    <p className="font-medium">
                      {format(new Date(patient.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{patient.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Place of Residence</p>
                    <p className="font-medium">{patient.placeOfResidence || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reference Person</p>
                    <p className="font-medium">{patient.referencePerson || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nature of Work</p>
                    <p className="font-medium">{patient.natureOfWork || "-"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium border-b pb-2 mb-3">Physical Information</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-medium">
                      {patient.height ? `${patient.height} cm` : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">
                      {patient.weight ? `${patient.weight} kg` : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">BMI</p>
                    <p className="font-medium">{patient.bmi || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium border-b pb-2 mb-3">Lifestyle</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Sleep Patterns</p>
                    <p className="font-medium whitespace-pre-line">
                      {patient.sleepPatterns || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Diet</p>
                    <p className="font-medium whitespace-pre-line">
                      {patient.diet || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium border-b pb-2 mb-3">Record Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">
                      {format(new Date(patient.createdAt), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {format(new Date(patient.updatedAt), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DiseaseList patientId={parseInt(id!)} />
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t">
        <Link
          to="/patients"
          className="text-blue-600 hover:underline flex items-center"
        >
          ← Back to Patient List
        </Link>
      </div>
    </div>
  );
};

export default PatientDetails; 