// catalog js
let catalog = document.getElementById("catalog");
let catalogBackdrop = document.getElementById("catalog-backdrop");
let catalogButton = document.getElementById("btn-catalog");
let catalogTopHeight = catalog.offsetTop;
let tocElement = document.getElementsByClassName("catalog-content")[0];

function isMobileCatalog() {
  return window.matchMedia("(max-width: 888px)").matches;
}

// 是否固定目录
function changePos() {
  if (isMobileCatalog()) {
    catalog.removeAttribute("style");
    return;
  }

  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > catalogTopHeight - 20) {
    catalog.style = "position: fixed; top: 20px; bottom: 20px;";
  } else {
    catalog.style = "position: absolute; top: calc(290px + 88px + 30px);";
  }
}

// 是否激活目录
function isActiveCat() {
  // 可宽限高度值
  let offsetHeight = 20;

  // 当前页面滚动位置距页面顶部的高度值
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  // 页面所有标题列表
  let headerLinkList = document.getElementsByClassName("headerlink");

  if (!headerLinkList.length) return;

  // 页面所有目录列表
  let catLinkList = document.getElementsByClassName("toc-link");

  for(let i = 0; i < catLinkList.length; i++) {
    let currentTopCat = headerLinkList[i].offsetTop - offsetHeight;
    let nextTopCat = i + 1 === headerLinkList.length ?
        Infinity : headerLinkList[i+1].offsetTop - offsetHeight;

    if (scrollTop >= currentTopCat && scrollTop < nextTopCat) {
      // 目录跟随滚动
      catLinkList[i].className = "toc-link active";
      tocElement.scrollTop = catLinkList[i].offsetTop - 32;
    } else {
      catLinkList[i].className = "toc-link";
    }
  }
}

// 窗体高度变化时
function handleResize() {
  if (isMobileCatalog()) {
    tocElement.removeAttribute("style");
  } else {
    let windowHeight = document.documentElement.clientHeight;
    tocElement.setAttribute("style", `height: ${windowHeight - 90}px`);
  }
  changePos();
}

function setCatalogVisible(visible) {
  catalog.classList.toggle("hidden", !visible);
  if (catalogBackdrop) {
    catalogBackdrop.classList.toggle("hidden", !visible);
  }
  if (catalogButton) {
    catalogButton.setAttribute("aria-expanded", visible ? "true" : "false");
  }
}

// 小屏下（屏宽小于888px）是否展开目录
function openOrHiddenCatalog() {
  setCatalogVisible(catalog.classList.contains("hidden"));
}

changePos();
isActiveCat();
handleResize();
document.addEventListener("scroll", changePos, false);
document.addEventListener("scroll", isActiveCat, false);
window.addEventListener("resize", handleResize, false);

if (catalogButton) {
  catalogButton.addEventListener("click", openOrHiddenCatalog, false);
  catalogButton.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openOrHiddenCatalog();
    }
  }, false);
}

if (catalogBackdrop) {
  catalogBackdrop.addEventListener("click", function() {
    setCatalogVisible(false);
  }, false);
}

tocElement.addEventListener("click", function(event) {
  if (isMobileCatalog() && event.target.closest(".toc-link")) {
    setCatalogVisible(false);
  }
}, false);

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    setCatalogVisible(false);
  }
}, false);
