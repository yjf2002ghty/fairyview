import { Chessground } from "chessgroundx";
import * as pocketutil from "chessgroundx/pocket";
import * as util from "./utility.js";

const EmptyMap = new Map();

function highlightMoveOnBoard(moveturns, chessground, moves, colors, notepositions) {
    if (!(Array.isArray(moveturns)) || !(Array.isArray(moves)) || !(Array.isArray(colors)) || !(Array.isArray(notepositions)) || chessground == null) {
        return;
    }
    let i = 0;
    let bestmove = null;
    let autoshapes = [];
    let color = "";
    let notecolor = "";
    let moveturn = true;
    let noteposition = "";
    for (i = 0; i < moves.length; i++) {
        bestmove = util.parseUCIMove(moves[i]);
        if (bestmove[0] == null || bestmove[1] == null || bestmove[2] == null || bestmove[3] == null) {
            continue;
        }
        color = colors[i];
        moveturn = moveturns[i];
        noteposition = notepositions[i];
        if (color == "blue") {
            notecolor = "#003088";
        }
        else if (color == "red") {
            notecolor = "#882020";
        }
        else if (color == "yellow") {
            notecolor = "#e68f00";
        }
        else if (color == "green") {
            notecolor = "#15781b";
        }
        else {
            notecolor = "#000000";
        }
        if (bestmove[0].startsWith("@")) {
            autoshapes.push({
                brush: color,
                orig: util.convertSquareToChessgroundXKey(bestmove[1]),
            });
        }
        else if (bestmove[0].includes("@")) {
            autoshapes.push({
                brush: color,
                orig: util.convertSquareToChessgroundXKey(bestmove[1]),
            });
            if (moveturn) {
                if (bestmove[0].charAt(0) == "+") {
                    autoshapes.push({
                        brush: color,
                        dest: "a0",
                        orig: util.convertSquareToChessgroundXKey(bestmove[1]),
                        piece: {
                            color: "white",
                            role: "p" + bestmove[0].toLowerCase().charAt(1) + "-piece",
                            scale: 0.7,
                        },
                        modifiers: { hilite: true },
                    });
                } else {
                    autoshapes.push({
                        brush: color,
                        dest: "a0",
                        orig: util.convertSquareToChessgroundXKey(bestmove[1]),
                        piece: {
                            color: "white",
                            role: bestmove[0].toLowerCase().charAt(0) + "-piece",
                            scale: 0.7,
                        },
                        modifiers: { hilite: true },
                    });
                }
            } else {
                if (bestmove[0].charAt(0) == "+") {
                    autoshapes.push({
                        brush: color,
                        dest: "a0",
                        orig: util.convertSquareToChessgroundXKey(bestmove[1]),
                        piece: {
                            color: "black",
                            role: "p" + bestmove[0].toLowerCase().charAt(1) + "-piece",
                            scale: 0.7,
                        },
                        modifiers: { hilite: true },
                    });
                } else {
                    autoshapes.push({
                        brush: color,
                        dest: "a0",
                        orig: util.convertSquareToChessgroundXKey(bestmove[1]),
                        piece: {
                            color: "black",
                            role: bestmove[0].toLowerCase().charAt(0) + "-piece",
                            scale: 0.7,
                        },
                        modifiers: { hilite: true },
                    });
                }
            }
        } else {
            if (bestmove[0] == bestmove[1]) {
                autoshapes.push({
                    brush: "black",
                    orig: util.convertSquareToChessgroundXKey(bestmove[0]),
                    customSvg: util.generatePassTurnNotationSVG(notecolor),
                });
            } else {
                autoshapes.push({
                    brush: color,
                    dest: util.convertSquareToChessgroundXKey(bestmove[1]),
                    orig: util.convertSquareToChessgroundXKey(bestmove[0]),
                });
            }
            if (bestmove[2] != "") {
                let piecerole = chessground.state.boardState.pieces.get(
                    util.convertSquareToChessgroundXKey(bestmove[0]),
                ).role;
                autoshapes.push({
                    brush: "black",
                    orig: util.convertSquareToChessgroundXKey(bestmove[1]),
                    customSvg: util.generateMoveNotationSVG(
                        bestmove[2],
                        notecolor,
                        "#ffffff",
                        noteposition,
                    ),
                });
                if (bestmove[2] == "+") {
                    if (moveturn) {
                        autoshapes.push({
                            brush: color,
                            orig: util.convertSquareToChessgroundXKey(bestmove[1]),
                            dest: util.convertSquareToChessgroundXKey(bestmove[0]),
                            piece: { color: "white", role: "p" + piecerole },
                        });
                    } else {
                        autoshapes.push({
                            brush: color,
                            orig: util.convertSquareToChessgroundXKey(bestmove[1]),
                            dest: util.convertSquareToChessgroundXKey(bestmove[0]),
                            piece: { color: "black", role: "p" + piecerole },
                        });
                    }
                } else if (bestmove[2] == "-") {
                    if (moveturn) {
                        autoshapes.push({
                            brush: color,
                            orig: util.convertSquareToChessgroundXKey(bestmove[1]),
                            dest: util.convertSquareToChessgroundXKey(bestmove[0]),
                            piece: { color: "white", role: piecerole.slice(1) },
                        });
                    } else {
                        autoshapes.push({
                            brush: color,
                            orig: util.convertSquareToChessgroundXKey(bestmove[1]),
                            dest: util.convertSquareToChessgroundXKey(bestmove[0]),
                            piece: { color: "black", role: piecerole.slice(1) },
                        });
                    }
                } else {
                    if (moveturn) {
                        autoshapes.push({
                            brush: color,
                            orig: util.convertSquareToChessgroundXKey(bestmove[1]),
                            dest: util.convertSquareToChessgroundXKey(bestmove[0]),
                            piece: { color: "white", role: bestmove[2] + "-piece" },
                        });
                    } else {
                        autoshapes.push({
                            brush: color,
                            orig: util.convertSquareToChessgroundXKey(bestmove[1]),
                            dest: util.convertSquareToChessgroundXKey(bestmove[0]),
                            piece: { color: "black", role: bestmove[2] + "-piece" },
                        });
                    }
                }
            }
        }
        if (bestmove[3] != "") {
            autoshapes.push({
                brush: color,
                orig: util.convertSquareToChessgroundXKey(bestmove[3]),
            });
            autoshapes.push({
                brush: color,
                dest: "a0",
                orig: util.convertSquareToChessgroundXKey(bestmove[3]),
                piece: {
                    color: "black",
                    role: "_-piece",
                    scale: 0.7,
                },
                modifiers: { hilite: true },
            });
        }
    }
    chessground.setAutoShapes(autoshapes);
}

