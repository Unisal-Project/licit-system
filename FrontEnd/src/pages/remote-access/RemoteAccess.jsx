import React from 'react';
import { useState } from "react"
import Select from "react-select";
import Sidebar from '../../components/layout/Sidebar';
import Input  from "../../components/ui/Input/Input"
import Button from "../../components/ui/Button/Button"
import { Home, ArrowLeft, Copy, AlertCircle, User, Lock, Link } from "lucide-react"
import { useNavigate } from 'react-router-dom';
import { customSelectStyles } from "../../components/shared/styleSelect";
import { USER_ROLES } from "../../utils/permissions";
import { generateRemoteAccess } from "../../services/authService";
import "./RemoteAccess.css"

const PERFIL_OPTIONS = [
  { value: USER_ROLES.VISITOR, label: "Visitante" },
  { value: USER_ROLES.EDITOR, label: "Editor" },
];

const VALIDADE_OPTIONS = [
  { value: "7", label: "7 dias" },
  { value: "15", label: "15 dias" },
  { value: "30", label: "30 dias" },
  { value: "permanente", label: "Permanente" },
];

const VISITOR_VALIDITY_OPTION = { value: "24h", label: "24 horas" };

const getSelectedOption = (options, value) => {
  return options.find((option) => option.value === value) || null;
};

function PageHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="page-header">
      <div className="page-header-esquerda">
        <button
          type="button"
          className="back-button-create"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={26} />
        </button>
        <div>
          <h1>Acesso Remoto</h1>
          <p>Gerencie os usuários que podem ter acesso remoto</p>
        </div>
      </div>
      <div className="breadcrumb">
        <Home size={14} />
        <span>/</span>
        <span>Licitações</span>
        <span>/</span>
        <span className="breadcrumb-ativo">Acesso Remoto</span>
      </div>
    </div>
  )
}

