import T from 'prop-types'
import React, { Fragment } from 'react'
import Splitting from 'splitting'
/* eslint-disable react/no-danger */
const FinishScreen = ({ newHigh, onRestart, onReset, result }) => (
  <div className="info-screen">
    <div className="results">
      {newHigh && (
        <Fragment>
          <h2
            className="celebration"
            dangerouslySetInnerHTML={{
              __html: Splitting.html({ content: `New High Score!` }),
            }}
          />

          <h2 className="celebration">{result}</h2>
        </Fragment>
      )}
      {!newHigh && (
        <h2 className="info__text boring-text">{`You Scored ${result}`}</h2>
      )}
    </div>
    <button onClick={onRestart}>Play Again</button>
    <button onClick={onReset}>Main Menu</button>
  </div>
)

FinishScreen.propTypes = {
  newHigh: T.bool.isRequired,
  onRestart: T.func.isRequired,
  onReset: T.func.isRequired,
  result: T.number.isRequired,
}

export default FinishScreen