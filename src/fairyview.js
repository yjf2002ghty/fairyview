import * as ffishlib from "./ffish.js";
import * as util from "./utility.js";
import * as pgnutil from "./pgn.js";
import * as chessgroundwidget from "./chessground.js";
import * as viewerwidget from "./viewer.js";
import * as gameinfowidget from "./gameinfo.js";
import * as titlewidget from "./title.js";
// import * as themeutil from "./chessgroundtheme.js";
// import * as imgutil from "./image.js";

export class FairyViewConfig
{
    constructor(VariantsIni,PGN,MoveNotation,CoordinateNotation,Orientation,InitialHalfMove)
    {
        if (typeof VariantsIni!="string" || typeof PGN!="string" || typeof MoveNotation!="number" || typeof CoordinateNotation!="number" || typeof Orientation!="number" || typeof InitialHalfMove!="number")
        {
            throw TypeError();
        }
        this.VariantsIni=VariantsIni;
        this.PGN=PGN;
        this.Notation=MoveNotation;
        this.Coordinate=CoordinateNotation;
        this.InitialHalfMove=InitialHalfMove;
        this.Orientation=(Orientation==0?"white":"black");
        this.ShowTitle=true;
        this.ShowGameInformation=true;
        this.ShowViewer=true;
        this.ShowMoveHistory=true;
        this.KeyPressToMove=true;
        this.MouseScrollToMove=true;
        this.AllowDrawingsOnBoard=true;
        this.MoveHistoryStyle=0;
    }

    destructor() {}
}

