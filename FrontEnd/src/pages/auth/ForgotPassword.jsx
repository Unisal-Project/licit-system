import { useState } from "react";
import { ArrowLeft, CircleCheck, Mail } from "lucide-react";
import { NavLink, useSearchParams } from "react-router-dom";
import { Button, Input } from "../../components/ui/main";
import { lighting, logo, male_laptop, name } from "../../assets/images/images.js";
import { requestPasswordReset } from "../../services/authService";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetLink, setResetLink] = useState("");

  const enviar = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setResetLink("");
    setIsSubmitting(true);

    try {
      const data = await requestPasswordReset(email);
      setSuccessMessage(
        data?.message ||
          "Se o e-mail estiver cadastrado, enviaremos as instruções de redefinição."
      );
      setResetLink(data?.reset_link || "");
    } catch (error) {
      setErrorMessage("Não foi possível solicitar a redefinição: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-panel-left">
        <div className="forgot-content">
          <div className="forgot-logo">
            <div className="forgot-logo-row">
              <img src={logo} alt="Logo LicitSys" className="forgot-logo-img" />
              <img src={name} alt="LicitSys" className="forgot-logo-name" />
            </div>
            <p>Sistema de Gestão de Licitações</p>
          </div>

          <NavLink to="/login" className="forgot-back-link">
            <ArrowLeft size={18} />
            Voltar para o login
          </NavLink>

          <div className="forgot-header">
            <h2>Esqueci minha senha</h2>
            <p>Informe seu e-mail para receber as instruções de recuperação.</p>
          </div>

          <form onSubmit={enviar} className="forgot-form">
            <Input
              className="forgot-input"
              type="email"
              icon={Mail}
              placeholder="E-mail cadastrado"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            {successMessage && (
              <div className="forgot-alert success">
                <CircleCheck size={20} />
                <span>
                  {successMessage}
                  {resetLink && (
                    <a href={resetLink} className="forgot-debug-link">
                      Abrir link de redefinição
                    </a>
                  )}
                </span>
              </div>
            )}

            {errorMessage && <p className="forgot-error">{errorMessage}</p>}

            <Button type="submit" className="btn-forgot" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar instruções"}
            </Button>
          </form>
        </div>
      </div>

      <div className="forgot-panel-deco">
        <div className="forgot-deco-card">
          <img src={lighting} alt="Iluminação" className="forgot-lighting" />
          <div className="forgot-light-effect"></div>
          <img src={male_laptop} alt="Ilustração" className="forgot-ilustracao" />

          <div className="forgot-deco-text">
            <h2>Recupere o acesso <br /> com segurança.</h2>
            <p>Proteja sua conta e continue gerenciando suas licitações.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
