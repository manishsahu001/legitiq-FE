import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const listDocuments = async () => {
  const response = await api.get("/api/documents");
  return response.data;
};

export const deleteDocument = async (docId: string) => {
  const response = await api.delete(`/api/documents/${docId}`);
  return response.data;
};

export const compareDocuments = async (
  policyId: string,
  regulationFile: File,
) => {
  const formData = new FormData();
  formData.append("regulation_file", regulationFile);

  const response = await api.post(
    `/api/compare?policy_id=${policyId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

export const downloadReport = async () => {
  const response = await api.get("/api/report", {
    responseType: "blob",
  });
  return response.data;
};

export const downloadRevisedPolicy = async () => {
  const response = await api.get("/api/download-revised-policy", {
    responseType: "blob",
  });
  return response.data;
};

export default api;
