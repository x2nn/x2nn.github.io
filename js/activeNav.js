// which nav has active
let navs = document.querySelectorAll('.nav-item');
let pagePath = window.location.pathname.replace(/index\.html$/, '');
for(let nav of navs) {
  let navPath = nav.getAttribute("data-path");
  if(navPath && (navPath === pagePath || (navPath === '/journals/' && pagePath.startsWith(navPath)))) {
    nav.className = "nav-item active";
    nav.querySelector('a').setAttribute('aria-current', 'page');
  }
}
