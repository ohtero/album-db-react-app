import { useState } from "react";
import { AllResultsTable, SingleResultTable } from "./result-tables";
import { Button } from "./common-button";
import { Modal } from "./modal";

// Palauttaa koko varsinaisen sovellusosan, sisältäen hakukentän, ja lapsikomponentteina hakutuloskentät, sekä modaalin albumin lisäämistä varten.
export function MainAppDisplay() {
  const [newSearchInput, setNewSearchInput] = useState("");
  const [allResults, setAllResults] = useState("");
  const [singleResult, setSingleResult] = useState("");

  const [show, setShow] = useState(false);

  async function getAllData() {   // Hakee kaikki tietokannan tietueet

    setSingleResult("")
    const res = await fetch('https://ohtero-rest-api.onrender.com/api/getall')
    const data = await res.json()
    setAllResults(data)
  };
  
  async function handleSubmit(e) {    // Hakee Id:n perusteella
    e.preventDefault();
    setAllResults("")
    const res = await fetch(`https://ohtero-rest-api.onrender.com/api/${newSearchInput}`)
    const data = await res.json()
    setSingleResult(data)
    setNewSearchInput("")

  };

  return(
    <>
    <div className="search-wrapper">
      <form className="search-form" onSubmit={e => handleSubmit(e)}>
        <label htmlFor="searchField">Hae ID:llä:</label>
        <div className="search-input"> 
          <input type="text" name="searchField" id="searchField" className="search-field" value={newSearchInput} onChange={e => setNewSearchInput(e.target.value)}/>
          <Button type="submit" text="Hae" />
        </div>
      </form> 
    </div>
    <div className="top-btn-cont">
      <Button type="button" handleOnClick={() => getAllData()} text="Näytä kaikki" />
      <Button type="button" text="Lisää albumi" handleOnClick={() => setShow(true)} />
    </div>   
    <div className="results-wrapper">
      <AllResultsTable albumData={allResults} refreshResults={getAllData} />
      <SingleResultTable albumData={singleResult} />
    </div>
    <Modal show={show} title={"Syötä uuden albumin tiedot"} artist={""} album={""} year={""} onClick={() => setShow(false)} refreshResults={getAllData}/>
    </>
  )
};