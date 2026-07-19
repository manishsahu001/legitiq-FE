import React from "react";
import { useAppStore } from "../store/appStore";
import { deleteDocument } from "../api/client";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Trash2, FileText } from "lucide-react";
import { toast } from "sonner";

export const DocumentList: React.FC = () => {
  const { documents, removeDocument, selectedPolicyId, setSelectedPolicy } =
    useAppStore();

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p>No documents uploaded yet.</p>
          <p className="text-sm">Upload a policy above to get started.</p>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async (id: string, filename: string) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }
    try {
      await deleteDocument(id);
      removeDocument(id);
      toast.success(`🗑️ "${filename}" deleted successfully.`);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete document. Please try again.");
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Uploaded Documents</h3>
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedPolicyId === doc.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedPolicy(doc.id)}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">{doc.filename}</p>
                  <p className="text-xs text-gray-500">
                    {doc.total_pages} pages • {doc.total_chunks} chunks
                  </p>
                </div>
                {selectedPolicyId === doc.id && (
                  <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(doc.id, doc.filename);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
