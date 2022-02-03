import Cart from './cart';

describe('Cart', () => {
  let cart;

  const product = {
    title: 'Adidas running shoes - men',
    price: 35388,
  }

  const product2 = {
    title: 'Adidas running shoes - woman',
    price: 41872,
  }

  beforeEach(() => cart = new Cart());

  describe('#getTotal', () => {
    it('should return 0 when getTotal() is executed in a newly created instance', () => {
      expect(cart.getTotal().getAmount()).toEqual(0)
    })

    it('should multiply quantity and price and receive the total amount', () => {
      const item = {
        product,
        quantity: 2,
      }

      cart.add(item);

      expect(cart.getTotal().getAmount()).toEqual(70776);
    })

    it('should ensure no more than on product exists at a time', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product,
        quantity: 1,
      });

      expect(cart.getTotal().getAmount()).toEqual(35388);
    })

    it('should update total when a product gets included and then removed from cart', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      cart.remove(product)

      expect(cart.getTotal().getAmount()).toEqual(41872);
    })
  })

  describe('#summary', () => {
    it('should return an object with the total and the list of items', () => {
      cart.add({ product, quantity: 2 })

      cart.add({ product: product2, quantity: 3 })

      expect(cart.summary()).toMatchInlineSnapshot(`
Object {
  "formatted": "R$1,963.92",
  "items": Array [
    Object {
      "product": Object {
        "price": 35388,
        "title": "Adidas running shoes - men",
      },
      "quantity": 2,
    },
    Object {
      "product": Object {
        "price": 41872,
        "title": "Adidas running shoes - woman",
      },
      "quantity": 3,
    },
  ],
  "total": 196392,
}
`);
    })

    it('should not reset cart', () => {
      cart.add({ product, quantity: 2 })

      cart.add({ product: product2, quantity: 3 })

      cart.summary()

      expect(cart.summary()).toMatchSnapshot();
      expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
    })

    it('should included formatted amount in the summary', () => {
      cart.add({ product, quantity: 2 })

      cart.add({ product: product2, quantity: 3 })

      cart.summary()

      expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
    })
  })

  describe('#checkout', () => {
    it('should return an object with the total and the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      })

      cart.add({
        product: product2,
        quantity: 3,
      })

      expect(cart.checkout()).toMatchInlineSnapshot(`
        Object {
          "items": Array [
            Object {
              "product": Object {
                "price": 35388,
                "title": "Adidas running shoes - men",
              },
              "quantity": 2,
            },
            Object {
              "product": Object {
                "price": 41872,
                "title": "Adidas running shoes - woman",
              },
              "quantity": 3,
            },
          ],
          "total": 196392,
        }
      `);
    })

    it('should reset the cart when checkout is called', () => {
      cart.add({
        product: product2,
        quantity: 3,
      })

      cart.checkout()

      expect(cart.getTotal().getAmount()).toEqual(0)
    })
  })

  describe('#special conditions', () => {
    it('should apply percentage discount quantity above minimum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 3,
      });

      expect(cart.getTotal().getAmount()).toEqual(74315)
    })

    it('should not apply percentage discount quantity is below or equals minimum', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 2,
      });

      expect(cart.getTotal().getAmount()).toEqual(70776)
    })

    it('should apply quantity discount for even quantities', () => {
      const condition = { quantity: 2 };

      cart.add({
        product,
        condition,
        quantity: 4,
      });

      expect(cart.getTotal().getAmount()).toEqual(70776)
    })

    it('should not apply quantity discount for even quantities when condition is not met', () => {
      const condition = { quantity: 2 };

      cart.add({
        product,
        condition,
        quantity: 1,
      });

      expect(cart.getTotal().getAmount()).toEqual(35388)
    })

    it('should apply quantity discount for odd quantities', () => {
      const condition = { quantity: 2 };

      cart.add({ product, condition, quantity: 5 });

      expect(cart.getTotal().getAmount()).toEqual(106164);
    })

    it('should receive two or more conditions and determine/apply the best discount. First case.', () => {
      const condition1 = { percentage: 30, minimum: 2 };
      const condition2 = { quantity: 2 };

      cart.add({ product, condition: [condition1, condition2], quantity: 5 });

      expect(cart.getTotal().getAmount()).toEqual(106164);
    })

    it('should receive two or more conditions and determine/apply the best discount. Second case.', () => {
      const condition1 = { percentage: 80, minimum: 2 };
      const condition2 = { quantity: 2 };

      cart.add({ product, condition: [condition1, condition2], quantity: 5 });

      expect(cart.getTotal().getAmount()).toEqual(35388);
    })
  })
})
