import React from "react"
import "./App.css"

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
  return (
    <div className="App">
      <div className="gameBoard">
        <AllRows />
      </div>
    </div>
  )
}

export default App