// This class must be constructed after ffish.js initialization
export class FairyView
{
    constructor(ContainerDivision,Config) {
        if (!(ContainerDivision instanceof HTMLDivElement))
        {
            throw TypeError("Invalid container element. Container must be a <div> element.");
        }
        if (!(Config instanceof FairyViewConfig))
        {
            throw TypeError();
        }
        while (ContainerDivision.childNodes.length>0)
        {
            ContainerDivision.removeChild(ContainerDivision.childNodes.item(0));
        }
        this.Initialized=false;
        this.ShowGameInformation=Config.ShowGameInformation;
        this.ShowMoveHistory=Config.ShowMoveHistory;
        this.ShowTitle=Config.ShowTitle;
        this.ShowViewer=Config.ShowViewer;

        this.ErrorMessageDivision=document.createElement("div");
        this.ErrorMessageDivision.style.display="none";
        this.ErrorMessageDivision.classList.add("error-message-div");
        this.ErrorMessage=document.createElement("p");
        this.ErrorMessage.textContent="";
        this.ErrorMessage.classList.add("error-message");
        this.ErrorMessageDivision.appendChild(this.ErrorMessage);
        ContainerDivision.appendChild(this.ErrorMessageDivision);

        let pgn=pgnutil.ParseSinglePGN(Config.PGN);
        let variant=pgn.headers.get("Variant") || "chess";
        this.Variant=variant.replace(/960$/,"").toLowerCase();
        this.Is960=variant.endsWith("960");
        
        if (this.Variant=="standard")
        {
            this.Variant="chess";
        }
        
        if (Config.VariantsIni)
        {
            ffishlib.ffish.loadVariantConfig(Config.VariantsIni);
        }
        if (!ffishlib.ffish.variants().split(" ").includes(this.Variant))
        {
            this.ErrorMessageDivision.style.display="";
            this.ErrorMessage.textContent="Error: Cannot load variant: "+variant;
            return;
        }

        if (Config.Notation<0 || Config.Notation>=ffishlib.ffishnotationobjects.length)
        {
            this.ErrorMessageDivision.style.display="";
            this.ErrorMessage.textContent="Error: Invalid move notation index: "+Config.Notation;
            return;
        }

        if (Config.Coordinate<0 || Config.Coordinate>7)
        {
            this.ErrorMessageDivision.style.display="";
            this.ErrorMessage.textContent="Error: Invalid coordinate notation index: "+Config.Coordinate;
            return;
        }

        this.FEN=pgn.headers.get("FEN") || ffishlib.ffish.startingFen(this.Variant);
        let dimensions=util.getDimensions(this.FEN);
        let date=pgn.headers.get("Date");
        let site=pgn.headers.get("Site") || "";
        this.Title=pgn.headers.get("Event") || "Game";
        if (date)
        {
            this.Title+=(" on "+date);
        }
        this.WhiteName=pgn.headers.get("White") || "Unknown";
        this.BlackName=pgn.headers.get("Black") || "Unknown";
        this.GameResult=pgn.headers.get("Result") || "*";
        this.WhiteElo=pgn.headers.get("WhiteElo") || "?";
        this.BlackElo=pgn.headers.get("BlackElo") || "?";
        this.Container=ContainerDivision;
        this.Wrapper=document.createElement("div");
        this.Wrapper.classList.add("fairyview-wrapper");
        this.UnderTitleDivision=document.createElement("div");
        this.UnderTitleDivision.classList.add("fairyview-under-title-div");
        this.LeftPanelDivision=document.createElement("div");
        this.LeftPanelDivision.classList.add("fairyview-left-panel-div");
        this.ChessgroundContainer=document.createElement("div");
        this.ChessgroundContainer.classList.add("chessground-container");
        this.TitleContainer=document.createElement("div");
        this.TitleContainer.classList.add("title-container");
        this.GameInformationContainer=document.createElement("div");
        this.GameInformationContainer.classList.add("gameinfo-container");
        this.ViewerContainer=document.createElement("div");
        this.ViewerContainer.classList.add("viewer-container");
        // this.ChessgroundThemeDetectorContainer=document.createElement("div");
        // this.ChessgroundThemeDetectorContainer.classList.add("theme-detector");
        this.LeftPanelDivision.appendChild(this.ChessgroundContainer);
        this.LeftPanelDivision.appendChild(this.GameInformationContainer);
        this.UnderTitleDivision.appendChild(this.LeftPanelDivision);
        this.UnderTitleDivision.appendChild(this.ViewerContainer);
        this.Wrapper.appendChild(this.TitleContainer);
        this.Wrapper.appendChild(this.UnderTitleDivision);
        // this.Wrapper.appendChild(this.ChessgroundThemeDetectorContainer);
        ContainerDivision.appendChild(this.Wrapper);

        this.TitleWidget=new titlewidget.TitleWidget(this.TitleContainer);
        this.GameInformationWidget=new gameinfowidget.GameInformationWidget(this.GameInformationContainer);
        this.ChessgroundWidget=new chessgroundwidget.ChessgroundWidget(this.ChessgroundContainer,this.FEN,ffishlib.ffish.capturesToHand(this.Variant),dimensions.width,dimensions.height,Config.Coordinate,Config.AllowDrawingsOnBoard);
        this.ViewerWidget=new viewerwidget.ViewerWidget(this.ViewerContainer,Config.ShowMoveHistory);
        // this.ChessgroundThemeDetector=new themeutil.ChessgroundThemeDetector(this.ChessgroundThemeDetectorContainer);
        if (!this.ViewerWidget.UpdateMoveListFromPGN(pgn.moves,this.Variant,this.FEN,this.Is960,this.GameResult,ffishlib.ffishnotationobjects[Config.Notation],Config.MoveHistoryStyle?true:false,
            (FEN,PreviousMoverRound,LastMove,CheckedSquares,GameResult,Evaluation,WhiteTime,BlackTime,BoardNotes,HiddenPieces)=>
            {
                this.ChessgroundWidget.SetPosition(FEN,PreviousMoverRound,LastMove,CheckedSquares,GameResult,HiddenPieces);
                this.GameInformationWidget.SetEvaluation(Evaluation);
                this.GameInformationWidget.SetPreviousMoverRound(PreviousMoverRound);
                this.GameInformationWidget.SetTime(WhiteTime,BlackTime);
                this.ChessgroundWidget.ShowBoardNotes(BoardNotes,PreviousMoverRound);
                this.ChessgroundWidget.SetTheme(this.Variant,this.Variant+"board");
            }
        ))
        {
            this.ErrorMessageDivision.style.display="";
            this.ErrorMessage.textContent="Error: Cannot load PGN";
            return;
        }
        this.GameInformationWidget.SetPlayerInformation(this.WhiteName,this.BlackName,this.WhiteElo,this.BlackElo);
        this.TitleWidget.SetFlipBoardCallback(()=>{
            this.ChessgroundWidget.ChessgroundInstance.toggleOrientation();
            // this.ChessgroundThemeDetector.ToggleOrientation();
        });
        this.TitleWidget.SetTitle(this.Title);
        this.TitleWidget.SetCopyFENCallback(()=>{
            window.prompt("FEN of displayed position:",this.ChessgroundWidget.FEN);
        });
        this.TitleWidget.SetSavePGNCallback(()=>{
            if (Config.PGN)
            {
                util.DownloadFile(Config.PGN,"game.pgn","text/plain");
            }
            else
            {
                window.alert("No PGN file loaded.");
            }
        });
        this.TitleWidget.SetEventSite(site);
        if (Config.MouseScrollToMove)
        {
            this.ChessgroundWidget.SetBoardOnWheelEventCallback((event,num)=>{
                event.stopPropagation();
                event.preventDefault();
                if (num>0)
                {
                    this.ViewerWidget.NextPosition()
                }
                else
                {
                    this.ViewerWidget.PreviousPosition()
                }
            });
        }
        if (Config.KeyPressToMove)
        {
            this.ChessgroundWidget.SetBoardOnKeyEventCallback((key,ctrlKey,altKey)=>{
                if (altKey)
                {
                    if (key=="ArrowRight")
                    {
                        this.ViewerWidget.NextVariationMove();
                    }
                    else if (key=="ArrowLeft")
                    {
                        this.ViewerWidget.PreviousVariationMove();
                    }
                }
                else if (ctrlKey)
                {
                    if (key=="ArrowRight")
                    {
                        this.ViewerWidget.FinalPosition();
                    }
                    else if (key=="ArrowLeft")
                    {
                        this.ViewerWidget.InitialPosition();
                    }
                }
                else
                {
                    if (key=="ArrowRight")
                    {
                        this.ViewerWidget.NextPosition();
                    }
                    else if (key=="ArrowLeft")
                    {
                        this.ViewerWidget.PreviousPosition();
                    }
                }
            });
        }
        setTimeout(()=>{
            this.ChessgroundWidget.ChessgroundInstance.set({orientation: Config.Orientation});
            this.ViewerWidget.GoToHalfMove(Config.InitialHalfMove);
        },50);
        // this.TitleWidget.SetSaveImageCallback(()=>{
        //     let themes=this.ChessgroundThemeDetector.GetThemes();
        //     let width=this.ChessgroundWidget.BoardWidth;
        //     let height=(this.ChessgroundWidget.FEN.includes("[")?this.ChessgroundWidget.BoardHeight+2:this.ChessgroundWidget.BoardHeight);
        //     imgutil.GenerateBoardImage(this.ChessgroundWidget.FEN,this.ChessgroundWidget.LastMove,checkedsquarelist,this.ChessgroundWidget.ChessgroundInstance.state.orientation,this.ChessgroundWidget.BoardWidth,this.ChessgroundWidget.BoardHeight,Config.Coordinate,themes.pieces,themes.board,1000,1000*height/width,(blob)=>{
        //         const url=URL.createObjectURL(blob);
        //         const a = document.createElement('a');
        //         a.href = url;
        //         a.download = "board.png";
        //         document.body.appendChild(a);
        //         a.click();
        //         document.body.removeChild(a);
        //         setTimeout(()=>{
        //           URL.revokeObjectURL(url);
        //         },100);
        //     });
        // });
        // this.ChessgroundThemeDetector.SetThemes(this.Variant,this.Variant+"board",dimensions.width,dimensions.height);
        this.Initialized=true;
    }

