import { API_BASE_URL, apiRequest } from "./api";

export function mapApiAttachment(attachment) {
  return {
    ...attachment,
    nome: attachment.nome,
    tamanho: attachment.tamanho_kb !== null && attachment.tamanho_kb !== undefined
      ? `${attachment.tamanho_kb} KB`
      : attachment.tamanho || "",
    tipo: attachment.tipo,
    downloadUrl: `${API_BASE_URL}/attachments/${attachment.id}/download`,
  };
}

export async function listAttachmentsByBidding(biddingId) {
  const attachments = await apiRequest(`/attachments/${biddingId}`);

  return Array.isArray(attachments)
    ? attachments.map(mapApiAttachment)
    : [];
}

export async function uploadAttachment(biddingId, file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest(`/attachments/${biddingId}`, {
    method: "POST",
    body: formData,
  });
}

export async function uploadAttachments(biddingId, files = []) {
  const uploadableFiles = files.filter((file) => file instanceof File);

  if (uploadableFiles.length === 0) {
    return [];
  }

  try {
    const results = await Promise.all(
      uploadableFiles.map((file) => uploadAttachment(biddingId, file))
    );
    return results;
  } catch (error) {
    console.error("Erro ao fazer upload de arquivos:", error);
    throw new Error("Falha ao fazer upload de um ou mais arquivos");
  }
}

export async function deleteAttachment(attachmentId) {
  return apiRequest(`/attachments/${attachmentId}`, {
    method: "DELETE",
  });
}
