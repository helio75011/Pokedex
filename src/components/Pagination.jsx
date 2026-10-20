function Pagination({ page, totalPages, onPrev, onNext, disablePrev, disableNext }) {
  return (
    <div className="pagination">
      <button onClick={onPrev} disabled={disablePrev}>
        ◀ Page précédente
      </button>
      <span>
        Page {page} sur {totalPages}
      </span>
      <button onClick={onNext} disabled={disableNext}>
        Page suivante ▶
      </button>
    </div>
  );
}

export default Pagination;
