import "./Scoreboard.css"
import React from 'react'

const Scoreboard = ({ score, onIncrease, onDecrease }) => {
  return (
    <div>
      <button onClick={onDecrease}>-</button>
      <span>{score}</span>
      <button onClick={onIncrease}>+</button>
    </div>
  )
}

export default Scoreboard
