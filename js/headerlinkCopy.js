// 点击标题左侧的 # 锚点时，复制该标题的完整 URL 到剪贴板并弹 toast
(function () {
  if (typeof document === 'undefined') return;

  function showToast(text) {
    var toast = document.querySelector('.blog-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'blog-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('visible');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.classList.remove('visible');
    }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.top = '-2000px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  function onClick(e) {
    var a = e.target.closest && e.target.closest('.markdown-body .headerlink');
    if (!a) return;
    e.preventDefault();
    var href = a.getAttribute('href') || '';
    // href 形如 "#某小节"，拼出完整地址
    var absolute = location.origin + location.pathname + href;
    copyText(absolute).then(
      function () { showToast('已复制本节链接'); },
      function () { showToast('复制失败，可手动选中地址栏'); }
    );
    // 同时更新地址栏 hash，方便用户看到跳转
    history.replaceState(null, '', href);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      document.addEventListener('click', onClick);
    });
  } else {
    document.addEventListener('click', onClick);
  }
})();
