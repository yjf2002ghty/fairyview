export function parseUCIMove(ucimove) {
    if (typeof ucimove != "string") {
        throw TypeError;
    }
    if (ucimove == "0000" || ucimove == "") {
        return [undefined, undefined, undefined, undefined];
    }
    function SplitNumberAndLetter(move) {
        let j = 0;
        let numstart = 0;
        let letterstart = 0;
        let state = 0;
        let nums = [];
        let letters = [];
        for (j = 0; j < move.length; j++) {
            if (state == 0) {
                if (move.charCodeAt(j) >= 48 && move.charCodeAt(j) <= 57) {
                    state = 1;
                    if (letterstart != j) {
                        letters.push(move.substring(letterstart, j));
                    }
                    numstart = j;
                }
            } else {
                if (move.charCodeAt(j) >= 97 && move.charCodeAt(j) <= 122) {
                    state = 0;
                    if (numstart != j) {
                        nums.push(move.substring(numstart, j));
                    }
                    letterstart = j;
                }
            }
        }
        if (state == 1) {
            if (numstart != j) {
                nums.push(move.substring(numstart, j));
            }
        } else {
            if (letterstart != j) {
                letters.push(move.substring(letterstart, j));
            }
        }  
        return { numbers: nums, letters: letters };
    }
    let move = ucimove;
    let gatingmove = "";
    if (move.includes(",")) {
        let parts = move.split(",");
        let gating = parts[1];
        move = parts[0];
        let targets = SplitNumberAndLetter(gating);
        gatingmove = targets.letters[1] + targets.numbers[1];
    }
    if (move.includes("@")) {
        let indexofat = move.indexOf("@");
        return [
            move.slice(0, indexofat + 1),
            move.slice(indexofat + 1),
            "",
            gatingmove,
        ];
    }
    let additional = "";
    let lastch = move.at(-1);
    if (lastch == "+") {
        additional = "+";
        move = move.slice(0, -1);
    } else if (lastch == "-") {
        additional = "-";
        move = move.slice(0, -1);
    } else {
        let chcode = lastch.charCodeAt(0);
        if (chcode >= 97 && chcode <= 122) {
        additional = lastch;
        move = move.slice(0, -1);
        }
    }
    let target = SplitNumberAndLetter(move);
    let files = target.letters;
    let ranks = target.numbers;
    if (files.length != 2 || ranks.length != 2) {
        return [null, null, null, null];
    }
    return [files[0] + ranks[0], files[1] + ranks[1], additional, gatingmove];
}

export function convertSquareToChessgroundXKey(square) {
    const ranks = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        ":",
        ";",
        "<",
        "=",
        ">",
        "?",
        "@",
    ];
    const files = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
    ];
    return square.charAt(0) + ranks[parseInt(square.substring(1)) - 1];
}

export function getCheckSquares(board) {
    let checks = board.checkedPieces();
    if (checks == "") {
      return [];
    }
    let checklist = checks.split(" ");
    let i = 0;
    for (i = 0; i < checklist.length; i++) {
      checklist[i] = convertSquareToChessgroundXKey(checklist[i]);
    }
    return checklist;
}

export function generateMoveNotationSVG(text, backgroundcolor, textcolor, position) {
    if (
      typeof text != "string" ||
      typeof backgroundcolor != "string" ||
      typeof textcolor != "string" ||
      typeof position != "string"
    ) {
      return null;
    }
    if (position == "TopRight") {
      return `<svg xmlns='http://www.w3.org/2000/svg'version='1.1'width='100px'height='100px'><path style="fill:${backgroundcolor};stroke:none;stroke-width:0;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"d="m 100,2 a 20,20 0 0 0 -20,19.999999 20,20 0 0 0 20,20 z"/><g transform="scale(1.5)"><text style="fill:${textcolor}"font-size="15"font-family="Arial"font-weight="bold"x="60"y="15"text-anchor="middle"dominant-baseline="central">${text.replace("-", "━").replace("+", "✚")}</text></g></svg>`;
    } else if (position == "TopLeft") {
      return `<svg xmlns='http://www.w3.org/2000/svg'version='1.1'width='100px'height='100px'><path style="fill:${backgroundcolor};stroke:none;stroke-width:0;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"d="m 0,2 a 20,20 0 0 1 20,19.999999 20,20 0 0 1 -20,20 z"/><g transform="scale(1.5)"><text style="fill:${textcolor}"font-size="15"font-family="Arial"font-weight="bold"x="6"y="15"text-anchor="middle"dominant-baseline="central">${text.replace("-", "━").replace("+", "✚")}</text></g></svg>`;
    } else {
      return null;
    }
}

