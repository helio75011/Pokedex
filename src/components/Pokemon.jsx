function Pokemon({ nom, element, poids }) {
  return (
    <div className="pokemon">
      <h3>{nom}</h3>
      <p className={`element ${element}`}>{element}</p>
      <p className="poids">{poids} kg</p>
    </div>
  );
}

export default Pokemon;
