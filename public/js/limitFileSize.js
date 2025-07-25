document.addEventListener('DOMContentLoaded', () => {
    const fileInput    = document.getElementById('song')
    const errorMessage = document.getElementById('fileSizeError')
    const MAX_SIZE     = 6 * 1024 * 1024
    const submitBtn    = document.querySelector('#uploadForm button[type="submit"]')

    fileInput.addEventListener('change', e => {
        const file = e.target.files[0]
        if (file && file.size > MAX_SIZE) {
            e.preventDefault()
            errorMessage.classList.remove('hidden')
            submitBtn.disabled= true
        } else {
            errorMessage.classList.add('hidden')
            submitBtn.disabled = false
        }
    })
})