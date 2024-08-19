export class DragAndDrop {
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
    if (
      !e.target.closest(".board-card") ||
      e.target.classList.contains("delete-btn")
    ) {
      return;
    }
    e.preventDefault();

    this.draggedEl = e.target.closest(".board-card");
    this.ghostEl = this.draggedEl.cloneNode(true);

    this.ghostEl.style.width = `${e.target.offsetWidth}px`;
    this.ghostEl.classList.add("dragged");

    document.querySelector(".board").appendChild(this.ghostEl);

    const { top, left } = this.draggedEl.getBoundingClientRect();
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
      const parentEl = this.elementBehind
        .closest(".board-column")
        .querySelector(".board-list");
      if (!parentEl.hasChildNodes()) {
        parentEl.append(this.emptyCard);
      } else if (this.elementBehind.closest(".add-btn")) {
        parentEl.append(this.emptyCard);
      } else if (this.elementBehind.closest(".board-column-title")) {
        parentEl.prepend(this.emptyCard);
      } else if (this.elementBehind.closest(".board-card")) {
        parentEl.insertBefore(
          this.emptyCard,
          this.elementBehind.closest(".board-card"),
        );
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

    const parentEl = this.elementBehind
      .closest(".board-column")
      .querySelector(".board-list");

    if (this.elementBehind.closest(".add-btn")) {
      parentEl.append(this.ghostEl);
    } else if (this.elementBehind.closest(".board-column-title")) {
      parentEl.prepend(this.ghostEl);
    } else {
      parentEl.insertBefore(
        this.ghostEl,
        this.elementBehind.closest(".board-card"),
      );
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
