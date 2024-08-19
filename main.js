/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/js/storage.js
class Storage {
  constructor(storage) {
    this.storage = storage;
  }
  save(data) {
    this.storage.setItem("data", JSON.stringify(data));
  }
  load() {
    try {
      return JSON.parse(this.storage.getItem("data"));
    } catch (err) {
      return err;
    }
  }
}
;// CONCATENATED MODULE: ./src/js/card.js
class Card {
  constructor() {
    this.board = null;
    this.cards = null;
    this.list = null;
  }
  bindToDOM(board) {
    if (!(board instanceof HTMLElement)) {
      throw new Error("board is not HTMLElement");
    }
    this.board = board;
    this.cards = this.board.querySelectorAll(".board-card");
  }
  init() {
    this.addCard();
    this.cards.forEach(card => {
      const deleteBtn = card.querySelector(".delete-btn");
      card.addEventListener("click", () => {
        card.remove();
      });
      card.addEventListener("mouseover", () => {
        deleteBtn.classList.remove("visually-hidden");
      });
      card.addEventListener("mouseout", () => {
        deleteBtn.classList.add("visually-hidden");
      });
      deleteBtn.addEventListener("click", () => {
        card.remove();
      });
    });
  }
  addCard() {
    const addBtns = this.board.querySelectorAll(".add-btn");
    addBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const column = btn.closest(".board-column");
        const boardTextarea = column.querySelector(".textarea");
        this.list = column.querySelector(".board-list");
        if (boardTextarea) return;
        const textareaContainer = document.createElement("div");
        textareaContainer.classList.add("textarea-container");
        column.insertBefore(textareaContainer, btn);
        btn.classList.add("visually-hidden");
        const textarea = document.createElement("textarea");
        textarea.classList.add("textarea");
        textarea.placeholder = "Enter a title for this card...";
        textareaContainer.appendChild(textarea);
        const textareaBtn = document.createElement("button");
        textareaBtn.classList.add("textarea-btn");
        textareaBtn.textContent = "Add Card";
        textareaContainer.appendChild(textareaBtn);
        textareaBtn.addEventListener("click", () => {
          const card = document.createElement("li");
          card.classList.add("board-card");
          card.textContent = textarea.value;
          if (!textarea.value) return;
          this.list.appendChild(card);
          const deleteCard = document.createElement("button");
          deleteCard.classList.add("delete-btn", "visually-hidden");
          deleteCard.textContent = "✖";
          card.appendChild(deleteCard);
          card.addEventListener("mouseover", () => {
            deleteCard.classList.remove("visually-hidden");
          });
          card.addEventListener("mouseout", () => {
            deleteCard.classList.add("visually-hidden");
          });
          deleteCard.addEventListener("click", () => {
            card.remove();
          });
          textarea.value = "";
          textareaContainer.remove();
          btn.classList.remove("visually-hidden");
        });
        const crossBtn = document.createElement("button");
        crossBtn.classList.add("cross-btn");
        crossBtn.textContent = "✖";
        textareaContainer.appendChild(crossBtn);
        crossBtn.addEventListener("click", () => {
          btn.classList.remove("visually-hidden");
          textareaContainer.remove();
        });
      });
    });
  }
  deleteCard() {
    this.cards.forEach(card => {
      const deleteBtn = card.querySelector(".delete-btn");
      card.addEventListener("click", () => {
        card.remove();
      });
      card.addEventListener("mouseover", () => {
        deleteBtn.classList.remove("visually-hidden");
      });
      card.addEventListener("mouseout", () => {
        deleteBtn.classList.add("visually-hidden");
      });
    });
  }
}
;// CONCATENATED MODULE: ./src/js/dnd.js
class DragAndDrop {
  constructor() {
    this.draggedEl = null;
    this.ghostEl = null;
    this.board = null;
    this.emptyCard = null;
    this.elementBehind = null;
    this.topDiff = null;
    this.leftDiff = null;
  }
  init() {
    this.board = document.querySelector(".board");
    this.board.addEventListener("mousedown", this.mouseDownEvent);
    this.board.addEventListener("mousemove", this.mouseMoveEvent);
    this.board.addEventListener("mouseleave", this.mouseLeaveEvent);
    this.board.addEventListener("mouseup", this.mouseUpEvent);
  }
  mouseDownEvent(e) {
    if (!e.target.closest(".board-card") || e.target.classList.contains("delete-btn")) {
      return;
    }
    e.preventDefault();
    this.draggedEl = e.target.closest(".board-card");
    this.ghostEl = this.draggedEl.cloneNode(true);
    this.ghostEl.style.width = `${e.target.offsetWidth}px`;
    this.ghostEl.classList.add("dragged");
    document.querySelector(".board").appendChild(this.ghostEl);
    const {
      top,
      left
    } = this.draggedEl.getBoundingClientRect();
    this.leftDiff = e.pageX - left;
    this.topDiff = e.pageY - top;
    this.ghostEl.style.left = `${e.pageX - this.leftDiff - this.ghostEl.offsetWidth / 2}px`;
    this.ghostEl.style.top = `${e.pageY - this.topDiff - this.ghostEl.offsetHeight / 2}px`;
    this.draggedEl.style.opacity = 0;
    this.emptyCard = document.createElement("li");
    this.emptyCard.classList.add("empty-card");
    this.emptyCard.style.height = `${this.draggedEl.offsetHeight}px`;
  }
  mouseMoveEvent(e) {
    e.preventDefault();
    if (!this.draggedEl) {
      return;
    }
    this.elementBehind = document.elementFromPoint(e.clientX, e.clientY);
    this.ghostEl.style.left = `${e.pageX - this.leftDiff - this.ghostEl.offsetWidth / 2}px`;
    this.ghostEl.style.top = `${e.pageY - this.topDiff - this.ghostEl.offsetHeight / 2}px`;
    if (this.elementBehind.closest(".board-column")) {
      const parentEl = this.elementBehind.closest(".board-column").querySelector(".board-list");
      if (!parentEl.hasChildNodes()) {
        parentEl.append(this.emptyCard);
      } else if (this.elementBehind.closest(".add-btn")) {
        parentEl.append(this.emptyCard);
      } else if (this.elementBehind.closest(".board-column-title")) {
        parentEl.prepend(this.emptyCard);
      } else if (this.elementBehind.closest(".board-card")) {
        parentEl.insertBefore(this.emptyCard, this.elementBehind.closest(".board-card"));
      }
    }
  }
  mouseLeaveEvent() {
    if (!this.draggedEl) {
      return;
    }
    document.querySelector(".board").removeChild(this.ghostEl);
    document.querySelector(".empty-card").remove();
    this.draggedEl.style.opacity = 1;
    this.ghostEl = null;
    this.draggedEl = null;
  }
  mouseUpEvent(e) {
    e.preventDefault();
    if (!this.draggedEl) {
      return;
    }
    if (!this.elementBehind.closest(".board-column")) {
      document.querySelector(".board").removeChild(this.ghostEl);
      document.querySelector(".empty-card").remove();
      this.draggedEl.style.opacity = 1;
      this.ghostEl = null;
      this.draggedEl = null;
      return;
    }
    this.ghostEl.style.left = `0px`;
    this.ghostEl.style.top = `0px`;
    this.ghostEl.style.width = `auto`;
    const parentEl = this.elementBehind.closest(".board-column").querySelector(".board-list");
    if (this.elementBehind.closest(".add-btn")) {
      parentEl.append(this.ghostEl);
    } else if (this.elementBehind.closest(".board-column-title")) {
      parentEl.prepend(this.ghostEl);
    } else {
      parentEl.insertBefore(this.ghostEl, this.elementBehind.closest(".board-card"));
    }
    if (document.querySelector(".empty-card")) {
      document.querySelector(".empty-card").remove();
    }
    this.ghostEl.classList.remove("dragged");
    this.draggedEl.remove();
    this.ghostEl = null;
    this.draggedEl = null;
  }
}
;// CONCATENATED MODULE: ./src/js/app.js



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
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;