import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MedicalHistory } from "../types";

interface MedicalHistoryFormProps {
  initialValues?: MedicalHistory | null;
  diseaseId: number;
  onSave: (medicalHistory: MedicalHistory) => Promise<void>;
  onCancel: () => void;
}

const MedicalHistoryForm = ({ initialValues, diseaseId, onSave, onCancel }: MedicalHistoryFormProps) => {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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

  const formik = useFormik({
    initialValues: initialValues || emptyMedicalHistory,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSaving(true);
        setError("");
        await onSave({
          ...values,
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          {initialValues ? "Edit Medical History" : "Add Medical History"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Record important medical history related to this disease
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            Medical Reports
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
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Medical History"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalHistoryForm; 