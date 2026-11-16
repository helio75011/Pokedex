// Molécule : le haut d'une page, une note manuscrite au-dessus d'un très grand titre.
// children : ce qui s'affiche dessous (la recherche sur l'accueil, un lien…)
function Hero({ surtitre, titre, children }) {
  return (
    <header className="hero">
      {surtitre && <p className="manuscrit">{surtitre}</p>}
      <h1>{titre}</h1>
      {children}
    </header>
  );
}

export default Hero;
