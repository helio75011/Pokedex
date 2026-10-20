function Pokemon({ nom, element, image, poids }) {
  return (
    <div className="pokemon">
      <img src={image} alt={nom} width="120" height="120" loading="lazy" />
      <h3>{nom}</h3>
      <p className="element">{element}</p>
      <p className="poids">{poids} kg</p>
    </div>
  );
}

export default Pokemon;
