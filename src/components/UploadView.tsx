import React from "react";
import { UploadZone } from "./UploadZone";
import { DocumentList } from "./DocumentList";
import { Button } from "@/components/ui/button";
import { BarChart3, ShieldCheck } from "lucide-react";
import { Document, CompareResponse } from "../types";

interface UploadViewProps {
  documents: Document[];
  compareResult: CompareResponse | null;
  onUploadComplete: () => void;
  onNavigateToResults: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  documents,
  compareResult,
  onUploadComplete,
  onNavigateToResults,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <ShieldCheck className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          LegitIQ <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your existing policy and the new regulation. Our AI will
          identify compliance gaps instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            Existing Policy
          </h2>
          <UploadZone type="policy" />
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            New Regulation
          </h2>
          <UploadZone type="regulation" onUploadComplete={onUploadComplete} />
        </div>
      </div>

      <DocumentList />

      {documents.length > 0 && (
        <div className="text-center">
          <Button
            onClick={onNavigateToResults}
            className={`gap-2 ${compareResult ? "bg-gray-900 hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!compareResult}
          >
            <BarChart3 className="w-4 h-4" />
            {compareResult
              ? "📊 View Latest Comparison"
              : "📄 Upload Regulation to Compare"}
          </Button>
          {!compareResult && (
            <p className="text-xs text-gray-400 mt-2">
              Upload a regulation file above to generate the comparison report.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
