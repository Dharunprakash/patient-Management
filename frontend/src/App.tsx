import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";
import PatientDetails from "./components/PatientDetails";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-blue-800 text-white shadow-lg">
          <div className="p-4">
            <h1 className="text-xl font-bold">Patient Management</h1>
          </div>
          <nav className="mt-6">
            <Link
              to="/"
              className="block py-3 px-4 hover:bg-blue-700 transition duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/patients"
              className="block py-3 px-4 hover:bg-blue-700 transition duration-200"
            >
              Patient List
            </Link>
            {/* <Link
              to="/patients/new"
              className="block py-3 px-4 hover:bg-blue-700 transition duration-200"
            >
              Add New Patient
            </Link> */}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patients/new" element={<PatientForm />} />
              <Route path="/patients/:id" element={<PatientDetails />} />
              <Route path="/patients/:id/edit" element={<PatientForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
