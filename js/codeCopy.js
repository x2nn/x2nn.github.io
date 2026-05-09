// clipboard js 代码复制功能
window.addEventListener('DOMContentLoaded', initCodeCopy)

function initCodeCopy() {
  if (typeof ClipboardJS === 'undefined') {
    window.setTimeout(initCodeCopy, 80)
    return
  }

  const codeBlockDoms = document.querySelectorAll('figure.highlight')
  codeBlockDoms.forEach((block, index) => {
    const copyContent = block.querySelector('td.code')
    if (!copyContent) return

    const copyBtn = document.createElement('button')
    copyBtn.type = 'button'
    copyBtn.className = 'pin-copy'
    copyBtn.setAttribute('aria-label', '复制代码')
    copyBtn.setAttribute('data-text', 'copy')
    copyBtn.setAttribute('data-clipboard-text', copyContent.innerText || '')

    const copyIcon = document.createElement('i')
    copyIcon.className = 'iconfont icon-copy'
    copyBtn.appendChild(copyIcon)

    const codeLabel = document.createElement('span')
    codeLabel.className = 'code-block-label'
    codeLabel.textContent = getCodeBlockLabel(block, index)

    const codeHead = document.createElement('div')
    codeHead.className = 'code-block-head'
    codeHead.appendChild(codeLabel)
    codeHead.appendChild(copyBtn)
    block.insertBefore(codeHead, block.firstChild)

    const clipboard = new ClipboardJS(copyBtn)
    clipboard.on('success', function(e) {
      copyBtn.setAttribute('data-text', 'copied')
      e.clearSelection()
      window.setTimeout(function() {
        copyBtn.setAttribute('data-text', 'copy')
      }, 1400)
    })
    clipboard.on('error', function() {
      copyBtn.setAttribute('data-text', 'failed')
      window.setTimeout(function() {
        copyBtn.setAttribute('data-text', 'copy')
      }, 1400)
    })
  })
}

function getCodeBlockLabel(block, index) {
  const classes = Array.from(block.classList).filter(name => name !== 'highlight')
  const lang = classes[0] || 'text'
  return lang === 'plaintext' ? 'text' : lang || `code ${index + 1}`
}
