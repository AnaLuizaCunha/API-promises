document.addEventListener("DOMContentLoaded", async () => {
  const url = `http://localhost:3000/products`;
  const form = document.getElementById("add-product-form");
  const nameInput = document.getElementById("name");
  const imageInput = document.getElementById("image");
  const descriptionInput = document.getElementById("description");
  const priceInput = document.getElementById("price");
  const categoryInput = document.getElementById("category");
  const ratingInput = document.getElementById("rating");

  const productId = window.location.search.split("=")[1];
  try {
    const response = await fetch(`${url}/${productId}`);
    const product = await response.json();

    nameInput.value = product.name;
    priceInput.value = product.price;
    imageInput.value = product.image;
    categoryInput.value = product.category;
    descriptionInput.value = product.description;
    ratingInput.value = product.rating;
  } catch (error) {
    console.log("Erro ao buscar produto:", error);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const updatedProduct = {
      name: nameInput.value,
      price: priceInput.value,
      image: imageInput.value,
      category: categoryInput.value,
      description: descriptionInput.value,
      rating: ratingInput.value,
    };

    try {
      const response = await fetch(`${url}/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      if (response.ok) {
        console.log("Produto atualizado com sucesso");
      } else {
        console.log("Erro ao atualizar produto");
      }
    } catch (error) {
      console.log("Erro ao atualizar o produto:", error);
    }
  });
});
