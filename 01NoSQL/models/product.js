const { getDb } = require("../utils/db-connect");
const { ObjectId } = require("mongodb");

class Product {
  constructor(title, price, desc, imageUrl, userId) {
    this.title = title;
    this.price = price;
    this.desc = desc;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }

  save() {
    const db = getDb;
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb;
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: new ObjectId(productId) })
      .then((product) => {
        if (!product) {
          throw new Error("Product not found");
        }
        return product;
      });
  }
}

module.exports = Product;
