import React from "react";

export const ProcessingView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-6" />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Analyzing Documents
      </h2>
      <p className="text-gray-500">
        Our AI is comparing your policy against the regulation...
      </p>
      <div className="mt-4 w-full max-w-md mx-auto bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};
