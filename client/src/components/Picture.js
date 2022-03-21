const Picture = ({ picture }) => {
  return (
      <div id="picture">
        { picture && <img src={picture} alt="Blurdle of the day" className="image" /> }
        { !picture && <div className="image">Loading...</div> }
      </div>
  )
}

export default Picture