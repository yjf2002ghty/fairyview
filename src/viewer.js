import * as moveutil from "./move.js";
import * as pgnutil from "./pgn.js";
import * as ffishlib from "./ffish.js";
import * as util from "./utility.js";

const BlankSplitter=new RegExp("[ ]+");
const MoveTextActionPartsMatcher=new RegExp("\\[.*?\\]","g");

function SymbolToText(MoveSymbol)
{
    if (typeof MoveSymbol!="string")
    {
        throw TypeError();
    }
    if (MoveSymbol=="?!")
    {
        return "symbol-dubious";
    }
    else if (MoveSymbol=="?")
    {
        return "symbol-mistake";
    }
    else if (MoveSymbol=="??")
    {
        return "symbol-blunder";
    }
    else if (MoveSymbol=="!?")
    {
        return "symbol-interesting";
    }
    else if (MoveSymbol=="!")
    {
        return "symbol-good";
    }
    else if (MoveSymbol=="!!")
    {
        return "symbol-brilliant";
    }
    else
    {
        return "symbol-unknown";
    }
}

function SymbolDescription(MoveSymbol)
{
    if (typeof MoveSymbol!="string")
    {
        throw TypeError();
    }
    if (MoveSymbol=="?!")
    {
        return "Dubious Move (Inaccuracy)";
    }
    else if (MoveSymbol=="?")
    {
        return "Bad Move (Mistake)";
    }
    else if (MoveSymbol=="??")
    {
        return "Disastrous Move (Blunder)";
    }
    else if (MoveSymbol=="!?")
    {
        return "Interesting Move";
    }
    else if (MoveSymbol=="!")
    {
        return "Good Move";
    }
    else if (MoveSymbol=="!!")
    {
        return "Brilliant Move";
    }
    else
    {
        return "(Unknown Symbol)";
    }
}

class GameStateInformation
{
    constructor(FFishBoardObject)
    {
        if (FFishBoardObject==null)
        {
            throw TypeError();
        }
        this.CurrentFEN=FFishBoardObject.fen();
        this.CheckedSquares=util.getCheckSquares(FFishBoardObject);
        this.GameResult=FFishBoardObject.result();
        this.MoverRound=FFishBoardObject.turn()?0:1;
        this.HiddenPieces=util.getHiddenDroppablePiece(this.CurrentFEN,this.MoverRound==0,FFishBoardObject.legalMoves());
        this.FullMoveNumber=FFishBoardObject.fullmoveNumber();
        if (this.GameResult == "*") {
            if (FFishBoardObject.result(true) != "*") {
                this.GameResult = FFishBoardObject.result(true);
            } else if (FFishBoardObject.result(false) != "*") {
                this.GameResult = FFishBoardObject.result(false);
            }
        }
    }
}

class MainMoveElement
{
    constructor()
    {
        this.Element=document.createElement("div");
        this.Element.classList.add("main-line-move");
        this.MoveNumberElement=document.createElement("p");
        this.MoveNumberElement.classList.add("main-line-move-number");
        this.MoveNumberElement.textContent="0.";
        this.MovesElement=document.createElement("div");
        this.MovesElement.classList.add("main-line-move-pair");
        this.Move1Element=document.createElement("p");
        this.Move1Element.textContent="...";
        this.Move1Element.classList.add("main-line-first-move");
        this.Move2Element=document.createElement("p");
        this.Move2Element.classList.add("main-line-second-move");
        this.Move2Element.textContent="...";
        this.MovesElement.appendChild(this.Move1Element);
        this.MovesElement.appendChild(this.Move2Element);
        this.Element.appendChild(this.MoveNumberElement);
        this.Element.appendChild(this.MovesElement);
    }

    destructor() {}
}

class MoveStateInformation
{
    constructor(MoveNode,MoveElement,WhiteTime,BlackTime)
    {
        if (!(MoveNode instanceof moveutil.MoveTreeNode) || !(MoveElement instanceof HTMLElement) || typeof WhiteTime!="string" || typeof BlackTime!="string")
        {
            throw TypeError();
        }
        this.MoveNode=MoveNode;
        this.MoveElement=MoveElement;
        this.WhiteTime=WhiteTime;
        this.BlackTime=BlackTime;
    }

    destructor() {}
}

