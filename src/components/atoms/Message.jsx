// Atome : un message pour l'utilisateur (chargement, liste vide, erreur).
// Les lecteurs d'écran annoncent les erreurs tout de suite (alert), les autres poliment (status)
function Message({ type = "info", children }) {
  return (
    <p className={`message message--${type}`} role={type === "erreur" ? "alert" : "status"}>
      {children}
    </p>
  );
}

export default Message;
