import { useEffect, useState } from "react";
import { ArrowLeft, Home, Lock, Mail, Pencil, Save, User, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import { getCurrentUserProfile, updateCurrentUserPassword } from "../../services/userService";
import "./Settings.css";

const EMPTY_PROFILE = {
  nome: "",
  email: "",
  perfil: "",
};

const INITIAL_PASSWORD_FORM = {
  senhaAtual: "",
  novaSenha: "",
  confirmarSenha: "",
};

function SettingsHeader() {
  const navigate = useNavigate();

  return (
    <header className="settings-header">
      <div className="settings-header-left">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} />
        </button>

        <div>
          <h1>Configurações</h1>
          <p>Gerencie seu perfil e altere sua senha de acesso</p>
        </div>
      </div>

      <nav className="settings-breadcrumb" aria-label="breadcrumb">
        <Home size={15} />
        <span>/</span>
        <strong>Configurações</strong>
      </nav>
    </header>
  );
}

function SettingsCard({ icon: Icon, title, subtitle, action, children }) {
  return (
    <section className="settings-card settings-simple-card">
      <div className="settings-card-header">
        <Icon size={26} />
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        {action && <div className="settings-card-action">{action}</div>}
      </div>

      <div className="settings-card-body">{children}</div>
    </section>
  );
}

function SettingsField({ label, icon: Icon, type = "text", value, placeholder, disabled, isPassword = false, onChange }) {
  return (
    <label className="settings-field">
      <span>{label}</span>
      <Input
        icon={Icon}
        type={type}
        isPassword={isPassword}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Settings() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [draftProfile, setDraftProfile] = useState(EMPTY_PROFILE);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [passwordForm, setPasswordForm] = useState(INITIAL_PASSWORD_FORM);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setIsLoadingProfile(true);
        const user = await getCurrentUserProfile();
        const nextProfile = {
          nome: user.nome || "",
          email: user.email || "",
          perfil: user.perfil || "",
        };

        if (!isMounted) return;

        setProfile(nextProfile);
        setDraftProfile(nextProfile);
        setProfileError("");
      } catch (error) {
        if (!isMounted) return;
        setProfileError(error.message);
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateDraftProfile = (field, value) => {
    setDraftProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
  };

  const updatePasswordForm = (field, value) => {
    setPasswordForm((currentPasswordForm) => ({
      ...currentPasswordForm,
      [field]: value,
    }));
  };

  const startProfileEdit = () => {
    setDraftProfile(profile);
    setIsEditingProfile(true);
  };

  const cancelProfileEdit = () => {
    setDraftProfile(profile);
    setIsEditingProfile(false);
  };

  const saveProfile = () => {
    // Futuro backend: await updateUserProfile(draftProfile)
    setProfile(draftProfile);
    setIsEditingProfile(false);
  };

  const changePassword = async () => {
    setPasswordFeedback({ type: "", message: "" });

    if (!passwordForm.senhaAtual || !passwordForm.novaSenha || !passwordForm.confirmarSenha) {
      setPasswordFeedback({ type: "error", message: "Preencha todos os campos de senha." });
      return;
    }

    if (passwordForm.novaSenha.length < 8) {
      setPasswordFeedback({ type: "error", message: "A nova senha precisa ter pelo menos 8 caracteres." });
      return;
    }

    if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
      setPasswordFeedback({ type: "error", message: "A confirmação não confere com a nova senha." });
      return;
    }

    try {
      setIsChangingPassword(true);
      await updateCurrentUserPassword({
        senhaAtual: passwordForm.senhaAtual,
        novaSenha: passwordForm.novaSenha,
      });
      setPasswordForm(INITIAL_PASSWORD_FORM);
      setPasswordFeedback({ type: "success", message: "Senha alterada com sucesso." });
    } catch (error) {
      setPasswordFeedback({ type: "error", message: error.message });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="settings-page">
      <Sidebar />

      <main className="settings-main">
        <SettingsHeader />

        <div className="settings-layout">
          <aside className="settings-profile-panel">
            <div className="settings-avatar-wrap">
              <div className="settings-avatar">
                <User size={48} />
              </div>
            </div>

            <h2>{isLoadingProfile ? "Carregando..." : profile.nome}</h2>
            <p>{profile.perfil || "Perfil do usuário"}</p>

            <div className="settings-profile-meta">
              <span>{profile.email}</span>
            </div>
          </aside>

          <div className="settings-content">
            <SettingsCard
              icon={User}
              title="Dados do perfil"
              subtitle="Dados pessoais carregados da conta do usuário"
              action={
                isEditingProfile ? (
                  <button
                    type="button"
                    className="settings-icon-button"
                    onClick={cancelProfileEdit}
                    title="Cancelar edição"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="settings-icon-button"
                    onClick={startProfileEdit}
                    title="Editar dados"
                  >
                    <Pencil size={18} />
                  </button>
                )
              }
            >
              {profileError && (
                <p className="settings-feedback">{profileError}</p>
              )}

              <div className="settings-field-grid">
                <label className="settings-field settings-field-full">
                  <span>Nome</span>
                  <Input
                    icon={User}
                    value={draftProfile.nome}
                    placeholder="Digite seu nome"
                    disabled={!isEditingProfile}
                    onChange={(event) => updateDraftProfile("nome", event.target.value)}
                  />
                </label>

                <SettingsField
                  label="E-mail"
                  icon={Mail}
                  type="email"
                  value={draftProfile.email}
                  placeholder="email@exemplo.com"
                  disabled={!isEditingProfile}
                  onChange={(value) => updateDraftProfile("email", value)}
                />
              </div>

              {isEditingProfile && (
                <footer className="settings-actions">
                  <Button variant="secondary" onClick={cancelProfileEdit}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={saveProfile}>
                    <Save size={18} />
                    Salvar dados
                  </Button>
                </footer>
              )}
            </SettingsCard>

            <SettingsCard
              icon={Lock}
              title="Redefinir senha"
              subtitle="Crie uma nova senha caso tenha esquecido ou precise acessar em outro dispositivo"
            >
              <div className="settings-field-grid">
                <SettingsField
                  label="Senha atual"
                  icon={Lock}
                  isPassword
                  value={passwordForm.senhaAtual}
                  placeholder="Digite sua senha atual"
                  onChange={(value) => updatePasswordForm("senhaAtual", value)}
                />

                <SettingsField
                  label="Nova senha"
                  icon={Lock}
                  isPassword
                  value={passwordForm.novaSenha}
                  placeholder="Digite a nova senha"
                  onChange={(value) => updatePasswordForm("novaSenha", value)}
                />

                <label className="settings-field">
                  <span>Confirmar nova senha</span>
                  <Input
                    icon={Lock}
                    isPassword
                    value={passwordForm.confirmarSenha}
                    placeholder="Confirme a nova senha"
                    onChange={(event) => updatePasswordForm("confirmarSenha", event.target.value)}
                  />
                </label>
              </div>

              <NavLink
                to={`/forgot-password?email=${encodeURIComponent(profile.email || draftProfile.email || "")}`}
                className="settings-forgot-password-link"
              >
                Não sei minha senha atual
              </NavLink>

              {passwordFeedback.message && (
                <p className={`settings-feedback settings-feedback-${passwordFeedback.type}`}>
                  {passwordFeedback.message}
                </p>
              )}

              <footer className="settings-actions">
                <Button variant="primary" onClick={changePassword} disabled={isChangingPassword}>
                  <Save size={18} />
                  {isChangingPassword ? "Alterando..." : "Redefinir senha"}
                </Button>
              </footer>
            </SettingsCard>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
