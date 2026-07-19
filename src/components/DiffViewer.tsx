import React from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import { Card, CardContent } from "./ui/card";

interface DiffViewerProps {
  originalText: string;
  revisedText: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalText,
  revisedText,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-gray-500 mb-2">
          <span className="bg-red-100 px-2 py-0.5 rounded">Original</span>
          {" → "}
          <span className="bg-green-100 px-2 py-0.5 rounded">
            Suggested Revision
          </span>
        </div>
        <div className="border rounded-lg overflow-hidden max-h-80 overflow-y-auto">
          <ReactDiffViewer
            oldValue={originalText}
            newValue={revisedText}
            splitView={true}
            showDiffOnly={false}
            leftTitle="Current Policy"
            rightTitle="Suggested Remediation"
            styles={{
              diffContainer: {
                fontSize: "14px",
                lineHeight: "1.6",
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
