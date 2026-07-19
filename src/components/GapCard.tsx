import React, { useState } from "react";
import { GapAnalysis } from "../types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DiffViewer } from "./DiffViewer";
import { CheckCircle, TrendingUp } from "lucide-react";
import { useAppStore } from "../store/appStore";

const getSeverityVariant = (
  severity: string,
): "default" | "destructive" | "outline" | "secondary" => {
  switch (severity) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    case "compliant":
      return "default";
    default:
      return "outline";
  }
};

interface GapCardProps {
  gap: GapAnalysis;
  index: number;
}

export const GapCard: React.FC<GapCardProps> = ({ gap, index }) => {
  const [showDiff, setShowDiff] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const isCompliant = gap.risk_severity === "compliant";

  const feedback = useAppStore.getState().feedback;
  const clauseId =
    gap.regulation_clause.clause_id ||
    gap.regulation_clause.section ||
    `clause-${index}`;
  const feedbackStatus = feedback[clauseId] || null;

  const handleToggleDiff = () => {
    setShowDiff(!showDiff);
    if (showEvidence) setShowEvidence(false);
  };

  const handleToggleEvidence = () => {
    setShowEvidence(!showEvidence);
    if (showDiff) setShowDiff(false);
  };

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`w-1.5 h-full min-h-[4rem] rounded-full flex-shrink-0 mt-1 ${
              isCompliant
                ? "bg-green-500"
                : gap.risk_severity === "high"
                  ? "bg-red-500"
                  : gap.risk_severity === "medium"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
            }`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge
                variant={getSeverityVariant(gap.risk_severity)}
                className="capitalize"
              >
                {gap.risk_severity}
              </Badge>
              <span className="text-sm font-medium text-gray-800">
                {gap.regulation_clause.section || "Clause"}
              </span>
              <span className="text-xs text-gray-400">
                Page {gap.regulation_clause.page_reference || "N/A"}
              </span>
              {feedbackStatus === "accepted" && (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Accepted
                </Badge>
              )}
              {feedbackStatus === "rejected" && (
                <Badge
                  variant="destructive"
                  className="bg-red-100 text-red-700 border-red-200"
                >
                  Rejected
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {gap.regulation_clause.text}
            </p>

            {!isCompliant && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-red-600">Gap:</span>{" "}
                  {gap.gap_description}
                </p>
              </div>
            )}

            {gap.industry_gap_description &&
              gap.industry_score > 0 &&
              !isCompliant && (
                <div className="mt-2 p-3 bg-purple-50 rounded-md border border-purple-100">
                  <p className="text-xs font-medium text-purple-700 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Industry Benchmark
                  </p>
                  <p className="text-sm text-purple-800">
                    {gap.industry_gap_description}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Score:{" "}
                    <span className="font-bold">{gap.industry_score}/100</span>
                  </p>
                </div>
              )}

            {isCompliant && (
              <div className="mt-2 text-sm text-green-700 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Policy is compliant with
                this requirement.
              </div>
            )}

            {!isCompliant && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={handleToggleDiff}>
                  {showDiff ? "Hide Remediation" : "✏️ Suggested Fix"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={handleToggleEvidence}
                >
                  {showEvidence ? "Hide Evidence" : "🔍 Evidence"}
                </Button>
              </div>
            )}

            {showDiff && !isCompliant && (
              <div className="mt-3">
                <DiffViewer
                  originalText={gap.regulation_clause.text}
                  revisedText={
                    gap.suggested_remediation ||
                    "No suggested remediation provided."
                  }
                />
              </div>
            )}

            {showEvidence && !isCompliant && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  📄 Retrieved Evidence (RAG)
                </p>
                {gap.matched_policy_chunks &&
                gap.matched_policy_chunks.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {gap.matched_policy_chunks.map((chunk, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded border border-gray-100 shadow-sm"
                      >
                        <p className="text-sm text-gray-700">{chunk.text}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-400">
                            📍 Page {chunk.page_hint || "N/A"}
                          </span>
                          {chunk.similarity_score !== undefined && (
                            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                              Score: {(1 - chunk.similarity_score).toFixed(3)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No specific policy chunks matched.
                  </p>
                )}
                <div className="mt-3 border-t border-gray-200 pt-3 flex flex-wrap items-center gap-2">
                  {feedbackStatus === "accepted" ? (
                    <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                      ✅ Accepted
                    </span>
                  ) : feedbackStatus === "rejected" ? (
                    <span className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full">
                      ❌ Rejected
                    </span>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          useAppStore
                            .getState()
                            .setFeedback(clauseId, "accepted");
                          setShowEvidence(false);
                        }}
                      >
                        ✅ Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          useAppStore
                            .getState()
                            .setFeedback(clauseId, "rejected");
                          setShowEvidence(false);
                        }}
                      >
                        ❌ Reject
                      </Button>
                    </>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">
                    Human‑in‑the‑loop
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
