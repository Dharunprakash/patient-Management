import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Therapy } from "../types";

interface TherapyFormProps {
  initialValues?: Therapy | null;
  diseaseId: number;
  onSave: (therapy: Therapy) => Promise<void>;
  onCancel: () => void;
}

const TherapyForm = ({ initialValues, diseaseId, onSave, onCancel }: TherapyFormProps) => {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const emptyTherapy: Therapy = {
    diseaseId,
    name: "",
    fitnessOrTherapy: "",
    homeRemedies: "",
    dietReference: "",
    lifestyleModifications: "",
    secondaryTherapy: "",
    aggravatingPoses: "",
    relievingPoses: "",
    flexibilityLevel: "",
    nerveStiffness: "",
    muscleStiffness: "",
    avoidablePoses: "",
    therapyPoses: "",
    sideEffects: "",
    progressiveReport: ""
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Therapy name is required"),
    fitnessOrTherapy: Yup.string().required("Fitness or therapy type is required")
  });

  const formik = useFormik({
    initialValues: initialValues || emptyTherapy,
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
        setError(`Error saving therapy: ${err.message}`);
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
          {initialValues ? "Edit Therapy" : "Add Therapy"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Record therapy details for this disease
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Therapy Name*
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="fitnessOrTherapy" className="block text-sm font-medium text-gray-700 mb-1">
              Fitness or Therapy Type*
            </label>
            <input
              id="fitnessOrTherapy"
              name="fitnessOrTherapy"
              type="text"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fitnessOrTherapy}
            />
            {formik.touched.fitnessOrTherapy && formik.errors.fitnessOrTherapy ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.fitnessOrTherapy}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="homeRemedies" className="block text-sm font-medium text-gray-700 mb-1">
              Home Remedies
            </label>
            <textarea
              id="homeRemedies"
              name="homeRemedies"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.homeRemedies}
            />
          </div>

          <div>
            <label htmlFor="dietReference" className="block text-sm font-medium text-gray-700 mb-1">
              Diet Reference
            </label>
            <textarea
              id="dietReference"
              name="dietReference"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dietReference}
            />
          </div>

          <div>
            <label htmlFor="lifestyleModifications" className="block text-sm font-medium text-gray-700 mb-1">
              Lifestyle Modifications
            </label>
            <textarea
              id="lifestyleModifications"
              name="lifestyleModifications"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lifestyleModifications}
            />
          </div>

          <div>
            <label htmlFor="secondaryTherapy" className="block text-sm font-medium text-gray-700 mb-1">
              Secondary Therapy
            </label>
            <textarea
              id="secondaryTherapy"
              name="secondaryTherapy"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.secondaryTherapy}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label htmlFor="aggravatingPoses" className="block text-sm font-medium text-gray-700 mb-1">
              Aggravating Poses
            </label>
            <textarea
              id="aggravatingPoses"
              name="aggravatingPoses"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.aggravatingPoses}
            />
          </div>

          <div>
            <label htmlFor="relievingPoses" className="block text-sm font-medium text-gray-700 mb-1">
              Relieving Poses
            </label>
            <textarea
              id="relievingPoses"
              name="relievingPoses"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.relievingPoses}
            />
          </div>

          <div>
            <label htmlFor="flexibilityLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Flexibility Level
            </label>
            <input
              id="flexibilityLevel"
              name="flexibilityLevel"
              type="text"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.flexibilityLevel}
            />
          </div>

          <div>
            <label htmlFor="nerveStiffness" className="block text-sm font-medium text-gray-700 mb-1">
              Nerve Stiffness
            </label>
            <input
              id="nerveStiffness"
              name="nerveStiffness"
              type="text"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nerveStiffness}
            />
          </div>

          <div>
            <label htmlFor="muscleStiffness" className="block text-sm font-medium text-gray-700 mb-1">
              Muscle Stiffness
            </label>
            <input
              id="muscleStiffness"
              name="muscleStiffness"
              type="text"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.muscleStiffness}
            />
          </div>

          <div>
            <label htmlFor="avoidablePoses" className="block text-sm font-medium text-gray-700 mb-1">
              Avoidable Poses
            </label>
            <textarea
              id="avoidablePoses"
              name="avoidablePoses"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.avoidablePoses}
            />
          </div>

          <div>
            <label htmlFor="therapyPoses" className="block text-sm font-medium text-gray-700 mb-1">
              Therapy Poses
            </label>
            <textarea
              id="therapyPoses"
              name="therapyPoses"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.therapyPoses}
            />
          </div>

          <div>
            <label htmlFor="sideEffects" className="block text-sm font-medium text-gray-700 mb-1">
              Side Effects
            </label>
            <textarea
              id="sideEffects"
              name="sideEffects"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.sideEffects}
            />
          </div>

          <div>
            <label htmlFor="progressiveReport" className="block text-sm font-medium text-gray-700 mb-1">
              Progressive Report
            </label>
            <textarea
              id="progressiveReport"
              name="progressiveReport"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.progressiveReport}
            />
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
              "Save Therapy"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TherapyForm; 