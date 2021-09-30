import find from 'lodash/find';
import remove from 'lodash/remove';

export default class Cart {
  items = []

  add(item) {
    const itemToFind = { product: item.product };

    if(find(this.items, itemToFind)) {
      remove(this.items, itemToFind)
    }

    this.items = [...this.items, item];
  }

  remove(product) {
    remove(this.items, { product })
  }

  getTotal() {
    return this.items.reduce((accumulator, item) => {
      return accumulator + (item.product.price * item.quantity)
    }, 0);
  }

  summary() {
    const total = this.getTotal();
    const items = this.items

    return {
      total,
      items,
    }
  }

  checkout() {
    const { total, items } = this.summary();

    this.items = [];

    return {
      total,
      items,
    }
  }
}