import React from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import "./AttachmentItem.css";

function AttachmentItem({ anexo }) {
  const isSpreadsheet = anexo.tipo === "xlsx";
  const Icon = isSpreadsheet ? FileSpreadsheet : FileText;

  return (
    <div className="attachment-item">
      <div className="attachment-info">
        <Icon size={20} className={isSpreadsheet ? "file-xlsx" : "file-doc"} />

        <div>
          <strong>{anexo.nome}</strong>
          <span>{anexo.tamanho}</span>
        </div>
      </div>

      <a
        className="attachment-download"
        href={anexo.downloadUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Baixar ${anexo.nome}`}
      >
        <Download size={15} />
      </a>
    </div>
  );
}

export default AttachmentItem;
