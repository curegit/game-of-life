window.onload = function() {
    var canvas = document.getElementById("frame");
    var game = new GameOfLife.Game(canvas);
    game.CreateWorld(50, 50, true, true);
    game.Random(0.3);
    game.SetInterval(500);
    var func_create = function() {
        var width = +document.getElementById("width").value;
        var height = +document.getElementById("height").value;
        var xlap = document.getElementById("xlap").checked;
        var ylap = document.getElementById("ylap").checked;
        game.CreateWorld(width, height, xlap, ylap)
    };
    var func_rand = function() {
        game.RandomRate();
    };
    var func_next = function() {
        game.Next();
    };
    var func_interval = function() {
        var i = 1000 / +document.getElementById("speed").value;
        game.SetInterval(i);
    };
    var func_play = function() {
        func_interval();
        game.Play();
    };
    var func_pause = function() {
        game.Pause();
    };
    document.getElementById("create").addEventListener("click", func_create, false);
    document.getElementById("random").addEventListener("click", func_rand, false);
    document.getElementById("next").addEventListener("click", func_next, false);
    document.getElementById("play").addEventListener("click", func_play, false);
    document.getElementById("pause").addEventListener("click", func_pause, false);
    document.getElementById("speed").addEventListener("change", func_interval, false);
}
