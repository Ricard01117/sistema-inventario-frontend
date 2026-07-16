import { useEffect, useState } from "react";

const emptyForm = {
  code: "",
  name: "",
  supplier: "",
  stock: "",
  minStock: "",
  price: "",
};

function ProductForm({ addProduct, updateProduct, editingProduct, cancelEdit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    } else {
      setForm(emptyForm);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      form.code.trim() === "" ||
      form.name.trim() === "" ||
      form.supplier.trim() === "" ||
      form.stock === "" ||
      form.minStock === "" ||
      form.price === ""
    ) {
      alert("Completa todos los campos");
      return;
    }

    const productData = {
      ...form,
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      price: Number(form.price),
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    setForm(emptyForm);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{editingProduct ? "Editar producto" : "Agregar producto"}</h2>

      <div className="form-grid">
        <input
          type="text"
          name="code"
          placeholder="Código"
          value={form.code}
          onChange={handleChange}
        />

        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="supplier"
          placeholder="Proveedor"
          value={form.supplier}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          min="0"
          value={form.stock}
          onChange={handleChange}
        />

        <input
          type="number"
          name="minStock"
          placeholder="Stock mínimo"
          min="0"
          value={form.minStock}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Precio"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="submit">
          {editingProduct ? "Guardar cambios" : "Agregar producto"}
        </button>

        {editingProduct && (
          <button type="button" className="secondary-btn" onClick={cancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;