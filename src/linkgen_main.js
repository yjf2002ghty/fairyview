import * as queryutil from "./compression.js";

function main()
{
    let genlink=document.getElementById("genlink");
    let domain=document.getElementById("domain");
    let css=document.getElementById("css");
    let ini=document.getElementById("ini");
    let pgn=document.getElementById("pgn");
    let notation=document.getElementById("notation");
    let coordinate=document.getElementById("coordinate");
    let linktext=document.getElementById("linktext");
    let iframecode=document.getElementById("iframe-code");
    let cssexample=document.getElementById("css-example");
    let iniexample=document.getElementById("ini-example");
    let pgnexample=document.getElementById("pgn-example");
    let localhostwarning=document.getElementById("localhost-warning");
    if (
        css instanceof HTMLTextAreaElement &&
        ini instanceof HTMLTextAreaElement &&
        pgn instanceof HTMLTextAreaElement &&
        domain instanceof HTMLInputElement &&
        notation instanceof HTMLSelectElement &&
        coordinate instanceof HTMLSelectElement &&
        linktext instanceof HTMLAnchorElement &&
        iframecode instanceof HTMLElement
    )
    {
        let pathlist=window.location.pathname.split("/");
        pathlist[pathlist.length-1]=pathlist[pathlist.length-1].replace("linkgen","index");
        let newpath=pathlist.join("/");
        domain.value=`${window.location.protocol}//${window.location.host}${newpath}`;
        localhostwarning.style.display="none";
        genlink.onclick=()=>{
            let url=null;
            if (domain.value=="")
            {
                window.alert("Domain is a required field.");
                return;
            }
            try {
                url=new URL(domain.value);
            }
            catch {
                window.alert("Invalid URL in domain field.");
                return;
            }
            if (pgn.value=="")
            {
                window.alert("PGN is a required field.");
                return;
            }
            let queries=new URLSearchParams();
            if (css.value)
            {
                queries.append("css",queryutil.EncodeQuery(css.value));
            }
            if (ini.value)
            {
                queries.append("ini",queryutil.EncodeQuery(ini.value));
            }
            queries.append("pgn",queryutil.EncodeQuery(pgn.value));
            queries.append("not",String(notation.selectedIndex));
            queries.append("coo",String(coordinate.selectedIndex));
            linktext.textContent=`${domain.value}?${queries.toString()}`;
            linktext.href=`${domain.value}?${queries.toString()}`;
            iframecode.textContent=`<iframe src="${domain.value}?${queries.toString()}" width="800" height="600"></iframe>`;
            if (url.hostname=="localhost" || url.hostname=="127.0.0.1")
            {
                localhostwarning.style.display="";
            }
            else
            {
                localhostwarning.style.display="none";
            }
        };
        cssexample.onclick=()=>{
            css.value=":root {\n --text-color: #ccc;\n --bg-color: #333;\n --title-text-color: #fff;\n --title-bg-color: #444;\n --viewer-non-mainline-bg-color: #666;\n --branch-move-hover-color: #888;\n --border-color: #888;\n --button-active-text-color: #000;\n --button-active-color: #629924;\n --menu-color: #000;\n --menu-active-text-color: #eee;\n --menu-active-color: #555;\n --menu-hr-color: #666;\n --button-clicked-text-color: #555;\n --button-clicked-color: #eee;\n}";
        };
        iniexample.onclick=()=>{
            ini.value="[tictactoe]\nmaxRank = 3\nmaxFile = 3\nimmobile = p\nstartFen = 3/3/3[PPPPPpppp] w - - 0 1\npieceDrops = true\ndoubleStep = false\ncastling = false\nstalemateValue = draw\nimmobilityIllegal = false\nconnectN = 3";
        };
        pgnexample.onclick=()=>{
            pgn.value="[Event \"British Championship 2025\"]\n[White \"Yao,Lan\"]\n[Black \"Maroroa Jones,Gawain C B\"]\n[Site \"https://share.chessbase.com/SharedGames/game/?p=yzfJ4K06xOD/syLEENbOkXOdOLp20ZTI+6L1zIm3i9ox4JHR8jU5LHxJJznjgDB2\"]\n[Round \"4.9\"]\n[Annotator \"\"]\n[Result \"0-1\"]\n[Date \"2025.08.05\"]\n[WhiteElo \"2261\"]\n[BlackElo \"2653\"]\n[PlyCount \"82\"]\n[TimeControl \"60\"]\n\n{[%evp 17,82,38,30,35,42,38,27,33,32,26,25,0,0,-13,-4,-31,-26,-34,-19,-27,-33,-60,-33,-27,-19,-47,-42,-32,-27,-23,-20,-34,-35,-53,-18,-28,0,-11,-16,-10,0,-41,-49,-39,-31,-111,-103,-178,-133,-146,-143,-153,-139,-244,-234,-305,-314,-328,-230,-586,-608,-605,-600,-585,-588,-677,-665]} 1. e4 {[%emt 0:0:12]} d6 {[%emt 0:0:13]} 2. d4 {[%emt 0:0:33]} Nf6 {[%emt 0:0:8]} 3. Nc3 {[%emt 0:0:25]} e5 {[%emt 0:0:7]} 4. Nf3 {[%emt 0:0:19]} Nbd7 {[%emt 0:0:6]} 5. Bc4 {[%emt 0:0:28]} Be7 {[%emt 0:0:10]} 6. O-O {[%emt 0:0:12]} O-O {[%emt 0:0:7]} 7. a4 {[%emt 0:1:14]} c6 {[%emt 0:0:22]} 8. Re1 {[%emt 0:1:9]} h6 {[%emt 0:0:6]} 9. h3 {[%emt 0:1:45]} Re8 {[%emt 0:0:7]} 10. Ba2 {[%emt 0:4:0] C41: Philidor Defence.} exd4 $1 {[%emt 0:4:17][%mdl 4] is now more promising than 10...Qc7.} 11. Nxd4 {[%emt 0:0:33]} Nc5 $5 {[%emt 0:0:20][%mdl 4] Leaves trodden paths.} 12. Qf3 {[%emt 0:8:13] White has an edge.} Bf8 {[%emt 0:2:51][%cal Yd6d5]} 13. Bf4 {[%emt 0:4:1]} Ne6 {[%emt 0:1:4]} 14. Nxe6 {[%emt 0:2:41]} Bxe6 {[%emt 0:0:7]} 15. Bxe6 {[%emt 0:3:5]} Rxe6 {[%emt 0:1:25]} 16. Re3 {[%emt 0:16:35]} Qa5 $146 {[%emt 0:4:19]} (16... Qb6 17. b3 Rae8 18. Rae1 Qa5 19. R1e2 a6 20. g4 Nd7 21. Bg3 b5 22. Kh2 Nc5 23. axb5 axb5 {0-1 Bosman,M (2356)-Drenchev,P (2465) NRW Class2 0910 2009 (5.5)} )17. Rae1 {[%emt 0:9:3]} Rae8 {[%emt 0:5:7]} 18. b3 {[%emt 0:4:34]} a6 {[%emt 0:3:50]} 19. Bg3 {[%emt 0:7:40]} Qc5 {[%emt 0:6:56]} 20. R3e2 {[%emt 0:5:23]} b5 {[%emt 0:4:58]} 21. Qd3 {[%emt 0:2:3]} Nh5 {[%emt 0:3:21]} 22. Bh2 {[%emt 0:1:22]} g6 {[%emt 0:0:34]} 23. axb5 {[%emt 0:9:19]} axb5 {[%emt 0:0:19]} 24. Re3 {[%emt 0:1:30]} Bg7 {[%emt 0:1:28]} 25. Nd1 {[%emt 0:8:37]} Ra8 {[%emt 0:11:36]} 26. R3e2 {[%emt 0:1:53]} Ra1 {[%emt 0:3:59]} 27. Kh1 {[%emt 0:0:39]} Qb4 {[%emt 0:5:59]} 28. Rg1 {[%emt 0:0:49]} Ra8 {[%emt 0:7:58]} 29. Rd2 {[%emt 0:3:42]} Nf6 {[%emt 0:7:47][%cal Yh5f6,Yf6d5,Yd5b4][%mdl 32]} (29... Rxe4 $2 30. c3 (30. Qxd6 Nf6 $15 )Bxc3 31. Qxc3 $18 (31. Nxc3 Ree8 $18 ))30. Bxd6 {[%emt 0:1:50]} Qxe4 {[%emt 0:0:6] [#]} 31. Bc5 {[%emt 0:0:56]} (31. Nc3 $1 $15 Qh4 32. Bg3 )Qh4 {[%emt 0:2:4]} 32. f3 {[%emt 0:0:57] Prevents Ne4.} (32. Qf3 $17 )Nd5 {[%emt 0:2:56]} 33. Bf2 {[%emt 0:0:19]} Qg5 $36 {[%emt 0:0:21][%mdl 2048] Black is in control.} 34. h4 {[%emt 0:0:28] [#]} Qe7 {[%emt 0:2:20] Black has more active pieces.} 35. g3 {[%emt 0:0:36]} (35. c3 $17 )Nb4 $19 {[%emt 0:0:18]} 36. Qf1 {[%emt 0:0:22]} Ra2 {[%emt 0:0:32]} 37. Rg2 {[%emt 0:0:56]} Ra1 {[%emt 0:2:2][%cal Yg7c3] and ...Bc3! should not be overlooked} ({Don't take} 37... Nxc2 38. Kh2 $19 )38. Kh2 $2 {[%emt 0:0:21]} (38. Rg1 )Bc3 {[%emt 0:0:28] Black is clearly winning.} 39. Bd4 {[%emt 0:0:31]} Bxd4 {[%emt 0:0:59]} ({Weaker is} 39... Re1 40. Qxe1 Qxe1 41. Bxc3 Rxd1 42. Rd8+ Rxd8 43. Bxe1 $11 )40. Rxd4 {[%emt 0:0:25]} Re1 {[%emt 0:0:9]} 41. Rd7 {[%emt 0:12:13]} Rxf1 {[%emt 0:1:35]} 0-1\n";
        };
    }
}

main();
