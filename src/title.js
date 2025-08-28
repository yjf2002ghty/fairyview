export class TitleWidget
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
        this.ShowMenu=false;
        this.Container=ContainerDivision;
        this.Wrapper=document.createElement("div");
        this.Wrapper.classList.add("title-wrapper");
        this.MenuButton=document.createElement("button");
        this.MenuButton.classList.add("menu-button");
        this.MenuButton.title="Menu\nClick to open the menu.";
        this.FlipBoardButton=document.createElement("button");
        this.FlipBoardButton.classList.add("flip-board-button");
        this.FlipBoardButton.title="Flip Board\nClick to flip the board.";
        this.TitleText=document.createElement("p");
        this.TitleText.classList.add("title-text");
        this.Menu=document.createElement("div");
        this.Menu.classList.add("menu");
        this.Menu.style.display="none";
        this.CopyFEN=document.createElement("p");
        this.CopyFEN.classList.add("menu-element");
        this.CopyFEN.textContent="Copy current board FEN";
        this.SavePGN=document.createElement("p");
        this.SavePGN.classList.add("menu-element");
        this.SavePGN.textContent="Save PGN";
        // this.SaveImage=document.createElement("p");
        // this.SaveImage.classList.add("menu-element");
        // this.SaveImage.textContent="Save current board as image";
        this.GoToEventSite=document.createElement("a");
        this.GoToEventSite.classList.add("menu-element");
        this.GoToEventSite.textContent="Go to site of this game";
        this.GenerateNewLink=document.createElement("a");
        this.GenerateNewLink.classList.add("menu-element");
        this.GenerateNewLink.textContent="Create a PGN viewer of a new game"
        this.GenerateNewLink.href="./linkgen.html";
        this.GoToGithub=document.createElement("a");
        this.GoToGithub.classList.add("menu-element");
        this.GoToGithub.textContent="Go to Github page of this project";
        this.GoToGithub.href="https://github.com/yjf2002ghty/fairyview";
        this.Menu.appendChild(this.CopyFEN);
        this.Menu.appendChild(this.SavePGN);
        // this.Menu.appendChild(this.SaveImage);
        this.Menu.appendChild(this.GoToEventSite);
        this.Menu.appendChild(document.createElement("hr"));
        this.Menu.appendChild(this.GenerateNewLink);
        this.Menu.appendChild(this.GoToGithub);
        this.Wrapper.appendChild(this.MenuButton);
        this.Wrapper.appendChild(this.TitleText);
        this.Wrapper.appendChild(this.FlipBoardButton);
        this.Wrapper.appendChild(this.Menu);
        ContainerDivision.appendChild(this.Wrapper);
        this.MenuButton.onclick=()=>{
            if (this.ShowMenu)
            {
                this.ShowMenu=false;
                this.Menu.style.display="none";
            }
            else
            {
                let menubuttonrect=this.MenuButton.getBoundingClientRect();
                this.ShowMenu=true;
                this.Menu.style.left=`${menubuttonrect.left}px`;
                this.Menu.style.top=`${menubuttonrect.top+menubuttonrect.height}px`;
                this.Menu.style.display="";
            }
        };
        this.MenuCloseHandler=this.OnDocumentClicked.bind(this);
        document.addEventListener("click",this.MenuCloseHandler);
    }

    destructor()
    {
        document.removeEventListener("click",this.MenuCloseHandler);
    }

    CalculateElementSize(ContainerWidth,ContainerHeight)
    {
        if (typeof ContainerWidth!="number" || typeof ContainerHeight!="number")
        {
            throw TypeError();
        }
        let newheight=(ContainerWidth>3*ContainerHeight)?ContainerHeight:ContainerWidth/3;
        this.Wrapper.style.width=`${ContainerWidth}px`;
        this.Wrapper.style.height=`${newheight}px`;
        this.MenuButton.style.width=this.MenuButton.style.height=`${newheight}px`;
        this.MenuButton.style.fontSize=`${0.5*newheight}px`;
        this.FlipBoardButton.style.width=this.FlipBoardButton.style.height=`${newheight}px`;
        this.FlipBoardButton.style.fontSize=`${0.5*newheight}px`;
        this.TitleText.style.width=`${ContainerWidth-2*newheight}px`;
        this.TitleText.style.height=`${newheight}px`;
        this.TitleText.style.fontSize=`${Math.min(0.5*newheight,(ContainerWidth-2*newheight)/20)}px`;
        let menubuttonrect=this.MenuButton.getBoundingClientRect();
        this.Menu.style.left=`${menubuttonrect.left}px`;
        this.Menu.style.top=`${menubuttonrect.top+menubuttonrect.height}px`;
    }

    OnDocumentClicked(event)
    {
        if (!event.isTrusted)
        {
            return;
        }
        if (!this.ShowMenu)
        {
            return;
        }
        if (!this.MenuButton.contains(event.target) && !this.Menu.contains(event.target))
        {
            this.ShowMenu=false;
            this.Menu.style.display="none";
        }
        else if (this.CopyFEN.contains(event.target) || this.SavePGN.contains(event.target) || this.SaveImage.contains(event.target) || this.GenerateNewLink.contains(event.target) || this.GoToGithub.contains(event.target))
        {
            this.ShowMenu=false;
            this.Menu.style.display="none";
        }
        else if (this.GoToEventSite && this.GoToEventSite.contains(event.target))
        {
            this.ShowMenu=false;
            this.Menu.style.display="none";
        }
    }

    SetTitle(Title)
    {
        if (typeof Title!="string")
        {
            throw TypeError();
        }
        this.TitleText.textContent=Title;
    }

    SetCopyFENCallback(Callback)
    {
        if (typeof Callback!="function")
        {
            throw TypeError();
        }
        this.CopyFEN.onclick=Callback;
    }

    SetSavePGNCallback(Callback)
    {
        if (typeof Callback!="function")
        {
            throw TypeError();
        }
        this.SavePGN.onclick=Callback;
    }

    // SetSaveImageCallback(Callback)
    // {
    //     if (typeof Callback!="function")
    //     {
    //         throw TypeError();
    //     }
    //     this.SaveImage.onclick=Callback;
    // }

    SetEventSite(Site)
    {
        if (typeof Site!="string")
        {
            throw TypeError();
        }
        try {
            const url = new URL(Site);
            if (url.protocol === "http:" || url.protocol === "https:")
            {
                this.GoToEventSite.href=Site;
            }
            else
            {
                this.Menu.removeChild(this.GoToEventSite);
                this.GoToEventSite=null;
            }
        } catch (err) {
            this.Menu.removeChild(this.GoToEventSite);
            this.GoToEventSite=null;
        }
    }

    SetFlipBoardCallback(Callback)
    {
        if (typeof Callback!="function")
        {
            throw TypeError();
        }
        this.FlipBoardButton.onclick=Callback;
    }
}