import Badge from "../atoms/Badge";

// Molécule : un badge par type. Un pokémon peut en avoir deux, écrits « Plante / Poison »
function TypeBadges({ element }) {
  return (
    <div className="types">
      {element.split(" / ").map((type) => (
        <Badge key={type} type={type}>
          {type}
        </Badge>
      ))}
    </div>
  );
}

export default TypeBadges;
