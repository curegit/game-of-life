# Game of Life

Conway's Game of Life with HTML Canvas and JavaScript

[Demo](https://curegit.github.io/game-of-life/)

![game of life grid](preview.gif)

## Usage

1. Load `game-of-life.js`
2. Make a `Game` instance
3. Create a world
4. Configure the game
5. Run

### Code example

```js
window.onload = function () {
    var canvas = document.getElementById("canvasID");
    var game = new GameOfLife.Game(canvas);
    game.CreateWorld(50, 50, true, true);
    game.Random(0.2);
    game.SetInterval(500);
    game.Play();
};
```

## License

[MIT](LICENSE)
