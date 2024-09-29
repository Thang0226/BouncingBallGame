let score = 0;
function updateScore() {
  document.getElementById("score").innerHTML = `Score: ${score}`;
  score++;
  setTimeout(updateScore, 1000);
}

let game_board = new GameBoard(900, 600);
let ball = new Ball(game_board.width / 2, game_board.height / 2, 3, game_board);
let bar = new Bar(150, game_board.width / 3, game_board);

function start() {
  game_board.draw();
  ball.move();
  ball.draw();
  bar.draw();
  ball.checkCollisionWithBar(bar);

  setTimeout(start, 1000 / 60);
}

start();
updateScore();