function RemoteAccess() {
  const selectMenuPortalTarget =
    typeof document !== "undefined" ? document.body : undefined;

  const [dados, setDados] = useState({
    usuario: "",
    senha: "",
    perfil: USER_ROLES.VISITOR,
    validade: "24h",
    mensagem: "",
  })
  const [linkGerado, setLinkGerado] = useState("")
  const [credenciais, setCredenciais] = useState(null)
  const [copiado, setCopiado] = useState(false)
  const [erro, setErro] = useState("")
  const [expiracaoTexto, setExpiracaoTexto] = useState("")
  const [gerando, setGerando] = useState(false)

  const handleChange = (campo, valor) => {
    setDados(prev => {
      if (campo === "perfil" && valor === USER_ROLES.VISITOR) {
        return { ...prev, perfil: valor, validade: "24h" }
      }

      if (campo === "perfil" && valor === USER_ROLES.EDITOR) {
        return { ...prev, perfil: valor, validade: "7" }
      }

      return { ...prev, [campo]: valor }
    })
  }

  const handleGerarLink = async () => {
    setErro("")
    setLinkGerado("")
    setCredenciais(null)
    setExpiracaoTexto("")

    if (!dados.usuario.trim() || !dados.senha.trim()) {
      setErro("Informe o usuário e a senha de acesso.")
      return
    }

    try {
      setGerando(true)
      const isEditor = dados.perfil === USER_ROLES.EDITOR
      const permanente = isEditor && dados.validade === "permanente"
      const response = await generateRemoteAccess({
        perfil: dados.perfil,
        usuario: dados.usuario,
        senha: dados.senha,
        permanente,
        validade_dias: isEditor && !permanente ? Number(dados.validade || 7) : undefined,
      })

      setLinkGerado(response.link_acesso)
      setCredenciais({
        usuario: response.usuario,
        senha: response.senha,
        perfil: response.perfil,
      })
      setExpiracaoTexto(
        response.permanente
          ? "Acesso permanente"
          : response.expira_em
            ? `Expira em ${new Date(response.expira_em).toLocaleString("pt-BR")}`
            : "Expiração não informada"
      )
    } catch (error) {
      setErro("Erro ao gerar acesso remoto: " + error.message)
    } finally {
      setGerando(false)
    }
  }

  const handleCopiar = () => {
    navigator.clipboard.writeText(linkGerado)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="wrapper remote-access-page">
      <Sidebar />
      <main className="main">
        <PageHeader />

        <div className="acesso-card">

          <div className="acesso-form">
            <div className="acesso-card-titulo">
              <div className="acesso-icon">
                <i className="bi bi-send"></i>
              </div>
              <div>
                <h2>Gerar link de Acesso</h2>
                <p>Crie um link com permissões temporárias para acessar o sistema</p>
              </div>
            </div>

            <div className="campos-linha">
              <div className="campo">
                <label>Usuário de acesso</label>
                <Input
                  className="input-user"
                  icon={User}
                  placeholder="Usuário"
                  value={dados.usuario}
                  onChange={(e) => handleChange('usuario', e.target.value)}
                />
              </div>
              <div className="campo">
                <label>Senha de acesso</label>
                <Input
                  className="input-senha"
                  isPassword={true}
                  icon={Lock}
                  placeholder="Senha"
                  value={dados.senha}
                  onChange={(e) => handleChange('senha', e.target.value)}
                />
              </div>
            </div>

            <div className="campos-linha">
              <div className="campo">
                <label>Perfil de acesso</label>
                <Select
                  classNamePrefix="remote-react-select"
                  options={PERFIL_OPTIONS}
                  placeholder="Selecione"
                  value={getSelectedOption(PERFIL_OPTIONS, dados.perfil)}
                  onChange={(selectedOption) =>
                    handleChange("perfil", selectedOption ? selectedOption.value : "")
                  }
                  styles={customSelectStyles}
                  isSearchable={false}
                  menuPortalTarget={selectMenuPortalTarget}
                  menuPosition="fixed"
                />
              </div>

              <div className="campo">
                <label>Validade do Link</label>
                <Select
                  classNamePrefix="remote-react-select"
                  options={dados.perfil === USER_ROLES.VISITOR ? [VISITOR_VALIDITY_OPTION] : VALIDADE_OPTIONS}
                  placeholder="Selecione"
                  value={dados.perfil === USER_ROLES.VISITOR
                    ? VISITOR_VALIDITY_OPTION
                    : getSelectedOption(VALIDADE_OPTIONS, dados.validade)}
                  onChange={(selectedOption) =>
                    handleChange("validade", selectedOption ? selectedOption.value : "")
                  }
                  styles={customSelectStyles}
                  isSearchable={false}
                  isDisabled={dados.perfil === USER_ROLES.VISITOR}
                  menuPortalTarget={selectMenuPortalTarget}
                  menuPosition="fixed"
                />
              </div>
            </div>

            <div className="campo">
              <label>Mensagem <span className="opcional">(opcional)</span></label>
              <textarea
                className="textarea"
                placeholder='Olá! Você foi convidado a acessar o sisteman de licitaçoes. crie sua conta clicando no link abaixo.'
                value={dados.mensagem}
                onChange={(e) => handleChange('mensagem', e.target.value)}
              />
            </div>

            {erro && <p className="remote-error">{erro}</p>}

            <div className="acesso-botoes">
              <Button variant="primary" onClick={handleGerarLink} className="btn-gerar" disabled={gerando}>
                <Link size={18} />
                {gerando ? "Gerando..." : "Gerar Link de Acesso"}
              </Button>
            </div>
          </div>

          <div className="divisor"></div>

          <div className="acesso-info">
            <div className="link-gerado-box">
              <label>Link gerado:</label>
              <div className="link-input">
                <input
                  type="text"
                  readOnly
                  value={linkGerado || ""}
                  placeholder=""
                />
                <button className="btn-copiar" onClick={handleCopiar}>
                  <Copy size={18} />
                </button>
              </div>
              {copiado && <span className="copiado-msg">Copiado!</span>}
              {credenciais && (
                <div className="credenciais-box">
                  <strong>Dados para enviar:</strong>
                  <span>Usuário: {credenciais.usuario}</span>
                  <span>Senha: {credenciais.senha}</span>
                  <span>Perfil: {credenciais.perfil}</span>
                </div>
              )}
              <div className="link-aviso">
                <AlertCircle size={14} />
                <span>{expiracaoTexto || "Visitante expira em 24 horas. Editor pode ter validade personalizada ou permanente."}</span>
              </div>
            </div>

            <div className="como-funciona">
              <p className="como-titulo">Como funciona:</p>
              <div className="passo">
                <div className="passo-numero">1</div>
                <p>Você cria o usuário e envia o link de acesso</p>
              </div>
              <div className="passo-linha"></div>
              <div className="passo">
                <div className="passo-numero">2</div>
                <p>A pessoa abre o link e entra com usuário e senha</p>
              </div>
              <div className="passo-linha"></div>
              <div className="passo">
                <div className="passo-numero">3</div>
                <p>As permissões vêm do perfil definido no cadastro</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default RemoteAccess
