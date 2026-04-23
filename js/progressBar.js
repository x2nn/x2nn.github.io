// 顶部阅读进度条：根据 scrollTop / (scrollHeight - clientHeight) 驱动宽度
(function () {
  if (typeof document === 'undefined') return;

  function ensureBar() {
    var bar = document.querySelector('.reading-progress-bar');
    if (bar) return bar;
    bar = document.createElement('div');
    bar.className = 'reading-progress-bar';
    // 语义化：让屏幕阅读器忽略（纯装饰）
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    return bar;
  }

  var bar;
  var ticking = false;

  function update() {
    if (!bar) return;
    var doc = document.documentElement;
    var total = doc.scrollHeight - doc.clientHeight;
    var pct = total > 0 ? (doc.scrollTop / total) * 100 : 0;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    bar.style.width = pct.toFixed(2) + '%';
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  function init() {
    bar = ensureBar();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
