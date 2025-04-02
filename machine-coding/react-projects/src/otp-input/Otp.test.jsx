import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import Otp from "./Otp";

//render
//correct no of boxes
//move focus to next input
//move focus to previous input
//does not change focus when full
//only allows per character

describe("Otp Component", () => {
  beforeEach(() => {
    render(<Otp length={4} />);
  });

  it("renders the correct number of input boxes", () => {
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(4); // Should match the length prop
  });

  it("moves focus to the next input box on input", async () => {
    const inputs = screen.getAllByRole("textbox");

    await userEvent.type(inputs[0], "1");

    expect(inputs[1]).toHaveFocus();
  });

  it("moves focus back on backspace if input is empty", async () => {
    render(<Otp length={4} />); // Ensure component is rendered

    const inputs = screen.getAllByRole("textbox");

    await userEvent.type(inputs[0], "1");
    await userEvent.type(inputs[1], "2");

    await userEvent.clear(inputs[1]); // Ensure input is empty before Backspace
    await userEvent.keyboard("{Backspace}"); // Simulate Backspace key

    expect(inputs[0]).toHaveFocus();
  });

  it("does not move focus forward when box is full", async () => {
    const inputs = screen.getAllByRole("textbox");

    await userEvent.type(inputs[0], "1"); // Type first character
    expect(inputs[1]).toHaveFocus(); // Focus should move

    await userEvent.type(inputs[0], "2"); // Try typing second character in the same box
    expect(inputs[0].value).toBe("1"); // It should still contain only "1"
  });

  it("only allows one character per input", async () => {
    const inputs = screen.getAllByRole("textbox");

    await userEvent.type(inputs[0], "99");

    expect(inputs[0].value).toBe("9"); // Should only keep one character
  });
});
