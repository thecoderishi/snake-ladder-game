import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import App from "./App"
import Dice from "react-dice-roll"

test("The board will have total 100 tiles, 50 even tiles and 50 odd tiles", () => {
  const { container } = render(<App />)
  // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
  const oddTile = container.querySelectorAll(".oddTile")
  // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
  const evenTile = container.querySelectorAll(".evenTile")
  expect(oddTile).toBeDefined()
  expect(evenTile).toBeDefined()
  expect(oddTile).toHaveLength(50)
  expect(evenTile).toHaveLength(50)
})

test("Dice should be rendered and enabled and check default value should be 1", () => {
  render(<App />)
  const diceButton = screen.getByRole("button")
  expect(diceButton).toBeInTheDocument()
  expect(diceButton).toBeEnabled()
  expect(diceButton.classList.contains("one")).toBe(true)
})

test("Rolling the dice to check if value is updating", async () => {
  render(<App />)
  const diceButton = screen.getByRole("button")
  fireEvent.click(diceButton)
  await new Promise((r) => setTimeout(r, 1100))
  expect(diceButton.classList.contains("one")).toBe(false)
})
