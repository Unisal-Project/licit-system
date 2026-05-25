import React, { useEffect, useState } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import "./Login.css"
import { logo, male_laptop, name, lighting} from "../../assets/images/images.js"
import { Button, Input } from "../../components/ui/main"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { login, saveAuth } from "../../services/authService"

function Login() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [lembrar, setLembrar] = useState(false)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const remoteUser = searchParams.get("usuario")

        if (remoteUser) {
            setEmail(remoteUser)
        }

        const remoteToken = searchParams.get("token")

        if (!remoteToken) {
            return
        }

        try {
            const [, payloadPart] = remoteToken.split(".")
            const normalizedPayload = payloadPart.replace(/-/g, "+").replace(/_/g, "/")
            const paddedPayload = normalizedPayload.padEnd(
                normalizedPayload.length + ((4 - normalizedPayload.length % 4) % 4),
                "="
            )
            const payload = JSON.parse(atob(paddedPayload))

            saveAuth({
                access_token: remoteToken,
                user: {
                    id: Number(payload.sub || 0),
                    nome: payload.nome || "Acesso remoto",
                    email: payload.email,
                    perfil: payload.perfil,
                    remoto: Boolean(payload.remote),
                    permanente: Boolean(payload.permanente),
                },
            })
            navigate("/dashboard", { replace: true })
        } catch {
            toast.error("Link de acesso inválido.")
        }
    }, [navigate, searchParams])

    const enviar = async (event) => {
        event.preventDefault()

        try {
            const data = await login(email, senha)
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
