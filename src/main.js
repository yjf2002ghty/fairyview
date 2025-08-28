import * as queryutil from "./decompression.js";
import * as pgnutil from "./pgn.js";
import * as ffishlib from "./ffish.js";
import * as fairyview from "./fairyview.js";

const params = new URLSearchParams(window.location.search);
const variants_ini_raw=params.get("ini");
const PGN_raw=params.get("pgn");
const CSS_raw=params.get("css");
const notation_raw=params.get("not");
const coordinate_raw=params.get("coo");

let variants_ini="",PGN="",notation_index=1,coordinate_index=0;
var FairyViewInstance;
let start_time=Date.now();

function AfterInitialization()
{
    let config=new fairyview.FairyViewConfig(variants_ini,PGN,notation_index,coordinate_index);
    let fairyviewcontainer=document.createElement("div");
    fairyviewcontainer.classList.add("fairyview-container");
    document.body.appendChild(fairyviewcontainer);
    FairyViewInstance=new fairyview.FairyView(fairyviewcontainer,config);
    let element=document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("href", "./assets/theme-piece-" + FairyViewInstance.Variant + ".css");
    document.head.appendChild(element);
    element=document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("href", "./assets/theme-board-" + FairyViewInstance.Variant + "board.css");
    document.head.appendChild(element);
    window.addEventListener("resize",()=>{
        FairyViewInstance.CalculateElementSize(window.innerWidth,window.innerHeight);
    });
    FairyViewInstance.CalculateElementSize(window.innerWidth,window.innerHeight);
    console.log("Page load took "+String(Date.now()-start_time)+"ms.");

    // ffish.js consumes about 40MB of RAM, which is not good for embedded projects.
    // This become problematic especially when there are multiple emebedded FairyView instances.
    // Therefore we remove all references to ffish.js instance so that it is freed by garbage collector.
    ffishlib.Free();
    // Free LZMA library as we no longer use it.
    queryutil.Free();
    // Free PGN library as we no longer use it.
    pgnutil.Free();
}

function main()
{
    try
    {
        if (CSS_raw)
        {
            let element=document.createElement("style");
            element.style = "text/css";
            element.appendChild(document.createTextNode(queryutil.DecodeQuery(CSS_raw)));
            document.head.appendChild(element);
        }
        if (variants_ini_raw)
        {
            variants_ini=queryutil.DecodeQuery(variants_ini_raw);
        }
        if (PGN_raw)
        {
            PGN=queryutil.DecodeQuery(PGN_raw);
        }
        if (notation_raw)
        {
            notation_index=parseInt(notation_raw);
            if (isNaN(notation_index))
            {
                throw Error();
            }
        }
        if (coordinate_raw)
        {
            coordinate_index=parseInt(coordinate_raw);
            if (isNaN(coordinate_index))
            {
                throw Error();
            }
        }
    }
    catch
    {
        let errdiv=document.createElement("div");
        errdiv.classList.add("error-message-div");
        let errmsg=document.createElement("p");
        errmsg.textContent="Error: Syntax error in URL queries";
        errmsg.classList.add("error-message");
        errdiv.appendChild(errmsg);
        document.body.appendChild(errdiv);
        return;
    }
    ffishlib.InitializeFFishJSLibrary(()=>{
        AfterInitialization();
    });
}

main();