export class ChessgroundWidget {
    constructor(ContainerDivision, InitialFEN, IsCaptureToHand, BoardWidth, BoardHeight, CoordinateNotation) {
        if (!(ContainerDivision instanceof HTMLDivElement)) {
            throw TypeError("Invalid container element. Container must be a <div> element.");
        }
        if (typeof InitialFEN != "string" || typeof IsCaptureToHand != "boolean" || typeof BoardWidth != "number" || typeof BoardHeight != "number" || typeof CoordinateNotation!="number") {
            throw TypeError();
        }
        while (ContainerDivision.childNodes.length > 0) {
            ContainerDivision.removeChild(ContainerDivision.childNodes.item(0));
        }
        let PocketSize = 0;
        let PocketRoles = undefined;
        if (IsCaptureToHand) {
            const pieceLetters = InitialFEN.split(" ")[0].replace(/[0-9kK\/\[\]]/g, "");
            const pieceRoles = util.getPieceRoles(pieceLetters);
            PocketRoles = {
                white: pieceRoles,
                black: pieceRoles,
            };
            PocketSize = pieceRoles.length;
        }
        else if (InitialFEN.includes("[")) {
            const index = InitialFEN.indexOf("[");
            const pieceLetters = InitialFEN.substring(index + 1, InitialFEN.indexOf("]"));
            const pieceRoles = util.getPieceRoles(pieceLetters);
            const whitePieceLetters = pieceLetters.replace(/[a-z]/g, "");
            const blackPieceLetters = pieceLetters.replace(/[A-Z]/g, "");
            PocketRoles = {
                white: util.getPieceRoles(whitePieceLetters),
                black: util.getPieceRoles(blackPieceLetters),
            };
            PocketSize = pieceRoles.length;
        }
        this.Container = ContainerDivision;
        this.ContainerWidth=0;
        this.ContainerHeight=0;
        this.Wrapper = document.createElement("div");
        this.Wrapper.classList.value = `chessground-wrapper board${BoardWidth}x${BoardHeight} merida blueboard`;
        this.PocketTopWrapper = document.createElement("div");
        this.PocketTopWrapper.classList.add("chessground-pocket-top-wrapper");
        this.PocketTopWrapper.classList.add("cg-wrap");
        this.PocketTopWrapper.classList.add("pocket-top");
        this.PocketBottomWrapper = document.createElement("div");
        this.PocketBottomWrapper.classList.add("chessground-pocket-bottom-wrapper");
        this.PocketBottomWrapper.classList.add("cg-wrap");
        this.PocketBottomWrapper.classList.add("pocket-bottom");
        this.BoardWrapper = document.createElement("div");
        this.BoardWrapper.classList.add("chessground-board-wrapper");
        this.BoardWrapper.classList.add("inner");
        this.PocketTopDivision = document.createElement("div");
        this.PocketBottomDivision = document.createElement("div");
        this.BoardDivision = document.createElement("div");
        this.HasPockets = (PocketSize > 0);
        this.BoardHeight = BoardHeight;
        this.BoardWidth = BoardWidth;
        this.PocketSize = PocketSize;
        this.HiddenPocketSize=0;
        this.SquareDisplaySize=0;

        this.PocketTopWrapper.appendChild(this.PocketTopDivision);
        this.BoardWrapper.appendChild(this.BoardDivision);
        this.PocketBottomWrapper.appendChild(this.PocketBottomDivision);
        this.Wrapper.appendChild(this.PocketTopWrapper);
        this.Wrapper.appendChild(this.BoardWrapper);
        this.Wrapper.appendChild(this.PocketBottomWrapper);

        if (CoordinateNotation>=1 && CoordinateNotation<=3)
        {
            this.Wrapper.classList.add("shogi-coords");
        }
        else if (CoordinateNotation==5 || CoordinateNotation==6)
        {
            this.Wrapper.classList.add("xiangqi-coords");
        }

        this.FEN=InitialFEN;
        this.LastMove="";
        this.ChessgroundInstance = Chessground(this.BoardDivision, {
            autoCastle: false,
            dimensions: { width: BoardWidth, height: BoardHeight },
            fen: InitialFEN,
            disableContextMenu: true,
            movable: {
                free: false,
                showDests: false,
                color: undefined,
                dests: EmptyMap,
            },
            premovable: {
                enabled: false,
            },
            draggable: {
                enabled: false,
            },
            selectable: {
                enabled: false,
            },
            drawable: {
                enabled: true,
                visible: true,
            },
            pocketRoles: PocketRoles,
            notation: CoordinateNotation,
        }, this.PocketTopDivision, this.PocketBottomDivision);
        if (PocketRoles == undefined) {
            this.PocketTopWrapper.classList.add("no-inital-pocket-piece");
            this.PocketBottomWrapper.classList.add("no-inital-pocket-piece");
        }

        this.OnWheelEventCallback=null;

        ContainerDivision.appendChild(this.Wrapper);
    }