    destructor()
    {
        this.TitleWidget.destructor();
    }

    CalculateElementSize(ContainerWidth,ContainerHeight)
    {
        if (typeof ContainerWidth!="number" || typeof ContainerHeight!="number")
        {
            throw TypeError();
        }
        if (!this.Initialized)
        {
            return;
        }
        let verticallayout=false;
        if (ContainerHeight>ContainerWidth || !this.ShowMoveHistory)
        {
            this.UnderTitleDivision.classList.add("vertical");
            verticallayout=true;
        }
        else
        {
            this.UnderTitleDivision.classList.remove("vertical");
        }
        let titlecontainerwidth=ContainerWidth;
        let titlecontainerheight=0.1*ContainerHeight;
        let undertitledivwidth=ContainerWidth;
        let undertitledivheight=verticallayout?0.9*ContainerHeight:0.9*ContainerHeight;
        if (!this.ShowTitle)
        {
            titlecontainerwidth=0;
            titlecontainerheight=0;
            undertitledivheight=ContainerHeight;
        }
        let leftpaneldivwidth=verticallayout?undertitledivwidth:0.7*undertitledivwidth;
        let leftpaneldivheight=verticallayout?0.5*undertitledivheight:undertitledivheight;
        let viewercontainerwidth=verticallayout?undertitledivwidth:0.3*undertitledivwidth;
        let viewercontainerheight=verticallayout?0.5*undertitledivheight:undertitledivheight;
        if (!this.ShowViewer)
        {
            leftpaneldivwidth=undertitledivwidth;
            leftpaneldivheight=undertitledivheight;
            viewercontainerwidth=0;
            viewercontainerheight=0;
        }
        else if (!this.ShowMoveHistory)
        {
            leftpaneldivwidth=undertitledivwidth;
            leftpaneldivheight=0.8*undertitledivheight;
            viewercontainerwidth=undertitledivwidth;
            viewercontainerheight=0.2*undertitledivheight;
        }
        let gameinfocontainerwidth=leftpaneldivwidth;
        let gameinfocontainerheight=0.2*leftpaneldivheight;
        let chessgroundcontainerwidth=leftpaneldivwidth;
        let chessgroundcontainerheight=0.8*leftpaneldivheight;
        if (!this.ShowGameInformation)
        {
            gameinfocontainerwidth=0;
            gameinfocontainerheight=0;
            chessgroundcontainerheight=leftpaneldivheight;
        }
        this.Wrapper.style.width=`${ContainerWidth}px`;
        this.Wrapper.style.height=`${ContainerHeight}px`;
        this.TitleContainer.style.width=`${titlecontainerwidth}px`;
        this.TitleContainer.style.height=`${titlecontainerheight}px`;
        this.UnderTitleDivision.style.width=`${undertitledivwidth}px`;
        this.UnderTitleDivision.style.height=`${undertitledivheight}px`;
        this.LeftPanelDivision.style.width=`${leftpaneldivwidth}px`;
        this.LeftPanelDivision.style.height=`${leftpaneldivheight}px`;
        this.ViewerContainer.style.width=`${viewercontainerwidth}px`;
        this.ViewerContainer.style.height=`${viewercontainerheight}px`;
        this.GameInformationContainer.style.width=`${gameinfocontainerwidth}px`;
        this.GameInformationContainer.style.height=`${gameinfocontainerheight}px`;
        this.ChessgroundContainer.style.width=`${chessgroundcontainerwidth}px`;
        this.ChessgroundContainer.style.height=`${chessgroundcontainerheight}px`;
        this.ChessgroundWidget.CalculateElementSize(chessgroundcontainerwidth,chessgroundcontainerheight);
        if (this.ShowGameInformation)
        {
            this.GameInformationWidget.CalculateElementSize(gameinfocontainerwidth,gameinfocontainerheight);
        }
        else
        {
            this.GameInformationContainer.style.display="none";
        }
        if (this.ShowViewer)
        {
            this.ViewerWidget.CalculateElementSize(viewercontainerwidth,viewercontainerheight);
        }
        else
        {
            this.ViewerContainer.style.display="none";
        }
        if (this.ShowTitle)
        {
            this.TitleWidget.CalculateElementSize(titlecontainerwidth,titlecontainerheight);
        }
        else
        {
            this.TitleContainer.style.display="none";
        }
    }
}
