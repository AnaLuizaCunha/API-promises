let allProducts = [];
const productsPerPage = 9;
let currentPage = 1;
let totalPages = 0;
const maxButtonsPagination = 5;

async function getProducts(page = 1, limit = productsPerPage) {
  const url = `http://localhost:3000/products?_limit=${limit}&_page=${page}`;
  try {
    const response = await fetch(url);
    const products = await response.json();
    const total = response.headers.get("X-Total-Count");
    allProducts = products;
    totalPages = Math.ceil(total / productsPerPage);
    renderProducts();
    renderPagination();
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
}

getProducts(currentPage, productsPerPage);

function renderProducts() {
  const section = document.querySelector("section");
  section.innerHTML = "";

  allProducts.forEach((product) => {
    const productToRender = `<div class="product">
          <div class="product-header">
            <div class="rating">
              <p>${parseFloat(product.rating).toFixed(2)}</p>
              <img src="../assets/Star.png" alt="Icone de estrela" />
            </div>
            <div class="actions">
              <div class="delete" data-id="${product.id}">
                <img src="../assets/delete-icon.png" alt="Icone de deletar" />
              </div>
              <a href="../Editar/index.html?id=${product.id}" class="edit">
                <img src="../assets/edit-icon.png" alt="Icone de editar" />
              </a>
            </div>
          </div>
          <div class="product-content">
            <img src="../assets/camisa.png" alt="Imagem do produto" />
            <div class="description-container">
              <div class="description-titles">
                <h2>${product.name.toUpperCase()}</h2>
                <h3>${product.category.toUpperCase()}</h3>
              </div>
              <div class="description-content">
                <p>
                  ${product.description}
                </p>
                <span>R$ ${parseFloat(product.price)
                  .toFixed(2)
                  .replace(".", ",")}</span>
              </div>
            </div>
          </div>
        </div>`;
    section.innerHTML += productToRender;
  });
  addDeleteEvent();
}

function renderPagination() {
  const pagesContainer = document.querySelector(".pages");
  pagesContainer.innerHTML = "";
  const { leftNumbers, rightNumbers } = calcButtonsPagination(totalPages);
  for (let i = leftNumbers; i <= rightNumbers; i++) {
    const pageToShow = document.createElement("div");
    pageToShow.className = `page-number ${i === currentPage ? "active" : ""}`;
    pageToShow.innerHTML = `<a href="#">${i}</a>`;
    pageToShow.addEventListener("click", (e) => {
      e.preventDefault();
      goToPage(i);
    });
    pagesContainer.appendChild(pageToShow);
  }
}

function nextPage() {
  currentPage++;
  const lastPage = currentPage > totalPages;
  if (lastPage) {
    currentPage--;
  }
  getProducts(currentPage, productsPerPage);
}

function previousPage() {
  currentPage--;
  if (currentPage < 1) {
    currentPage++;
  }
  getProducts(currentPage, productsPerPage);
}

function goToPage(page) {
  if (page < 1) {
    page = 1;
  }
  currentPage = +page;
  if (page > totalPages) {
    currentPage = totalPages;
  }
  getProducts(currentPage, productsPerPage);
}

function createPageEvent() {
  document.querySelector(".next-page").addEventListener("click", (e) => {
    e.preventDefault();
    nextPage();
  });
  document.querySelector(".previous-page").addEventListener("click", (e) => {
    e.preventDefault();
    previousPage();
  });
}

function createPageButton(number) {
  const button = document.createElement("div");
  button.className = "page-number";
  button.innerHTML = `<a href="">${number}</a>`;

  if (currentPage == number) {
    button.classList.add("active");
  }
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const page = e.target.innerText;
    goToPage(page);
    renderPagination();
    renderProducts();
  });
  document.querySelector(".pages").appendChild(button);
}

function updatePageButtons() {
  document.querySelector(".pages").innerHTML = "";
  const { leftNumbers, rightNumbers } = calcButtonsPagination(totalPages);
  for (let page = leftNumbers; page <= rightNumbers; page++) {
    createPageButton(page);
  }
}

function calcButtonsPagination(totalParesParameter) {
  const totalPagesCalc = totalParesParameter || totalPages;
  let leftNumbers = currentPage - Math.floor(maxButtonsPagination / 2);
  let rightNumbers = currentPage + Math.floor(maxButtonsPagination / 2);

  if (leftNumbers < 1) {
    leftNumbers = 1;
    rightNumbers = maxButtonsPagination;
  }
  if (rightNumbers > totalPagesCalc) {
    leftNumbers = totalPagesCalc - (maxButtonsPagination - 1);
    rightNumbers = totalPagesCalc;
    if (leftNumbers < 1) {
      leftNumbers = 1;
    }
  }
  return { leftNumbers, rightNumbers };
}

async function deleteProduct(id) {
  const url = `http://localhost:3000/products`;
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
  }
}

function addDeleteEvent() {
  const deleteButton = document.querySelectorAll(".delete");
  deleteButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      const productCard = e.currentTarget.closest(".product");
      const productId = e.currentTarget.dataset.id;
      deleteProduct(productId).then(() => {
        productCard.remove();
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createPageEvent();
});
