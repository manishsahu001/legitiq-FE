export interface UploadResponse {
  filename: string;
  total_pages: number;
  total_chunks: number;
  document_id: string;
  status: string;
}

export interface Document {
  id: string;
  filename: string;
  total_pages: number;
  total_chunks: number;
  vector_path: string;
}

export interface ClauseExtract {
  clause_id: string;
  section: string;
  text: string;
  page_reference: number;
}

export interface GapAnalysis {
  regulation_clause: ClauseExtract;
  policy_match_found: boolean;
  matched_policy_chunks: Array<{
    chunk_id: number;
    text: string;
    page_hint: number;
    similarity_score?: number; // FAISS distance
  }>;
  risk_severity: "high" | "medium" | "low" | "compliant";
  gap_description: string;
  suggested_remediation: string;
  citations: Array<{ chunk_id: number; page: number }>;
  industry_gap_description: string;
  industry_score: number;
}

export interface CompareResponse {
  document_name: string;
  regulation_name: string;
  total_clauses_analyzed: number;
  compliant_count: number;
  gap_count: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  compliance_score: number;
  gap_analyses: GapAnalysis[];
  generated_at: string;
  industry_benchmark_score: number;
}
