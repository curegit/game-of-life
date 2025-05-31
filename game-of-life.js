var GameOfLife = function () {};

GameOfLife.Cell = (function () {
    var Cell = function () {
        this.life = false;
        this.next = false;
        this.neighbors = [];
    };

    // 隣接セルを追加する
    Cell.prototype.AddNeighbor = function (cell) {
        this.neighbors.push(cell);
    };

    // 次の状態を予約する
    Cell.prototype.Reserve = function () {
        var count = 0;
        this.neighbors.forEach(function (cell) {
            if (cell.life) {
                count++;
            }
        });
        if (this.life && (count <= 1 || count >= 4)) {
            this.next = false;
        } else if (!this.life && count === 3) {
            this.next = true;
        } else {
            this.next = this.life;
        }
    };

    // 状態を移行する
    Cell.prototype.Translate = function () {
        this.life = this.next;
    };

    // 誕生させる
    Cell.prototype.Birth = function () {
        this.life = true;
    };

    // 死滅させる
    Cell.prototype.Die = function () {
        this.life = false;
    };

    // 生死を反転させる
    Cell.prototype.Reverse = function () {
        this.life = !this.life;
    };

    return Cell;
})();

GameOfLife.World = (function () {
    var World = function (width, height, xlap, ylap) {
        this.width = width;
        this.height = height;
        this.xlap = xlap;
        this.ylap = ylap;
        this.generation = 1;
        this.cells = [];
        // セルの初期化
        for (var i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (var j = 0; j < this.height; j++) {
                this.cells[i][j] = new GameOfLife.Cell();
            }
        }
        // 隣接セルの関連付け
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                for (var k = -1; k <= 1; k++) {
                    for (var l = -1; l <= 1; l++) {
                        if (!(k === 0 && l === 0)) {
                            var tmpx = i + k;
                            var tmpy = j + l;
                            if ((this.xlap || (tmpx >= 0 && tmpx < this.width)) && (this.ylap || (tmpy >= 0 && tmpy < this.height))) {
                                var x = (tmpx % this.width + this.width) % this.width;
                                var y = (tmpy % this.height + this.height) % this.height;
                                this.cells[i][j].AddNeighbor(this.cells[x][y]);
                            }
                        }
                    }
                }
            }
        }
    };

    // 世界全体に生命を確率pで発生させる
    World.prototype.Random = function (p) {
        this.cells.forEach(function (col) {
            col.forEach(function (cell) {
                if (Math.random() < p) {
                    cell.Birth();
                }
            });
        });
    };

    // 生命を一掃
    World.prototype.Clear = function () {
        this.cells.forEach(function (col) {
            col.forEach(function (cell) {
                cell.Die();
            });
        });
    };

    // x,yにあるセルの生死を反転する
    World.prototype.Reverse = function (x, y) {
        this.cells[x][y].Reverse();
    };

    // 1世代進む
    World.prototype.Age = function () {
        this.cells.forEach(function (col) {
            col.forEach(function (cell) {
                cell.Reserve();
            });
        });
        this.cells.forEach(function (col) {
            col.forEach(function (cell) {
                cell.Translate();
            });
        });
        this.generation += 1;
    };

    // 生存セルをすべて返す
    World.prototype.GetLives = function () {
        var list = [];
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (this.cells[i][j].life) {
                    var key = list.length;
                    list[key] = [];
                    list[key][0] = i;
                    list[key][1] = j;
                }
            }
        }
        return list;
    };

    return World;
})();

