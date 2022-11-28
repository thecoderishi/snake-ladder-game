import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import App from "./App"
import { mockRandom, resetMockRandom } from "jest-mock-random"

jest.useFakeTimers()

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

test("Player piece initialy should be outside of the board", () => {
  render(<App />)
  const playerPiece = screen.getByTestId("playerPiece")
  expect(playerPiece).toBeInTheDocument()
  expect(playerPiece).toHaveStyle("left:-40px")
  expect(playerPiece).toHaveStyle("bottom:22px")
})

test("Dice should be rendered and enabled", () => {
  render(<App />)
  const dice = screen.getByTestId("dice")
  expect(dice).toBeInTheDocument()
  fireEvent.click(dice)
})

test("Dice should give random value from 1 to 6 on each roll", () => {
  mockRandom([0.1, 0.28, 0.45, 0.57, 0.72, 0.95, 0])
  render(<App />)
  const dice = screen.getByTestId("dice")
  ;[1, 2, 3, 4, 5, 6].forEach((diceValue) => {
    act(() => {
      jest.runAllTimers()
    })
    fireEvent.click(dice)
    expect(dice).toHaveAttribute("src", `/dice-${diceValue}.png`)
  })
})

test("Player piece should move to first position only if the dice value will be 6", () => {
  mockRandom([0.95])
  render(<App />)
  const dice = screen.getByTestId("dice")
  const playerPiece = screen.getByTestId("playerPiece")
  fireEvent.click(dice)
  expect(dice).toHaveAttribute("src", `/dice-6.png`)
  expect(playerPiece).toHaveStyle("left:22px")
  expect(playerPiece).toHaveStyle("bottom:22px")
})

test("For each dice roll, player should move from it's position by the dice value", async () => {
  mockRandom([0.95, 0.96])
  render(<App />)
  const dice = screen.getByTestId("dice")
  const playerPiece = screen.getByTestId("playerPiece")
  fireEvent.click(dice)
  act(() => {
    jest.runAllTimers()
  })
  fireEvent.click(dice)
  expect(playerPiece).toHaveStyle("left:430px")
  expect(playerPiece).toHaveStyle("bottom:22px")
  resetMockRandom()
})

test("Player piece should move to respective snake tail after snake bite", async () => {
  mockRandom([0.95, 0.96, 0.96, 0.96, 0.96, 0.96, 0.45])
  render(<App />)
  const dice = screen.getByTestId("dice")
  const playerPiece = screen.getByTestId("playerPiece")
  ;[1, 2, 3, 4, 5, 6, 7].forEach(() => {
    fireEvent.click(dice)
    act(() => {
      jest.runAllTimers()
    })
  })
  expect(playerPiece).toHaveStyle("left:430px")
  expect(playerPiece).toHaveStyle("bottom:22px")
  resetMockRandom()
})
