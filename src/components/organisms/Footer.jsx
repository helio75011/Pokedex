// Organisme : le pied de page, présent sur toutes les pages
function Footer() {
  return (
    <footer className="pied">
      <p className="pied__logo">Pokédex</p>
      <div className="pied__bas">
        <p className="manuscrit">Fait avec React, pour le TP Pokédex</p>
        <p>
          Données et images : <a href="https://pokeapi.co">PokéAPI</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
