import Button from "../atoms/Button";

// Molécule : deux boutons et le numéro de la page
function Pagination({ page, totalPages, onPrev, onNext, disablePrev, disableNext }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <Button onClick={onPrev} disabled={disablePrev}>
        ◀ Page précédente
      </Button>
      <span>
        Page {page} sur {totalPages}
      </span>
      <Button onClick={onNext} disabled={disableNext}>
        Page suivante ▶
      </Button>
    </nav>
  );
}

export default Pagination;
