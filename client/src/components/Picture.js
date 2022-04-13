import { isBrowser } from "react-device-detect";
import BeatLoader from "react-spinners/BeatLoader";
import { FiShare2 } from "react-icons/fi"

const Picture = ({ picture, isGuessing, answer, roundData, shareScore }) => {

  return (
      <div id="picture" className={(isGuessing && !isBrowser) ? "guessing" : ""}>
        { picture && <img src={picture} alt="Blurdle of the day" className="image" /> }
        { !picture && <BeatLoader id="mainLoader" color="#fff" size={20} css={`margin-top:50px`} /> }
        { answer && <div id="answer">Answer: {answer}</div> } 
        { answer && 
            <div id="score">
                <div id="scoreInner">
                  {roundData.map(r => <div key={r.roundNo} className={r.outcome ? r.outcome : 'blank'}></div>)}
                </div>
                <div id="share" onClick={shareScore}>Share <FiShare2 /></div>
            </div> 
        } 
      </div>
  )
}

export default Picture