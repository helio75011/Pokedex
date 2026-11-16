// Atome : une étiquette arrondie. « type » lui donne la couleur de ce type (voir App.css)
function Badge({ type, children }) {
  return (
    <span className="badge" data-type={type}>
      {children}
    </span>
  );
}

export default Badge;
