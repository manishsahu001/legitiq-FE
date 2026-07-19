import React, { useState } from "react";
import { CompareResponse } from "../types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GapCard } from "./GapCard";
import { downloadReport, downloadRevisedPolicy } from "../api/client";
import { Download, CheckCircle, XCircle, FileText } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { toast } from "sonner";

interface CompareDashboardProps {
  result: CompareResponse;
}

export const CompareDashboard: React.FC<CompareDashboardProps> = ({
  result,
}) => {
  const [downloading, setDownloading] = useState(false);
  const feedbackCounts = useAppStore.getState().getFeedbackCounts();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await downloadReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compliance_report_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("📄 Full report downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadRevised = async () => {
    setDownloading(true);
    try {
      const blob = await downloadRevisedPolicy();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `revised_policy_draft_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("📝 Revised policy draft downloaded!");
    } catch (error) {
      console.error("Failed to download revised policy:", error);
      toast.error("Failed to download revised policy.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards - Clean, Minimal */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-blue-600">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Compliance
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {result.compliance_score}%
            </p>
            <p className="text-xs text-gray-400 mt-1">Score</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Industry Benchmark
            </p>
            <p className="text-2xl font-bold text-purple-700">
              {result.industry_benchmark_score !== undefined &&
              result.industry_benchmark_score > 0
                ? `${result.industry_benchmark_score}%`
                : "N/A"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {result.industry_benchmark_score !== undefined &&
              result.industry_benchmark_score > 0
                ? result.industry_benchmark_score > 80
                  ? "🏆 Best-in-class"
                  : result.industry_benchmark_score > 60
                    ? "📈 Competitive"
                    : "⚠️ Lagging"
                : "Not benchmarked"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Total Clauses
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {result.total_clauses_analyzed}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Compliant
            </p>
            <p className="text-2xl font-bold text-green-600">
              {result.compliant_count}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Gaps
            </p>
            <p className="text-2xl font-bold text-red-600">
              {result.gap_count}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-gray-700 mr-2">
          Risk breakdown:
        </span>
        {result.high_risk_count > 0 && (
          <Badge variant="destructive" className="px-3 py-1">
            High {result.high_risk_count}
          </Badge>
        )}
        {result.medium_risk_count > 0 && (
          <Badge
            variant="secondary"
            className="px-3 py-1 bg-yellow-100 text-yellow-800"
          >
            Medium {result.medium_risk_count}
          </Badge>
        )}
        {result.low_risk_count > 0 && (
          <Badge
            variant="outline"
            className="px-3 py-1 border-blue-300 text-blue-700"
          >
            Low {result.low_risk_count}
          </Badge>
        )}
        <span className="text-xs text-gray-400 ml-auto">
          Last updated: {new Date(result.generated_at).toLocaleTimeString()}
        </span>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">Compliance Score</span>
          <span className="font-medium text-blue-700">
            {result.compliance_score}%
          </span>
        </div>
        <Progress value={result.compliance_score} className="h-2 bg-gray-100" />
        <p className="text-xs text-gray-400 mt-2">
          {result.document_name} vs {result.regulation_name}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Generating..." : "Download Full Report"}
          </Button>
          <Button
            onClick={handleDownloadRevised}
            disabled={downloading}
            variant="outline"
            className="gap-2 border-green-500 text-green-700 hover:bg-green-50"
          >
            <FileText className="w-4 h-4" />
            {downloading ? "Generating..." : "📄 Download Revised Policy"}
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500 flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" /> Accepted:{" "}
            {feedbackCounts.accepted}
          </span>
          <span className="text-gray-500 flex items-center gap-1">
            <XCircle className="w-4 h-4 text-red-600" /> Rejected:{" "}
            {feedbackCounts.rejected}
          </span>
        </div>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white shadow-sm"
          >
            All Clauses
          </TabsTrigger>
          <TabsTrigger
            value="gaps"
            className="data-[state=active]:bg-white shadow-sm"
          >
            Gaps ({result.gap_count})
          </TabsTrigger>
          <TabsTrigger
            value="compliant"
            className="data-[state=active]:bg-white shadow-sm"
          >
            Compliant ({result.compliant_count})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-4">
          {result.gap_analyses.map((gap, idx) => (
            <GapCard key={idx} gap={gap} index={idx} />
          ))}
        </TabsContent>
        <TabsContent value="gaps" className="space-y-4 mt-4">
          {result.gap_analyses
            .filter((g) => g.risk_severity !== "compliant")
            .map((gap, idx) => (
              <GapCard key={idx} gap={gap} index={idx} />
            ))}
        </TabsContent>
        <TabsContent value="compliant" className="space-y-4 mt-4">
          {result.gap_analyses
            .filter((g) => g.risk_severity === "compliant")
            .map((gap, idx) => (
              <GapCard key={idx} gap={gap} index={idx} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
