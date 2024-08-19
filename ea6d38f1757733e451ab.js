import { Storage } from "./storage";
import { Card } from "./card";
import { DragAndDrop } from "./dnd";
const storage = new Storage(localStorage);
let data = storage.load();
let board = document.querySelector(".board");
if (data === null || data.board.length === undefined) {
  data = {
    board: [board.innerHTML]
  };
}
board.innerHTML = data.board[data.board.length - 1];
const newCard = new Card();
newCard.bindToDOM(board);
newCard.init();
let dnd = new DragAndDrop();
dnd.init();
window.addEventListener("unload", () => {
  data.board[data.board.length - 1] = board.innerHTML;
  storage.save(data);
});