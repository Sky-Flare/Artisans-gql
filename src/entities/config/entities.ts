import { Artisan } from '@entity/artisan';
import { Cart } from '@entity/cart';
import { Category_product } from '@entity/category_product';
import { Category_shop } from '@entity/category_shop';
import { Client } from '@entity/client';
import { Horaire_shop } from '@entity/horaire_shop';
import { Product } from '@entity/product';
import { Shop } from '@entity/shop';
import { Siren } from '@entity/siren';
import { Siret } from '@entity/siret';

// All entities are required by the ORM data-source.
const entities = [
  Artisan,
  Cart,
  Category_product,
  Category_shop,
  Client,
  Horaire_shop,
  Product,
  Shop,
  Siren,
  Siret
];

export { entities };
