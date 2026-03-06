export default function ButtonOfSale({price, btnClass, productKey, sellCb}) {
  const newPrice = Number(price.replace("Р", ""));
  return <button className={btnClass} onClick={() => sellCb(productKey, newPrice)}>{price}</button>
}