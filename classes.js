const BAR_RIGHT = 1;
const BAR_LEFT = 2;
const DEFAULT_BAR_SPEED = 10;
const FAST_BAR_SPEED = 30;

class GameBoard {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.canvas = document.getElementById("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = canvas.getContext("2d");
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

class Ball {
  constructor(x, y, speed, game_board) {
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 25;
    this.direction = 60; // 60 degrees
    this.speed = speed;
    this.game_board = game_board;

    this.image = new Image();
    this.image.src = "ball.jpg";
  }

  move() {
    let rad = (this.direction * Math.PI) / 180; // radian
    this.x += this.speed * Math.cos(rad);
    this.y -= this.speed * Math.sin(rad);
    // meet ceiling or left wall or right wall
    if (this.y < 0) this.direction = -this.direction;
    if (this.x < 0) this.direction = 180 - this.direction;
    if (this.x + this.width > this.game_board.width) {
      this.direction = 180 - this.direction;
    }
    // meet bottom then lose
    if (this.y + this.height > this.game_board.height) {
      alert("You lost");
      window.location.reload();
    }
  }

  checkCollisionWithBar(bar) {
    let collide = false;
    if (
      this.x < bar.x + bar.width &&
      this.x + this.width > bar.x &&
      this.y + this.height > bar.y
    ) {
      collide = true;
      this.direction = -this.direction;
    }
    // direction change based on speed of bar
    if (collide && bar.speed > DEFAULT_BAR_SPEED) {
      if (bar.direction === BAR_RIGHT) {
        this.direction -= 15; // change 20 degrees "to the right"
        if (this.direction % 360 == 0 || this.direction % 360 > 340)
          this.direction = 5;
      } else if (bar.direction === BAR_LEFT) {
        this.direction += 15; // change 20 degrees "to the left"
        if (this.direction % 360 == 180 || this.direction % 360 > 180)
          this.direction = 175;
      }
    }
  }

  draw() {
    let ctx = this.game_board.ctx;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Bar {
  constructor(width, x, game_board) {
    this.game_board = game_board;
    this.width = width;
    this.height = 10;
    this.x = x;
    this.y = this.game_board.height - 100;
    this.speed = DEFAULT_BAR_SPEED;
    this.direction = BAR_RIGHT;

    document.addEventListener("keydown", (event) => this.keyDownHandler(event));
    document.addEventListener("keyup", (event) => this.keyUpHandler(event));
  }

  moveLeft() {
    if (this.x <= 0) return;
    this.x -= this.speed;
    this.direction = BAR_LEFT;
  }

  moveRight() {
    if (this.x + this.width >= this.game_board.width) return;
    this.x += this.speed;
    this.direction = BAR_RIGHT;
  }

  keyDownHandler(e) {
    if (e.ctrlKey) this.speed = FAST_BAR_SPEED;
    if (e.key === "Right" || e.key === "ArrowRight") {
      this.moveRight();
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      this.moveLeft();
    }
  }

  keyUpHandler(e) {
    if (!e.ctrlKey) this.speed = DEFAULT_BAR_SPEED;
  }

  draw() {
    let ctx = this.game_board.ctx;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
  }
}
