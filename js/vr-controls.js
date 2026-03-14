/*
  vr-controls.js
  Powers all the controls on the VR scene pages.
  Loaded after main.js on site1–site4 only.

  What it controls:
  - Play / Pause button
  - Rewind 10 seconds button
  - Progress bar (click to seek, drag to scrub)
  - Timestamp display (current time / total)
  - Subtitles (CC) toggle
  - Thumbnail strip click (jumps to that angle/time)
  - Left/right area navigation arrows
  - Fullscreen button

  To hook this up to a real video once you have footage:
  - Replace the setInterval ticker with your video element's timeupdate event
  - Call seekTo() when the video's currentTime changes
  - Set data-duration on .video-controls to match your video length in seconds
*/

(function () {

  // Read the total duration from the HTML — default is 120 seconds (2 minutes)
  const controlsEl = document.querySelector('.video-controls');
  const DURATION    = controlsEl ? (parseFloat(controlsEl.dataset.duration) || 120) : 120;

  // Keep track of playback state
  let currentTime = 0;
  let playing     = false;
  let subsOn      = false;
  let ticker      = null;  // the setInterval handle


  /* ─────────────────────────────────────
     Play / Pause
  ───────────────────────────────────── */
  const playBtn = document.getElementById('ctrlPlay');

  function setPlaying(state) {
    playing = state;

    if (playBtn) {
      playBtn.textContent = playing ? '⏸' : '▶';
      playBtn.title       = playing ? 'Pause' : 'Play';
    }

    if (playing) {
      // Tick forward one second at a time
      ticker = setInterval(() => {
        currentTime = Math.min(currentTime + 1, DURATION);
        updateProgress();
        updateTimestamp();
        updateSubtitles();
        if (currentTime >= DURATION) setPlaying(false); // stop at the end
      }, 1000);
    } else {
      clearInterval(ticker);
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => setPlaying(!playing));
  }


  /* ─────────────────────────────────────
     Rewind
     Jumps back 10 seconds each click
  ───────────────────────────────────── */
  const rewindBtn = document.getElementById('ctrlRewind');

  if (rewindBtn) {
    rewindBtn.addEventListener('click', () => {
      currentTime = Math.max(0, currentTime - 10);
      updateProgress();
      updateTimestamp();
    });
  }


  /* ─────────────────────────────────────
     Progress Bar
     Click anywhere on the bar to seek.
     Hold and drag to scrub.
  ───────────────────────────────────── */
  const progressWrap  = document.getElementById('progressWrap');
  const progressFill  = document.getElementById('progressFill');
  const progressThumb = document.getElementById('progressThumb');

  function seekTo(clientX) {
    if (!progressWrap) return;
    const rect    = progressWrap.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    currentTime   = percent * DURATION;
    updateProgress();
    updateTimestamp();
    updateSubtitles();
  }

  function updateProgress() {
    const pct = DURATION > 0 ? (currentTime / DURATION) * 100 : 0;
    if (progressFill)  progressFill.style.width = `${pct}%`;
    if (progressThumb) progressThumb.style.left  = `${pct}%`;
  }

  if (progressWrap) {
    let dragging = false;

    progressWrap.addEventListener('mousedown',  (e) => { dragging = true; seekTo(e.clientX); });
    progressWrap.addEventListener('touchstart', (e) => { dragging = true; seekTo(e.touches[0].clientX); }, { passive: true });

    window.addEventListener('mousemove',  (e) => { if (dragging) seekTo(e.clientX); });
    window.addEventListener('touchmove',  (e) => { if (dragging) seekTo(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup',    () => { dragging = false; });
    window.addEventListener('touchend',   () => { dragging = false; });

    progressWrap.addEventListener('click', (e) => seekTo(e.clientX));
  }


  /* ─────────────────────────────────────
     Timestamp Display
     Shows "00:30 / 02:00" in the controls bar
  ───────────────────────────────────── */
  const timestampEl = document.getElementById('ctrlTimestamp');

  // Pads a number to always show two digits e.g. 5 becomes "05"
  function pad(n) { return String(Math.floor(n)).padStart(2, '0'); }

  function updateTimestamp() {
    if (!timestampEl) return;
    timestampEl.textContent =
      `${pad(currentTime / 60)}:${pad(currentTime % 60)} / ${pad(DURATION / 60)}:${pad(DURATION % 60)}`;
  }

  updateTimestamp(); // show the initial "00:00 / 02:00" straight away


  /* ─────────────────────────────────────
     Subtitles (CC) Toggle
     Reads subtitle cues from window.VR_SUBTITLES
     which is defined in each site page's inline script.

     Format: [{ time: 10, duration: 5, text: "Hello world" }]
  ───────────────────────────────────── */
  const subsBtn     = document.getElementById('ctrlSubs');
  const subsOverlay = document.querySelector('.subtitle-overlay');
  const subtitles   = window.VR_SUBTITLES || [];

  function updateSubtitles() {
    if (!subsOn || !subsOverlay) return;

    // Find a cue that covers the current timestamp
    const cue = subtitles.find(c => currentTime >= c.time && currentTime < c.time + c.duration);

    if (cue) {
      const textEl = subsOverlay.querySelector('.subtitle-text');
      if (textEl) textEl.textContent = cue.text;
      subsOverlay.classList.add('visible');
    } else {
      subsOverlay.classList.remove('visible');
    }
  }

  if (subsBtn) {
    subsBtn.addEventListener('click', () => {
      subsOn = !subsOn;
      subsBtn.classList.toggle('subs-on', subsOn);
      subsBtn.title = subsOn ? 'Turn off subtitles' : 'Turn on subtitles';
      if (!subsOn && subsOverlay) subsOverlay.classList.remove('visible');
    });
  }


  /* ─────────────────────────────────────
     Thumbnail Strip Clicks
     Clicking a thumbnail seeks to its time
     and (if you've added A-Frame) rotates the sky
     to the matching angle.

     Add data-time and data-angle to each .thumb div.
  ───────────────────────────────────── */
  document.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {

      // Mark this one as active, clear the others
      document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      // Seek to the thumbnail's time
      const t = parseFloat(thumb.dataset.time);
      if (!isNaN(t)) {
        currentTime = t;
        updateProgress();
        updateTimestamp();
        updateSubtitles();
      }

      // Rotate the A-Frame sky to match this angle (works once you add A-Frame)
      const angle = parseFloat(thumb.dataset.angle);
      const sky   = document.querySelector('a-sky');
      if (sky && !isNaN(angle)) {
        sky.setAttribute('rotation', `0 ${angle} 0`);
      }
    });
  });


  /* ─────────────────────────────────────
     Area Navigation Arrows (← →)
     Cycles through the named areas defined
     in window.VR_AREAS in each site page.

     Format: [{ label: "Entrance", angle: -90, time: 0 }]
  ───────────────────────────────────── */
  const prevBtn = document.getElementById('areaNavPrev');
  const nextBtn = document.getElementById('areaNavNext');
  const areas   = window.VR_AREAS || [];
  let areaIndex = 0;

  function goToArea(index) {
    if (!areas.length) return;

    // Wrap around at the ends
    areaIndex = ((index % areas.length) + areas.length) % areas.length;
    const area = areas[areaIndex];

    // Rotate the sky (works once you add A-Frame)
    const sky = document.querySelector('a-sky');
    if (sky) sky.setAttribute('rotation', `0 ${area.angle || 0} 0`);

    // Seek the timeline
    if (area.time !== undefined) {
      currentTime = area.time;
      updateProgress();
      updateTimestamp();
    }

    // Highlight the matching thumbnail
    document.querySelectorAll('.thumb').forEach((t, i) => {
      t.classList.toggle('active', i === areaIndex);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToArea(areaIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToArea(areaIndex + 1));


  /* ─────────────────────────────────────
     Fullscreen
     Expands the .vr-wrapper to fill the screen
  ───────────────────────────────────── */
  const fsBtn      = document.getElementById('ctrlFullscreen');
  const vrWrapper  = document.querySelector('.vr-wrapper');

  if (fsBtn && vrWrapper) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        vrWrapper.requestFullscreen && vrWrapper.requestFullscreen();
      } else {
        document.exitFullscreen && document.exitFullscreen();
      }
    });

    document.addEventListener('fullscreenchange', () => {
      fsBtn.textContent = document.fullscreenElement ? '✕' : '⛶';
      fsBtn.title       = document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen';
    });
  }


  /* ─────────────────────────────────────
     Initialise
     Set the first thumbnail as active and
     make sure the timestamp shows straight away
  ───────────────────────────────────── */
  updateProgress();
  updateTimestamp();

  const firstThumb = document.querySelector('.thumb');
  if (firstThumb) firstThumb.classList.add('active');

})();
