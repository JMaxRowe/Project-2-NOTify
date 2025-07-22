document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('addSongModal')
    const btn   = document.getElementById('addSongBtn')
    const close = modal.querySelector('.close')

    btn.addEventListener('click',   () => modal.style.display = 'block')
    close.addEventListener('click', () => modal.style.display = 'none')
    window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none'
    
    })
})