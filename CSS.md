# Custom CSS

The custom CSS allows you to change UI appearance and board & piece graphics. You need to have basic knowledge on CSS in order to use this feature.

### UI Appearance

An example CSS on changing the UI to dark theme:

```css
/*For more details on element styles, please refer to index_head.html which contains full UI appearance CSS*/
:root {
    --text-color: #ccc;
    --bg-color: #333;
    --title-text-color: #fff;
    --title-bg-color: #444;
    --viewer-non-mainline-bg-color: #666;
    --branch-move-hover-color: #888;
    --border-color: #888;
    --button-active-text-color: #000;
    --button-active-color: #629924;
    --menu-color: #000;
    --menu-active-text-color: #eee;
    --menu-active-color: #555;
    --menu-hr-color: #666;
    --button-clicked-text-color: #555;
    --button-clicked-color: #eee;
}
```

### Board Graphics

An example to change board graphics:

```css
/*Change the board image*/
cg-board {
    background-image: url('https://example.com/path/to/image.png') !important;
}

/*If you want to provide graphics with different board sizes (width and height), use this syntax*/
/*4x8 board (width 4 height 8 board)*/
.board4x8 cg-board {
    background-image: url('path/to/image4x8.jpeg') !important;
}

/*8x4 board (width 8 height 4 board)*/
.board8x4 cg-board {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='80px' height='80px'><text font-size='30' x='50%' y='50%' fill='white' class='white' text-anchor='middle' dominant-baseline='central'>O</text></svg>") !important;
}

/*If you want to use different board images for different perspective*/
/*First mover's (White's) perspective board*/
.orientation-white cg-board {
    background-image: url('board1.avif') !important;
}

/*Second mover's (Black's) perspective 2x4 board*/
.board2x4 .orientation-black cg-board {
    background-image: url('board2_2x4.webp') !important;
}
```

### Piece Graphics

An example to change piece graphics:

```css
/*Change second mover's (Black's) piece represented by character "b"*/
piece.b-piece.black {
    background-image: url("bB.png") !important;
}

/*Change first mover's (White's) piece represented by character "a", from first mover's perspective*/
.orientation-white piece.a-piece.white {
    background-image: url("wA1.png") !important;a
}

/*Change both side's piece represented by character "d", on 9x10 board*/
.board2x4 piece.d-piece {
    background-image: url("D.png") !important;
}

/*Change second mover's (Black's) piece represented by character "k", from second mover's perspective, on 3x3 board*/
.board3x3 .orientation-black piece.k-piece.black {
    background-image: url("bK2_3x3.jpg") !important;
}

/*Change wall square appearance*/
piece._-piece {
    background-image: url("barrier.svg") !important;
}
```