    destructor() {
        if (typeof this.OnWheelEventCallback=="function")
        {
            this.BoardWrapper.removeEventListener("wheel",this.OnWheelEventCallback);
        }
    }

    CalculateElementSize(ContainerWidth, ContainerHeight) {
        if (typeof ContainerWidth != "number" || typeof ContainerHeight != "number") {
            throw TypeError();
        }
        let pocketsize=this.PocketSize+this.HiddenPocketSize;
        let displaywidth = Math.max(this.BoardWidth, pocketsize);
        let displayheight = (pocketsize > 0 ? this.BoardHeight + 2 : this.BoardHeight);
        let squarepixelsize = 0;

        //  ContainerHeight/ContainerWidth>displayheight/displaywidth
        if (ContainerHeight * displaywidth > displayheight * ContainerWidth) {
            squarepixelsize = ContainerWidth / displaywidth;
        }
        else {
            squarepixelsize = ContainerHeight / displayheight;
        }
        let width=squarepixelsize * this.BoardWidth;
        let height=squarepixelsize * this.BoardHeight;
        let pocketdivattr=`width: ${squarepixelsize * pocketsize}px; height: ${squarepixelsize}px; --pocketLength: ${pocketsize}; --files: ${this.BoardWidth}; --ranks: ${this.BoardHeight}; --cg-width: ${width}px; --cg-height: ${height}px`;
        this.SquareDisplaySize=squarepixelsize;
        this.Wrapper.style.width=`${displaywidth*squarepixelsize}px`;
        this.Wrapper.style.height=`${displayheight*squarepixelsize}px`;
        this.PocketTopWrapper.style.width=`${displaywidth*squarepixelsize}px`;
        this.PocketTopWrapper.style.height=`${squarepixelsize}px`;
        this.BoardWrapper.style.width=`${displaywidth*squarepixelsize}px`;
        this.BoardWrapper.style.height=`${height}px`;
        this.PocketBottomWrapper.style.width=`${displaywidth*squarepixelsize}px`;
        this.PocketBottomWrapper.style.height=`${squarepixelsize}px`;
        this.BoardDivision.setAttribute("style", `width: ${width}px; height: ${height}px; --cg-width: ${width}px; --cg-height: ${height}px; --files: ${this.BoardWidth}; --ranks: ${this.BoardHeight}`);
        this.PocketTopDivision.setAttribute("style", pocketdivattr);
        this.PocketBottomDivision.setAttribute("style", pocketdivattr);
        this.ContainerWidth=ContainerWidth;
        this.ContainerHeight=ContainerHeight;
    }

