# HTML - Game of Life

This is Conway's Game of Life implemented by Canvas and plain JavaScript.  
[Demo](https://curegit.github.io/html-game-of-life/)

![game of life grid](preview.gif)

## Usage

```js
window.onload = function() {
    var canvas = document.getElementById("canvasID");
    var game = new GameOfLife.Game(canvas);
    game.CreateWorld(50, 50, true, true);
    game.Random(0.2);
    game.SetInterval(500);
    game.Play();
}
```

## License

MIT
