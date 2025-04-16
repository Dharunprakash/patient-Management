import React, { useState } from "react";
import { Therapy, TherapyTools } from "../types";
import TherapyToolsView from "./TherapyToolsView";
import TherapyToolsForm from "./TherapyToolsForm";

interface TherapyViewProps {
  therapy: Therapy | null | undefined;
  onEdit: () => void;
  onSaveTherapyTools?: (therapyTools: TherapyTools) => Promise<void>;
}

type ViewState = "view" | "edit-tools";

const TherapyView = ({ therapy, onEdit, onSaveTherapyTools }: TherapyViewProps) => {
  const [viewState, setViewState] = useState<ViewState>("view");

  if (!therapy) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Therapy</h2>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Therapy
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          No therapy has been recorded yet.
        </div>
      </div>
    );
  }

  const handleEditTherapyTools = () => {
    setViewState("edit-tools");
  };

  const handleSaveTherapyTools = async (therapyTools: TherapyTools) => {
    if (onSaveTherapyTools) {
      await onSaveTherapyTools(therapyTools);
      setViewState("view");
    }
  };

  const handleCancelEditTools = () => {
    setViewState("view");
  };

  if (viewState === "edit-tools") {
    return (
      <TherapyToolsForm
        initialValues={therapy.therapyTools}
        therapyId={therapy.id!}
        onSave={handleSaveTherapyTools}
        onCancel={handleCancelEditTools}
      />
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {therapy.name} <span className="text-gray-500 text-sm">({therapy.fitnessOrTherapy})</span>
        </h2>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Edit Therapy
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {therapy.homeRemedies && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Home Remedies</h3>
              <p className="whitespace-pre-line">{therapy.homeRemedies}</p>
            </div>
          )}

          {therapy.dietReference && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Diet Reference</h3>
              <p className="whitespace-pre-line">{therapy.dietReference}</p>
            </div>
          )}

          {therapy.lifestyleModifications && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Lifestyle Modifications</h3>
              <p className="whitespace-pre-line">{therapy.lifestyleModifications}</p>
            </div>
          )}

          {therapy.secondaryTherapy && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Secondary Therapy</h3>
              <p className="whitespace-pre-line">{therapy.secondaryTherapy}</p>
            </div>
          )}
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-md font-medium mb-3">Poses Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {therapy.aggravatingPoses && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Aggravating Poses</h3>
                <p className="whitespace-pre-line">{therapy.aggravatingPoses}</p>
              </div>
            )}

            {therapy.relievingPoses && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Relieving Poses</h3>
                <p className="whitespace-pre-line">{therapy.relievingPoses}</p>
              </div>
            )}

            {therapy.avoidablePoses && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Avoidable Poses</h3>
                <p className="whitespace-pre-line">{therapy.avoidablePoses}</p>
              </div>
            )}

            {therapy.therapyPoses && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Therapy Poses</h3>
                <p className="whitespace-pre-line">{therapy.therapyPoses}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-md font-medium mb-3">Physical Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {therapy.flexibilityLevel && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Flexibility Level</h3>
                <p>{therapy.flexibilityLevel}</p>
              </div>
            )}

            {therapy.nerveStiffness && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Nerve Stiffness</h3>
                <p>{therapy.nerveStiffness}</p>
              </div>
            )}

            {therapy.muscleStiffness && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Muscle Stiffness</h3>
                <p>{therapy.muscleStiffness}</p>
              </div>
            )}
          </div>
        </div>

        {therapy.sideEffects && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Side Effects</h3>
            <p className="whitespace-pre-line">{therapy.sideEffects}</p>
          </div>
        )}

        {therapy.progressiveReport && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Progressive Report</h3>
            <p className="whitespace-pre-line">{therapy.progressiveReport}</p>
          </div>
        )}

        <TherapyToolsView
          therapyTools={therapy.therapyTools}
          onEdit={onSaveTherapyTools ? handleEditTherapyTools : onEdit}
        />
      </div>
    </div>
  );
};

export default TherapyView; 