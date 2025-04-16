import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Patient } from "../types";

type PatientFormData = Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'diseases'>;

const initialValues: PatientFormData = {
  name: "",
  date: new Date().toISOString(),
  age: 0,
  gender: "MALE",
  placeOfResidence: "",
  referencePerson: "",
  natureOfWork: "",
  height: undefined,
  weight: undefined,
  bmi: undefined,
  sleepPatterns: "",
  diet: "",
};

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientFormData>(initialValues);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");
  const isEditing = !!id;
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

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    age: Yup.number()
      .required("Age is required")
      .positive("Age must be positive")
      .integer("Age must be a whole number"),
    gender: Yup.string().required("Gender is required"),
    height: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? undefined : value))
      .positive("Height must be positive"),
    weight: Yup.number()
      .nullable()
      .transform((value) => (isNaN(value) ? undefined : value))
      .positive("Weight must be positive"),
  });

  const calculateBMI = (values: PatientFormData) => {
    const { height, weight } = values;
    if (height && weight) {
      // BMI = weight(kg) / (height(m))²
      const heightInMeters = height / 100; // Convert cm to meters
      const bmi = weight / (heightInMeters * heightInMeters);
      return parseFloat(bmi.toFixed(2));
    }
    return undefined;
  };

  const handleSubmit = async (values: PatientFormData) => {
    try {
      // Calculate BMI if height and weight are provided
      if (values.height && values.weight) {
        values.bmi = calculateBMI(values);
      }

      if (isEditing) {
        await ipcRenderer.invoke("update-patient", {
          id: parseInt(id!),
          data: values,
        });
      } else {
        await ipcRenderer.invoke("create-patient", values);
      }
      navigate("/patients");
    } catch (error) {
      console.error("Error saving patient:", error);
      setError("Failed to save patient data");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing ? "Edit Patient" : "Add New Patient"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Formik
        initialValues={isEditing ? patient : initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name *
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <Field
                  type="number"
                  name="age"
                  id="age"
                  min="0"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage name="age" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <Field
                  as="select"
                  name="gender"
                  id="gender"
                  className="w-full p-2 border rounded-md"
                >
                  <option value="MALE">Male</option>
                  <option value="Female">Female</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="placeOfResidence" className="block text-sm font-medium text-gray-700 mb-1">
                  Place of Residence
                </label>
                <Field
                  type="text"
                  name="placeOfResidence"
                  id="placeOfResidence"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="referencePerson" className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Person
                </label>
                <Field
                  type="text"
                  name="referencePerson"
                  id="referencePerson"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="natureOfWork" className="block text-sm font-medium text-gray-700 mb-1">
                  Nature of Work
                </label>
                <Field
                  type="text"
                  name="natureOfWork"
                  id="natureOfWork"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-medium mb-4">Physical Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <Field
                    type="number"
                    name="height"
                    id="height"
                    step="0.01"
                    className="w-full p-2 border rounded-md"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = parseFloat(e.target.value);
                      setFieldValue("height", isNaN(value) ? "" : value);

                      // Update BMI if both height and weight are available
                      if (values.weight && !isNaN(value)) {
                        const height = value / 100; // convert to meters
                        const bmi = values.weight / (height * height);
                        setFieldValue("bmi", parseFloat(bmi.toFixed(2)));
                      } else {
                        setFieldValue("bmi", undefined);
                      }
                    }}
                  />
                  <ErrorMessage name="height" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <Field
                    type="number"
                    name="weight"
                    id="weight"
                    step="0.01"
                    className="w-full p-2 border rounded-md"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = parseFloat(e.target.value);
                      setFieldValue("weight", isNaN(value) ? "" : value);

                      // Update BMI if both height and weight are available
                      if (values.height && !isNaN(value)) {
                        const height = values.height / 100; // convert to meters
                        const bmi = value / (height * height);
                        setFieldValue("bmi", parseFloat(bmi.toFixed(2)));
                      } else {
                        setFieldValue("bmi", undefined);
                      }
                    }}
                  />
                  <ErrorMessage name="weight" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-1">
                    BMI
                  </label>
                  <Field
                    type="number"
                    name="bmi"
                    id="bmi"
                    disabled
                    className="w-full p-2 border rounded-md bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-medium mb-4">Lifestyle</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sleepPatterns" className="block text-sm font-medium text-gray-700 mb-1">
                    Sleep Patterns
                  </label>
                  <Field
                    as="textarea"
                    name="sleepPatterns"
                    id="sleepPatterns"
                    rows="3"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="diet" className="block text-sm font-medium text-gray-700 mb-1">
                    Diet
                  </label>
                  <Field
                    as="textarea"
                    name="diet"
                    id="diet"
                    rows="3"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/patients")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {isEditing ? "Update Patient" : "Save Patient"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PatientForm; 