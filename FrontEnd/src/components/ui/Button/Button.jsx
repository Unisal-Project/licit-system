import './Button.css';

function Button({children, onClick, type = "button", className= "", variant = "primary", icon, as: Component = 'button', ...props}) {
    return(
        <Component onClick={onClick} type={type} className={`btn ${variant} ${className}`} {...props}>
            {icon && <i className={icon}></i>}
            {children}
        </Component>
    )
}

export default Button;