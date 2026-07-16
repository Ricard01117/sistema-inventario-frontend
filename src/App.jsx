import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import ProductForm from "./components/ProductForm.jsx";
import ProductTable from "./components/ProductTable.jsx";
import SummaryCards from "./components/SummaryCards.jsx";

function App() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("inventory-products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    localStorage.setItem("inventory-products", JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    const newProduct = {
      id: Date.now(),
      ...product,
    };

    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct) => {
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );

    setProducts(updatedProducts);
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este producto?");

    if (!confirmDelete) return;

    const filteredProducts = products.filter((product) => product.id !== id);
    setProducts(filteredProducts);
  };

  const increaseStock = (id) => {
    const updatedProducts = products.map((product) =>
      product.id === id
        ? { ...product, stock: Number(product.stock) + 1 }
        : product
    );

    setProducts(updatedProducts);
  };

  const decreaseStock = (id) => {
    const updatedProducts = products.map((product) =>
      product.id === id && Number(product.stock) > 0
        ? { ...product, stock: Number(product.stock) - 1 }
        : product
    );

    setProducts(updatedProducts);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = `${product.name} ${product.code} ${product.supplier}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const isLowStock = Number(product.stock) <= Number(product.minStock);

      const matchesFilter =
        filter === "Todos" || (filter === "Stock bajo" && isLowStock);

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  const exportToExcel = () => {
    if (products.length === 0) {
      alert("No hay productos para exportar");
      return;
    }

    const data = products.map((product) => ({
      Código: product.code,
      Producto: product.name,
      Proveedor: product.supplier,
      Stock: Number(product.stock),
      "Stock mínimo": Number(product.minStock),
      Precio: Number(product.price),
      "Valor total": Number(product.stock) * Number(product.price),
      Estado:
        Number(product.stock) <= Number(product.minStock)
          ? "Stock bajo"
          : "Disponible",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 28 },
      { wch: 25 },
      { wch: 12 },
      { wch: 16 },
      { wch: 12 },
      { wch: 16 },
      { wch: 16 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    XLSX.writeFile(workbook, "inventario.xlsx");
  };

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="tag">Panel de inventario</p>
          <h1>Gestión de almacén y inventarios</h1>
          <p>Registra productos, controla existencias y detecta stock bajo.</p>
        </div>

        <button onClick={exportToExcel}>Exportar Excel</button>
      </header>

      <SummaryCards products={products} />

      <ProductForm
        addProduct={addProduct}
        updateProduct={updateProduct}
        editingProduct={editingProduct}
        cancelEdit={() => setEditingProduct(null)}
      />

      <section className="filters">
        <input
          type="text"
          placeholder="Buscar por producto, código o proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Stock bajo">Stock bajo</option>
        </select>
      </section>

      <ProductTable
        products={filteredProducts}
        onEdit={setEditingProduct}
        onDelete={deleteProduct}
        onIncrease={increaseStock}
        onDecrease={decreaseStock}
      />
    </main>
  );
}

export default App;