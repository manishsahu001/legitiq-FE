import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { uploadDocument, compareDocuments } from "../api/client";
import { useAppStore } from "../store/appStore";
import { Document } from "../types";
import { toast } from "sonner";

interface UploadZoneProps {
  type: "policy" | "regulation";
  onUploadComplete?: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  type,
  onUploadComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null);

  const {
    addDocument,
    setSelectedPolicy,
    selectedPolicyId,
    setCompareResult,
    setStep,
  } = useAppStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadedDocId(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      if (type === "policy") {
        const result = await uploadDocument(file);
        const doc: Document = {
          id: result.document_id,
          filename: result.filename,
          total_pages: result.total_pages,
          total_chunks: result.total_chunks,
          vector_path: `data/${result.document_id}`,
        };

        addDocument(doc);
        setSelectedPolicy(result.document_id);
        setUploadedDocId(result.document_id);

        toast.success(`✅ Policy "${file.name}" uploaded successfully!`);
        if (onUploadComplete) onUploadComplete();
      } else if (type === "regulation") {
        const policyId = selectedPolicyId;
        if (!policyId) {
          toast.error(
            "⚠️ Please upload a Policy document first before comparing.",
          );
          setUploading(false);
          return;
        }

        const result = await compareDocuments(policyId, file);
        setCompareResult(result);
        setStep("results");
        setUploadedDocId("compare_success");
        toast.success("🎉 Comparison complete! View the dashboard below.");
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.detail ||
        error?.message ||
        "Unknown error occurred.";
      toast.error(`❌ Operation failed: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadedDocId(null);
  };

  const isSuccess = uploadedDocId !== null;
  const isCompareSuccess = uploadedDocId === "compare_success";

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"}
            ${isSuccess ? "border-green-500 bg-green-50" : ""}
          `}
        >
          <input {...getInputProps()} />

          {isCompareSuccess ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="font-medium text-green-700">Comparison Complete!</p>
              <p className="text-sm text-gray-500">{file?.name}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="mt-2"
              >
                Compare Another Regulation
              </Button>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="font-medium text-green-700">
                Policy Uploaded Successfully
              </p>
              <p className="text-sm text-gray-500">{file?.name}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="mt-2"
              >
                Upload Different Policy
              </Button>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center gap-2">
              <File className="w-12 h-12 text-blue-500" />
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {type === "policy" ? "Uploading..." : "Comparing..."}
                    </>
                  ) : type === "policy" ? (
                    "Upload Policy"
                  ) : (
                    "Compare Now"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-12 h-12 text-gray-400" />
              <p className="font-medium">
                {isDragActive
                  ? "Drop your PDF here"
                  : `Drop your ${type} PDF here`}
              </p>
              <p className="text-sm text-gray-500">or click to browse</p>
              <p className="text-xs text-gray-400">PDF files only</p>

              {/* FIXED: Consistent height placeholder */}
              <div className="h-6 mt-1">
                {type === "regulation" && (
                  <p className="text-xs text-blue-600">
                    ⚡ This will instantly compare against your selected policy.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
