import { useEffect, useCallback } from "react";
import { useAppStore } from "./store/appStore";
import { listDocuments } from "./api/client";
import { UploadView, ProcessingView, ResultsView } from "./components";
import { ShieldCheck } from "lucide-react";

function App() {
  const { step, setStep, documents, setDocuments, compareResult } =
    useAppStore();
  const loadDocuments = useCallback(async () => {
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  }, [setDocuments]);
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleUploadComplete = () => setStep("results");
  const handleNavigateToUpload = () => setStep("upload");
  const handleNavigateToResults = () => {
    if (compareResult) setStep("results");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">LegitIQ</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              AI
            </span>
          </div>
          <div className="text-sm text-gray-400">
            {step === "upload" && "📄 Upload"}
            {step === "processing" && "⚙️ Processing"}
            {step === "results" && "📊 Results"}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {step === "upload" && (
          <UploadView
            documents={documents}
            compareResult={compareResult}
            onUploadComplete={handleUploadComplete}
            onNavigateToResults={handleNavigateToResults}
          />
        )}

        {step === "processing" && <ProcessingView />}

        {step === "results" && compareResult && (
          <ResultsView
            result={compareResult}
            onNavigateToUpload={handleNavigateToUpload}
          />
        )}

        {step === "results" && !compareResult && (
          <div className="text-center py-20">
            <p className="text-gray-600">No comparison results found.</p>
            <button
              onClick={handleNavigateToUpload}
              className="mt-4 text-blue-600 underline hover:no-underline"
            >
              Go to Upload
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
