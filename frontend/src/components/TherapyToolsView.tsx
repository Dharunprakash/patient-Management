import React from "react";
import { TherapyTools } from "../types";

interface TherapyToolsViewProps {
  therapyTools: TherapyTools | null | undefined;
  onEdit: () => void;
}

const TherapyToolsView = ({ therapyTools, onEdit }: TherapyToolsViewProps) => {
  if (!therapyTools) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Therapy Tools</h2>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Therapy Tools
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          No therapy tools have been recorded yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Therapy Tools</h2>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Edit Therapy Tools
        </button>
      </div>

      <div className="space-y-6">
        {/* General Tools Section */}
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-medium mb-4">General Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {therapyTools.mantras && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Mantras</h4>
                <p className="whitespace-pre-line">{therapyTools.mantras}</p>
              </div>
            )}

            {therapyTools.meditationTypes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Meditation Types</h4>
                <p className="whitespace-pre-line">{therapyTools.meditationTypes}</p>
              </div>
            )}

            {therapyTools.bandhas && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Bandhas</h4>
                <p className="whitespace-pre-line">{therapyTools.bandhas}</p>
              </div>
            )}
          </div>
        </div>

        {/* Yoga Section */}
        {therapyTools.yoga && (therapyTools.yoga.poses || therapyTools.yoga.repeatingTimingsPerDay) && (
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Yoga</h3>
            <div className="space-y-4">
              {therapyTools.yoga.poses && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Poses</h4>
                  <p className="whitespace-pre-line">{therapyTools.yoga.poses}</p>
                </div>
              )}

              {therapyTools.yoga.repeatingTimingsPerDay !== undefined &&
                therapyTools.yoga.repeatingTimingsPerDay > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Repeating Timings Per Day
                    </h4>
                    <p>{therapyTools.yoga.repeatingTimingsPerDay}</p>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Pranayama Section */}
        {therapyTools.pranayama &&
          (therapyTools.pranayama.techniques || therapyTools.pranayama.repeatingTimingsPerDay) && (
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Pranayama</h3>
              <div className="space-y-4">
                {therapyTools.pranayama.techniques && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Techniques</h4>
                    <p className="whitespace-pre-line">{therapyTools.pranayama.techniques}</p>
                  </div>
                )}

                {therapyTools.pranayama.repeatingTimingsPerDay !== undefined &&
                  therapyTools.pranayama.repeatingTimingsPerDay > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Repeating Timings Per Day
                      </h4>
                      <p>{therapyTools.pranayama.repeatingTimingsPerDay}</p>
                    </div>
                  )}
              </div>
            </div>
          )}

        {/* Mudras Section */}
        {therapyTools.mudras &&
          (therapyTools.mudras.mudraNames || therapyTools.mudras.repeatingTimingsPerDay) && (
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Mudras</h3>
              <div className="space-y-4">
                {therapyTools.mudras.mudraNames && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Mudra Names</h4>
                    <p className="whitespace-pre-line">{therapyTools.mudras.mudraNames}</p>
                  </div>
                )}

                {therapyTools.mudras.repeatingTimingsPerDay !== undefined &&
                  therapyTools.mudras.repeatingTimingsPerDay > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Repeating Timings Per Day
                      </h4>
                      <p>{therapyTools.mudras.repeatingTimingsPerDay}</p>
                    </div>
                  )}
              </div>
            </div>
          )}

        {/* Breathing Exercises Section */}
        {therapyTools.breathingExercises &&
          (therapyTools.breathingExercises.exercises ||
            therapyTools.breathingExercises.repeatingTimingsPerDay) && (
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Breathing Exercises</h3>
              <div className="space-y-4">
                {therapyTools.breathingExercises.exercises && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Exercises</h4>
                    <p className="whitespace-pre-line">{therapyTools.breathingExercises.exercises}</p>
                  </div>
                )}

                {therapyTools.breathingExercises.repeatingTimingsPerDay !== undefined &&
                  therapyTools.breathingExercises.repeatingTimingsPerDay > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Repeating Timings Per Day
                      </h4>
                      <p>{therapyTools.breathingExercises.repeatingTimingsPerDay}</p>
                    </div>
                  )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default TherapyToolsView; 