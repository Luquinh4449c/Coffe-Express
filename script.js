document.addEventListener('DOMContentLoaded', () => {
    const barBtn = document.querySelector(".bar-btn");
    const asideNavigation = document.querySelector(".aside-navigation");
    const cartBtn = document.querySelector(".cart-btn");
    const asideCart = document.querySelector(".aside-cart");
    const searchBtn = document.querySelector(".search-btn");
    const asideSearch = document.querySelector(".aside-search");
    const searchInput = document.querySelector(".aside-search input");

    const toggleAsideNavigation = () => {
        asideNavigation.classList.toggle("active");
        document.body.classList.toggle("nav-open");
    };

    const toggleAsideCart = () => {
        closeAllAsides();
        asideCart.classList.toggle("active");
        document.body.classList.toggle("cart-open");
    };

    const toggleAsideSearch = () => {
        closeAllAsides();
        asideSearch.classList.toggle("active");
        document.body.classList.toggle("search-open");
        if (asideSearch.classList.contains("active") && searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    };

    const closeAllAsides = () => {
        asideNavigation?.classList.remove("active");
        asideCart?.classList.remove("active");
        asideSearch?.classList.remove("active");
        document.body.classList.remove("nav-open", "cart-open", "search-open");
    };

    function updateCartCount() {
        const cartItems = document.querySelectorAll(".aside-cart li");
        const cartCount = cartItems.length;
        let badge = document.querySelector(".cart-count");
        if (!badge && cartCount > 0) {
            badge = document.createElement("span");
            badge.className = "cart-count";
            cartBtn.appendChild(badge);
        }
        if (badge) {
            badge.textContent = cartCount;
            badge.style.display = cartCount > 0 ? "block" : "none";
        }
    }

    function addToCart(productName, productPrice, productImage) {
        const cartList = document.querySelector(".aside-cart ul");
        if (!cartList) return;

        const cartItem = document.createElement("li");
        cartItem.innerHTML = `
            <div class="cart-item">
                <div><img src="${productImage}" alt="${productName}"></div>
                <div>
                    <h2>${productName}</h2>
                    <span>${productPrice}</span>
                </div>  
            </div>
            <button><ion-icon name="trash"></ion-icon></button>
        `;
        cartList.appendChild(cartItem);

        const deleteBtn = cartItem.querySelector("button");
        deleteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            cartItem.remove();
            updateCartCount();
        });

        updateCartCount();
        showNotification(`${productName} adicionado ao carrinho!`);
    }

    function handleSearch(e) {
        const query = e.target.value.toLowerCase();
        console.log("Buscando:", query);
    }

    function performSearch(query) {
        if (!query.trim()) return;
        console.log("Executando busca para:", query);
        showNotification(`Buscando por: ${query}`);
        closeAllAsides();
    }

    function showNotification(message, type = "success") {
        const existingNotification = document.querySelector(".notification");
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;

        Object.assign(notification.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "15px 20px",
            backgroundColor: type === "success" ? "#4CAF50" : "#f44336",
            color: "white",
            borderRadius: "5px",
            zIndex: "9999",
            transform: "translateX(100%)",
            transition: "transform 0.3s ease"
        });

        document.body.appendChild(notification);
        setTimeout(() => notification.style.transform = "translateX(0)", 10);
        setTimeout(() => {
            notification.style.transform = "translateX(100%)";
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    if (barBtn && asideNavigation) {
        barBtn.addEventListener("click", toggleAsideNavigation);
    }

    const asideNavigationLinks = document.querySelectorAll(".aside-navigation a");
    asideNavigationLinks.forEach(link => {
        link.addEventListener("click", () => {
            asideNavigation.classList.remove("active");
            document.body.classList.remove("nav-open");
        });
    });

    if (cartBtn && asideCart) {
        cartBtn.addEventListener("click", toggleAsideCart);
    }

    const cartDeleteButtons = document.querySelectorAll(".aside-cart button");
    cartDeleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const cartItem = button.closest("li");
            if (cartItem) {
                cartItem.remove();
                updateCartCount();
            }
        });
    });

    if (searchBtn && asideSearch) {
        searchBtn.addEventListener("click", toggleAsideSearch);
    }

    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                performSearch(searchInput.value);
            }
        });
    }

    document.addEventListener("click", (e) => {
        const isClickInsideAside = e.target.closest(".aside-navigation, .aside-cart, .aside-search");
        const isClickOnButton = e.target.closest(".bar-btn, .cart-btn, .search-btn");
        if (!isClickInsideAside && !isClickOnButton) {
            closeAllAsides();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAllAsides();
        }
    });

    const purchaseButtons = document.querySelectorAll('.menu-item button, .products-cta button[title="add-to-cart"]');
    purchaseButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const item = button.closest(".menu-item, .products-item");
            if (!item) return;

            const name = item.querySelector("h2")?.textContent || "Produto";
            const price = item.querySelector("h3")?.textContent || "$0.00";
            const image = item.querySelector("img")?.src || "./img/default.jpg";

            addToCart(name, price, image);
        });
    });

    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    updateCartCount();
});