export function generatePassTurnNotationSVG(backgroundcolor) {
    if (typeof backgroundcolor != "string") {
      return null;
    }
    let bgcolor = "#0078d7";
    if (backgroundcolor != "") {
      bgcolor = backgroundcolor;
    }
    return `<svg width="100"height="100"viewBox="0 0 26.458333 26.458333"version="1.1"xmlns="http://www.w3.org/2000/svg"xmlns:svg="http://www.w3.org/2000/svg"><g><ellipse style="fill:${bgcolor};stroke:#000000;stroke-width:1.05833333;stroke-linecap:square;stroke-dasharray:none;stroke-opacity:1;fill-opacity:1"id="background"cx="13.229165"cy="13.229164"rx="11.906248"ry="11.906247"/><path id="foreground"style="fill:#ffffff;fill-opacity:1;stroke:#ffffff;stroke-width:0;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;image-rendering:auto"d="m 13.229166,3.9687505 -2.778125,2.7781249 2.778125,2.7781248 V 7.672917 a 5.5562497,5.5562497 0 0 1 5.55625,5.556251 5.5562497,5.5562497 0 0 1 -3.271893,5.06248 l 1.377486,1.377487 a 7.4083326,7.4083326 0 0 0 3.74649,-6.439967 7.4083326,7.4083326 0 0 0 -7.408333,-7.4083344 z m -3.6607575,2.821533 a 7.4083326,7.4083326 0 0 0 -3.7475747,6.4388845 7.4083326,7.4083326 0 0 0 7.4083322,7.408331 v 1.852084 l 2.778125,-2.778125 -2.778125,-2.778125 v 1.852083 A 5.5562497,5.5562497 0 0 1 7.672917,13.229168 5.5562497,5.5562497 0 0 1 10.945171,8.1670469 Z"/></g></svg>`;
}

export function getPieceRoles(pieceLetters) {
    if (typeof pieceLetters!="string")
    {
        return null;
    }
    const uniqueLetters = new Set(pieceLetters.toLowerCase().split(""));
    return [...uniqueLetters].map((char) => char + "-piece");
}

function pieceDisplayedInPocketOfFEN(fen, pieceid) {
    if (typeof fen!="string" || typeof pieceid!="string")
    {
        throw TypeError();
    }
    if (fen.includes("[")) {
      let pieces = fen.substring(fen.indexOf("[") + 1, fen.indexOf("]"));
      return pieces.includes(pieceid);
    } else {
      return false;
    }
}

export function getHiddenDroppablePiece(fen,moveturn,legalmoves)
{
    if (typeof fen!="string" || typeof moveturn!="boolean" || typeof legalmoves!="string")
    {
        throw TypeError();
    }
    let originalfen = fen;
    let moves = legalmoves.split(" ");
    let i = 0;
    let movepart = [];
    let hiddenpieces = [];
    let whitehiddenpieces = "";
    let blackhiddenpieces = "";
    for (i = 0; i < moves.length; i++) {
        if (moves[i]=="")
        {
            continue;
        }
        movepart = parseUCIMove(moves[i]);
        if (movepart[0].endsWith("@")) {
            if (movepart[0].charAt(0) == "+") {
                let pieceid = moveturn
                ? movepart[0].charAt(1)
                : movepart[0].charAt(1).toLowerCase();
                if (!pieceDisplayedInPocketOfFEN(originalfen, pieceid)) {
                    if (moveturn) {
                        whitehiddenpieces += pieceid;
                    } else {
                        blackhiddenpieces += pieceid;
                    }
                    if (hiddenpieces.indexOf(pieceid) < 0) {
                        hiddenpieces.push(pieceid);
                    }
                }
            }
            else
            {
                let pieceid = moveturn
                ? movepart[0].charAt(0)
                : movepart[0].charAt(0).toLowerCase();
                if (!pieceDisplayedInPocketOfFEN(originalfen, pieceid)) {
                    if (moveturn) {
                        whitehiddenpieces += pieceid;
                    } else {
                        blackhiddenpieces += pieceid;
                    }
                    if (hiddenpieces.indexOf(pieceid) < 0) {
                        hiddenpieces.push(pieceid);
                    }
                }
            }
        }
    }
    return {hiddenpieces: hiddenpieces, whitehiddenpieces: whitehiddenpieces, blackhiddenpieces: blackhiddenpieces};
}

export function getDimensions(fen) {
    if (typeof fen!="string")
    {
        throw TypeError();
    }
    const fenBoard = fen.split(" ")[0];
    const ranks = fenBoard.split("/").length;
    const lastRank = fenBoard.split("/")[0].replace(/[^0-9a-z*]/gi, "");
    let files = lastRank.length;
  
    for (const match of lastRank.matchAll(/\d+/g)) {
      files += parseInt(match[0]) - match[0].length;
    }
  
    //console.log("Board: %dx%d", files, ranks);
    return {
      width: files,
      height: ranks,
    };
}

