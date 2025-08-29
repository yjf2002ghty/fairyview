class EvaluationBarWidget
{
    constructor(ContainerDivision)
    {
        if (!(ContainerDivision instanceof HTMLDivElement))
        {
            throw TypeError("Invalid container element. Container must be a <div> element.");
        }
        this.Container=ContainerDivision;
        this.Wrapper=document.createElement("div");
        this.Wrapper.classList.add("evalbar-wrapper");
        this.EvaluationBarProgress=document.createElement("div");
        this.EvaluationBarProgress.classList.add("evalbar-progress");
        this.EvaluationText=document.createElement("p");
        this.EvaluationText.classList.add("evalbar-text");
        this.Wrapper.appendChild(this.EvaluationBarProgress);
        this.Wrapper.appendChild(this.EvaluationText);
        ContainerDivision.appendChild(this.Wrapper);
    }

    CalculateElementSize(ContainerWidth,ContainerHeight)
    {
        if (typeof ContainerWidth!="number" || typeof ContainerHeight!="number")
        {
            throw TypeError();
        }
        let borderwidth=Math.min(0.025*ContainerWidth,0.025*ContainerHeight);
        this.Wrapper.style.width=`${ContainerWidth-2*borderwidth}px`;
        this.Wrapper.style.height=`${ContainerHeight-2*borderwidth}px`;
        this.Wrapper.style.borderWidth=`${borderwidth}px`;
        this.EvaluationBarProgress.style.height=`${ContainerHeight}px`;
        this.EvaluationText.style.fontSize=`${0.25*Math.min(ContainerWidth,ContainerHeight)}px`;
    }

    SetEvaluation(Evaluation)
    {
        if (typeof Evaluation!="string")
        {
            throw TypeError();
        }
        if (Evaluation=="")
        {
            this.EvaluationBarProgress.style.width="";
            this.EvaluationText.textContent="N/A";
        }
        else if (Evaluation.startsWith("#"))
        {
            let matenum=parseInt(Evaluation.substring(1));
            if (isNaN(matenum))
            {
                return;
            }
            else if (matenum<0)
            {
                this.EvaluationBarProgress.style.width="0%";
            }
            else if (matenum>0)
            {
                this.EvaluationBarProgress.style.width="100%";
            }
            this.EvaluationText.textContent=`Mate in ${Math.abs(matenum)}`;
        }
        else
        {
            let evalnum=parseFloat(Evaluation);
            let progress=50+evalnum*5;
            if (progress>98)
            {
                this.EvaluationBarProgress.style.width="98%";
            }
            else if (progress<2)
            {
                this.EvaluationBarProgress.style.width="2%";
            }
            else
            {
                this.EvaluationBarProgress.style.width=`${progress}%`;
            }
            if (evalnum>0)
            {
                this.EvaluationText.textContent=("+"+evalnum.toFixed(2));
            }
            else
            {
                this.EvaluationText.textContent=evalnum.toFixed(2);
            }
        }
    }

    destructor() {}
}

