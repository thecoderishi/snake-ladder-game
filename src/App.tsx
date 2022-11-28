import React, { useState, useEffect } from "react"
import "./App.css"

// Constant values
const TILE_GAP = 4
const TILE_SIZE = 60
const PIECE_SIZE = 24

// Snake head and tail points
const SNAKES: { [snakeHead: number]: number } = {
  98: 35,
  89: 53,
  33: 6,
  40: 22,
}

const SingleRow = ({ rowIdx }: { rowIdx: number }) => {
  const arr = Array.from(Array(10).keys())
  if (rowIdx % 2 !== 0) arr.reverse()
  return (
    <div className="singleRow">
      {arr.map((idx) => (
        <div
          key={idx}
          id={`tile-${rowIdx * 10 + idx}`}
          className={idx % 2 === 0 ? "oddTile" : "evenTile"}
        >
          <span className={idx % 2 === 0 ? "oddCount" : "evenCount"}>
            {rowIdx * 10 + idx + 1}
          </span>
        </div>
      ))}
    </div>
  )
}

const AllRows = () => {
  return (
    <>
      {Array(10)
        .fill(0)
        .map((_, rowIdx) => (
          <SingleRow key={rowIdx} rowIdx={9 - rowIdx} />
        ))}
    </>
  )
}

const App = () => {
  const [diceValue, setDiceValue] = useState<any>(1)
  const [playerPiecePosition, setPlayerPiecePosition] = useState<number>(-1)
  const [pieceLeft, setPieceLeft] = useState<number>(-40)
  const [pieceBottom, setPieceBottom] = useState<number>(22)
  const [gameStatus, setGameStatus] = useState<string>("Not Started")
  const [diceDisabled, setDiceDisabled] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  // Roll the dice
  const rollDice = () => {
    if (diceDisabled) return
    const randomDice = Math.floor(6 * Math.random()) + 1
    setDiceDisabled(true)
    setDiceValue(randomDice)
    updatePlayerPiecePosition(randomDice)
  }

  // Updating the player postion and game status
  const updatePlayerPiecePosition = (rolledDiceValue: number) => {
    setDiceValue(rolledDiceValue)
    if (playerPiecePosition === -1 && rolledDiceValue === 6) {
      setPlayerPiecePosition(0)
      positionCalculate(0)
      setGameStatus("Running...")
    } else if (
      playerPiecePosition > -1 &&
      playerPiecePosition + rolledDiceValue < 100
    ) {
      setPlayerPiecePosition((oldPosition) => rolledDiceValue + oldPosition)
      positionCalculate(rolledDiceValue + playerPiecePosition)
    }
    if (playerPiecePosition + rolledDiceValue === 99) {
      setGameStatus("Finished!")
      setDiceDisabled(true)
      setIsDialogOpen(true)
    }
  }

  // Calculating the position to place player piece
  const positionCalculate = (playerPiecePosition: number) => {
    const bottomCount = Math.floor(playerPiecePosition / 10)
    const leftCount = playerPiecePosition % 10

    const bottom = Math.floor(
      bottomCount * (TILE_SIZE + TILE_GAP * 2) +
        TILE_SIZE / 2 -
        PIECE_SIZE / 2 +
        4
    )

    let left = Math.floor(leftCount * (TILE_SIZE + TILE_GAP * 2))
    if (bottomCount % 2 !== 0)
      left =
        TILE_SIZE * 10 +
        TILE_GAP * 20 -
        left -
        TILE_SIZE / 2 -
        TILE_GAP / 2 -
        PIECE_SIZE / 2
    else left += TILE_SIZE / 2 - TILE_GAP / 2 - 6

    setPieceLeft(left)
    setPieceBottom(bottom)
  }

  // Reset game
  const resetGame = () => {
    setDiceValue(1)
    setPlayerPiecePosition(-1)
    setPieceLeft(-40)
    setPieceBottom(22)
    setGameStatus("Not Started")
    setDiceDisabled(false)
    setIsDialogOpen(false)
  }

  //   Logging the status of the game
  useEffect(() => {
    if (gameStatus !== "Finished!") {
      const timeout = setTimeout(() => {
        setDiceDisabled(false)
      }, 1000)

      return () => clearTimeout(timeout)
    }

    console.log(`
        Dice Value : ${diceValue}
        Players Position : ${
          playerPiecePosition > -1
            ? playerPiecePosition + 1
            : "Outside the board"
        }
        Game Status : ${gameStatus}
      `)
  }, [diceValue, playerPiecePosition, gameStatus, diceDisabled])

  // Handle snake bite
  useEffect(() => {
    const snakeTail = SNAKES[playerPiecePosition]
    if (snakeTail) {
      setTimeout(() => {
        setPlayerPiecePosition(snakeTail)
        positionCalculate(snakeTail)
      }, 1000)
    }
  }, [playerPiecePosition])

  return (
    <div className="App">
      <div className="gameBoard">
        <AllRows />
        <div
          data-testid="playerPiece"
          className="playerPiece"
          style={{ left: `${pieceLeft}px`, bottom: `${pieceBottom}px` }}
        ></div>
        <div>
          <img className="snake snake-1" src="snake-1.png" alt="snake-1" />
          <img className="snake snake-2" src="snake-2.png" alt="snake-2" />
          <img className="snake snake-3" src="snake-3.png" alt="snake-3" />
          <img className="snake snake-4" src="snake-4.png" alt="snake-4" />
        </div>
      </div>
      <div className={`diceContainer ${diceDisabled && "diceDisabled"}`}>
        <img
          data-testid="dice"
          className={`dice`}
          src={`/dice-${diceValue}.png`}
          alt="dice"
          onClick={rollDice}
        />
      </div>
      <div
        className="dialogBox"
        style={{ display: isDialogOpen ? "block" : "none" }}
      >
        <div className="dialogBoxContent">
          <p>Game Finished...</p>
          <div style={{ display: "flex" }}>
            <button className="button" onClick={() => setIsDialogOpen(false)}>
              Ok
            </button>
            <button className="button" onClick={resetGame}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
