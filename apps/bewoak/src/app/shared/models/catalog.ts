import { Item } from './item';

export class Catalog {
  items: Item[];

  constructor(options: { items?: Item[] }) {
    this.items = options.items || [];
  }
}