export class GameInformationWidget
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
        this.EvaluationBarContainer=document.createElement("div");
        this.EvaluationBarContainer.classList.add("evalbar-container");
        this.EvaluationBar=new EvaluationBarWidget(this.EvaluationBarContainer);
        this.Wrapper=document.createElement("div");
        this.Wrapper.classList.add("gameinfo-wrapper");
        this.WhiteInformationDivision=document.createElement("div");
        this.WhiteInformationDivision.classList.add("white-info");
        this.BlackInformationDivision=document.createElement("div");
        this.BlackInformationDivision.classList.add("black-info");
        this.WhiteTimeDisplay=document.createElement("p");
        this.WhiteTimeDisplay.classList.add("white-time");
        this.BlackTimeDisplay=document.createElement("p");
        this.BlackTimeDisplay.classList.add("black-time");
        this.WhitePlayerNameDisplay=document.createElement("p");
        this.WhitePlayerNameDisplay.classList.add("white-player-name");
        this.BlackPlayerNameDisplay=document.createElement("p");
        this.BlackPlayerNameDisplay.classList.add("black-player-name");
        this.WhiteInformationDivision.appendChild(this.WhitePlayerNameDisplay);
        this.WhiteInformationDivision.appendChild(this.WhiteTimeDisplay);
        this.BlackInformationDivision.appendChild(this.BlackPlayerNameDisplay);
        this.BlackInformationDivision.appendChild(this.BlackTimeDisplay);
        this.Wrapper.appendChild(this.WhiteInformationDivision);
        this.Wrapper.appendChild(this.EvaluationBarContainer);
        this.Wrapper.appendChild(this.BlackInformationDivision);
        ContainerDivision.appendChild(this.Wrapper);
    }

    destructor() {}

    CalculateElementSize(ContainerWidth,ContainerHeight)
    {
        if (typeof ContainerWidth!="number" || typeof ContainerHeight!="number")
        {
            throw TypeError();
        }
        let newheight=(ContainerWidth>3*ContainerHeight)?ContainerHeight:ContainerWidth/3;
        this.Wrapper.style.width=`${ContainerWidth}px`;
        this.Wrapper.style.height=`${newheight}px`;
        this.EvaluationBarContainer.style.width=`${newheight}px`;
        this.EvaluationBarContainer.style.height=`${newheight}px`;
        this.WhiteInformationDivision.style.width=`${(ContainerWidth-newheight)/2}px`;
        this.WhiteInformationDivision.style.height=`${newheight}px`;
        this.BlackInformationDivision.style.width=`${(ContainerWidth-newheight)/2}px`;
        this.BlackInformationDivision.style.height=`${newheight}px`;
        this.WhiteTimeDisplay.style.width=this.BlackTimeDisplay.style.width=`${(ContainerWidth-newheight)/2}px`;
        this.WhiteTimeDisplay.style.height=this.BlackTimeDisplay.style.height=`${newheight/2}px`;
        this.WhitePlayerNameDisplay.style.width=this.BlackPlayerNameDisplay.style.width=`${(ContainerWidth-newheight)/2}px`;
        this.WhitePlayerNameDisplay.style.height=this.BlackPlayerNameDisplay.style.height=`${newheight/2}px`;
        this.WhiteTimeDisplay.style.fontSize=this.BlackTimeDisplay.style.fontSize=`${newheight/3}px`;
        this.WhitePlayerNameDisplay.style.fontSize=this.BlackPlayerNameDisplay.style.fontSize=`${newheight/6}px`;
        this.EvaluationBar.CalculateElementSize(newheight,newheight);
    }

    SetPlayerInformation(WhitePlayerName,BlackPlayerName,WhiteElo,BlackElo)
    {
        if (typeof WhitePlayerName!="string" || typeof BlackPlayerName!="string" || typeof WhiteElo!="string" || typeof BlackElo!="string")
        {
            throw TypeError();
        }
        let whiteelo=parseInt(WhiteElo);
        let blackelo=parseInt(BlackElo);
        if (WhitePlayerName)
        {
            if (isNaN(whiteelo))
            {
                this.WhitePlayerNameDisplay.textContent=WhitePlayerName;
            }
            else
            {
                this.WhitePlayerNameDisplay.textContent=WhitePlayerName+" ("+WhiteElo+")";
            }
        }
        else
        {
            this.WhitePlayerNameDisplay.textContent="?";
        }
        if (BlackPlayerName)
        {
            if (isNaN(blackelo))
            {
                this.BlackPlayerNameDisplay.textContent=BlackPlayerName;
            }
            else
            {
                this.BlackPlayerNameDisplay.textContent=BlackPlayerName+" ("+BlackElo+")";
            }
        }
        else
        {
            this.BlackPlayerNameDisplay.textContent="?";
        }
    }

    SetTime(WhiteTime,BlackTime)
    {
        if (typeof WhiteTime!="string" || typeof BlackTime!="string")
        {
            throw TypeError();
        }
        if (WhiteTime)
        {
            let times=WhiteTime.split(":");
            let hours=0,minutes=0,seconds=0;
            if (times.length==3)
            {
                hours=parseInt(times[0].trim());
                minutes=parseInt(times[1].trim());
                seconds=parseFloat(times[2].trim());
            }
            else if (times.length==2)
            {
                minutes=parseInt(times[0].trim());
                seconds=parseFloat(times[1].trim());
            }
            else if (times.length==1)
            {
                seconds=parseFloat(times[0].trim());
            }
            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds))
            {
                this.WhiteTimeDisplay.textContent="--";
            }
            else
            {
                if (hours>0)
                {
                    seconds=Math.round(seconds);
                    this.WhiteTimeDisplay.textContent=`${String(hours)}:${minutes<10?"0"+String(minutes):String(minutes)}:${seconds<10?"0"+String(seconds):String(seconds)}`;
                }
                else if (minutes>0)
                {
                    seconds=Math.round(seconds);
                    this.WhiteTimeDisplay.textContent=`${String(minutes)}:${seconds<10?"0"+String(seconds):String(seconds)}`;
                }
                else
                {
                    this.WhiteTimeDisplay.textContent=`${seconds<10?seconds.toFixed(1):String(seconds)}`;
                }
            }
        }
        else
        {
            this.WhiteTimeDisplay.textContent="--";
        }
        if (BlackTime)
        {
            let times=BlackTime.split(":");
            let hours=0,minutes=0,seconds=0;
            if (times.length==3)
            {
                hours=parseInt(times[0].trim());
                minutes=parseInt(times[1].trim());
                seconds=parseFloat(times[2].trim());
            }
            else if (times.length==2)
            {
                minutes=parseInt(times[0].trim());
                seconds=parseFloat(times[1].trim());
            }
            else if (times.length==1)
            {
                seconds=parseFloat(times[0].trim());
            }
            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds))
            {
                this.BlackTimeDisplay.textContent="--";
            }
            else
            {
                if (hours>0)
                {
                    seconds=Math.round(seconds);
                    this.BlackTimeDisplay.textContent=`${String(hours)}:${minutes<10?"0"+String(minutes):String(minutes)}:${seconds<10?"0"+String(seconds):String(seconds)}`;
                }
                else if (minutes>0)
                {
                    seconds=Math.round(seconds);
                    this.BlackTimeDisplay.textContent=`${String(minutes)}:${seconds<10?"0"+String(seconds):String(seconds)}`;
                }
                else
                {
                    this.BlackTimeDisplay.textContent=`${seconds<10?seconds.toFixed(1):String(seconds)}`;
                }
            }
        }
        else
        {
            this.BlackTimeDisplay.textContent="--";
        }
    }

    SetEvaluation(Evaluation)
    {
        this.EvaluationBar.SetEvaluation(Evaluation);
    }

    SetPreviousMoverRound(PreviousMoverRound)
    {
        if (typeof PreviousMoverRound!="number")
        {
            throw TypeError();
        }
        if (PreviousMoverRound==0)
        {
            this.BlackPlayerNameDisplay.classList.add("current-mover");
            this.WhitePlayerNameDisplay.classList.remove("current-mover");
            this.BlackTimeDisplay.classList.add("current-mover");
            this.WhiteTimeDisplay.classList.remove("current-mover");
        }
        else
        {
            this.WhitePlayerNameDisplay.classList.add("current-mover");
            this.BlackPlayerNameDisplay.classList.remove("current-mover");
            this.WhiteTimeDisplay.classList.add("current-mover");
            this.BlackTimeDisplay.classList.remove("current-mover");
        }
    }
}