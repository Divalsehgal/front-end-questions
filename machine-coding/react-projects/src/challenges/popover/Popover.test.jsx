import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import Popover from "./Popover";

//first it should render ==> render
//when button click show popover =>> button click   (to be in document)
//when clicks outside popover close  =>> fire-event (not to be in document)
describe("Popover Component", () => {
  beforeEach(() => {
    render(<Popover />);
  });

  it("renders the button", () => {
    expect(screen.getByText("click me")).toBeInTheDocument();
  });

  it("opens popover when clicking the button", async () => {
    const button = screen.getByText("click me");
    await userEvent.click(button);
    expect(screen.getByText(/Hi this is Pop over/i)).toBeInTheDocument();
  });

  it("closes popover when clicking outside", async () => {
    const button = screen.getByText("click me");
    await userEvent.click(button);

    // Ensure popover is open
    expect(screen.getByText(/Hi this is Pop over/i)).toBeInTheDocument();

    // Click outside
    fireEvent.click(document.body);

    // Expect popover to close
    expect(screen.queryByText(/Hi this is Pop over/i)).not.toBeInTheDocument();
  });
});
