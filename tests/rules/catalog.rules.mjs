import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { ref, get, set, runTransaction } from 'firebase/database';

const rules = readFileSync(process.env.CATALOG_RULES_PATH || new URL('../../database.rules.json', import.meta.url), 'utf8');
const env = await initializeTestEnvironment({ projectId: 'demo-accounting-catalog', database: { host: '127.0.0.1', port: 9000, rules } });
const owner = env.authenticatedContext('owner').database();
const visitor = env.unauthenticatedContext().database();
const other = env.authenticatedContext('other').database();
const path = 'users/owner/accountingV2';
const catalogPath = `${path}/publicCatalog`;
const state = {
  version: 2, startedAt: 1, legacyImported: false,
  storefront: { enabled: true, title: 'Магазин' },
  categories: { c: { id: 'c', title: 'Чипсы', color: '#ffffff', icon: '' } },
  products: { p: { id: 'p', title: 'Краб', categoryId: 'c', imageUrl: '', price: 17500, friendPrice: 16500, stock: 1, stockValue: 10000, openingRevenue: 0, revenue: 0, sold: 0, knownProfit: 0, unknownCostSold: 0, legacy: false, archived: false } },
  publicCatalog: { title: 'Магазин', products: { p: { id: 'p', title: 'Краб', categoryId: 'c', categoryTitle: 'Чипсы', imageUrl: '', price: 17500, available: true } } },
};
try {
  await env.clearDatabase();
  await assertSucceeds(set(ref(owner, path), state));
  const publicData = (await assertSucceeds(get(ref(visitor, catalogPath)))).val();
  assert.deepEqual(publicData, state.publicCatalog);
  for (const privatePath of ['users', 'users/owner', path, `${path}/products`, `${path}/sales`, `${path}/receipts`, `${path}/deletedProducts`, `${path}/storefront`]) {
    await assertFails(get(ref(visitor, privatePath)));
  }
  await assertFails(get(ref(other, `${path}/products`)));
  await assertFails(set(ref(visitor, `${catalogPath}/title`), 'Changed'));
  await assertFails(set(ref(other, `${catalogPath}/title`), 'Changed'));
  await assertFails(set(ref(owner, `${catalogPath}/products/p/friendPrice`), 16500));
  await assertFails(set(ref(owner, `${catalogPath}/products/p/stock`), 1));
  await assertFails(set(ref(owner, `${catalogPath}/secret`), 'private'));
  await assertFails(set(ref(owner, `${catalogPath}/products/p/price`), 1));
  await assertFails(set(ref(owner, `${catalogPath}/products/p/available`), false));
  await assertSucceeds(runTransaction(ref(owner, path), value => {
    if (!value) return value;
    value.products.p.stock = 0;
    value.products.p.stockValue = 0;
    value.products.p.sold = 1;
    value.products.p.revenue = 17500;
    value.publicCatalog.products.p.available = false;
    value.sales = { s: { id: 's', productId: 'p', title: 'Краб', categoryId: 'c', quantity: 1, price: 17500, cost: 10000, createdAt: 2, priceKind: 'regular' } };
    return value;
  }));
  assert.equal((await get(ref(visitor, `${catalogPath}/products/p/available`))).val(), false);
  await assertSucceeds(runTransaction(ref(owner, path), value => {
    if (!value) return value;
    value.products.p.archived = true;
    delete value.publicCatalog.products;
    return value;
  }));
  assert.equal((await get(ref(visitor, `${catalogPath}/products`))).exists(), false);
  await assertSucceeds(runTransaction(ref(owner, path), value => {
    if (!value) return value;
    value.storefront.enabled = false;
    value.publicCatalog = null;
    return value;
  }));
  await assertFails(get(ref(visitor, catalogPath)));
  console.log('PASS: public read, private isolation, owner-only writes, field allowlist, atomic sale/archive, disable');
} finally { await env.cleanup(); }
