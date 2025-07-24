    document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('global-audio')
    const playPauseIcon = document.getElementById('playPauseIcon')
    const titleEl = document.getElementById('currentSongTitle')
    if (!audio) return

    const savedSrc   = localStorage.getItem('currentTrack')
    const savedTime  = parseFloat(localStorage.getItem('currentTime') || 0)
    const wasPlaying = localStorage.getItem('isPlaying') === 'true'
    const savedTitle = localStorage.getItem('currentTitle')

    if(savedTitle){
        titleEl.textContent=savedTitle
    }

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

    
    

function updateIcon(isPlaying) {
    if(!playPauseIcon) return;
    playPauseIcon.classList.toggle('fa-play', !isPlaying)
    playPauseIcon.classList.toggle('fa-pause', isPlaying)
 }


    updateIcon (wasPlaying)

    audio.addEventListener('play',  () => updateIcon(true))
    audio.addEventListener('pause', () => updateIcon(false))

    playPauseIcon.addEventListener('click', () =>{
        if (audio.paused) audio.play().catch(()=>{})
        else audio.pause()
    })

    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', event => {
            const item = event.currentTarget.closest('.song-item')
            const src = item?.dataset.src
            const title = item?.querySelector('h4')?.textContent

        if (!src) return
        audio.src = src

        if (title){
            titleEl.textContent = title
            localStorage.setItem('currentTitle', title)
        }
        audio.play().catch(() => {})
        })
    })

    

    
})

