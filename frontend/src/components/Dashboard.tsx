import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: "MALE" | "Female";
  createdAt: string;
}

// For the pie chart colors
const COLORS = ["#0088FE", "#FF8042"];

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ipcRenderer = (window as any).electronAPI;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const patientList = await ipcRenderer.invoke("get-patients");
        setPatients(patientList);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

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

  // Calculate statistics
  const totalPatients = patients.length;
  const maleCount = patients.filter(p => p.gender === "MALE").length;
  const femaleCount = patients.filter(p => p.gender === "Female").length;

  // Recent patients - last 5 added
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Age distribution data for chart
  const getAgeGroups = () => {
    const ageGroups = [
      { name: '0-18', count: 0 },
      { name: '19-35', count: 0 },
      { name: '36-50', count: 0 },
      { name: '51-65', count: 0 },
      { name: '65+', count: 0 },
    ];

    patients.forEach(patient => {
      const age = patient.age;
      if (age <= 18) ageGroups[0].count++;
      else if (age <= 35) ageGroups[1].count++;
      else if (age <= 50) ageGroups[2].count++;
      else if (age <= 65) ageGroups[3].count++;
      else ageGroups[4].count++;
    });

    return ageGroups;
  };

  // Gender distribution data for pie chart
  const genderData = [
    { name: 'Male', value: maleCount },
    { name: 'Female', value: femaleCount },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-500">Total Patients</h2>
          <p className="text-4xl font-bold mt-2">{totalPatients}</p>
          <Link
            to="/patients"
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm inline-block"
          >
            View all patients →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-500">Male Patients</h2>
          <p className="text-4xl font-bold mt-2">{maleCount}</p>
          <p className="text-sm text-gray-500 mt-2">
            {totalPatients > 0
              ? `${((maleCount / totalPatients) * 100).toFixed(1)}% of total`
              : 'No patients yet'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-500">Female Patients</h2>
          <p className="text-4xl font-bold mt-2">{femaleCount}</p>
          <p className="text-sm text-gray-500 mt-2">
            {totalPatients > 0
              ? `${((femaleCount / totalPatients) * 100).toFixed(1)}% of total`
              : 'No patients yet'}
          </p>
        </div>
      </div>

      {totalPatients === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-4">No patients yet</h2>
          <p className="text-gray-500 mb-6">Start by adding your first patient</p>
          <Link
            to="/patients/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add New Patient
          </Link>
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Distribution Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium mb-6">Age Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getAgeGroups()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gender Distribution Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium mb-6">Gender Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Recently Added Patients</h2>
              <Link
                to="/patients"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View all patients →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentPatients.map(patient => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 