export class ViewerWidget
{
    constructor(ContainerDivision)
    {
        if (!(ContainerDivision instanceof HTMLDivElement))
        {
            throw TypeError("Invalid container element. Container must be a <div> element.");
        }
        while (ContainerDivision.childNodes.length>0)
        {
            ContainerDivision.removeChild(ContainerDivision.childNodes.item(0));
        }
        this.Container=ContainerDivision;
        this.Wrapper=document.createElement("div");
        this.Wrapper.classList.add("viewer-wrapper");
        this.MoveListWrapper=document.createElement("div");
        this.MoveListWrapper.classList.add("viewer-move-list-wrapper");
        this.MoveControlWrapper=document.createElement("div");
        this.MoveControlWrapper.classList.add("viewer-move-control-wrapper");
        this.NextPositionButton=document.createElement("button");
        this.NextPositionButton.classList.add("viewer-next-position-button");
        this.NextPositionButton.title="Next Position\nClick to display next position of the displayed position.";
        this.NextPositionButton.classList.add("viewer-button");
        this.PreviousPositionButton=document.createElement("button");
        this.PreviousPositionButton.classList.add("viewer-previous-position-button");
        this.PreviousPositionButton.title="Previous Position\nClick to display previous position of the displayed position.";
        this.PreviousPositionButton.classList.add("viewer-button");
        this.InitialPositionButton=document.createElement("button");
        this.InitialPositionButton.classList.add("viewer-initial-position-button");
        this.InitialPositionButton.title="Initial Position\nClick to display the initial position of current game.";
        this.InitialPositionButton.classList.add("viewer-button");
        this.FinalPositionButton=document.createElement("button");
        this.FinalPositionButton.classList.add("viewer-final-position-button");
        this.FinalPositionButton.title="Final Position\nClick to display the latest position of the displayed position.";
        this.FinalPositionButton.classList.add("viewer-button");
        this.CurrentPositionButton=document.createElement("button");
        this.CurrentPositionButton.classList.add("viewer-current-position-button");
        this.CurrentPositionButton.title="Current Position\nClick to display the latest position of current game.";
        this.CurrentPositionButton.classList.add("viewer-button");

        this.MoveControlWrapper.appendChild(this.InitialPositionButton);
        this.MoveControlWrapper.appendChild(this.PreviousPositionButton);
        this.MoveControlWrapper.appendChild(this.CurrentPositionButton);
        this.MoveControlWrapper.appendChild(this.NextPositionButton);
        this.MoveControlWrapper.appendChild(this.FinalPositionButton);
        this.Wrapper.appendChild(this.MoveListWrapper);
        this.Wrapper.appendChild(this.MoveControlWrapper);
        ContainerDivision.appendChild(this.Wrapper);

        this.MoveTree=new moveutil.MoveTree();
        this.CurrentMove=this.MoveTree.RootNode;
        this.MoveElementList=[];
        this.MoveListFirstElement=null;
    }

    destructor() {}

    CalculateElementSize(ContainerWidth,ContainerHeight)
    {
        if (typeof ContainerWidth!="number" || typeof ContainerHeight!="number")
        {
            throw TypeError();
        }
        let newwidth=(ContainerHeight>2*ContainerWidth/7.5)?ContainerWidth:7.5*ContainerHeight/2;
        this.Wrapper.style.width=`${newwidth}px`;
        this.Wrapper.style.height=`${ContainerHeight}px`;
        this.MoveControlWrapper.style.width=`${newwidth}px`;
        this.MoveControlWrapper.style.height=`${newwidth/7.5}px`
        this.MoveListWrapper.style.width=`${newwidth}px`;
        this.MoveListWrapper.style.height=`${ContainerHeight-newwidth/7.5}px`;
        this.InitialPositionButton.style.width=
        this.PreviousPositionButton.style.width=
        this.CurrentPositionButton.style.width=
        this.NextPositionButton.style.width=
        this.FinalPositionButton.style.width=
        `${newwidth/5}px`;
        this.InitialPositionButton.style.height=
        this.PreviousPositionButton.style.height=
        this.CurrentPositionButton.style.height=
        this.NextPositionButton.style.height=
        this.FinalPositionButton.style.height=
        `${newwidth/7.5}px`;
        this.InitialPositionButton.style.fontSize=
        this.PreviousPositionButton.style.fontSize=
        this.CurrentPositionButton.style.fontSize=
        this.NextPositionButton.style.fontSize=
        this.FinalPositionButton.style.fontSize=
        `${newwidth/15}px`;
    }

