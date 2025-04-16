import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TherapyTools, Yoga, Pranayama, Mudras, BreathingExercises } from "../types";

interface TherapyToolsFormProps {
  initialValues?: TherapyTools | null;
  therapyId: number;
  onSave: (therapyTools: TherapyTools) => Promise<void>;
  onCancel: () => void;
}

const TherapyToolsForm = ({ initialValues, therapyId, onSave, onCancel }: TherapyToolsFormProps) => {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "yoga" | "pranayama" | "mudras" | "breathing">("general");

  const emptyYoga: Yoga = {
    therapyToolsId: 0,
    poses: "",
    repeatingTimingsPerDay: 0
  };

  const emptyPranayama: Pranayama = {
    therapyToolsId: 0,
    techniques: "",
    repeatingTimingsPerDay: 0
  };

  const emptyMudras: Mudras = {
    therapyToolsId: 0,
    mudraNames: "",
    repeatingTimingsPerDay: 0
  };

  const emptyBreathingExercises: BreathingExercises = {
    therapyToolsId: 0,
    exercises: "",
    repeatingTimingsPerDay: 0
  };

  const emptyTherapyTools: TherapyTools = {
    therapyId,
    mantras: "",
    meditationTypes: "",
    bandhas: "",
    yoga: emptyYoga,
    pranayama: emptyPranayama,
    mudras: emptyMudras,
    breathingExercises: emptyBreathingExercises
  };

  const validationSchema = Yup.object({
    mantras: Yup.string(),
    meditationTypes: Yup.string(),
    bandhas: Yup.string(),
    yoga: Yup.object({
      poses: Yup.string(),
      repeatingTimingsPerDay: Yup.number().min(0, "Cannot be negative")
    }),
    pranayama: Yup.object({
      techniques: Yup.string(),
      repeatingTimingsPerDay: Yup.number().min(0, "Cannot be negative")
    }),
    mudras: Yup.object({
      mudraNames: Yup.string(),
      repeatingTimingsPerDay: Yup.number().min(0, "Cannot be negative")
    }),
    breathingExercises: Yup.object({
      exercises: Yup.string(),
      repeatingTimingsPerDay: Yup.number().min(0, "Cannot be negative")
    })
  });

  const formik = useFormik({
    initialValues: initialValues || emptyTherapyTools,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSaving(true);
        setError("");
        await onSave({
          ...values,
          id: initialValues?.id,
          therapyId,
          yoga: values.yoga ? {
            ...values.yoga,
            id: initialValues?.yoga?.id,
            therapyToolsId: initialValues?.id || 0
          } : undefined,
          pranayama: values.pranayama ? {
            ...values.pranayama,
            id: initialValues?.pranayama?.id,
            therapyToolsId: initialValues?.id || 0
          } : undefined,
          mudras: values.mudras ? {
            ...values.mudras,
            id: initialValues?.mudras?.id,
            therapyToolsId: initialValues?.id || 0
          } : undefined,
          breathingExercises: values.breathingExercises ? {
            ...values.breathingExercises,
            id: initialValues?.breathingExercises?.id,
            therapyToolsId: initialValues?.id || 0
          } : undefined
        });
      } catch (err: any) {
        setError(`Error saving therapy tools: ${err.message}`);
        console.error("Error in save:", err);
      } finally {
        setSaving(false);
      }
    },
  });

  const renderTabContent = () => {
    if (activeTab === "general") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="mantras" className="block text-sm font-medium text-gray-700 mb-1">
              Mantras
            </label>
            <textarea
              id="mantras"
              name="mantras"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mantras}
            />
            {formik.touched.mantras && formik.errors.mantras ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.mantras as string}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="meditationTypes" className="block text-sm font-medium text-gray-700 mb-1">
              Meditation Types
            </label>
            <textarea
              id="meditationTypes"
              name="meditationTypes"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.meditationTypes}
            />
            {formik.touched.meditationTypes && formik.errors.meditationTypes ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.meditationTypes as string}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="bandhas" className="block text-sm font-medium text-gray-700 mb-1">
              Bandhas
            </label>
            <textarea
              id="bandhas"
              name="bandhas"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bandhas}
            />
            {formik.touched.bandhas && formik.errors.bandhas ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.bandhas as string}</div>
            ) : null}
          </div>
        </div>
      );
    }

    if (activeTab === "yoga") {
      return (
        <div className="space-y-6">
          <div>
            <label htmlFor="yoga.poses" className="block text-sm font-medium text-gray-700 mb-1">
              Yoga Poses
            </label>
            <textarea
              id="yoga.poses"
              name="yoga.poses"
              rows={5}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.yoga?.poses || ''}
            />
            {formik.touched.yoga?.poses && formik.errors.yoga?.poses ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.yoga?.poses as string}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="yoga.repeatingTimingsPerDay" className="block text-sm font-medium text-gray-700 mb-1">
              Repeating Timings Per Day
            </label>
            <input
              id="yoga.repeatingTimingsPerDay"
              name="yoga.repeatingTimingsPerDay"
              type="number"
              min="0"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.yoga?.repeatingTimingsPerDay || 0}
            />
            {formik.touched.yoga?.repeatingTimingsPerDay && formik.errors.yoga?.repeatingTimingsPerDay ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.yoga?.repeatingTimingsPerDay as string}</div>
            ) : null}
          </div>
        </div>
      );
    }

    if (activeTab === "pranayama") {
      return (
        <div className="space-y-6">
          <div>
            <label htmlFor="pranayama.techniques" className="block text-sm font-medium text-gray-700 mb-1">
              Pranayama Techniques
            </label>
            <textarea
              id="pranayama.techniques"
              name="pranayama.techniques"
              rows={5}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pranayama?.techniques || ''}
            />
            {formik.touched.pranayama?.techniques && formik.errors.pranayama?.techniques ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.pranayama?.techniques as string}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="pranayama.repeatingTimingsPerDay" className="block text-sm font-medium text-gray-700 mb-1">
              Repeating Timings Per Day
            </label>
            <input
              id="pranayama.repeatingTimingsPerDay"
              name="pranayama.repeatingTimingsPerDay"
              type="number"
              min="0"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pranayama?.repeatingTimingsPerDay || 0}
            />
            {formik.touched.pranayama?.repeatingTimingsPerDay && formik.errors.pranayama?.repeatingTimingsPerDay ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.pranayama?.repeatingTimingsPerDay as string}</div>
            ) : null}
          </div>
        </div>
      );
    }

    if (activeTab === "mudras") {
      return (
        <div className="space-y-6">
          <div>
            <label htmlFor="mudras.mudraNames" className="block text-sm font-medium text-gray-700 mb-1">
              Mudra Names
            </label>
            <textarea
              id="mudras.mudraNames"
              name="mudras.mudraNames"
              rows={5}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mudras?.mudraNames || ''}
            />
            {formik.touched.mudras?.mudraNames && formik.errors.mudras?.mudraNames ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.mudras?.mudraNames as string}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="mudras.repeatingTimingsPerDay" className="block text-sm font-medium text-gray-700 mb-1">
              Repeating Timings Per Day
            </label>
            <input
              id="mudras.repeatingTimingsPerDay"
              name="mudras.repeatingTimingsPerDay"
              type="number"
              min="0"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mudras?.repeatingTimingsPerDay || 0}
            />
            {formik.touched.mudras?.repeatingTimingsPerDay && formik.errors.mudras?.repeatingTimingsPerDay ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.mudras?.repeatingTimingsPerDay as string}</div>
            ) : null}
          </div>
        </div>
      );
    }

    if (activeTab === "breathing") {
      return (
        <div className="space-y-6">
          <div>
            <label htmlFor="breathingExercises.exercises" className="block text-sm font-medium text-gray-700 mb-1">
              Breathing Exercises
            </label>
            <textarea
              id="breathingExercises.exercises"
              name="breathingExercises.exercises"
              rows={5}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.breathingExercises?.exercises || ''}
            />
            {formik.touched.breathingExercises?.exercises && formik.errors.breathingExercises?.exercises ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.breathingExercises?.exercises as string}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="breathingExercises.repeatingTimingsPerDay" className="block text-sm font-medium text-gray-700 mb-1">
              Repeating Timings Per Day
            </label>
            <input
              id="breathingExercises.repeatingTimingsPerDay"
              name="breathingExercises.repeatingTimingsPerDay"
              type="number"
              min="0"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.breathingExercises?.repeatingTimingsPerDay || 0}
            />
            {formik.touched.breathingExercises?.repeatingTimingsPerDay && formik.errors.breathingExercises?.repeatingTimingsPerDay ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.breathingExercises?.repeatingTimingsPerDay as string}</div>
            ) : null}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          {initialValues ? "Edit Therapy Tools" : "Add Therapy Tools"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Record yoga, pranayama, mudras, and other therapy tools
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              type="button"
              className={`mr-2 py-2 px-4 text-center border-b-2 font-medium text-sm ${activeTab === "general"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
            <button
              type="button"
              className={`mr-2 py-2 px-4 text-center border-b-2 font-medium text-sm ${activeTab === "yoga"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("yoga")}
            >
              Yoga
            </button>
            <button
              type="button"
              className={`mr-2 py-2 px-4 text-center border-b-2 font-medium text-sm ${activeTab === "pranayama"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("pranayama")}
            >
              Pranayama
            </button>
            <button
              type="button"
              className={`mr-2 py-2 px-4 text-center border-b-2 font-medium text-sm ${activeTab === "mudras"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("mudras")}
            >
              Mudras
            </button>
            <button
              type="button"
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${activeTab === "breathing"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("breathing")}
            >
              Breathing
            </button>
          </nav>
        </div>

        <div className="py-4">
          {renderTabContent()}
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
              "Save Therapy Tools"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TherapyToolsForm; 