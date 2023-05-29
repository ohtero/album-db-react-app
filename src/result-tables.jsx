import { useContext, useRef, useState } from "react";
import { Button } from "./common-button";
import { Modal } from "./modal";
import { GetAlbumsContext } from "./main-app-display";

// Palauttaa komponentin yksittäisille ja kaikille hakutuloksille. Hyödynnetään alempana. Lapsikomponenttina myös modaali albumitietojen muokkausta varten.
function ResultTable ({ id, artist, album, year, index }) {    
  const getAllAlbums = useContext(GetAlbumsContext);
  const deleteDialog = useRef();
  
const [show, setShow] = useState(false);

const [Artist, setArtist] = useState(artist);
const [Album, setAlbum] = useState(album);
const [Year, setYear] = useState(year);


// Päivittää alkuperäisen hakutuloksen kentät modaalissa päivitetyillä arvoilla.
function updateFields(newArtist, newAlbum, newYear) {
  setArtist(newArtist)
  setAlbum(newAlbum)
  setYear(newYear)
}

async function deleteDbEntry(id) {
  const res = await fetch(`https://ohtero-rest-api.onrender.com/api/delete/${id}`, {
    method: "DELETE"
  })
  deleteDialog.current.close()

    if (res) {
      getAllAlbums();    // Tietueen poistamisen jälkeen päivittää hakutulokset, eli tekee uuden API pyynnön kaikista tietueista.
  }
}

  return (
    <>  
    <table key={id}>
      <tbody>
        <tr><td><b>{`#${index}`}</b></td><td className="table-buttons"><Button type="button" text="Muokkaa" handleOnClick={() => setShow(true)}/><Button type="button" text="Poista" handleOnClick={() => deleteDialog.current.showModal()} /></td></tr>
        <tr><td>Artisti:</td><td>{Artist}</td></tr>
        <tr><td>Albumi:</td><td>{Album}</td></tr>
        <tr><td>Julkaisuvuosi:</td><td>{Year}</td></tr>
        <tr><td>Id:</td><td>{id}</td></tr>
      </tbody>  
    </table>
    <dialog ref={deleteDialog} >
      <div className="delete-confirmation">
        <p>Halutko varmasti poistaa albumin?</p>
        <div className="confirmation-buttons">
          <button onClick={() => deleteDialog.current.close()}>Ei</button>
          <button onClick={() => deleteDbEntry(id)}>Kyllä</button>
        </div>
      </div>
    </dialog>
    <Modal show={show} title={"Muokkaa tietoja"} artist={Artist} album={Album} year={Year} id={id} dbAction={"update"} onClick={() => setShow(false)} updateFields={updateFields}/>
    </>
  )
}

// Taulukot hakutuloksille
export function ResultsTable({ albumData }) {

  if (albumData.length > 1) {
    const allResults = albumData.map(({  _id, artist, albumName, releaseYear } = albumData, index) => 
    <ResultTable index={index + 1} id={_id} artist={artist} album={albumName} year={releaseYear}/> 
    )
      return (
        allResults 
      )
  } else if (albumData)  {
      const { _id, artist, albumName, releaseYear} = albumData;
      return (
        <ResultTable index={1} id={_id} artist={artist} album={albumName} year={releaseYear}  /> 
    )
  }
};





