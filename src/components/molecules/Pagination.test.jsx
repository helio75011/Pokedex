import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Pagination from "./Pagination";

describe("Pagination (test unitaire)", () => {
  it("désactive « Page précédente » sur la première page", () => {
    render(
      <Pagination
        page={1}
        totalPages={13}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        disablePrev={true}
        disableNext={false}
      />,
    );

    expect(screen.getByRole("button", { name: /précédente/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /suivante/ })).toBeEnabled();
    expect(screen.getByText("Page 1 sur 13")).toBeInTheDocument();
  });

  it("appelle onNext quand on clique sur « Page suivante »", async () => {
    const onNext = vi.fn();
    render(
      <Pagination
        page={2}
        totalPages={13}
        onPrev={vi.fn()}
        onNext={onNext}
        disablePrev={false}
        disableNext={false}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /suivante/ }));

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
