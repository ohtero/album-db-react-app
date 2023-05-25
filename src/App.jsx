import { MainAppDisplay } from "./main-app-display";
import Header from "./header";

export default function App(){

  return (
    <>
        <Header />
    <div className="main-wrapper">
      <div className="main-container">
        <MainAppDisplay />
      </div>
    </div> 
    </>
  )
}
