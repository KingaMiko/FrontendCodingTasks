document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchLabel = document.querySelector(".search__label");
  const searchResults = document.getElementById("searchResults");
  const loadingIcon = document.querySelector(".search__loading");
  let currentQuery = "";

  function toggleSearchLabel() {
    searchLabel.style.display =
      searchInput.value.trim() !== "" ? "none" : "block";
  }

  function clearSearchResults() {
    searchResults.innerHTML = "";
    searchResults.classList.remove("active");
    loadingIcon.style.display = "none";
    toggleSearchLabel();
  }

  let debounceTimer;
  function handleInput() {
    const query = searchInput.value;
    currentQuery = query;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (query.length > 0) {
        fetchResults(query);
      } else {
        clearSearchResults();
      }
    }, 500);
  }

  searchInput.addEventListener("input", () => {
    handleInput();
  });

  searchInput.addEventListener("blur", () => {
    toggleSearchLabel();
  });

  searchInput.addEventListener("focus", () => {
    searchLabel.style.display = "block";
  });

  if (searchInput.value.trim() !== "") {
    toggleSearchLabel();
  }

  async function fetchResults(query) {
    searchResults.classList.add("active");
    loadingIcon.style.display = "block";

    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${query}&limit=5&delay=1000`
      );
      const data = await response.json();
      if (currentQuery === query) {
        if (data.products.length > 0 || query.trim() === "") {
          displayResults(data.products);
        } else {
          displayNoResults();
        }
      }
    } catch (error) {
      searchResults.innerHTML = "Error loading results";
      console.error("Error:", error);
    } finally {
      loadingIcon.style.display = "none";
    }
  }

  function displayNoResults() {
    searchResults.innerHTML = "";
    const noResultsElement = document.createElement("div");
    noResultsElement.classList.add("search__result-item", "no-results");
    noResultsElement.textContent = "No results found.";
    searchResults.appendChild(noResultsElement);
  }

  function displayResults(products) {
    searchResults.innerHTML = "";
    products.forEach((product) => {
      searchResults.appendChild(createResultItem(product));
    });
  }

  function createResultItem(product) {
    const resultItem = document.createElement("div");
    resultItem.classList.add("search__result-item");

    const productTitle = document.createElement("span");
    productTitle.classList.add("product__title");
    productTitle.textContent = product.title;

    const productPrice = document.createElement("span");
    productPrice.classList.add("product__price");
    productPrice.textContent = `$${product.price}`;

    resultItem.appendChild(productTitle);
    resultItem.appendChild(productPrice);

    resultItem.addEventListener("click", function () {
      selectResult(product.title);
    });

    return resultItem;
  }

  function selectResult(title) {
    searchInput.value = title;
    clearSearchResults();
    searchInput.focus();
  }
});
