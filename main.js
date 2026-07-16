const headerCartBtn = document.querySelector(".header__cart-btn");
const headerCartBtnCount = document.querySelector(".header__cart-btn-count");
const headerTabletCartBtn = document.querySelector(".header-tablet__cart-btn");

const catalogTabs = document.querySelectorAll(".catalog-top__tab");
const catalogFranceList = document.querySelector(".catalog__list.france");
const catalogGermanyList = document.querySelector(".catalog__list.germany");
const catalogEnglandList = document.querySelector(".catalog__list.england");
const catalogItemsArr = document.querySelectorAll(".catalog__item");
const catalogLists = [catalogFranceList, catalogGermanyList, catalogEnglandList];

const cartPopup = document.querySelector(".cart-popup");
const cartPopupBox = document.querySelector(".cart-popup__box");
const cartPopupCloseBtn = document.querySelector(".cart-popup__close-btn");
const cartPopupContent = document.querySelector(".cart-popup__content");
const cartPopupEmptyText = document.querySelector(".cart-popup__empty-text");
const cartPopupTable = document.querySelector(".cart-popup__table");
const cartPopupBottom = document.querySelector(".cart-popup__bottom");
const cartPopupResult = document.querySelector(".cart-popup__result");
const cartPopupPayBtn = document.querySelector(".cart-popup__pay-btn");
const cartPopupSuccess = document.querySelector(".cart-popup__success");

// Стили
catalogGermanyList.classList.add("none");
catalogEnglandList.classList.add("none");

cartPopupSuccess.classList.add("none");
cartPopupEmptyText.classList.add("none");

// Функция изменения счетчика в углучу корзины
const changeHeaderBtnsCountSpans = () => {
    const localStorageItems = JSON.parse(localStorage.getItem("cart")) || [];

    let totalItemsCount = 0;
    localStorageItems.forEach(item => totalItemsCount += item.count);

    headerCartBtnCount.innerHTML = totalItemsCount;
};

document.addEventListener("DOMContentLoaded", changeHeaderBtnsCountSpans);

// CatalogTabs
catalogTabs.forEach((tab, index) => tab.addEventListener("click", () => {
    tab.classList.add("current");
    [...catalogTabs].filter((_, ind) => ind !== index).forEach(tab => tab.classList.remove("current"));
    catalogLists[index].classList.remove("none");
    catalogLists.filter((_, ind) => ind !== index).forEach(list => list.classList.add("none"));
}));

// Add item to cart
catalogItemsArr.forEach(item => {
    const itemBtn = item.querySelector(".catalog__item-btn");

    const itemTitle = item.querySelector(".catalog__item-title").innerHTML;
    const itemAuthor = item.querySelector(".catalog__item-author").innerHTML;
    const itemPrice = item.querySelector(".catalog__item-price").innerHTML;

    itemBtn.addEventListener("click", () => {
        const localStorageItems = JSON.parse(localStorage.getItem("cart")) || [];
        let newLocalStorageItems = [...localStorageItems];

        let isItemInLocalStorage = false;
        localStorageItems.forEach((el, index) => {
            if(el.name == itemTitle) {
                isItemInLocalStorage = true;
                newLocalStorageItems[index].count++;
            };
        });

        if(!isItemInLocalStorage) {
            newLocalStorageItems.push({
                name: itemTitle,
                author: itemAuthor,
                price: itemPrice,
                count: 1,
            });
        };

        localStorage.setItem("cart", JSON.stringify(newLocalStorageItems));

        changeHeaderBtnsCountSpans();
    });
});

// Pay items
cartPopupPayBtn.addEventListener("click", () => {
    localStorage.setItem("cart", JSON.stringify([]));
    cartPopupContent.classList.add("none");
    cartPopupSuccess.classList.remove("none");
    headerCartBtnCount.innerHTML = "0";
    changeHeaderBtnsCountSpans();
});

// CartPopup
const closeCartPopup = () => cartPopup.classList.remove("open");
const openCartPopup = () => {
    const localStorageCart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartPopupRows = document.querySelectorAll(".cart-popup__row");
    cartPopupRows.forEach(row => row.remove());

    if(localStorageCart.length !== 0) {
        cartPopupEmptyText.classList.add("none");
        cartPopupTable.classList.remove("none");
        let totalSum = 0;

        localStorageCart.forEach(item => {
            const newCartPopupTableRow = document.createElement("div");
            newCartPopupTableRow.classList.add("cart-popup__row");
            newCartPopupTableRow.innerHTML = `
                <span class="cart-popup__row-text">${item.name}</span>
                <span class="cart-popup__row-text">${item.author}</span>
                <span class="cart-popup__row-text">${item.price}</span>
                <span class="cart-popup__row-text">${item.count}шт</span>
            `;
            totalSum += Number(item.price.replace(" руб", "").replace(" ", "")) * item.count;

            cartPopupTable.append(newCartPopupTableRow);
        });

        cartPopupResult.innerHTML = `Итого к оплате: ${totalSum} руб`;
    } else {
        cartPopupTable.classList.add("none");
        cartPopupBottom.classList.add("none");
        cartPopupEmptyText.classList.remove("none");
    };

    cartPopup.classList.add("open");
};

[headerCartBtn, headerTabletCartBtn].forEach(btn => btn.addEventListener("click", openCartPopup));
cartPopupCloseBtn.addEventListener("click", closeCartPopup);
cartPopupBox.addEventListener("click", (e) => e._isClickWithInModal = true);
cartPopup.addEventListener("click", (e) => {
    if(e._isClickWithInModal) return;
    closeCartPopup();
});