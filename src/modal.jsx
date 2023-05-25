import { useRef, useState } from "react"

// Modaali, jonka kautta tapahtuu albumitietojen muokkaus ja uuden albumin lisääminen.
export function Modal({ show, onClick, updateFields, artist, album, year, id, title, dbAction, refreshResults }) {

  const [newArtist, setNewArtist] = useState(artist)
  const [newAlbum, setNewAlbum] = useState(album)
  const [newYear, setNewYear] = useState(year)

  const confirmationText = useRef()
  const artistFieldError = useRef()
  const albumFieldError = useRef()
  const yearFieldError = useRef()

  const newData =
  {
    artist: newArtist,
    albumName: newAlbum,
    releaseYear: newYear
  }

  function cleanFieldErrors() {
    artistFieldError.current.innerHTML = ""
    albumFieldError.current.innerHTML = ""
    yearFieldError.current.innerHTML = ""
    confirmationText.current.innerHTML = ""
  }

  // Modaalin "Tallenna" nappia painaessa suorittaa joko päivityksen tai uuden tietueen luonnin, riippuen välittääkö modaalin lomake id-parametrin funktioon.
  async function updateOrCreateNew(id) {

    let inputError = false

    cleanFieldErrors();
    
      if (!newArtist.length) {
        artistFieldError.current.innerHTML = "Artisti ei voi olla tyhjä!"
        inputError = true
      }

      if (!newAlbum.length) {
        albumFieldError.current.innerHTML = "Albumi ei voi olla tyhjä!"
        inputError = true
      }

      if (!newYear.length | !Number.isInteger(parseInt(newYear))) {
        yearFieldError.current.innerHTML = "Julkaisuvuosi ei voi olla tyhjä tai kirjaimia!" 
        inputError = true
      }
      if (inputError === true) {
        console.log(`error 2: ${inputError}`)
        return
      }

      if ( newArtist === artist && newAlbum === album && newYear === year) {
        confirmationText.current.style.color = "red"
        confirmationText.current.innerHTML = "Albumitiedot eivät muuttuneet."
        return
      }
  
      if (id) {

          const res = await fetch(`https://ohtero-rest-api.onrender.com/api/update/${id}`, {
            method: "PATCH",
            mode: "cors",
            headers: {
              "content-type":"application/json"
            },
            body: JSON.stringify(newData)
          })
          if (res.status === 200) {
            confirmationText.current.style.color = "green"
            confirmationText.current.innerHTML = "Albumi päivitettiin onnistuneesti." 
            changeValue() 
          } else {
            confirmationText.current.innerHTML = `Virhe: ${res.status}! Muutoksia ei tallennettu!`
          }


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
            
            confirmationText.current.style.color = "green"
            confirmationText.current.innerHTML = "Albumi lisättiin onnistuneesti."
          } else {
            confirmationText.current.innerHTML = `Virhe: ${res.status}! Muutoksia ei tallennettu!`
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
          <div className="field-wrapper">
            <label htmlFor="artist">Artisti:</label>
            <input type="text" name="artist" id="artist" value={newArtist} onChange={e => setNewArtist(e.target.value)} required/>
            <p className="field-error" ref={artistFieldError}></p>
          </div>
          <div className="field-wrapper">
            <label htmlFor="album">Albumi:</label>
          <input type="text" name="album" id="album" value={newAlbum} onChange={e => setNewAlbum(e.target.value)} required/>
          <p className="field-error" ref={albumFieldError}></p>
          </div>
          <div className="field-wrapper">
          <label htmlFor="year">Julkaisuvuosi:</label>
          <input type="text" name="year" id="year" value={newYear} onChange={e => setNewYear(e.target.value)} required/>
          <p className="field-error" ref={yearFieldError}></p>
          </div>
          <div className="edit-form-buttons">
            <button onClick={() => {onClick(); setDefauldValues()}} >Peruuta</button>
            <button type="button" onClick={() => updateOrCreateNew(id)}>Tallenna</button>
          </div>
        </form>
        <p className="confirmation-text" ref={confirmationText}></p>
      </div> 
      </>
    )
  }
} 