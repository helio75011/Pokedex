// Atome : un bouton. « variante » choisit son style : principal, lien ou icone
function Button({ variante = "principal", type = "button", className = "", ...props }) {
  return (
    <button type={type} className={`bouton bouton--${variante} ${className}`.trim()} {...props} />
  );
}

export default Button;
