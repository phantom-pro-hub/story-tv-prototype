/**
 * STORY TV LIGHTWEIGHT PROTOTYPE
 * Pure Vanilla JS State Machine & Video Reel Controller
 */

(function () {
  'use strict';

  // --- APPLICATION STATE ---
  const state = {
    currentScreenId: 'screen-login',
    userPreferences: {
      gender: 'Female',
      age: '25-34',
      language: 'Hindi',
      genres: ['Romance', 'Drama'],
      locationAllowed: false
    },
    currentReelIndex: 1,
    maxReels: 3,
    soundEnabled: true,
    interludeStep: 1, // 1, 2, or 3
    subscription: {
      status: 'none', // 'none' | 'trial_active' | 'trial_extended' | 'weekly_active' | 'sachet_bought' | 'cancelled'
      expiryDate: '18th Sep, 2026',
      priceText: '₹699/3 months'
    },
    // Touch / Swipe Tracking
    swipe: {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      threshold: 50,
      isDragging: false
    }
  };

  // --- AUDIO SYNTHESIZER (Web Audio API for fast, zero-buffer sound effects) ---
  let audioCtx = null;
  let ambientOscillator = null;
  let ambientGain = null;

  function initAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.15) {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function playDramaticStinger() {
    if (!state.soundEnabled) return;
    playTone(220, 0.4, 'triangle', 0.2);
    setTimeout(() => playTone(330, 0.5, 'sine', 0.25), 100);
    setTimeout(() => playTone(440, 0.8, 'sine', 0.3), 250);
  }

  function playSuccessChime() {
    if (!state.soundEnabled) return;
    playTone(523.25, 0.15, 'sine', 0.2); // C5
    setTimeout(() => playTone(659.25, 0.18, 'sine', 0.22), 120); // E5
    setTimeout(() => playTone(783.99, 0.35, 'sine', 0.25), 240); // G5
    setTimeout(() => playTone(1046.50, 0.5, 'sine', 0.3), 360); // C6
  }

  function playClickSfx() {
    playTone(600, 0.05, 'triangle', 0.08);
  }

  // --- PROCEDURAL DRAMA CANVASES (100% Reliable Offline Fallback Graphics) ---
  const canvases = {};
  const canvasAnimations = {};

  function setupCanvas(canvasId, dramaType) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvases[canvasId] = { canvas, ctx, dramaType, time: 0 };
    resizeCanvas(canvas);
    window.addEventListener('resize', () => resizeCanvas(canvas));
  }

  function resizeCanvas(canvas) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    } else {
      canvas.width = 390 * dpr;
      canvas.height = 844 * dpr;
    }
  }

  function resizeAllCanvases() {
    for (const key in canvases) {
      if (canvases[key] && canvases[key].canvas) {
        resizeCanvas(canvases[key].canvas);
      }
    }
  }

  function drawDramaFrame(item) {
    const { ctx, canvas, dramaType } = item;
    item.time += 0.02;
    const t = item.time;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (dramaType === 'romance') {
      // Warm romantic sunset & bokeh
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#2d081b');
      grad.addColorStop(0.5, '#7a1435');
      grad.addColorStop(1, '#15030b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Bokeh lights
      for (let i = 0; i < 8; i++) {
        const x = (Math.sin(t + i * 2) * 0.4 + 0.5) * w;
        const y = (Math.cos(t * 0.7 + i * 1.5) * 0.4 + 0.5) * h;
        const r = (Math.sin(t + i) * 20 + 40) * (w / 360);
        const bGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
        bGrad.addColorStop(0, 'rgba(255, 105, 180, 0.28)');
        bGrad.addColorStop(1, 'rgba(255, 105, 180, 0)');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Romantic Couple Silhouette Center
      drawSilhouette(ctx, w * 0.46, h * 0.48, w * 0.16, '#0f0208');
      drawSilhouette(ctx, w * 0.54, h * 0.49, w * 0.15, '#0f0208');

    } else if (dramaType === 'action') {
      // High-intensity moody neon
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0a101d');
      grad.addColorStop(0.5, '#1e0c28');
      grad.addColorStop(1, '#05070c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Neon streaks
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 0, 122, 0.4)' : 'rgba(0, 229, 255, 0.35)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const startY = (Math.sin(t * 2 + i) * 0.5 + 0.5) * h;
        ctx.moveTo(0, startY);
        ctx.bezierCurveTo(w * 0.3, startY + 40, w * 0.7, startY - 40, w, startY + 20);
        ctx.stroke();
      }

      drawSilhouette(ctx, w * 0.5, h * 0.5, w * 0.2, '#08050e');

    } else if (dramaType === 'card-preview') {
      // Woman in orange dress preview (matches Screenshot 1)
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.4, 10, w * 0.5, h * 0.5, w * 0.7);
      grad.addColorStop(0, '#4a0d2a');
      grad.addColorStop(0.7, '#240615');
      grad.addColorStop(1, '#11020a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Character Representation (Orange dress hero)
      const cx = w * 0.35;
      const cy = h * 0.55;
      
      // Glow behind head
      const glow = ctx.createRadialGradient(cx, cy - h * 0.18, 5, cx, cy - h * 0.18, 50);
      glow.addColorStop(0, 'rgba(255, 180, 120, 0.35)');
      glow.addColorStop(1, 'rgba(255, 100, 50, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy - h * 0.18, 50, 0, Math.PI * 2);
      ctx.fill();

      // Orange outfit torso
      ctx.fillStyle = '#ff5722';
      ctx.beginPath();
      ctx.moveTo(cx - 28, cy + 50);
      ctx.lineTo(cx - 18, cy - 10);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + 18, cy - 10);
      ctx.lineTo(cx + 28, cy + 50);
      ctx.closePath();
      ctx.fill();

      // Face/Head
      ctx.fillStyle = '#f5cba7';
      ctx.beginPath();
      ctx.arc(cx, cy - 35, 20, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#3e2723';
      ctx.beginPath();
      ctx.arc(cx, cy - 42, 22, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();
      ctx.beginPath();
      ctx.rect(cx - 22, cy - 42, 44, 40);
      ctx.fill();

      // Hands gesturing slightly
      ctx.fillStyle = '#f5cba7';
      const handY = cy + Math.sin(t * 3) * 3;
      ctx.beginPath();
      ctx.arc(cx - 24, handY, 7, 0, Math.PI * 2);
      ctx.arc(cx + 24, handY, 7, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Default Dramatic Suspense
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1c0512');
      grad.addColorStop(0.6, '#3a0c24');
      grad.addColorStop(1, '#0c0208');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      drawSilhouette(ctx, w * 0.5, h * 0.5, w * 0.18, '#0d0309');
    }
  }

  function drawSilhouette(ctx, cx, cy, size, color) {
    ctx.fillStyle = color;
    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - size * 0.8, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
    // Body / Shoulders
    ctx.beginPath();
    ctx.ellipse(cx, cy, size * 0.7, size * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function startCanvasLoop() {
    function animate() {
      for (const key in canvases) {
        drawDramaFrame(canvases[key]);
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // --- SCREEN NAVIGATION CONTROLLER ---
  function navigateTo(screenId, options = {}) {
    const currentScreen = document.getElementById(state.currentScreenId);
    const targetScreen = document.getElementById(screenId);

    if (!targetScreen) {
      console.error('Target screen does not exist:', screenId);
      return;
    }

    if (currentScreen) {
      currentScreen.classList.remove('active');
    }

    // Always dismiss location modal if active
    const locModal = document.getElementById('modal-location');
    if (locModal && screenId !== 'modal-location') {
      locModal.classList.remove('active');
    }

    targetScreen.classList.add('active');
    state.currentScreenId = screenId;

    // Resize canvases to ensure crisp rendering
    setTimeout(resizeAllCanvases, 50);

    // Handle background videos / canvas per screen
    handleScreenEnter(screenId, options);

    // Sync quick selector dropdown
    syncQuickStepDropdown(screenId);
  }

  function handleScreenEnter(screenId, options = {}) {
    // Reel Screen
    if (screenId === 'screen-feed') {
      const reelIndex = options.reelIndex || state.currentReelIndex || 1;
      setReelSlide(reelIndex);
      playDramaticStinger();
    } 
    // Start Trial Screen
    else if (screenId === 'screen-trial') {
      playTone(400, 0.2, 'sine', 0.1);
    }
    // Trial Success Screen
    else if (screenId === 'screen-trial-success') {
      playSuccessChime();
      showToast('🎉 ₹1 Trial Activated Successfully!');
      // Auto transition to settings after 2.8s if user doesn't click
      setTimeout(() => {
        if (state.currentScreenId === 'screen-trial-success') {
          navigateTo('screen-settings');
        }
      }, 3200);
    }
    // Subscription Settings Screen
    else if (screenId === 'screen-settings') {
      updateSettingsScreenUI();
    }
    // Retention Video Interlude
    else if (screenId === 'screen-retention-video') {
      playDramaticStinger();
      updateInterludeUI(options.step || state.interludeStep);
    }
  }

  // --- REEL VIDEO / SLIDE CONTROLLER ---
  function setReelSlide(index) {
    if (index < 1) index = 1;
    if (index > state.maxReels) index = state.maxReels;

    state.currentReelIndex = index;

    // Update slides
    for (let i = 1; i <= state.maxReels; i++) {
      const slide = document.getElementById(`reel-slide-${i}`);
      const dot = document.getElementById(`dot-${i}`);
      const video = document.getElementById(`video-elem-${i}`);

      if (slide) {
        slide.classList.remove('active', 'prev');
        if (i === index) {
          slide.classList.add('active');
          if (video && state.soundEnabled) {
            video.currentTime = 0;
            video.play().catch(() => {});
          }
        } else if (i < index) {
          slide.classList.add('prev');
          if (video) video.pause();
        } else {
          if (video) video.pause();
        }
      }

      if (dot) {
        dot.classList.toggle('active', i === index);
      }
    }
  }

  function advanceReel() {
    if (state.currentReelIndex < state.maxReels) {
      setReelSlide(state.currentReelIndex + 1);
      playDramaticStinger();
    } else {
      // "After 3rd video, swipe up too takes the user to Start Trial screen"
      showToast('⚡ Final Preview complete! Unlock with ₹1 Trial');
      navigateTo('screen-trial');
    }
  }

  function openTrialScreen() {
    // "Swiping left or right takes users to Start Trial screen"
    navigateTo('screen-trial');
  }

  // --- GESTURE & SWIPE RECOGNIZER ---
  function setupGestures() {
    const feed = document.getElementById('screen-feed');
    if (!feed) return;

    // Touch events
    feed.addEventListener('touchstart', (e) => {
      state.swipe.startX = e.changedTouches[0].screenX;
      state.swipe.startY = e.changedTouches[0].screenY;
    }, { passive: true });

    feed.addEventListener('touchend', (e) => {
      state.swipe.endX = e.changedTouches[0].screenX;
      state.swipe.endY = e.changedTouches[0].screenY;
      handleSwipeGesture();
    }, { passive: true });

    // Mouse drag support for desktop presentation
    feed.addEventListener('mousedown', (e) => {
      state.swipe.isDragging = true;
      state.swipe.startX = e.clientX;
      state.swipe.startY = e.clientY;
    });

    window.addEventListener('mouseup', (e) => {
      if (!state.swipe.isDragging) return;
      state.swipe.isDragging = false;
      state.swipe.endX = e.clientX;
      state.swipe.endY = e.clientY;
      handleSwipeGesture();
    });

    // Mouse wheel support for desktop browsers
    let wheelThrottle = false;
    feed.addEventListener('wheel', (e) => {
      if (wheelThrottle) return;
      if (Math.abs(e.deltaY) > 30) {
        wheelThrottle = true;
        setTimeout(() => { wheelThrottle = false; }, 350);
        if (e.deltaY > 0) {
          advanceReel();
        } else if (state.currentReelIndex > 1) {
          setReelSlide(state.currentReelIndex - 1);
        }
      } else if (Math.abs(e.deltaX) > 30) {
        wheelThrottle = true;
        setTimeout(() => { wheelThrottle = false; }, 350);
        openTrialScreen();
      }
    }, { passive: true });

    // Click on gesture hint bar advances the reel
    const hintBar = document.getElementById('gesture-hint');
    if (hintBar) {
      hintBar.addEventListener('click', () => {
        advanceReel();
      });
    }

    // Click on progress dots jumps directly to that video
    document.querySelectorAll('.reel-progress-dots .dot').forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        setReelSlide(idx + 1);
      });
    });

    // Keyboard navigation support
    window.addEventListener('keydown', (e) => {
      if (state.currentScreenId !== 'screen-feed') return;
      if (e.key === 'ArrowUp' || e.key === 'PageDown') {
        advanceReel();
      } else if ((e.key === 'ArrowDown' || e.key === 'PageUp') && state.currentReelIndex > 1) {
        setReelSlide(state.currentReelIndex - 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        openTrialScreen();
      }
    });
  }

  function handleSwipeGesture() {
    const dx = state.swipe.endX - state.swipe.startX;
    const dy = state.swipe.endY - state.swipe.startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < state.swipe.threshold) {
      return; // Too small, ignored as tap
    }

    if (absY > absX) {
      // Vertical swipe
      if (dy < 0) {
        // Swipe UP -> Next video or Trial after 3rd
        advanceReel();
      } else if (dy > 0 && state.currentReelIndex > 1) {
        // Swipe DOWN -> Previous video
        setReelSlide(state.currentReelIndex - 1);
      }
    } else {
      // Horizontal swipe (Left or Right) -> Directly to Start Trial
      openTrialScreen();
    }
  }

  // --- SETTINGS UI UPDATER (MATCHING SCREENSHOT 2) ---
  function updateSettingsScreenUI() {
    const statusText = document.getElementById('plan-status-text');
    const expiryLabel = document.getElementById('expiry-label-text');
    const expiryDate = document.getElementById('expiry-date-value');
    const renewWrap = document.getElementById('renew-button-wrap');
    const cancelMenuLabel = document.getElementById('cancel-menu-label');
    const guideBanner = document.getElementById('demo-guide-banner');

    if (state.subscription.status === 'cancelled') {
      // Exactly matches Screenshot 2
      statusText.textContent = 'Autopay cancelled';
      statusText.className = 'plan-status-badge status-cancelled';

      expiryLabel.textContent = 'Show access expired on:';
      expiryDate.textContent = '8th Sep, 2026';

      renewWrap.style.display = 'block';
      cancelMenuLabel.textContent = 'Subscription Cancelled';
      cancelMenuLabel.style.color = '#ff5252';

      if (guideBanner) {
        guideBanner.innerHTML = `
          <span class="guide-icon">✅</span>
          <div class="guide-text">
            <strong>Cancelled State:</strong> Matches Screenshot 2 exactly. Tap <em>"Renew Now →"</em> to reactivate.
          </div>
        `;
      }
    } else if (state.subscription.status === 'sachet_bought') {
      statusText.textContent = 'Show Access Unlocked';
      statusText.className = 'plan-status-badge status-active';

      expiryLabel.textContent = 'Autopay Status:';
      expiryDate.textContent = 'Cancelled (₹10 Paid)';

      renewWrap.style.display = 'none';
      cancelMenuLabel.textContent = 'Cancel Plan';
      cancelMenuLabel.style.color = '#ffffff';

      if (guideBanner) {
        guideBanner.innerHTML = `
          <span class="guide-icon">🎉</span>
          <div class="guide-text">
            <strong>Sachet Pass:</strong> Autopay revoked! You own this show forever.
          </div>
        `;
      }
    } else if (state.subscription.status === 'weekly_active') {
      statusText.textContent = 'Weekly Pass Active';
      statusText.className = 'plan-status-badge status-active';

      expiryLabel.textContent = 'Next Weekly Billing:';
      expiryDate.textContent = '25th Sep, 2026 (₹49)';

      renewWrap.style.display = 'none';
      cancelMenuLabel.textContent = 'Cancel Plan';
      cancelMenuLabel.style.color = '#ffffff';
    } else if (state.subscription.status === 'trial_extended') {
      statusText.textContent = 'Trial Extended (+1 Day)';
      statusText.className = 'plan-status-badge status-active';

      expiryLabel.textContent = 'Updated Autopay Date:';
      expiryDate.textContent = '19th Sep, 2026 (₹699)';

      renewWrap.style.display = 'none';
      cancelMenuLabel.textContent = 'Cancel Plan';
      cancelMenuLabel.style.color = '#ffffff';
    } else {
      // Default Active Trial State
      statusText.textContent = 'Active Trial';
      statusText.className = 'plan-status-badge status-active';

      expiryLabel.textContent = 'Next autopay date:';
      expiryDate.textContent = '18th Sep, 2026';

      renewWrap.style.display = 'none';
      cancelMenuLabel.textContent = 'Cancel Plan';
      cancelMenuLabel.style.color = '#ffffff';

      if (guideBanner) {
        guideBanner.innerHTML = `
          <span class="guide-icon">💡</span>
          <div class="guide-text">
            <strong>Prototype Demo:</strong> Tap <em>"Cancel Plan"</em> below to test the 4-step Leave Trial retention journey!
          </div>
        `;
      }
    }
  }

  // --- RETENTION VIDEO INTERLUDE DATA ---
  function updateInterludeUI(stepNumber) {
    state.interludeStep = stepNumber;
    const badge = document.getElementById('interlude-badge-text');
    const title = document.getElementById('interlude-title');

    if (stepNumber === 1) {
      badge.textContent = 'Teaser Clip 1 • Before Step 2';
      title.textContent = 'Episode 2: "The Will Contains a Secret Clause!"';
    } else if (stepNumber === 2) {
      badge.textContent = 'Teaser Clip 2 • Before Step 3';
      title.textContent = 'Episode 4: "I Am Not the Woman You Thought I Was."';
    } else if (stepNumber === 3) {
      badge.textContent = 'Teaser Clip 3 • Final Offer Ahead';
      title.textContent = 'Episode 7: "The Billionaire Climax Revelation"';
    }
  }

  // --- TOAST NOTIFICATIONS ---
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  }

  // --- REAL-TIME STATUS BAR CLOCK ---
  function initClock() {
    const clock = document.getElementById('status-clock');
    if (!clock) return;

    function update() {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      minutes = minutes < 10 ? '0' + minutes : minutes;
      clock.textContent = `${hours}:${minutes}`;
    }
    update();
    setInterval(update, 10000);
  }

  // --- QUICK STEP SELECTOR SYNC ---
  function syncQuickStepDropdown(screenId) {
    const select = document.getElementById('quick-step-selector');
    if (!select) return;

    const mapping = {
      'screen-login': 'login',
      'screen-personalisation': 'personalisation',
      'modal-location': 'location',
      'screen-feed': `reel-${state.currentReelIndex}`,
      'screen-trial': 'trial',
      'screen-trial-success': 'trial-success',
      'screen-settings': state.subscription.status === 'cancelled' ? 'settings-cancelled' : 'settings-active',
      'screen-leave-step1': 'leave-step1',
      'screen-retention-video': `retention-video-${state.interludeStep}`,
      'screen-leave-step2': 'leave-step2',
      'screen-leave-step3': 'leave-step3',
      'screen-leave-step4': 'leave-step4'
    };

    if (mapping[screenId]) {
      select.value = mapping[screenId];
    }
  }

  // --- EVENT ATTACHMENTS & FLOW BINDINGS ---
  function initEventListeners() {
    
    // Quick Step Dropdown Change
    const quickSelect = document.getElementById('quick-step-selector');
    if (quickSelect) {
      quickSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'login') navigateTo('screen-login');
        else if (val === 'personalisation') navigateTo('screen-personalisation');
        else if (val === 'location') {
          navigateTo('screen-personalisation');
          document.getElementById('modal-location').classList.add('active');
        } else if (val === 'reel-1') {
          navigateTo('screen-feed', { reelIndex: 1 });
        } else if (val === 'reel-2') {
          navigateTo('screen-feed', { reelIndex: 2 });
        } else if (val === 'reel-3') {
          navigateTo('screen-feed', { reelIndex: 3 });
        } else if (val === 'trial') navigateTo('screen-trial');
        else if (val === 'trial-success') navigateTo('screen-trial-success');
        else if (val === 'settings-active') {
          state.subscription.status = 'trial_active';
          navigateTo('screen-settings');
        } else if (val === 'leave-step1') navigateTo('screen-leave-step1');
        else if (val === 'retention-video-1') navigateTo('screen-retention-video', { step: 1 });
        else if (val === 'leave-step2') navigateTo('screen-leave-step2');
        else if (val === 'retention-video-2') navigateTo('screen-retention-video', { step: 2 });
        else if (val === 'leave-step3') navigateTo('screen-leave-step3');
        else if (val === 'retention-video-3') navigateTo('screen-retention-video', { step: 3 });
        else if (val === 'leave-step4') navigateTo('screen-leave-step4');
        else if (val === 'settings-cancelled') {
          state.subscription.status = 'cancelled';
          navigateTo('screen-settings');
        }
      });
    }

    // Toggle Device Frame (Phone frame vs full browser)
    const toggleFrameBtn = document.getElementById('toggle-device-frame');
    if (toggleFrameBtn) {
      toggleFrameBtn.addEventListener('click', () => {
        document.body.classList.toggle('full-browser');
        const isFull = document.body.classList.contains('full-browser');
        toggleFrameBtn.querySelector('.btn-text').textContent = isFull ? 'Phone View' : 'Full View';
      });
    }

    // SCREEN 1: LOGIN
    const quickLoginBtn = document.getElementById('btn-login-quick');
    const phoneLoginBtn = document.getElementById('btn-login-phone');

    const handleLoginSuccess = () => {
      playClickSfx();
      navigateTo('screen-personalisation');
    };

    if (quickLoginBtn) quickLoginBtn.addEventListener('click', handleLoginSuccess);
    if (phoneLoginBtn) phoneLoginBtn.addEventListener('click', handleLoginSuccess);

    // SCREEN 2: PERSONALISATION
    // Back to Login
    const backFromPers = document.getElementById('back-from-personalisation');
    if (backFromPers) {
      backFromPers.addEventListener('click', () => navigateTo('screen-login'));
    }

    // Gender Selection
    document.querySelectorAll('#group-gender .pref-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        playClickSfx();
        document.querySelectorAll('#group-gender .pref-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.userPreferences.gender = chip.dataset.value;
      });
    });

    // Age Selection
    document.querySelectorAll('#group-age .pref-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        playClickSfx();
        document.querySelectorAll('#group-age .pref-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.userPreferences.age = chip.dataset.value;
      });
    });

    // Language Selection (Hindi, Telugu, Kannada, Tamil)
    document.querySelectorAll('#group-language .lang-card').forEach((card) => {
      card.addEventListener('click', () => {
        playClickSfx();
        document.querySelectorAll('#group-language .lang-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.userPreferences.language = card.dataset.value;
        showToast(`Language set to ${card.dataset.value}`);
      });
    });

    // Genre Selection (Comedy, Romance, Drama, Action) - Multi-select
    document.querySelectorAll('#group-genre .genre-card').forEach((card) => {
      card.addEventListener('click', () => {
        playClickSfx();
        card.classList.toggle('active');
        const genre = card.dataset.value;
        if (card.classList.contains('active')) {
          if (!state.userPreferences.genres.includes(genre)) state.userPreferences.genres.push(genre);
        } else {
          state.userPreferences.genres = state.userPreferences.genres.filter(g => g !== genre);
        }
      });
    });

    // Next button -> Prompts for Location
    const persNextBtn = document.getElementById('btn-personalisation-next');
    const locationModal = document.getElementById('modal-location');
    if (persNextBtn && locationModal) {
      persNextBtn.addEventListener('click', () => {
        playClickSfx();
        locationModal.classList.add('active');
      });
    }

    // SCREEN 3: LOCATION MODAL (Seamless transition whether Allow or Don't Allow)
    const locAllowBtn = document.getElementById('btn-location-allow');
    const locDenyBtn = document.getElementById('btn-location-deny');

    const handleLocationChoice = (allowed) => {
      state.userPreferences.locationAllowed = allowed;
      locationModal.classList.remove('active');
      showToast(allowed ? '📍 Location saved! Fetching trending dramas' : 'Location skipped. Showing top dramas');
      // Direct seamless transition to Video 1
      navigateTo('screen-feed', { reelIndex: 1 });
    };

    if (locAllowBtn) locAllowBtn.addEventListener('click', () => handleLocationChoice(true));
    if (locDenyBtn) locDenyBtn.addEventListener('click', () => handleLocationChoice(false));

    // SCREEN 4: REEL ACTIONS
    // Sound Toggle Button
    const soundToggle = document.getElementById('btn-sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    const soundLabel = document.getElementById('sound-label');

    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
        soundLabel.textContent = state.soundEnabled ? 'Sound ON' : 'Sound OFF';
        showToast(state.soundEnabled ? 'Audio Enabled' : 'Muted');
        if (state.soundEnabled) playDramaticStinger();
      });
    }

    // Reel Likes & Heart animations
    for (let i = 1; i <= 3; i++) {
      const likeBtn = document.getElementById(`like-btn-${i}`);
      if (likeBtn) {
        likeBtn.addEventListener('click', () => {
          likeBtn.classList.toggle('liked');
          playTone(550, 0.1, 'sine', 0.15);
        });
      }
    }

    // "Start Trial • ₹1 Only" CTAs on reel slides
    document.querySelectorAll('[data-action="go-trial"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openTrialScreen();
      });
    });

    // On-screen Next Video / Trial action buttons
    document.querySelectorAll('.btn-next-reel-action').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        advanceReel();
      });
    });

    // SCREEN 5: START TRIAL SCREEN (SCREENSHOT 1)
    const trialBackBtn = document.getElementById('btn-back-to-feed');
    if (trialBackBtn) {
      trialBackBtn.addEventListener('click', () => navigateTo('screen-feed'));
    }

    const trialFaqsBtn = document.getElementById('btn-trial-faqs');
    if (trialFaqsBtn) {
      trialFaqsBtn.addEventListener('click', () => {
        state.subscription.status = 'trial_active';
        navigateTo('screen-settings');
      });
    }

    const trialCardSound = document.getElementById('btn-card-sound');
    if (trialCardSound) {
      trialCardSound.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        showToast(state.soundEnabled ? 'Speaker On' : 'Speaker Muted');
        if (state.soundEnabled) playDramaticStinger();
      });
    }

    // Start Trial CTA (Magenta Button) -> Trial Successful Screen
    const submitTrialBtn = document.getElementById('btn-submit-trial');
    if (submitTrialBtn) {
      submitTrialBtn.addEventListener('click', () => {
        state.subscription.status = 'trial_active';
        navigateTo('screen-trial-success');
      });
    }

    // SCREEN 6: TRIAL SUCCESS -> SETTINGS
    const goToSettingsBtn = document.getElementById('btn-go-to-settings');
    if (goToSettingsBtn) {
      goToSettingsBtn.addEventListener('click', () => {
        navigateTo('screen-settings');
      });
    }

    // SCREEN 7: SUBSCRIPTION SETTINGS (SCREENSHOT 2)
    const settingsBackBtn = document.getElementById('btn-settings-back');
    if (settingsBackBtn) {
      settingsBackBtn.addEventListener('click', () => navigateTo('screen-feed'));
    }

    // Trigger Cancel Flow (Starts the 4-step retention funnel)
    const triggerCancelBtn = document.getElementById('btn-trigger-cancel-flow');
    if (triggerCancelBtn) {
      triggerCancelBtn.addEventListener('click', () => {
        playClickSfx();
        if (state.subscription.status === 'cancelled') {
          showToast('Subscription is already cancelled.');
          return;
        }
        // Start Step 1 of Leave Trial Journey
        navigateTo('screen-leave-step1');
      });
    }

    // Renew Plan Button (When cancelled)
    const renewPlanBtn = document.getElementById('btn-renew-plan');
    if (renewPlanBtn) {
      renewPlanBtn.addEventListener('click', () => {
        state.subscription.status = 'trial_active';
        playSuccessChime();
        showToast('🎉 Premium Plan Reactivated!');
        updateSettingsScreenUI();
      });
    }

    // Contact Us Button
    const contactBtn = document.getElementById('btn-contact-us');
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        showToast('Story TV Support: support@storytv.app');
      });
    }

    // =========================================================================
    // LEAVE TRIAL RETENTION JOURNEY
    // =========================================================================

    // STEP 1: Features you're going to miss out on
    const backStep1 = document.getElementById('back-leave-step1');
    if (backStep1) backStep1.addEventListener('click', () => navigateTo('screen-settings'));

    const step1Keep = document.getElementById('btn-step1-keep');
    if (step1Keep) {
      step1Keep.addEventListener('click', () => {
        showToast('❤️ Welcome back! Your VIP perks remain active.');
        navigateTo('screen-settings');
      });
    }

    const step1Proceed = document.getElementById('btn-step1-proceed');
    if (step1Proceed) {
      step1Proceed.addEventListener('click', () => {
        playClickSfx();
        // Shows Video Interlude 1 before Step 2
        navigateTo('screen-retention-video', { step: 1 });
      });
    }

    // VIDEO INTERLUDE (Reusable)
    const interludeSound = document.getElementById('btn-retention-sound');
    if (interludeSound) {
      interludeSound.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        interludeSound.textContent = state.soundEnabled ? '🔊 Sound ON' : '🔇 Muted';
        if (state.soundEnabled) playDramaticStinger();
      });
    }

    const interludeContinue = document.getElementById('btn-interlude-continue');
    if (interludeContinue) {
      interludeContinue.addEventListener('click', () => {
        showToast('🎬 Continuing your VIP access!');
        navigateTo('screen-settings');
      });
    }

    const interludeProceed = document.getElementById('btn-interlude-proceed');
    if (interludeProceed) {
      interludeProceed.addEventListener('click', () => {
        playClickSfx();
        if (state.interludeStep === 1) {
          // Move to Step 2
          navigateTo('screen-leave-step2');
        } else if (state.interludeStep === 2) {
          // Move to Step 3
          navigateTo('screen-leave-step3');
        } else if (state.interludeStep === 3) {
          // Move to Step 4
          navigateTo('screen-leave-step4');
        }
      });
    }

    // STEP 2: 1 More Day of Trial Extension
    const backStep2 = document.getElementById('back-leave-step2');
    if (backStep2) backStep2.addEventListener('click', () => navigateTo('screen-leave-step1'));

    const step2Claim = document.getElementById('btn-step2-claim');
    if (step2Claim) {
      step2Claim.addEventListener('click', () => {
        state.subscription.status = 'trial_extended';
        playSuccessChime();
        showToast('🎁 +1 Extra Day Added! Autopay updated to 19th Sep.');
        navigateTo('screen-settings');
      });
    }

    const step2Proceed = document.getElementById('btn-step2-proceed');
    if (step2Proceed) {
      step2Proceed.addEventListener('click', () => {
        playClickSfx();
        // Shows Video Interlude 2 before Step 3
        navigateTo('screen-retention-video', { step: 2 });
      });
    }

    // STEP 3: Update Autopay (weekly)
    const backStep3 = document.getElementById('back-leave-step3');
    if (backStep3) backStep3.addEventListener('click', () => navigateTo('screen-leave-step2'));

    const step3Keep = document.getElementById('btn-step3-keep');
    if (step3Keep) {
      step3Keep.addEventListener('click', () => {
        state.subscription.status = 'weekly_active';
        playSuccessChime();
        showToast('🔄 Switched to Weekly Pass (₹49)! Autopay updated.');
        navigateTo('screen-settings');
      });
    }

    const step3Proceed = document.getElementById('btn-step3-proceed');
    if (step3Proceed) {
      step3Proceed.addEventListener('click', () => {
        playClickSfx();
        // Shows Video Interlude 3 before Step 4
        navigateTo('screen-retention-video', { step: 3 });
      });
    }

    // STEP 4: Sachet One-Time Buy (₹10 Show)
    const backStep4 = document.getElementById('back-leave-step4');
    if (backStep4) backStep4.addEventListener('click', () => navigateTo('screen-leave-step3'));

    const step4Buy = document.getElementById('btn-step4-buy');
    if (step4Buy) {
      step4Buy.addEventListener('click', () => {
        state.subscription.status = 'sachet_bought';
        playSuccessChime();
        showToast('🎯 Purchased show for ₹10! Recurring Autopay cancelled.');
        navigateTo('screen-settings');
      });
    }

    const step4Proceed = document.getElementById('btn-step4-proceed');
    if (step4Proceed) {
      step4Proceed.addEventListener('click', () => {
        // User insisted on completing cancellation
        state.subscription.status = 'cancelled';
        playTone(300, 0.3, 'sine', 0.15);
        showToast('Subscription cancelled. You will not be charged.');
        navigateTo('screen-settings');
      });
    }
  }

  // --- INITIALIZATION ---
  window.addEventListener('DOMContentLoaded', () => {
    initClock();
    setupGestures();
    initEventListeners();

    // Initialize procedural drama preview canvases
    setupCanvas('canvas-reel-1', 'romance');
    setupCanvas('canvas-reel-2', 'action');
    setupCanvas('canvas-reel-3', 'suspense');
    setupCanvas('canvas-card-preview', 'card-preview');
    setupCanvas('canvas-retention', 'action');
    // Bind video status for smooth canvas fallback transitions
    document.querySelectorAll('.bg-reel-video').forEach((vid) => {
      vid.addEventListener('playing', () => vid.classList.add('playing'));
      vid.addEventListener('pause', () => vid.classList.remove('playing'));
      vid.addEventListener('error', () => vid.classList.remove('playing'));
    });

    startCanvasLoop();
  });

})();
