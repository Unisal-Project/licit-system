import React, { useState } from "react";
import {
  FileText,
  Paperclip,
  Upload,
  X,
} from "lucide-react";

import "./AttachmentModal.css";

function EditAttachmentsModal({
  attachments = [],
  addAttachments,
  removeAttachment,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    if (files.length > 0) {
      addAttachments({
        target: {
          files,
          value: "",
        },
      });
    }
  };

  return (
    <>
      <button
        className="attachments-card-button"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Paperclip size={26} />
      </button>

      {isOpen && (
        <div className="attachments-modal-overlay">
          <section className="attachments-modal">
            <header className="attachments-modal-header">
              <div>
                <h2>Anexos</h2>
                <p>{attachments.length} arquivo(s)</p>
              </div>

              <button type="button" onClick={() => setIsOpen(false)}>
                <X size={22} />
              </button>
            </header>

            <div className="attachments-modal-body">
              <label
                className="attachments-upload"
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
              >
                <Upload size={34} />

                <strong>
                  Arraste os arquivos aqui ou{" "}
                  <span>clique para selecionar</span>
                </strong>

                <small>
                  PDF, DOCX, XLSX • Máximo 10MB por arquivo
                </small>

                <input
                  type="file"
                  multiple
                  hidden
                  onChange={addAttachments}
                />
              </label>

              <div className="attachments-files">
                {attachments.length === 0 ? (
                  <span className="attachments-empty">
                    Nenhum arquivo adicionado
                  </span>
                ) : (
                  attachments.map((attachment, index) => {
                    const fileName =
                      attachment.name || attachment.nome;

                    const fileSize =
                      attachment.tamanho ||
                      `${Math.max(
                        1,
                        Math.round(
                          (attachment.size || 0) / 1024
                        )
                      )} KB`;

                    return (
                      <div
                        className="attachments-file-item"
                        key={`${fileName}-${index}`}
                      >
                        <div className="attachments-file-info">
                          <FileText size={20} />

                          <div>
                            <p>{fileName}</p>
                            <span>{fileSize}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="attachments-remove-button"
                          onClick={() => removeAttachment(index)}
                        >
                          <X size={17} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default EditAttachmentsModal;