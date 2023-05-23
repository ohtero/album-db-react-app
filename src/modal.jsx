import { useState } from "react"


// Modaali, jonka kautta tapahtuu albumitietojen muokkaus ja uuden albumin lisääminen.
export function Modal(props) {
  const { show, onClick, updateFields, artist, album, year, id, title, dbAction, refreshResults } = props
  const [newArtist, setNewArtist] = useState(artist)
  const [newAlbum, setNewAlbum] = useState(album)
  const [newYear, setNewYear] = useState(year)

  const newData =
  {
    artist: newArtist,
    albumName: newAlbum,
    releaseYear: newYear
  }

  // Modaalin "Tallenna" nappia painaessa suorittaa joko päivityksen tai uuden tietueen luonnin, riippuen välittääkö modaalin lomake id-parametrin funktioon.
  async function updateOrCreateNew(id) {

    if (id) {
      const res = await fetch(`https://ohtero-rest-api.onrender.com/api/update/${id}`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "content-type":"application/json"
        },
        body: JSON.stringify(newData)
      })
    } else {
        const res = await fetch('https://ohtero-rest-api.onrender.com/api/add', {
          method: "POST",
          mode:"cors",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(newData)
        })
        if (res.status === 200){
          refreshResults();
          setNewArtist("")
          setNewAlbum("")
          setNewYear("")
        } 

    }
  }

  function setDefauldValues() {
    setNewArtist(artist);
    setNewAlbum(album);
    setNewYear(year);
  }


// Jos tietuetta muokataan, alkuperäisen hakutuloksen kentät muutetaan useStaten avulla, eikä tehdä sivua päivittävää API-kutsua.
  function changeValue() {
    if (dbAction === "update"){
    updateFields(newArtist, newAlbum, newYear);
    }
  }
  
  if (show) {
    return (
      <> 
      <div className="modal-bg">
      </div>  
      <div className="modal">
        <h3>{title}</h3>
        <form action="" className="edit-form">
          <label htmlFor="artist">Artisti:</label>
          <input type="text" name="artist" id="artist" value={newArtist} onChange={e => setNewArtist(e.target.value)} required/>
          <label htmlFor="album">Albumi:</label>
          <input type="text" name="album" id="album" value={newAlbum} onChange={e => setNewAlbum(e.target.value)} required/>
          <label htmlFor="year">Julkaisuvuosi:</label>
          <input type="text" name="year" id="year" value={newYear} onChange={e => setNewYear(e.target.value)} required/>
          <div className="edit-form-buttons">
            <button onClick={() => {onClick(); setDefauldValues()}} >Peruuta</button>
            <button type="button" onClick={() => {updateOrCreateNew(id); changeValue()}}>Tallenna</button>
          </div>
        </form>
      </div> 
      </>
    )
  }
} 