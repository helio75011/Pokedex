import { ELEMENTS } from "../../data/elements";
import Badge from "../atoms/Badge";

// Molécule : une bande de types qui défile. C'est une décoration : aria-hidden la cache
// aux lecteurs d'écran. La liste est écrite deux fois : quand la première a fini de défiler,
// la seconde a pris exactement sa place, et l'animation repart sans que ça se voie
function Marquee() {
  return (
    <div className="defilant" aria-hidden="true">
      <div className="defilant__piste">
        {[...ELEMENTS, ...ELEMENTS].map((type, index) => (
          <Badge key={index} type={type}>
            {type}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
