document.addEventListener('DOMContentLoaded', () => {
    const form    = document.getElementById('uploadForm')
    const overlay = document.getElementById('uploadingOverlay')
    if (!form || !overlay) return

    form.addEventListener('submit', () => {
        overlay.classList.remove('hidden')
    })
})