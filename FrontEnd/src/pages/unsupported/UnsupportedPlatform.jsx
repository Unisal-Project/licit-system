import { MonitorX, UserPlus } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./UnsupportedPlatform.css";

function UnsupportedPlatform() {
  return (
    <main className="unsupported-page">
      <section className="unsupported-panel" aria-labelledby="unsupported-title">
        <div className="unsupported-icon">
          <MonitorX size={36} />
        </div>

        <div className="unsupported-content">
          <h1 id="unsupported-title">Plataforma não suportada</h1>
          <p>
            O LicitSystem ainda não possui suporte para tablet ou celular.
            Acesse pelo computador para usar o sistema completo.
          </p>
        </div>

        <NavLink className="unsupported-action" to="/register">
          <UserPlus size={18} />
          Criar conta
        </NavLink>
      </section>
    </main>
  );
}

export default UnsupportedPlatform;
