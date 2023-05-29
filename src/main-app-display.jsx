import { useState, createContext } from "react";
import { ResultsTable } from "./result-tables";
import { Button } from "./common-button";
import { Modal } from "./modal";

export const GetAlbumsContext = createContext();  // Viedään albuminhakufunktio ´result-tables´ komponenttiin.

// Palauttaa koko varsinaisen sovellusosan, sisältäen hakukentän, ja lapsikomponentteina hakutuloskentät, sekä modaalin albumin lisäämistä varten.
export function MainAppDisplay() {
  const [newSearchInput, setNewSearchInput] = useState("");
  const [allResults, setAllResults] = useState("");
  const [show, setShow] = useState(false);

  async function getAllAlbums() {   // Hakee kaikki tietokannan tietueet
    setAllResults("")
    const res = await fetch('https://ohtero-rest-api.onrender.com/api/getall')
    const data = await res.json()
    setAllResults(data)
  };
  
  async function handleSubmit(e) {    // Hakee Id:n perusteella
    e.preventDefault();
    setAllResults("")
    const res = await fetch(`https://ohtero-rest-api.onrender.com/api/${newSearchInput}`)
    const data = await res.json()
    setAllResults(data)
    setNewSearchInput("")
  };

  return(
    <>
    <div className="search-wrapper">
      <form className="search-form" onSubmit={e => handleSubmit(e)}>
        <label htmlFor="searchField">Hae ID:llä:</label>
        <div className="search-input"> 
          <input type="text" name="searchField" id="searchField" className="search-field" value={newSearchInput} onChange={e => setNewSearchInput(e.target.value)}/>
          <Button type="submit" text="Hae"/>
        </div>
      </form> 
    </div>
    <div className="top-btn-cont">
      <Button type="button" handleOnClick={() => getAllAlbums()} text="Näytä kaikki" />
      <Button type="button" text="Lisää albumi" handleOnClick={() => setShow(true)} />
    </div>   
    <GetAlbumsContext.Provider value={getAllAlbums}>
      <div className="results-wrapper">
        <ResultsTable albumData={allResults} />
      </div>
    </GetAlbumsContext.Provider>
    <Modal show={show} title={"Syötä uuden albumin tiedot"} artist={""} album={""} year={""} onClick={() => setShow(false)} getAllAlbums={getAllAlbums}/>
    </>
  )
};