    FlashMessage(Message) {
        if (typeof Message != "string") {
            throw TypeError();
        }
        let elem = document.getElementById("flashmessagecontainer");
        let div = document.createElement("div");
        let flashmessage = document.createElement("p");
        flashmessage.classList.add("flashmessage");
        while (elem) {
            this.Wrapper.removeChild(elem);
            elem = document.getElementById("flashmessagecontainer");
        }
        div.id = "flashmessagecontainer";
        div.classList.add("inaccessble");
        div.style.position = "absolute";
        div.style.display = "flex";
        div.style.overflow = "hidden";
        div.style.top = "0";
        div.style.left = "0";
        div.style.bottom = "0";
        div.style.right = "0";
        div.style.justifyContent = "center";
        div.style.alignItems = "center";
        div.style.zIndex = "1000";
        div.style.background = "#0000";
        div.style.pointerEvents = "none";
        flashmessage.textContent = Message;
        div.appendChild(flashmessage);
        setTimeout(() => {
            flashmessage.style.opacity = "1";
            flashmessage.style.fontSize = "min(50vw,50vh)";
        }, 100);
        setTimeout(() => {
            flashmessage.style.opacity = "0";
            flashmessage.style.fontSize = "min(0.01vw,0.01vh)";
        }, 2600);
        this.Wrapper.appendChild(div);
    }

    ShowBoardNotes(BoardNotes, PreviousMoverRound) {
        if (typeof BoardNotes != "string" || typeof PreviousMoverRound != "number") {
            throw TypeError();
        }
        let notes = BoardNotes.split(",");
        let i = 0;
        let color = "";
        let note = "";
        let moveturns = [];
        let moves = [];
        let colors = [];
        let notepositions = [];
        let moveturn = (PreviousMoverRound == 1);
        for (i = 0; i < notes.length; i++) {
            note = notes[i].trim();
            if (note == "") {
                continue;
            }
            if (note[0] == "Y") {
                color = "yellow";
            }
            else if (note[0] == "G") {
                color = "green";
            }
            else if (note[0] == "R") {
                color = "red";
            }
            else if (note[0] == "B") {
                color = "blue";
            }
            else {
                continue;
            }
            note = note.substring(1);
            moveturns.push(moveturn);
            colors.push(color);
            notepositions.push("TopRight")
            if (note.match(/[a-z][0-9]+/g).length == 1) {
                moves.push("@" + note);
            }
            else {
                moves.push(note);
            }
        }
        highlightMoveOnBoard(moveturns, this.ChessgroundInstance, moves, colors, notepositions);
    }

