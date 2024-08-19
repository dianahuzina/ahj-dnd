export class Storage {
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
