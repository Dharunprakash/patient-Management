import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MedicalHistory, MedicalReport } from "../types";
import MedicalReportFileUploader from "./MedicalReportFileUploader";
import MedicalReportFileViewer from "./MedicalReportFileViewer";

interface MedicalHistoryFormProps {
  initialValues?: MedicalHistory | null;
  diseaseId: number;
  onSave: (medicalHistory: MedicalHistory) => Promise<void>;
  onCancel: () => void;
}

const MedicalHistoryForm = ({ initialValues, diseaseId, onSave, onCancel }: MedicalHistoryFormProps) => {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadedReports, setUploadedReports] = useState<MedicalReport[]>([]);
  const [historyId, setHistoryId] = useState<number | undefined>(initialValues?.id);

  const emptyMedicalHistory: MedicalHistory = {
    childhoodIllness: "",
    psychiatricIllness: "",
    occupationalInfluences: "",
    operationsOrSurgeries: "",
    hereditary: false,
    medicalReports: "",
    diseaseId,
  };

  const validationSchema = Yup.object({
    childhoodIllness: Yup.string(),
    psychiatricIllness: Yup.string(),
    occupationalInfluences: Yup.string(),
    operationsOrSurgeries: Yup.string(),
    hereditary: Yup.boolean(),
    medicalReports: Yup.string(),
  });

  useEffect(() => {
    // Fetch the uploaded reports if we have a history ID
    if (initialValues?.id) {
      setHistoryId(initialValues.id);
    }
  }, [initialValues]);

  const handleFileUploaded = (report: MedicalReport) => {
    setUploadedReports(prev => [...prev, report]);
  };

  const formik = useFormik({
    initialValues: initialValues || emptyMedicalHistory,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSaving(true);
        setError("");

        // Remove medicalReports if it exists in values to prevent prisma error
        const { medicalReports, ...medicalHistoryValues } = values;

        await onSave({
          ...medicalHistoryValues,
          id: initialValues?.id,
          diseaseId,
        });
      } catch (err: any) {
        setError(`Error saving medical history: ${err.message}`);
        console.error("Error in save:", err);
      } finally {
        setSaving(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {initialValues?.id ? "Edit Medical History" : "Add Medical History"}
      </h2>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <label htmlFor="childhoodIllness" className="block text-sm font-medium text-gray-700 mb-1">
            Childhood Illness
          </label>
          <textarea
            id="childhoodIllness"
            name="childhoodIllness"
            rows={3}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.childhoodIllness}
          />
          {formik.touched.childhoodIllness && formik.errors.childhoodIllness ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.childhoodIllness}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="psychiatricIllness" className="block text-sm font-medium text-gray-700 mb-1">
            Psychiatric Illness
          </label>
          <textarea
            id="psychiatricIllness"
            name="psychiatricIllness"
            rows={3}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.psychiatricIllness}
          />
          {formik.touched.psychiatricIllness && formik.errors.psychiatricIllness ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.psychiatricIllness}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="occupationalInfluences" className="block text-sm font-medium text-gray-700 mb-1">
            Occupational Influences
          </label>
          <textarea
            id="occupationalInfluences"
            name="occupationalInfluences"
            rows={3}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.occupationalInfluences}
          />
          {formik.touched.occupationalInfluences && formik.errors.occupationalInfluences ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.occupationalInfluences}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="operationsOrSurgeries" className="block text-sm font-medium text-gray-700 mb-1">
            Operations or Surgeries
          </label>
          <textarea
            id="operationsOrSurgeries"
            name="operationsOrSurgeries"
            rows={3}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.operationsOrSurgeries}
          />
          {formik.touched.operationsOrSurgeries && formik.errors.operationsOrSurgeries ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.operationsOrSurgeries}</div>
          ) : null}
        </div>

        <div className="flex items-center">
          <input
            id="hereditary"
            name="hereditary"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            onChange={formik.handleChange}
            checked={formik.values.hereditary}
          />
          <label htmlFor="hereditary" className="ml-2 block text-sm text-gray-900">
            Hereditary
          </label>
        </div>

        <div>
          <label htmlFor="medicalReports" className="block text-sm font-medium text-gray-700 mb-1">
            Medical Reports Notes
          </label>
          <textarea
            id="medicalReports"
            name="medicalReports"
            rows={3}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.medicalReports}
          />
          {formik.touched.medicalReports && formik.errors.medicalReports ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.medicalReports}</div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Medical Report Files</h3>
            {historyId ? (
              <MedicalReportFileViewer medicalHistoryId={historyId} className="mb-3" />
            ) : (
              <p className="text-sm text-gray-500 mb-3">
                Save this form to enable file uploads
              </p>
            )}

            {historyId && (
              <MedicalReportFileUploader
                medicalHistoryId={historyId}
                onFileUploaded={handleFileUploaded}
              />
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {saving ? "Saving..." : initialValues?.id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MedicalHistoryForm; 