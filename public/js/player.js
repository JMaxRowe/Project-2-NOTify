    document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('global-audio')
    if (!audio) return

    const savedSrc   = localStorage.getItem('currentTrack')
    const savedTime  = parseFloat(localStorage.getItem('currentTime') || 0)
    const wasPlaying = localStorage.getItem('isPlaying') === 'true'

    if (savedSrc) {
        audio.src = savedSrc
        audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = savedTime
        if (wasPlaying) {
            audio.play().catch(() => {})
        }
        }, { once: true })
    }

    audio.addEventListener('loadedmetadata', () => {
        localStorage.setItem('currentTrack', audio.src)
    })
    audio.addEventListener('timeupdate', () => {
        localStorage.setItem('currentTime', audio.currentTime)
    })
    audio.addEventListener('play', () => {
        localStorage.setItem('isPlaying', 'true')
    })
    audio.addEventListener('pause', () => {
        localStorage.setItem('isPlaying', 'false')
    })

    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', event => {
        const src = event.currentTarget.closest('.song-item').dataset.src
        if (!src) return
        audio.src = src
        audio.play().catch(() => {})
        })
    })
})