// import { useState, useEffect } from "react";
// import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
// import { ProductList } from "./ProductList";
// import { ProductForm } from "./ProductForm";
//
// function App() {
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//
//   useEffect(() => {
//     async function fetchProducts() {
//       const productsData = await getAllProducts();
//       setProducts(productsData);
//     }
//     fetchProducts();
//   }, []);
//
//   async function handleCreate(productData) {
//     const newProduct = await createProduct(productData);
//     setProducts((prevProducts) => [...prevProducts, newProduct]);
//   }
//
//   async function handleUpdate(productData) {
//     const updatedProduct = await updateProduct(productData.id, productData);
//     setProducts((prevProducts) =>
//       prevProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
//     );
//   }
//
//   async function handleDelete(productId) {
//     await deleteProduct(productId);
//     setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
//   }
//
//   function handleSelect(product) {
//     setSelectedProduct(product);
//   }
//
//   function handleClearSelect() {
//     setSelectedProduct(null);
//   }
//
//   return (
//     <div>
//       <h1>Products CRUD</h1>
//       <ProductList products={products} onSelect={handleSelect} onDelete={handleDelete} />
//       <ProductForm selectedProduct={selectedProduct} onCreate={handleCreate} onUpdate={handleUpdate} onClearSelect={handleClearSelect} />
//     </div>
//   );
// }
//
// export default App;