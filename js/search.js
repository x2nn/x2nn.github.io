// A local search script with the help of hexo-generator-search.
var searchFunc = function(path, searchId, contentId) {
  'use strict';

  var input = document.getElementById(searchId);
  var resultContent = document.getElementById(contentId);
  var datas = [];
  var activeIndex = -1;
  var currentResults = [];

  if (!input || !resultContent) return;

  setState('loading', '正在载入索引文件...');

  $.ajax({
    url: path,
    dataType: 'xml',
    success: function(xmlResponse) {
      datas = $('entry', xmlResponse).map(function() {
        return {
          title: $('title', this).text() || 'Untitled',
          content: $('content', this).text() || '',
          url: $('url', this).text() || ''
        };
      }).get();
      setState('idle', '输入关键词开始搜索');
      render(input.value);
    },
    error: function() {
      setState('empty', '索引文件载入失败，请稍后重试');
    }
  });

  input.addEventListener('input', function() {
    render(this.value);
  });

  input.addEventListener('keydown', function(event) {
    var items = Array.from(resultContent.querySelectorAll('.search-result-item'));
    if (!items.length) {
      if (event.key === 'Enter') event.preventDefault();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(Math.min(activeIndex + 1, items.length - 1), items);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(Math.max(activeIndex - 1, 0), items);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      var activeItem = items[activeIndex] || items[0];
      var link = activeItem && activeItem.querySelector('a');
      if (link) window.location.href = link.href;
    }
  });

  resultContent.addEventListener('mousemove', function(event) {
    var item = event.target.closest && event.target.closest('.search-result-item');
    if (!item) return;
    var items = Array.from(resultContent.querySelectorAll('.search-result-item'));
    setActiveIndex(items.indexOf(item), items);
  });

  function render(rawQuery) {
    var query = rawQuery.trim().toLowerCase();
    activeIndex = -1;
    currentResults = [];

    if (!query) {
      setState('idle', '输入关键词开始搜索');
      return;
    }

    var keywords = query.split(/[\s\-]+/).filter(Boolean);
    if (!keywords.length) {
      setState('idle', '输入关键词开始搜索');
      return;
    }

    currentResults = datas.filter(function(data) {
      var title = data.title.trim().toLowerCase();
      var content = stripHtml(data.content).toLowerCase();
      return keywords.every(function(keyword) {
        return title.indexOf(keyword) >= 0 || content.indexOf(keyword) >= 0;
      });
    }).slice(0, 12);

    if (!currentResults.length) {
      setState('empty', '没有找到内容，请尝试更换检索词');
      return;
    }

    var list = document.createElement('ul');
    list.className = 'search-result-list';

    currentResults.forEach(function(data) {
      var item = document.createElement('li');
      item.className = 'search-result-item';

      var link = document.createElement('a');
      link.className = 'search-result-title';
      link.href = data.url;
      link.innerHTML = highlight(data.title.trim() || 'Untitled', keywords);
      item.appendChild(link);

      var excerpt = makeExcerpt(stripHtml(data.content), keywords);
      if (excerpt) {
        var abstract = document.createElement('p');
        abstract.className = 'search-result-abstract';
        abstract.innerHTML = highlight(excerpt, keywords);
        item.appendChild(abstract);
      }

      list.appendChild(item);
    });

    resultContent.innerHTML = '';
    resultContent.appendChild(list);
    setActiveIndex(0);
  }

  function setState(type, text) {
    resultContent.innerHTML = '';
    var state = document.createElement('div');
    state.className = 'local-search-empty local-search-' + type;
    state.textContent = text;
    resultContent.appendChild(state);
  }

  function setActiveIndex(index, items) {
    items = items || Array.from(resultContent.querySelectorAll('.search-result-item'));
    activeIndex = index;
    items.forEach(function(item, itemIndex) {
      item.classList.toggle('active', itemIndex === activeIndex);
    });
    if (items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function stripHtml(value) {
    return value.trim().replace(/<[^>]+>/g, '');
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function(match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match];
    });
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(value, keywords) {
    var escaped = escapeHtml(value);
    keywords.forEach(function(keyword) {
      var re = new RegExp('(' + escapeRegExp(escapeHtml(keyword)) + ')', 'gi');
      escaped = escaped.replace(re, '<span class="search-keyword">$1</span>');
    });
    return escaped;
  }

  function makeExcerpt(content, keywords) {
    if (!content) return '';
    var lower = content.toLowerCase();
    var firstOccur = -1;
    keywords.some(function(keyword) {
      firstOccur = lower.indexOf(keyword);
      return firstOccur >= 0;
    });
    if (firstOccur < 0) firstOccur = 0;

    var start = Math.max(0, firstOccur - 24);
    var end = Math.min(content.length, firstOccur + 96);
    var prefix = start > 0 ? '...' : '';
    var suffix = end < content.length ? '...' : '';
    return prefix + content.slice(start, end) + suffix;
  }

  $(document).on('click', '#search-close-icon', function() {
    $('#search-input').val('');
    $('#search-result').html('');
    setState('idle', '输入关键词开始搜索');
  });
};

var getSearchFile = function() {
  var path = '/search.xml';
  searchFunc(path, 'search-input', 'search-result');
};