    UpdateCurrentMove()
    {
        let i=0;
        let element=null;
        for (i=0;i<this.MoveElementList.length;i++)
        {
            element=this.MoveElementList[i];
            if (element instanceof MoveStateInformation)
            {
                if (element.MoveNode==this.CurrentMove)
                {
                    element.MoveElement.classList.add("current-move");
                }
                else
                {
                    element.MoveElement.classList.remove("current-move");
                }
            }
        }
    }

    OnPositionUpdated(Callback,ScrollMoveList)
    {
        if (typeof Callback!="function" || typeof ScrollMoveList!="boolean")
        {
            throw TypeError();
        }
        let gamestate=this.CurrentMove.GameState;
        if (!(gamestate instanceof GameStateInformation))
        {
            return;
        }
        this.UpdateCurrentMove();
        let currentfen=gamestate.CurrentFEN;
        let moverround=this.CurrentMove.Move.MoverRound;
        if (this.CurrentMove==this.MoveTree.RootNode)
        {
            moverround=this.MoveTree.InitialMoverRound==0?1:0;
            if (ScrollMoveList)
            {
                this.MoveListWrapper.scrollTo(0,0);
            }
        }
        let lastmove = [];
        if (this.CurrentMove.Move.Move!="")
        {
            let move=util.parseUCIMove(this.CurrentMove.Move.Move);
            if (this.CurrentMove.Move.Move.includes("@"))
            {
                lastmove = [
                    move[0],
                    util.convertSquareToChessgroundXKey(move[1]),
                ];
            }
            else
            {
                lastmove = [
                    util.convertSquareToChessgroundXKey(move[0]),
                    util.convertSquareToChessgroundXKey(move[1]),
                ];
            }
        }
        let checkedsquares=gamestate.CheckedSquares;
        let gameresult = gamestate.GameResult;
        let hiddenpieces=gamestate.HiddenPieces;
        let boardnotes="";
        let index=0,indexend=0;
        index=this.CurrentMove.Move.TextAfter.indexOf("[%cal ");
        if (index>=0)
        {
            indexend=this.CurrentMove.Move.TextAfter.indexOf("]",index+6);
            if (indexend>=0)
            {
                boardnotes=this.CurrentMove.Move.TextAfter.substring(index+6,indexend).trim();
            }
        }
        index=this.CurrentMove.Move.TextAfter.indexOf("[%csl ");
        if (index>=0)
        {
            indexend=this.CurrentMove.Move.TextAfter.indexOf("]",index+6);
            if (indexend>=0)
            {
                boardnotes+=(","+this.CurrentMove.Move.TextAfter.substring(index+6,indexend).trim());
            }
        }
        let whitetime="",blacktime="",evaluation="";
        let evalsubstring="";
        let i=0;
        let element;
        for (i=0;i<this.MoveElementList.length;i++)
        {
            element=this.MoveElementList[i];
            if (element instanceof MoveStateInformation)
            {
                if (element.MoveNode==this.CurrentMove)
                {
                    whitetime=element.WhiteTime;
                    blacktime=element.BlackTime;
                    if (ScrollMoveList)
                    {
                        let rect=element.MoveElement.getBoundingClientRect();
                        let anchor_rect=this.MoveListFirstElement.getBoundingClientRect();
                        let parent_rect=this.MoveListWrapper.getBoundingClientRect();
                        this.MoveListWrapper.scrollTo(0,rect.top-anchor_rect.top-parent_rect.height/2);
                        
                        //element.MoveElement.scrollIntoView({behavior:"auto",block:"center"});
                    }
                    break;
                }
            }
        }
        if (this.CurrentMove.Move.TextAfter)
        {
            index=this.CurrentMove.Move.TextAfter.indexOf("[%eval ");
            if (index>=0)
            {
                indexend=this.CurrentMove.Move.TextAfter.indexOf("]",index+7);
                if (indexend>=0)
                {
                    evalsubstring=this.CurrentMove.Move.TextAfter.substring(index+7,indexend).trim();
                    if (evalsubstring.includes(","))
                    {
                        if (evalsubstring.startsWith("#"))
                        {
                            evaluation=evalsubstring;
                        }
                        else
                        {
                            evaluation=`${parseInt(evalsubstring.split(",")[0])/100}`;
                        }
                    }
                    else
                    {
                        evaluation=evalsubstring;
                    }
                }
            }
        }
        Callback(currentfen,moverround,lastmove,checkedsquares,gameresult,evaluation,whitetime,blacktime,boardnotes,hiddenpieces);
    }

