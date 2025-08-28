# FairyView
This is an attempt to have a simple PGN viewer for [Fairy-Stockfish](https://github.com/ianfab/Fairy-Stockfish) in the browser, using its [ffish.js](https://www.npmjs.com/package/ffish-es6) library, and the graphical [chessgroundx](https://github.com/gbtami/chessgroundx) library. It is based on [fairyground](https://github.com/ianfab/fairyground).

You can see it deployed at: https://fairyview.vercel.app/

## Usage

Go to https://fairyview.vercel.app/linkgen.html and fill necessary fields to generate a link that can display the game. The fields are:

- Webpage address (**Required**): The host and path to this page. You don't need to change this unless you want to use a FairyView instance not deployed at [https://fairyview.vercel.app/](https://fairyview.vercel.app/).

- Custom CSS: You can provide a CSS file to change the appearance of FairyView, or provide your own graphics of pieces and board.

- Variants.ini: If your variant needs a variants.ini, which means it is not a built-in variant, then you need to provide your variants.ini here.

- PGN (**Required**): PGN file of this game. It should ONLY contain one game in PGN format, with all its PGN headers.

- Move notation format: The notation of moves displayed in move history.

- Board coordinate format: The format of board coordinate.

There are examples for "Custom CSS", "Variants.ini" and "PGN". You can click the button next to the text area to see an example.

After you provided these information, click \<Generate Link\> button to generate the link, and share it to others.

If you want to embed it into a webpage, you can copy the code below "Using As Embedded PGN Viewer", and insert it into the HTML file of that webpage.

## Development Usage

The following steps (_**Installation**_ and _**Run Application**_) show the process to set up a development environment.

### ◎ Installation

#### ⊙ Prerequisites

Install [Node.js](https://nodejs.org/en/download) first.

#### ⊙ Setup

1. Open your console and switch the working directory to this directory (the directory that contains this README). All of the following commands should be executed in this console.

2. Install dependencies

```
npm install
```

3. Bundle JavaScript

##### -- Linux/macOS

```bash
# Build once (for end users)
npm run build

# Build once (for developers, faster build without file compression & mangling)
npm run debug-build
```

##### --Windows

```batch
:: Build once (for end users)
npm run buildwithcmd

:: Build once (for developers, faster build without file compression & mangling)
npm run debug-buildwithcmd
```

### ◎ Run Application

1. Open your console and switch the working directory to this directory (the directory that contains this README). All of the following commands should be executed in this console.

2. Start server

```bash
node server.js
```

3. Then, browse to http://localhost:3000/public/linkgen.html to generate a link of a game.

4. You can also go to http://localhost:3000/public/demo.html to see a demo of embedding this project into another webpage.

Enjoy!

> [!WARNING]
> Locally deployed FairyView links cannot be shared to others.
> If you want to use your own instance of FairyView, you need to deploy it on a server with a public IP that others can access, and change the host in the URL to that server.

## Supported Browsers

### Full Support

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

### Limited Support

- Apple Safari

### No Support

- Microsoft Internet Explorer
- Opera Browser
- Brave Browser

Support for browsers not mentioned above are not clear. You need to check it yourself.

## Design Goals

This project aims to develop a read-only PGN viewer that can be shared to others. It should achieve the following aspects:

- Load and render fast
- Low memory consumption
- Browse through a game
- Variation tree
- PGN comments
- Player information, evaluation and clocks
- Mobile support
- Client-side only
- Easy to set up

## Non Design Goals

These apsects are not goals of this project:

- PGN editing
- Making moves on it
- Engine analysis
- Opening a new PGN in the menu
- Board image generation
