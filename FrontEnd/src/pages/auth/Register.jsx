import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button, Input } from "../../components/ui/main";
import { lighting, logo, male_laptop, name } from "../../assets/images/images.js";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const updateField = (field, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const enviar = (event) => {
    event.preventDefault();

    console.log("Cadastro:", formData);
  };

  return (
    <div className="register-wrapper">
      <div className="register-panel-left">
          <div className="register-content">
            <div className="register-logo">
            <div className="register-logo-row">
              <img src={logo} alt="Logo LicitSys" className="register-logo-img" />
              <img src={name} alt="LicitSys" className="register-logo-name" />
            </div>

            <p>Sistema de Gestão de Licitações</p>
          </div>

          <div className="register-header">
            <h2>Crie sua conta</h2>
            <p>Informe seus dados de acesso ao sistema.</p>
          </div>

          <form onSubmit={enviar} className="register-form">
            <Input
              className="register-input"
              icon={User}
              placeholder="Nome"
              value={formData.nome}
              onChange={(event) => updateField("nome", event.target.value)}
            />

            <div className="register-fields-row">
              <Input
                className="register-input"
                icon={Mail}
                type="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
              />

              <Input
                className="register-input"
                icon={User}
                placeholder="CPF"
                value={formData.cpf}
                onChange={(event) => updateField("cpf", event.target.value)}
              />
            </div>

            <div className="register-fields-row">
              <div className="register-password-field">
                <Input
                  className="register-input"
                  icon={Lock}
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={(event) => updateField("senha", event.target.value)}
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setMostrarSenha((currentValue) => !currentValue)}
                >
                  {mostrarSenha ? <EyeOff size={21} /> : <Eye size={21} />}
                </button>
              </div>

              <div className="register-password-field">
                <Input
                  className="register-input"
                  icon={Lock}
                  type={mostrarConfirmacao ? "text" : "password"}
                  placeholder="Confirmar senha"
                  value={formData.confirmarSenha}
                  onChange={(event) => updateField("confirmarSenha", event.target.value)}
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setMostrarConfirmacao((currentValue) => !currentValue)}
                >
                  {mostrarConfirmacao ? <EyeOff size={21} /> : <Eye size={21} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="btn-register">
              Criar conta
            </Button>

            <p className="register-login-text">
              Já possui uma conta? <NavLink to="/login">Entrar</NavLink>
            </p>
          </form>
        </div>
      </div>

      <div className="register-panel-deco">
        <div className="register-deco-card">
          <img src={lighting} alt="Iluminação" className="register-lighting" />

          <div className="register-light-effect"></div>

          <img src={male_laptop} alt="Ilustração" className="register-ilustracao" />

          <div className="register-deco-text">
            <h2>Comece com controle, segurança e transparência.</h2>
            <p>Organize as licitações da sua equipe em poucos minutos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