    RerenderPockets(FalseFEN) {
        if (typeof FalseFEN != "string") {
            throw TypeError();
        }
        let mainboard = this.Wrapper.getElementsByTagName("cg-board")[0];
        let mainboardcontainer =
            this.Wrapper.getElementsByTagName("cg-container")[0];
        let css_height = mainboardcontainer.style.height;
        let css_width = mainboardcontainer.style.width;
        let state = this.ChessgroundInstance.state;
        let pockettoplength = 0;
        let pocketbottomlength = 0;
        let elements = {
            board: mainboard,
            pocketTop: this.PocketTopDivision,
            pocketBottom: this.PocketBottomDivision,
            wrap: this.BoardDivision,
            container: this.Wrapper,
        };
        if (this.ChessgroundInstance.state.orientation == "white") {
            pocketbottomlength = this.ChessgroundInstance.state.pocketRoles.white.length;
            pockettoplength = this.ChessgroundInstance.state.pocketRoles.black.length;
        } else {
            pocketbottomlength = this.ChessgroundInstance.state.pocketRoles.black.length;
            pockettoplength = this.ChessgroundInstance.state.pocketRoles.white.length;
        }
        let pocketlength = Math.max(pockettoplength, pocketbottomlength);
        let width=this.SquareDisplaySize * pocketlength;
        let height=this.SquareDisplaySize;
        this.PocketTopDivision.setAttribute(
            "style",
            `width: ${width}; height: ${height}; --pocketLength: ${pocketlength}; --files: ${this.BoardWidth}; --ranks: ${this.BoardHeight}; --cg-width: ${css_width}; --cg-height: ${css_height}`,
        );
        this.PocketBottomDivision.setAttribute(
            "style",
            `width: ${width}; height: ${height}; --pocketLength: ${pocketlength}; --files: ${this.BoardWidth}; --ranks: ${this.BoardHeight}; --cg-width: ${css_width}; --cg-height: ${css_height}`,
        );
        pocketutil.renderPocketsInitial(state, elements, this.PocketTopDivision, this.PocketBottomDivision);
        pocketutil.renderPockets(state);
        this.PocketTopDivision.setAttribute(
            "style",
            `width: ${width}; height: ${height}; --pocketLength: ${pocketlength}; --files: ${this.BoardWidth}; --ranks: ${this.BoardHeight}; --cg-width: ${css_width}; --cg-height: ${css_height}`,
        );
        this.PocketBottomDivision.setAttribute(
            "style",
            `width: ${width}; height: ${height}; --pocketLength: ${pocketlength}; --files: ${this.BoardWidth}; --ranks: ${this.BoardHeight}; --cg-width: ${css_width}; --cg-height: ${css_height}`,
        );
        if (FalseFEN) {
            this.ChessgroundInstance.set({
                fen: FalseFEN,
            });
        }
    }

