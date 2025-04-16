import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface Patient {
  id: number;
  name: string;
  date: string;
  age: number;
  gender: "MALE" | "Female";
  placeOfResidence?: string;
}

const PatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const ipcRenderer = (window as any).electronAPI;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const patientList = await ipcRenderer.invoke("get-patients");
        setPatients(patientList);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleDeletePatient = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await ipcRenderer.invoke("delete-patient", id);
        setPatients(patients.filter((patient) => patient.id !== id));
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <Link
          to="/patients/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add New Patient
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search patients..."
          className="w-full p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No patients found. {searchTerm && "Try a different search term or "}
          <Link to="/patients/new" className="text-blue-500 hover:underline">
            add a new patient
          </Link>
          .
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Age</th>
                <th className="py-3 px-4 text-left">Gender</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Registration Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <td className="py-3 px-4">{patient.id}</td>
                  <td className="py-3 px-4 font-medium">{patient.name}</td>
                  <td className="py-3 px-4">{patient.age}</td>
                  <td className="py-3 px-4">{patient.gender}</td>
                  <td className="py-3 px-4">{patient.placeOfResidence || "-"}</td>
                  <td className="py-3 px-4">
                    {format(new Date(patient.date), "MMM dd, yyyy")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/patients/${patient.id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientList; 