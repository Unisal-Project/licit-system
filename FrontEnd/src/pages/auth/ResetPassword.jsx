import { useMemo, useState } from "react";
import { ArrowLeft, CircleCheck, Eye, EyeOff, Lock } from "lucide-react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Input } from "../../components/ui/main";
import { lighting, logo, male_laptop, name } from "../../assets/images/images.js";
import { resetPassword } from "../../services/authService";
import "./ForgotPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const enviar = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!token) {
      setErrorMessage("Link de redefinição inválido.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMessage("As senhas não conferem.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await resetPassword(token, senha);
      setSuccessMessage(data?.message || "Senha redefinida com sucesso.");
      setSenha("");
      setConfirmarSenha("");

      setTimeout(() => navigate("/login", { replace: true }), 1600);
    } catch (error) {
      setErrorMessage("Não foi possível redefinir a senha: " + error.message);
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
            <h2>Redefinir senha</h2>
            <p>Crie uma nova senha para recuperar o acesso à sua conta.</p>
          </div>

          <form onSubmit={enviar} className="forgot-form">
            <div className="forgot-password-field">
              <Input
                className="forgot-input"
                type={mostrarSenha ? "text" : "password"}
                icon={Lock}
                placeholder="Nova senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />
              <button
                type="button"
                className="forgot-password-toggle"
                onClick={() => setMostrarSenha((currentValue) => !currentValue)}
              >
                {mostrarSenha ? <EyeOff size={21} /> : <Eye size={21} />}
              </button>
            </div>

            <div className="forgot-password-field">
              <Input
                className="forgot-input"
                type={mostrarConfirmacao ? "text" : "password"}
                icon={Lock}
                placeholder="Confirmar nova senha"
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                required
              />
              <button
                type="button"
                className="forgot-password-toggle"
                onClick={() => setMostrarConfirmacao((currentValue) => !currentValue)}
              >
                {mostrarConfirmacao ? <EyeOff size={21} /> : <Eye size={21} />}
              </button>
            </div>

            {successMessage && (
              <div className="forgot-alert success">
                <CircleCheck size={20} />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && <p className="forgot-error">{errorMessage}</p>}

            <Button type="submit" className="btn-forgot" disabled={isSubmitting}>
              {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
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
            <h2>Seu acesso protegido.</h2>
            <p>Use uma senha segura e mantenha sua conta em boas mãos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
