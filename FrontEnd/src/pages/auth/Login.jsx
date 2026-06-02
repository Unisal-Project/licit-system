import React, { useState } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import "./Login.css"
import { logo, male_laptop, name, lighting} from "../../assets/images/images.js"
import { Button, Input } from "../../components/ui/main"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { login, saveAuth } from "../../services/authService"

function Login() {
    const [searchParams] = useSearchParams()
    const [email, setEmail] = useState(() => searchParams.get("usuario") || "")
    const [senha, setSenha] = useState("")
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [lembrar, setLembrar] = useState(false)
    const navigate = useNavigate()

    const enviar = async (event) => {
        event.preventDefault()

        try {
            const data = await login(email, senha, lembrar)
            saveAuth(data)
            navigate("/dashboard")
        } catch (error) {
            toast.error("Erro ao fazer login: " + error.message)
        }
    }

    return (
        <div className='wrapper'>
            <div className='panel-left'>
                <div className='login-content'>

                    <div className='logo'>
                        <div className='logo-row'>
                            <img src={logo} alt="Logo LicitSys" className='logo-img' />
                            <img src={name} alt="LicitSys" className='logo-name' />
                            <p>Sistema de Gestão de Licitações</p>
                        </div>
                    </div>

                    <div className='form-header'>
                        <h2>Olá!</h2>
                        <p>Por favor, preencha os campos abaixo.</p>
                    </div>

                    <form onSubmit={enviar} className='login-form'>

                        <Input
                            className="input-login"
                            type='text'
                            icon={User}
                            placeholder='E-mail ou usuário'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className='password-field'>
                            <Input
                                className="input-password"
                                type={mostrarSenha ? "text" : "password"}
                                icon={Lock}
                                placeholder='Senha'
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />

                            <button
                                type='button'
                                className='password-toggle'
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                            >
                                {mostrarSenha ? <EyeOff size={25} /> : <Eye size={25} />}
                            </button>
                        </div>

                        <div className='opcoes'>
                            <label className='checkbox-label'>
                                <input
                                    type='checkbox'
                                    checked={lembrar}
                                    onChange={(e) => setLembrar(e.target.checked)}
                                />
                                Lembrar de mim
                            </label>

                            <NavLink to="/forgot-password" className='forgot-link'>
                                Esqueci minha senha
                            </NavLink>
                        </div>

                        <Button
                            type="submit"
                            className="btn-login"
                        >
                            Entrar
                        </Button>

                        <p className='register-text'>
                            Não possui uma conta? <NavLink to="/register">Cadastre-se</NavLink>
                        </p>
                    </form>
                </div>
            </div>

            <div className='panel-deco'>
                <div className='deco-card'>

                    <img src={lighting} alt="Iluminação" className='lighting'/>

                    <div className='light-effect'></div>

                    <img src={male_laptop} alt="Ilustração" className='ilustracao' />

                    <div className='deco-text'>
                        <h2>Gestão eficiente, <br /> transparente e segura.</h2>
                        <p>Tudo que você precisa em um só lugar.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
