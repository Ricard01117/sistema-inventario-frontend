function SummaryCards({ products }) {
  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) <= Number(product.minStock)
  ).length;

  const totalUnits = products.reduce(
    (total, product) => total + Number(product.stock),
    0
  );

  const inventoryValue = products.reduce(
    (total, product) => total + Number(product.stock) * Number(product.price),
    0
  );

  return (
    <section className="summary-grid">
      <article className="summary-card">
        <span>{totalProducts}</span>
        <p>Productos</p>
      </article>

      <article className="summary-card">
        <span>{totalUnits}</span>
        <p>Unidades en stock</p>
      </article>

      <article className="summary-card warning">
        <span>{lowStockProducts}</span>
        <p>Stock bajo</p>
      </article>

      <article className="summary-card">
        <span>${inventoryValue.toFixed(2)}</span>
        <p>Valor inventario</p>
      </article>
    </section>
  );
}

export default SummaryCards;