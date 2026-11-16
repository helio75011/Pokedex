// Molécule : un libellé et son champ (input, select…). Le champ est placé dans la balise
// <label> : cliquer sur le libellé active le champ, et les lecteurs d'écran le lisent
function FormField({ label, children }) {
  return (
    <label className="champ">
      {label}
      {children}
    </label>
  );
}

export default FormField;
