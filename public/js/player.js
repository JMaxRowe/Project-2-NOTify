    document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('global-audio')
    const playPauseIcon = document.getElementById('playPauseIcon')
    const titleEl = document.getElementById('currentSongTitle')
    const progressBar = document.getElementById('progressBar')
    const volumeSlider = document.getElementById('volumeSlider')
    if (!audio || !playPauseIcon || !titleEl || !progressBar || !volumeSlider) return

    const savedSrc   = localStorage.getItem('currentTrack')
    const savedTime  = parseFloat(localStorage.getItem('currentTime') || 0)
    const wasPlaying = localStorage.getItem('isPlaying') === 'true'
    const savedTitle = localStorage.getItem('currentTitle')
    const savedVol = parseFloat(localStorage.getItem('audioVolume'))

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
        progressBar.max = audio.duration
    })
    audio.addEventListener('timeupdate', () => {
        localStorage.setItem('currentTime', audio.currentTime)
        progressBar.value = audio.currentTime
    })
    audio.addEventListener('play', () => {
        localStorage.setItem('isPlaying', 'true')
    })
    audio.addEventListener('pause', () => {
        localStorage.setItem('isPlaying', 'false')
    })

    if (!isNaN(savedVol)) {
        audio.volume= savedVol
        volumeSlider.value = savedVol
    } else {
        volumeSlider.value = audio.volume
    }
    

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

    progressBar.addEventListener('input', e => {
        audio.currentTime = parseFloat(e.currentTarget.value)
    })



    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', event => {
            const item = event.currentTarget.closest('.song-item')
            const src = item?.dataset.src
            const title = item?.querySelector('h3')?.textContent

        if (!src) return
        audio.src = src

        if (title){
            titleEl.textContent = title
            localStorage.setItem('currentTitle', title)
        }
        audio.play().catch(() => {})
        })
    })

    audio.addEventListener('ended', () =>{
    const items        = Array.from(document.querySelectorAll('.song-item'))
    const currentIndex = items.findIndex(item => item.dataset.src === audio.src)
    const nextIndex    = (currentIndex + 1) % items.length
    const nextItem     = items[nextIndex]
    const nextSrc      = nextItem.dataset.src
    const nextTitle    = nextItem.querySelector('h3').textContent

    audio.src = nextSrc
    titleEl.textContent = nextTitle
    localStorage.setItem('currentTrack', nextSrc)
    localStorage.setItem('currentTitle', nextTitle)
    localStorage.setItem('currentTime', 0)
    audio.play().catch(() => {})
    })

    volumeSlider.addEventListener('input', e => {
        const vol = parseFloat(e.currentTarget.value)
        audio.volume = vol
        localStorage.setItem('audioVolume', vol)
    })
    
})

// document.addEventListener('DOMContentLoaded', () => {
//     const audio = document.getElementById('global-audio')
//     const volumeSlider = document.getElementById('volumeSlider')
//     if (!audio || !volumeSlider) return


//     const savedVol = parseFloat(localStorage.getItem('audioVolume'))
//     if (!isNaN(savedVol)) {
//         audio.volume= savedVol
//         volumeSlider.value = savedVol
//     } else {
//         volumeSlider.value = audio.volume
//     }


//     volumeSlider.addEventListener('input', e => {
//         const vol = parseFloat(e.currentTarget.value)
//         audio.volume = vol
//         localStorage.setItem('audioVolume', vol)
//     })
// })