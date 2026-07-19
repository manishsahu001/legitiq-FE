import React from "react";
import { CompareResponse } from "../types";
import { CompareDashboard } from "./CompareDashboard";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ResultsViewProps {
  result: CompareResponse;
  onNavigateToUpload: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onNavigateToUpload,
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Compliance Report
          </h1>
          <p className="text-sm text-gray-500">
            {result.document_name} vs {result.regulation_name}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onNavigateToUpload}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          New Analysis
        </Button>
      </div>
      <CompareDashboard result={result} />
    </div>
  );
};
