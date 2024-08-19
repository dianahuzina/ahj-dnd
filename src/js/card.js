export class Card {
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
    this.deleteCard();
  }

  addCard() {
    const addBtns = this.board.querySelectorAll(".add-btn");
    addBtns.forEach((btn) => {
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
    this.cards.forEach((card) => {
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