GameOfLife.Canvas = (function () {
    var Canvas = function (canvas) {
        this.canvas = canvas;
        this.px = 10;
        this.cellcolor = "#000";
        this.grid = true;
        this.gridcolor = "#666";
        this.gridwidth = 1;
        this.font = "Times New Roman";
        this.fontsize = 15;
        this.fontcolor = "#000";
        this.lineheight = this.fontsize + 8;
        this.canclick = true;
        this.lastworld = null;
        var self = this;
        this.canvas.addEventListener("click", function(e) {
            self.OnClick(e)
        }, false);
    };

    // セルを描画する
    Canvas.prototype.Draw = function (world) {
        var ctx = this.canvas.getContext("2d");
        // 消去
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // 大きさの変更
        var width = world.width * this.px;
        var height = world.height * this.px;
        this.canvas.width = width;
        this.canvas.height = height + this.lineheight;
        // グリッド描画
        if (this.grid) {
            ctx.strokeStyle = this.gridcolor;
            ctx.lineWidth = this.gridwidth;
            var line = function (ctx, x1, y1, x2, y2) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            };
            for (var i = 0; i <= width; i = i + this.px) {
                line(ctx, i, 0, i, height);
            }
            for (var j = 0; j <= height; j = j + this.px) {
                line(ctx, 0, j, width, j);
            }
        }
        // セル描画
        var liveslist = world.GetLives();
        ctx.fillStyle = this.cellcolor;
        for (var i = 0; i < liveslist.length; i++) {
            ctx.fillRect(this.px * liveslist[i][0], this.px * liveslist[i][1], this.px, this.px);
        }
        // ステータス情報描画
        ctx.font = this.fontsize + "px '" + this.font + "', sans-serif";
        ctx.fillStyle = this.fontcolor;
        ctx.textAlign = "left";
        var text = "World: ("+ world.width + "x" + world.height + ", " + (world.xlap ? (world.ylap ? "loop" : "h-loop only") : (world.ylap ? "v-loop only" : "no loop")) +"), Generation: " + world.generation + ", Lives: " + liveslist.length;
        ctx.fillText(text, 10, height + this.fontsize);
        // イベント処理のため参照先を記憶
        this.lastworld = world;
    };

    // クリックイベントの処理
    Canvas.prototype.OnClick = function (event) {
        if (this.canclick) {
            var rect = event.target.getBoundingClientRect();
            var x = (event.clientX - rect.left) / (rect.right - rect.left) * this.lastworld.width;
            var y = (event.clientY - rect.top) / (rect.bottom - rect.top) * (this.lastworld.height + this.lineheight / this.px);
            var intx = Math.floor(x);
            var inty = Math.floor(y);
            this.lastworld.Reverse(intx, inty);
            this.Draw(this.lastworld);
        }
    };

    return Canvas;
})();

GameOfLife.Game = (function () {
    var Game = function (canvas) {
        this.world = null;
        this.canvas = new GameOfLife.Canvas(canvas);
        this.timer = null;
        this.interval = 1000;
        this.isPlaying = false;
    };

    // 世界を生成する
    Game.prototype.CreateWorld = function (width, height, xlap, ylap) {
        this.world = new GameOfLife.World(width, height, xlap, ylap);
        this.Refresh();
    };

    // ランダムな割合で配置
    Game.prototype.RandomRate = function () {
        this.world.Clear();
        this.world.Random(Math.random() * 0.2 + 0.2);
        this.Refresh();
    };

    // 割合pでランダム配置
    Game.prototype.Random = function (p) {
        this.world.Clear();
        this.world.Random(p);
        this.Refresh();
    };

    // 1つすすめる
    Game.prototype.Next = function () {
        this.world.Age();
        this.Refresh();
    };

    // 再生する
    Game.prototype.Play = function () {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.Continue();
        }
    };

    // 一定間隔で更新する
    Game.prototype.Continue = function () {
        var self = this;
        self.Next();
        this.timer = setTimeout(function () {
            self.Continue();
        }, this.interval);
    };

    // 一時停止
    Game.prototype.Pause = function () {
        if (this.isPlaying) {
            clearTimeout(this.timer);
            this.isPlaying = false;
        }
    };

    // 更新間隔を設定する
    Game.prototype.SetInterval = function (interval) {
        this.interval = interval;
    };

    // 描画更新
    Game.prototype.Refresh = function () {
        this.canvas.Draw(this.world);
    };

    return Game;
})();