    UpdateMoveListFromPGN(PGNMoves,Variant,FEN,Is960,Result,Notation,OnClickCallback)
    {
        if (typeof PGNMoves!="string" || typeof Variant!="string" || typeof FEN!="string" || typeof Is960!="boolean" || typeof Result!="string" || Notation==null || typeof OnClickCallback!="function")
        {
            throw TypeError();
        }
        const notation=Notation;
        let movetree=pgnutil.ParsePGNMovesToMoveTree(PGNMoves,Variant,Is960,FEN,ffishlib.ffish.Notation.SAN,ffishlib.ffish);
        if (movetree==null)
        {
            return false;
        }
        this.MoveTree=movetree;
        this.CurrentMove=movetree.RootNode;
        this.MoveElementList=[];
        let fenitems=FEN.split(BlankSplitter);
        let initialmoverround=(fenitems[1]=="b"?1:0);
        let initialmovenumber=parseInt(fenitems.pop());
        movetree.SetInitialCondition(initialmovenumber,initialmoverround,2);
        let tmpboard=new ffishlib.ffish.Board(Variant,FEN,Is960);
        let i=0;
        let branchlevel=0;
        let tokens=movetree.ToPGNTokens(2);
        let stack=[];
        let currentmainmoveelement=new MainMoveElement();
        let previousmainmovenode,previousmainmoveelement;
        let index=0,indexend=0;
        let text;
        let element,branchelement;
        let whitetime="",blacktime="";
        while (this.MoveListWrapper.childNodes.item(0))
        {
            this.MoveListWrapper.removeChild(this.MoveListWrapper.childNodes.item(0));
        }
        element=document.createElement("p");
        element.classList.add("variant-declaration");
        element.textContent=`Variant: ${Variant[0].toUpperCase()}${Variant.substring(1)}`;
        this.MoveListWrapper.appendChild(element);
        this.MoveListFirstElement=element;
        movetree.RootNode.GameState=new GameStateInformation(tmpboard);
        for (i=0;i<tokens.length;i++)
        {
            if (tokens[i].IsSplitter)
            {
                if (tokens[i].Move.Move=="(")
                {
                    if (branchlevel==0)
                    {
                        branchelement=document.createElement("div");
                        branchelement.classList.add("branch");
                    }
                    else
                    {
                        element=document.createElement("p");
                        element.textContent="(";
                        element.classList.add("splitter");
                        branchelement.appendChild(element);
                    }
                    stack.push(tmpboard.moveStack());
                    tmpboard.pop();
                    branchlevel++;
                }
                else if (tokens[i].Move.Move==")")
                {
                    if (branchlevel==1)
                    {
                        this.MoveListWrapper.appendChild(branchelement);
                    }
                    else
                    {
                        element=document.createElement("p");
                        element.textContent=")";
                        element.classList.add("splitter");
                        branchelement.appendChild(element);
                    }
                    tmpboard.reset();
                    tmpboard.setFen(FEN);
                    tmpboard.pushMoves(stack.pop());
                    branchlevel--;
                }
            }
            else
            {
                if (branchlevel==0)
                {
                    text=tokens[i].Move.TextBefore.replace(MoveTextActionPartsMatcher,"").trim();
                    if (text)
                    {
                        element=document.createElement("p");
                        element.classList.add("main-line-text-before");
                        element.textContent=text;
                        this.MoveListWrapper.appendChild(element);
                    }
                    currentmainmoveelement.MoveNumberElement.textContent=`${Math.ceil(tokens[i].Move.HalfMoveNumber/2)}.`;
                    if (tokens[i].Move.TextAfter)
                    {
                        index=tokens[i].Move.TextAfter.indexOf("[%clk ");
                        if (index>=0)
                        {
                            indexend=tokens[i].Move.TextAfter.indexOf("]",index+6);
                            if (indexend>=0)
                            {
                                if (tokens[i].Move.MoverRound==0)
                                {
                                    whitetime=tokens[i].Move.TextAfter.substring(index+6,indexend);
                                }
                                else
                                {
                                    blacktime=tokens[i].Move.TextAfter.substring(index+6,indexend);
                                }
                            }
                        }
                    }
                    if (tokens[i].Move.MoverRound==0)
                    {
                        currentmainmoveelement.Move1Element.textContent=tmpboard.sanMove(tokens[i].Move.Move,notation);
                        currentmainmoveelement.Move1Element.classList.add("valid");
                        tmpboard.push(tokens[i].Move.Move);
                        (function(node,widget){
                            node.GameState=new GameStateInformation(tmpboard);
                            currentmainmoveelement.Move1Element.onclick=(()=>{
                                widget.CurrentMove=node;
                                widget.OnPositionUpdated(OnClickCallback,false);
                            });
                        })(tokens[i].Node,this);
                        this.MoveElementList.push(new MoveStateInformation(tokens[i].Node,currentmainmoveelement.Move1Element,whitetime,blacktime));
                    }
                    else
                    {
                        currentmainmoveelement.Move2Element.textContent=tmpboard.sanMove(tokens[i].Move.Move,notation);
                        currentmainmoveelement.Move2Element.classList.add("valid");
                        tmpboard.push(tokens[i].Move.Move);
                        (function(node,widget){
                            node.GameState=new GameStateInformation(tmpboard);
                            currentmainmoveelement.Move2Element.onclick=(()=>{
                                widget.CurrentMove=node;
                                widget.OnPositionUpdated(OnClickCallback,false);
                            });
                        })(tokens[i].Node,this);
                        this.MoveElementList.push(new MoveStateInformation(tokens[i].Node,currentmainmoveelement.Move2Element,whitetime,blacktime));
                    }
                    if (tokens[i].Move.Symbol)
                    {
                        if (tokens[i].Move.MoverRound==0)
                        {
                            currentmainmoveelement.Move1Element.textContent+=tokens[i].Move.Symbol;
                            currentmainmoveelement.Move1Element.classList.add(SymbolToText(tokens[i].Move.Symbol));
                            currentmainmoveelement.Move1Element.title=SymbolDescription(tokens[i].Move.Symbol);
                        }
                        else
                        {
                            currentmainmoveelement.Move2Element.textContent+=tokens[i].Move.Symbol;
                            currentmainmoveelement.Move2Element.classList.add(SymbolToText(tokens[i].Move.Symbol));
                            currentmainmoveelement.Move2Element.title=SymbolDescription(tokens[i].Move.Symbol);
                        }
                    }
                    text=tokens[i].Move.TextAfter.replace(MoveTextActionPartsMatcher,"").trim();
                    if (text)
                    {
                        this.MoveListWrapper.appendChild(currentmainmoveelement.Element);
                        previousmainmovenode=tokens[i].Node;
                        previousmainmoveelement=currentmainmoveelement;
                        currentmainmoveelement=new MainMoveElement();
                        element=document.createElement("p");
                        element.classList.add("main-line-text-after");
                        element.textContent=text;
                        if (tokens[i].Move.Symbol)
                        {
                            element.classList.add(SymbolToText(tokens[i].Move.Symbol));
                        }
                        this.MoveListWrapper.appendChild(element);
                    }
                    else if (i==tokens.length-1)
                    {
                        this.MoveListWrapper.appendChild(currentmainmoveelement.Element);
                        previousmainmovenode=tokens[i].Node;
                        previousmainmoveelement=currentmainmoveelement;
                    }
                    else if (tokens[i].Move.MoverRound==1)
                    {
                        this.MoveListWrapper.appendChild(currentmainmoveelement.Element);
                        previousmainmovenode=tokens[i].Node;
                        previousmainmoveelement=currentmainmoveelement;
                        currentmainmoveelement=new MainMoveElement();
                    }
                    else if (i<tokens.length-1 && tokens[i+1].Move.Move=="(")
                    {
                        this.MoveListWrapper.appendChild(currentmainmoveelement.Element);
                        previousmainmovenode=tokens[i].Node;
                        previousmainmoveelement=currentmainmoveelement;
                        currentmainmoveelement=new MainMoveElement();
                    }
                }
                else
                {
                    if (tokens[i].Move.TextBefore)
                    {
                        element=document.createElement("p");
                        element.classList.add("branch-text-before");
                        element.textContent=tokens[i].Move.TextBefore.replace(MoveTextActionPartsMatcher,"");
                        branchelement.appendChild(element);
                    }
                    if (i==0 || (i>0 && tokens[i-1].Move.Move=="("))
                    {
                        if (tokens[i].Move.MoverRound==0)
                        {
                            element=document.createElement("p");
                            element.textContent=(Math.ceil(tokens[i].Move.HalfMoveNumber/2)+". ");
                            element.classList.add("branch-move-number");
                            branchelement.appendChild(element);
                        }
                        else
                        {
                            element=document.createElement("p");
                            element.textContent=(Math.ceil(tokens[i].Move.HalfMoveNumber/2)+"... ");
                            element.classList.add("branch-move-number");
                            branchelement.appendChild(element);
                        }
                    }
                    else if (tokens[i].Move.MoverRound==0)
                    {
                        element=document.createElement("p");
                        element.textContent=(Math.ceil(tokens[i].Move.HalfMoveNumber/2)+". ");
                        element.classList.add("branch-move-number");
                        branchelement.appendChild(element);
                    }
                    element=document.createElement("p");
                    element.textContent=tmpboard.sanMove(tokens[i].Move.Move,notation);
                    element.classList.add("branch-move");
                    if (tokens[i].Move.Symbol)
                    {
                        element.textContent+=tokens[i].Move.Symbol;
                    }
                    tmpboard.push(tokens[i].Move.Move);
                    (function(node,widget){
                        node.GameState=new GameStateInformation(tmpboard);
                        element.onclick=(()=>{
                            widget.CurrentMove=node;
                            widget.OnPositionUpdated(OnClickCallback,false);
                        });
                    })(tokens[i].Node,this);
                    branchelement.appendChild(element);
                    this.MoveElementList.push(new MoveStateInformation(tokens[i].Node,element,"",""));
                    if (tokens[i].Move.TextAfter)
                    {
                        element=document.createElement("p");
                        element.classList.add("branch-text-after");
                        element.textContent=tokens[i].Move.TextAfter.replace(MoveTextActionPartsMatcher,"");
                        branchelement.appendChild(element);
                    }
                }
                
            }
        }
        element=document.createElement("p");
        element.textContent=Result;
        element.classList.add("game-result");
        this.MoveListWrapper.appendChild(element);
        if (previousmainmovenode && previousmainmovenode.Move.MoverRound==0)
        {
            previousmainmoveelement.Move2Element.textContent="";
        }
        if (tokens[0] && tokens[0].Move.TextBefore)
        {
            movetree.RootNode.Move.TextAfter=tokens[0].Move.TextBefore;
        }
        tmpboard.delete();
        tmpboard=null;
        this.PreviousPositionButton.onclick=()=>{
            if (this.CurrentMove.PreviousNode)
            {
                this.CurrentMove=this.CurrentMove.PreviousNode;
                this.OnPositionUpdated(OnClickCallback,true);
            }
        }
        this.NextPositionButton.onclick=()=>{
            if (this.CurrentMove.NextNodes[0])
            {
                this.CurrentMove=this.CurrentMove.NextNodes[0];
                this.OnPositionUpdated(OnClickCallback,true);
            }
        }
        this.InitialPositionButton.onclick=()=>{
            this.CurrentMove=this.MoveTree.RootNode;
            this.OnPositionUpdated(OnClickCallback,true);
        }
        this.FinalPositionButton.onclick=()=>{
            let pointer=this.CurrentMove;
            while (pointer.NextNodes[0])
            {
                pointer=pointer.NextNodes[0];
            }
            this.CurrentMove=pointer;
            this.OnPositionUpdated(OnClickCallback,true);
        }
        this.CurrentPositionButton.onclick=()=>{
            let pointer=this.MoveTree.RootNode;
            while (pointer.NextNodes[0])
            {
                pointer=pointer.NextNodes[0];
            }
            this.CurrentMove=pointer;
            this.OnPositionUpdated(OnClickCallback,true);
        }
        while (this.CurrentMove.NextNodes[0])
        {
            this.CurrentMove=this.CurrentMove.NextNodes[0];
        }
        this.OnPositionUpdated(OnClickCallback,true);
        return true;
    }

    NextPosition()
    {
        if (this.CurrentMove.NextNodes[0])
        {
            this.NextPositionButton.click();
            return true;
        }
        return false;
    }

    PreviousPosition()
    {
        if (this.CurrentMove.PreviousNode)
        {
            this.PreviousPositionButton.click();
            return true;
        }
        else
        {
            return false;
        }
    }
}
