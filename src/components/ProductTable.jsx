function ProductTable({ products, onEdit, onDelete, onIncrease, onDecrease }) {
  if (products.length === 0) {
    return <p className="empty">No hay productos registrados.</p>;
  }

  return (
    <section className="table-card">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Proveedor</th>
            <th>Stock</th>
            <th>Mínimo</th>
            <th>Precio</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const isLowStock =
              Number(product.stock) <= Number(product.minStock);

            const totalValue = Number(product.stock) * Number(product.price);

            return (
              <tr key={product.id}>
                <td>{product.code}</td>
                <td>{product.name}</td>
                <td>{product.supplier}</td>

                <td>
                  <div className="stock-control">
                    <button onClick={() => onDecrease(product.id)}>-</button>
                    <span>{product.stock}</span>
                    <button onClick={() => onIncrease(product.id)}>+</button>
                  </div>
                </td>

                <td>{product.minStock}</td>
                <td>${Number(product.price).toFixed(2)}</td>
                <td>${totalValue.toFixed(2)}</td>

                <td>
                  <span className={isLowStock ? "badge danger" : "badge ok"}>
                    {isLowStock ? "Stock bajo" : "Disponible"}
                  </span>
                </td>

                <td>
                  <div className="actions">
                    <button onClick={() => onEdit(product)}>Editar</button>

                    <button
                      className="delete-btn"
                      onClick={() => onDelete(product.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default ProductTable;