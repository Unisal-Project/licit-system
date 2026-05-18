import React from 'react';
import { useState } from "react"
import Select from "react-select";
import Sidebar from '../../components/layout/Sidebar';
import Input  from "../../components/ui/Input/Input"
import Button from "../../components/ui/Button/Button"
import { Home, ArrowLeft, Copy, AlertCircle, User, Lock, Link } from "lucide-react"
import { useNavigate } from 'react-router-dom';
import { customSelectStyles } from "../../components/shared/styleSelect";
import "./RemoteAccess.css"

const PERFIL_OPTIONS = [
  { value: "Apenas visualização", label: "Apenas visualização" },
  { value: "Editor", label: "Editor" },
  { value: "Administrador", label: "Administrador" },
];

const VALIDADE_OPTIONS = [
  { value: "7 dias", label: "7 dias" },
  { value: "15 dias", label: "15 dias" },
  { value: "30 dias", label: "30 dias" },
];

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
    perfil: "",
    validade: "",
    mensagem: "",
  })
  const [linkGerado, setLinkGerado] = useState("")
  const [copiado, setCopiado] = useState(false)

  const handleChange = (campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }))
  }

  const handleGerarLink = () => {
    const link = ``
    setLinkGerado(link)
    console.log("Link gerado:", link)
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
                <p>Crie um convite para que o prefeito ou outra pessoa possa acessar o sistema</p>
              </div>
            </div>

            <div className="campos-linha">
              <div className="campo">
                <label>Usuário de acesso</label>
                <Input
                  className="input-user"
                  icon={User}
                  placeholder="Nome"
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
                  placeholder="••••••••"
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
                  options={VALIDADE_OPTIONS}
                  placeholder="Selecione"
                  value={getSelectedOption(VALIDADE_OPTIONS, dados.validade)}
                  onChange={(selectedOption) =>
                    handleChange("validade", selectedOption ? selectedOption.value : "")
                  }
                  styles={customSelectStyles}
                  isSearchable={false}
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

            <div className="acesso-botoes">
              <Button variant="primary" onClick={handleGerarLink} className="btn-gerar">
                <Link size={18} />
                Gerar Link de Acesso
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
              <div className="link-aviso">
                <AlertCircle size={14} />
                <span>O link expira em 7 dias ou após o primeiro acesso</span>
              </div>
            </div>

            <div className="como-funciona">
              <p className="como-titulo">Como funciona:</p>
              <div className="passo">
                <div className="passo-numero">1</div>
                <p>Você gera e envia o link de convite</p>
              </div>
              <div className="passo-linha"></div>
              <div className="passo">
                <div className="passo-numero">2</div>
                <p>O novo usuario recebe, cria a conta e ativa o acesso</p>
              </div>
              <div className="passo-linha"></div>
              <div className="passo">
                <div className="passo-numero">3</div>
                <p>O usuário fica salvo na lista para próximos acessos</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default RemoteAccess
