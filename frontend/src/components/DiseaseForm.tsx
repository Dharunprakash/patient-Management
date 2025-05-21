import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Disease, MedicalReport } from "../types";
import MedicalReportFileUploader from "./MedicalReportFileUploader";
import MedicalReportFileViewer from "./MedicalReportFileViewer";

interface DiseaseFormProps {
  initialValues?: Disease;
  patientId: number;
  onSave: (values: Disease) => Promise<void>;
  onCancel: () => void;
}

const emptyDisease: Disease = {
  patientId: 0,
  nameOfDisease: "",
  chiefComplaint: "",
  timePeriod: "",
  onsetOfDisease: "",
  symptoms: "",
  locationOfPain: "",
  severity: "",
  recurrenceTiming: "",
  aggravatingFactors: "",
  typeOfDisease: "",
  anatomicalReference: "",
  physiologicalReference: "",
  psychologicalReference: "",
};

const validationSchema = Yup.object({
  nameOfDisease: Yup.string().required("Disease name is required"),
  chiefComplaint: Yup.string().required("Chief complaint is required"),
});

const DiseaseForm = ({ initialValues, patientId, onSave, onCancel }: DiseaseFormProps) => {
  const [error, setError] = useState("");
  const [diseaseId, setDiseaseId] = useState<number | undefined>(initialValues?.id);
  const [uploadedReports, setUploadedReports] = useState<MedicalReport[]>([]);
  const isEditing = !!initialValues?.id;

  const defaultValues: Disease = initialValues
    ? { ...initialValues }
    : { ...emptyDisease, patientId };

  useEffect(() => {
    if (initialValues?.id) {
      setDiseaseId(initialValues.id);
    }
  }, [initialValues]);

  const handleFileUploaded = (report: MedicalReport) => {
    setUploadedReports(prev => [...prev, report]);
  };

  const handleSubmit = async (values: Disease) => {
    try {
      // Remove medicalReports if it exists in values to prevent prisma error
      const { medicalReports, ...diseaseValues } = values;

      // Save the disease
      await onSave(diseaseValues);
    } catch (err) {
      console.error("Error saving disease:", err);
      setError("Failed to save disease information");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? "Edit Disease" : "Add New Disease"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Formik
        initialValues={defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nameOfDisease" className="block text-sm font-medium text-gray-700 mb-1">
                  Disease Name *
                </label>
                <Field
                  type="text"
                  name="nameOfDisease"
                  id="nameOfDisease"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage name="nameOfDisease" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="typeOfDisease" className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Disease
                </label>
                <Field
                  type="text"
                  name="typeOfDisease"
                  id="typeOfDisease"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="chiefComplaint" className="block text-sm font-medium text-gray-700 mb-1">
                  Chief Complaint *
                </label>
                <Field
                  as="textarea"
                  name="chiefComplaint"
                  id="chiefComplaint"
                  rows="3"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage name="chiefComplaint" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period
                </label>
                <Field
                  type="text"
                  name="timePeriod"
                  id="timePeriod"
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., 2 weeks, 3 months"
                />
              </div>

              <div>
                <label htmlFor="onsetOfDisease" className="block text-sm font-medium text-gray-700 mb-1">
                  Onset of Disease
                </label>
                <Field
                  type="text"
                  name="onsetOfDisease"
                  id="onsetOfDisease"
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., Sudden, Gradual"
                />
              </div>

              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <Field
                  as="select"
                  name="severity"
                  id="severity"
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Severity</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Very Severe">Very Severe</option>
                </Field>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium mb-3">Symptoms and Effects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                    Symptoms
                  </label>
                  <Field
                    as="textarea"
                    name="symptoms"
                    id="symptoms"
                    rows="3"
                    className="w-full p-2 border rounded-md"
                    placeholder="Separate multiple symptoms with commas"
                  />
                </div>

                <div>
                  <label htmlFor="locationOfPain" className="block text-sm font-medium text-gray-700 mb-1">
                    Location of Pain
                  </label>
                  <Field
                    type="text"
                    name="locationOfPain"
                    id="locationOfPain"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="recurrenceTiming" className="block text-sm font-medium text-gray-700 mb-1">
                    Recurrence Timing
                  </label>
                  <Field
                    type="text"
                    name="recurrenceTiming"
                    id="recurrenceTiming"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Daily, Weekly, Monthly"
                  />
                </div>

                <div>
                  <label htmlFor="aggravatingFactors" className="block text-sm font-medium text-gray-700 mb-1">
                    Aggravating Factors
                  </label>
                  <Field
                    as="textarea"
                    name="aggravatingFactors"
                    id="aggravatingFactors"
                    rows="3"
                    className="w-full p-2 border rounded-md"
                    placeholder="Separate multiple factors with commas"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium mb-3">References</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="anatomicalReference" className="block text-sm font-medium text-gray-700 mb-1">
                    Anatomical Reference
                  </label>
                  <Field
                    type="text"
                    name="anatomicalReference"
                    id="anatomicalReference"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="physiologicalReference" className="block text-sm font-medium text-gray-700 mb-1">
                    Physiological Reference
                  </label>
                  <Field
                    type="text"
                    name="physiologicalReference"
                    id="physiologicalReference"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="psychologicalReference" className="block text-sm font-medium text-gray-700 mb-1">
                    Psychological Reference
                  </label>
                  <Field
                    type="text"
                    name="psychologicalReference"
                    id="psychologicalReference"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium mb-3">Medical Reports</h3>
              {diseaseId ? (
                <div className="space-y-4">
                  <MedicalReportFileViewer diseaseId={diseaseId} className="mb-3" />
                  <MedicalReportFileUploader
                    diseaseId={diseaseId}
                    onFileUploaded={handleFileUploaded}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Save this form first to enable medical report uploads.
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {isSubmitting ? "Saving..." : isEditing ? "Update Disease" : "Add Disease"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DiseaseForm; 