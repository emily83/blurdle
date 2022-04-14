const StatsDialog = ({ statistics }) => {

  const guesses = Object.values(statistics.guesses);
  const maxGuessValue = Math.max(...guesses);

  return (
    <>
      <h2>Blurdle Stats</h2>

      <div id="statsContainer">
        <div className="statsSection winRate">
          <div className="statsValue">{statistics.winPercentage}%</div>
          <div className="statsLabel">Win Rate</div>
        </div>
        <div className="statsSection">
          <div className="statsValue">{statistics.gamesPlayed}</div>
          <div className="statsLabel">Played</div>      
        </div>
        <div className="statsSection">
          <div className="statsValue">{statistics.gamesWon}</div>
          <div className="statsLabel">Won</div>     
        </div>

        <div className="statsSection">
          <div className="statsValue">{statistics.currentStreak}</div>
          <div className="statsLabel">Current Streak</div>
        </div>
        <div className="statsSection">
          <div className="statsValue">{statistics.maxStreak}</div>
          <div className="statsLabel">Max Streak</div>
        </div>
      </div>

      <div id="graphContainer">
        { Object.entries(statistics.guesses).map(([key, value]) => (
          <div className="graphSection" key={key}>
            <div className="graphBarOuter">
              <div className="graphBar" style={{ height:`${value / maxGuessValue * 100}%` }}>{value}</div>
            </div>
            <div className="graphLabel">{key}</div> 
          </div>
        ))}
      </div>
    </>
  )
}

export default StatsDialog