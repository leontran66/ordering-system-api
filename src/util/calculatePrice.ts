import Item from '../types/item';

export default (items: Array<Item>): number => {
  let price = 0;

  items.forEach((item: Item) => {
    price += (item.price * item.quantity);
  });
  return price;
};