export function DownloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function ParseFEN(fen) {
    if (typeof fen!="string") {
      throw TypeError;
    }
    let i=0;
    let j=0;
    const pieceprefixes=['+','|'];
    const piecesuffixes=['~'];
    const specialpieces=['*'];
    let boardwidth=0;
    let boardheight=0;
    let chcode=0;
    let ParserState=-1;
    let pieces=[];
    let piececolor="";
    let pieceid="";
    let firstrow=true;
    let columncount=0;
    let prefix="";
    let suffix="";
    let blankcount=0;
    let ch;
    const fenelem=fen.split(/[ ]+/);
    const position=fenelem[0];
    for (i=0;i<position.length;i++) {
        ch=position[i];
        chcode=ch.charCodeAt(0);
        if (ParserState==-1) {  //Initial state
            if (chcode>=65 && chcode<=90) {
                boardheight=1;
                columncount++;
                piececolor="white";
                pieceid=String.fromCharCode(chcode+32);
                ParserState=1;
            }
            else if (chcode>=97 && chcode<=122) {
                boardheight=1;
                columncount++;
                piececolor="black";
                pieceid=ch;
                ParserState=1;
            }
            else if (chcode>=48 && chcode<=57) {
                boardheight=1;
                blankcount=parseInt(ch);
                ParserState=0;
            }
            else if (pieceprefixes.includes(ch)) {
                if (prefix.includes(ch)) {
                    console.warn(`Duplicated piece prefix "${ch}" at char ${i+1} of FEN.`);
                    return null;
                }
                boardheight=1;
                prefix+=ch;
                ParserState=0;
            }
            else if (specialpieces.includes(ch)) {
                columncount++;
                boardheight=1;
                pieces.push({role: ch, color: null, prefix: null, suffix: null});
                ParserState=0;
            }
            else {
                console.warn(`Illegal character "${ch}" at char ${i+1} of FEN.`);
                return null;
            }
        }
        else if (ParserState==0) {  //Main state
            if (blankcount>0 && (chcode<48 || chcode>57)) {
                for (j=0;j<blankcount;j++) {
                    pieces.push({role: null, color: null, prefix: null, suffix: null});
                }
                columncount+=blankcount;
                blankcount=0;
            }
            if (chcode>=65 && chcode<=90) {
                piececolor="white";
                pieceid=String.fromCharCode(chcode+32);
                columncount++;
                ParserState=1;
            }
            else if (chcode>=97 && chcode<=122) {
                piececolor="black";
                pieceid=ch;
                columncount++;
                ParserState=1;
            }
            else if (chcode>=48 && chcode<=57) {
                if (prefix.length>0) {
                    console.warn(`Illegal prefix "${prefix}" describing empty squares at char ${i+1} of FEN.`);
                    return null;
                }
                blankcount=blankcount*10+parseInt(ch);
                prefix="";
                suffix="";
            }
            else if (pieceprefixes.includes(ch)) {
                if (prefix.includes(ch)) {
                    console.warn(`Duplicated piece prefix "${ch}" at char ${i+1} of FEN.`);
                    return null;
                }
                prefix+=ch;
            }
            else if (specialpieces.includes(ch)) {
                if (prefix.length>0) {
                    console.warn(`Illegal prefix "${prefix}" describing special piece at char ${i+1} of FEN.`);
                    return null;
                }
                columncount++;
                pieces.push({role: ch, color: null, prefix: null, suffix: null});
            }
            else if (ch=='/') {
                if (firstrow) {
                    boardwidth=columncount;
                    firstrow=false;
                }
                else if (columncount!=boardwidth) {
                    console.warn(`Column count mismatch at row ${boardheight}. Expected: ${boardwidth}, Actual: ${columncount}`);
                    return null;
                }
                columncount=0;
                boardheight++;
                if (prefix.length>0) {
                    console.warn(`Illegal prefix "${prefix}" at end of row at char ${i+1} of FEN.`);
                    return null;
                }
            }
            else {
                console.warn(`Illegal character "${ch}" at char ${i+1} of FEN.`);
                return null;
            }
        }
        else if (ParserState==1) {  //Parsing suffixes
            if (piecesuffixes.includes(ch)) {
                suffix+=ch;
            }
            else {
                pieces.push({role: pieceid, color: piececolor, prefix: prefix, suffix: suffix});
                prefix="";
                suffix="";
                i--;
                ParserState=0;
            }
        }
    }
    if (ParserState==0) {
        if (blankcount>0) {
            for (j=0;j<blankcount;j++) {
                pieces.push({role: null, color: null, prefix: null, suffix: null});
            }
            columncount+=blankcount;
        }
    }
    else if (ParserState==1) {
        pieces.push({role: pieceid, color: piececolor, prefix: prefix, suffix: suffix});
        prefix="";
    }
    if (firstrow) {
        boardwidth=columncount;
    }
    else if (columncount!=boardwidth) {
        console.warn(`Column count mismatch at row ${boardheight}. Expected: ${boardwidth}, Actual: ${columncount}`);
        return null;
    }
    if (prefix.length>0) {
        console.warn(`Illegal prefix "${prefix}" at end of row at char ${i+1} of FEN.`);
        return null;
    }
    return pieces;
}
