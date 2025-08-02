async function addProduct(product) {
  const url = `http://localhost:3000/products`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
  }
}

document.getElementById("add-product-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = {
    name: document.getElementById("name").value,
    price: parseFloat(document.getElementById("price").value),
    image: document.getElementById("image").value,
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    inStock: true,
    rating: parseFloat(document.getElementById("price").value),
  };

  addProduct(newProduct);
});
