import Module from "ffish-es6";

export var ffish=null;
export var ffish_initialized=false;
export var ffishnotationobjects=null;

export var InitializeFFishJSLibrary=function(OnInitialized)
{
    if (typeof OnInitialized!="function")
    {
        throw TypeError("Invalid on initialized function.");
    }
    function CheckInitialization()
    {
        let a=new ffish.Board("chess");
        a.delete();
        if (ffish.variants().includes(" chess "))
        {
            OnInitialized();
        }
        else
        {
            setTimeout(()=>{
                CheckInitialization();
            },100);
        }
    }
    if (ffish_initialized)
    {
        OnInitialized();
        return;
    }
    new Module().then((loadedModule) => {
        ffish=loadedModule;
        ffish_initialized=true;
        ffishnotationobjects = [
            ffish.Notation.DEFAULT,
            ffish.Notation.SAN,
            ffish.Notation.LAN,
            ffish.Notation.SHOGI_HOSKING,
            ffish.Notation.SHOGI_HODGES,
            ffish.Notation.SHOGI_HODGES_NUMBER,
            ffish.Notation.JANGGI,
            ffish.Notation.XIANGQI_WXF,
            ffish.Notation.THAI_SAN,
            ffish.Notation.THAI_LAN,
        ];
        CheckInitialization();
    });
}

export var Free=function()
{
    ffish=null;
    ffish_initialized=null;
    ffishnotationobjects=null;
    InitializeFFishJSLibrary=null;
    Free=null;
}