    SetPosition(FEN, PreviousMoverRound, LastMove, CheckedSquares, GameResult, HiddenPieces) {
        if (typeof FEN != "string" || typeof PreviousMoverRound != "number" || (!Array.isArray(LastMove) && typeof LastMove != "undefined") || !Array.isArray(CheckedSquares) || typeof GameResult != "string" || typeof HiddenPieces != "object") {
            throw TypeError();
        }
        this.ChessgroundInstance.set({
            fen: FEN,
            turnColor: PreviousMoverRound == 1 ? "white" : "black",
            check: CheckedSquares,
            lastMove: LastMove,
        });
        this.FEN=FEN;
        this.LastMove=LastMove.join("");
        if (GameResult != "*") {
            this.FlashMessage(GameResult);
        }
        let i = 0;
        let hiddenpieceresult = HiddenPieces;
        let previoushiddenpocketsize=this.HiddenPocketSize;
        this.HiddenPocketSize = hiddenpieceresult.hiddenpieces.length;
        if (hiddenpieceresult.hiddenpieces.length) {
            if (this.ChessgroundInstance.state.pocketRoles == undefined) {
                this.ChessgroundInstance.state.pocketRoles = { white: [], black: [] };
            }
            let whitehiddenpieceroles = util.getPieceRoles(hiddenpieceresult.whitehiddenpieces);
            let blackhiddenpieceroles = util.getPieceRoles(hiddenpieceresult.blackhiddenpieces);
            if (this.ChessgroundInstance.state.boardState.pockets == undefined) {
                this.ChessgroundInstance.state.boardState.pockets = {
                    white: new Map(),
                    black: new Map(),
                };
            }
            for (i = 0; i < whitehiddenpieceroles.length; i++) {
                if (
                    this.ChessgroundInstance.state.pocketRoles.white.indexOf(whitehiddenpieceroles[i]) <
                    0
                ) {
                    this.ChessgroundInstance.state.pocketRoles.white.push(whitehiddenpieceroles[i]);
                }
                this.ChessgroundInstance.state.boardState.pockets.white.set(
                    whitehiddenpieceroles[i],
                    1,
                );
            }
            for (i = 0; i < blackhiddenpieceroles.length; i++) {
                if (
                    this.ChessgroundInstance.state.pocketRoles.black.indexOf(blackhiddenpieceroles[i]) <
                    0
                ) {
                    this.ChessgroundInstance.state.pocketRoles.black.push(blackhiddenpieceroles[i]);
                }
                this.ChessgroundInstance.state.boardState.pockets.black.set(
                    blackhiddenpieceroles[i],
                    1,
                );
            }
            let fen = FEN;
            if (fen.includes("[")) {
                let endoffenpocket = fen.indexOf("]");
                fen =
                    fen.substring(0, endoffenpocket) +
                    hiddenpieceresult.hiddenpieces.join("") +
                    fen.substring(endoffenpocket);
            } else {
                let fenlist = fen.split(" ");
                fenlist[0] += `[${hiddenpieceresult.hiddenpieces.join("")}]`;
                fen = fenlist.join(" ");
            }
            if (previoushiddenpocketsize!=this.HiddenPocketSize)
            {
                this.CalculateElementSize(this.ContainerWidth,this.ContainerHeight);
            }
            this.FEN=fen;
            this.Wrapper.classList.add("pockets");
            this.RerenderPockets(fen);
            this.PocketTopWrapper.classList.add("has-hidden-pocket-piece");
            this.PocketBottomWrapper.classList.add("has-hidden-pocket-piece");
        }
        else {
            if (previoushiddenpocketsize!=this.HiddenPocketSize)
            {
                this.CalculateElementSize(this.ContainerWidth,this.ContainerHeight);
            }
            this.PocketTopWrapper.classList.remove("has-hidden-pocket-piece");
            this.PocketBottomWrapper.classList.remove("has-hidden-pocket-piece");
        }
    }

    SetTheme(PieceTheme, BoardTheme) {
        if (typeof PieceTheme != "string" || typeof BoardTheme != "string") {
            throw TypeError();
        }
        let classes = ["chessground-wrapper", `board${this.BoardWidth}x${this.BoardHeight}`];
        if (this.Wrapper.classList.contains("pockets"))
        {
            classes.push("pockets");
        }
        if (this.Wrapper.classList.contains("shogi-coords"))
        {
            classes.push("shogi-coords");
        }
        else if (this.Wrapper.classList.contains("xiangqi-coords"))
        {
            classes.push("xiangqi-coords");
        }
        if (PieceTheme) {
            classes.push(PieceTheme);
        }
        if (BoardTheme) {
            classes.push(BoardTheme);
        }
        this.Wrapper.classList.value = classes.join(" ");
    }

    SetBoardOnWheelEventCallback(Callback)
    {
        if (typeof Callback!="function")
        {
            throw TypeError();
        }
        if (this.OnWheelEventCallback!=null)
        {
            return;
        }
        this.OnWheelEventCallback=function(event) {
            if (event instanceof WheelEvent)
            {
                if (event.isTrusted)
                {
                    if (event.deltaY>0)
                    {
                        Callback(event,1);
                    }
                    else if (event.deltaY<0)
                    {
                        Callback(event,-1);
                    }
                }
            }
        }
        this.BoardWrapper.addEventListener("wheel",this.OnWheelEventCallback);
    }
}
