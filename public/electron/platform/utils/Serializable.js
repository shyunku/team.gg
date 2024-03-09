class Serializable {
  constructor(data) {
    // assign(this, data);
    for (let key in data) {
      let value = data[key];
      this[key] = value;
    }
  }
}

export default Serializable;
