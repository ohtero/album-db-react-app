import { useRef, useState } from "react";
import { Button } from "./common-button";
import { Modal } from "./modal";

// Palauttaa komponentin yksittäisille ja kaikille hakutuloksille. Hyödynnetään alempana. Lapsikomponenttina myös modaali albumitietojen muokkausta varten.
function ResultTable (props) {    
const { id, artist, album, year, refreshResults } = props;
const { index } = props;
const [show, setShow] = useState(false);

const [newArtist, setNewArtist] = useState(artist);
const [newAlbum, setNewAlbum] = useState(album);
const [newYear, setNewYear] = useState(year);

const deleteDialog = useRef();

// Päivittää alkuperäisen hakutuloksen kentät päivitetyillä arvoilla.
function updateFields(newArtist, newAlbum, newYear) {
  setNewArtist(newArtist)
  setNewAlbum(newAlbum)
  setNewYear(newYear)
}

async function deleteDbEntry(id) {
  const res = await fetch(`https://ohtero-rest-api.onrender.com/api/delete/${id}`, {
    method: "DELETE"
  })
  deleteDialog.current.close()

    if (res) {
      refreshResults()    // Tietueen poistamisen jälkeen päivittää hakutulokset, eli käytännössä tekee uuden API pyynnön kaikista tietueista.
  }
}

  return (
    <>  
    <table key={id}>
      <tbody>
        <tr><td><b>{`#${index}`}</b></td><td className="table-buttons"><Button type="button" text="Muokkaa" handleOnClick={() => setShow(true)}/><Button type="button" text="Poista" handleOnClick={() => deleteDialog.current.showModal()} /></td></tr>
        <tr><td>Artisti:</td><td>{newArtist}</td></tr>
        <tr><td>Albumi:</td><td>{newAlbum}</td></tr>
        <tr><td>Julkaisuvuosi:</td><td>{newYear}</td></tr>
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
    <Modal show={show} title={"Muokkaa tietoja"} artist={newArtist} album={newAlbum} year={newYear} id={id} dbAction={"update"} onClick={() => setShow(false)} updateFields={updateFields}/>
    </>
  )
}

// Taulukot kaikille hakutuloksille
export function AllResultsTable(props) {
  const { albumData, refreshResults } = props;

  if (albumData) {

  const allResults = albumData.map(({ _id, artist, albumName, releaseYear } = albumData, index) => 
    <ResultTable index={index + 1} id={_id} artist={artist} album={albumName} year={releaseYear}  refreshResults={refreshResults}/> 
  )
    return (
      allResults 
    )
  }
};

// Taulukot yksittäiselle hakutulokselle
  export function SingleResultTable(props) {
    const { albumData } = props;
    const { _id, artist, albumName, releaseYear} = albumData;
    
    if (albumData) {
      return (
        <ResultTable index={1} id={_id} artist={artist} album={albumName} year={releaseYear}  /> 
      )
    }
  }




