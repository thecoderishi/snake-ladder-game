import React, { useState, useEffect } from "react"
import Dice from "react-dice-roll"
import "./App.css"

// Constant values
const TILE_GAP = 4
const TILE_SIZE = 60
const PIECE_SIZE = 24

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
  const [diceValue, setDiceValue] = useState<number>(1)
  const [playerPiecePosition, setPlayerPiecePosition] = useState<number>(-1)
  const [pieceLeft, setPieceLeft] = useState<number>(-40)
  const [pieceBottom, setPieceBottom] = useState<number>(22)
  const [gameStatus, setGameStatus] = useState<string>("Not Started")
  const [diceDisabled, setDiceDisabled] = useState(false)

  // Updating the player postion and game status
  const updatePlayerPiecePosition = (rolledDiceValue: number) => {
    setDiceValue(rolledDiceValue)
    setDiceDisabled(true)
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
    if (playerPiecePosition + rolledDiceValue === 100) {
      setGameStatus("Finished!")
      setDiceDisabled(true)
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

  //   Logging the status of the game
  useEffect(() => {
    if (gameStatus !== "Finished!") {
      setTimeout(() => {
        setDiceDisabled(false)
      }, 1000)
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

  return (
    <div className="App">
      <div className="gameBoard">
        <AllRows />
        <div
          className="playerPiece"
          style={{ left: `${pieceLeft}px`, bottom: `${pieceBottom}px` }}
        ></div>
      </div>
      <div className="dice">
        <Dice
          onRoll={(value) => updatePlayerPiecePosition(value)}
          size={50}
          defaultValue={1}
          disabled={diceDisabled}
          sound={"/rolling-dice-2-102706.mp3"}
          faceBg={"#45d918"}
        />
      </div>
    </div>
  )
}

export default App
