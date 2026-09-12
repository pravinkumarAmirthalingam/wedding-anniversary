/* ═══════════════════════════════════════════════════════════════
   MEENAKSHI TEMPLE WEDDING ANNIVERSARY — MAIN APPLICATION JS
   Phase 1: Loading Screen, Three.js Particle Atmosphere, GSAP init
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── DOM References ─────────────────────────────────────── */
  const loadingScreen   = document.getElementById('loading-screen');
  const progressBar     = document.querySelector('.loader-progress-bar');
  const mainContent     = document.getElementById('main-content');
  const particleCanvas  = document.getElementById('particle-canvas');

  /* ═══════════════════════════════════════════════════════════
     1. LOADING SCREEN CONTROLLER
     ═══════════════════════════════════════════════════════════ */
  const Loader = {
    progress: 0,
    minDuration: 2500,   // minimum ms to show loader (for aesthetics)
    startTime: Date.now(),

    update(pct) {
      this.progress = Math.min(pct, 100);
      if (progressBar) {
        progressBar.style.width = this.progress + '%';
      }
    },

    finish() {
      this.update(100);
      const elapsed = Date.now() - this.startTime;
      const remaining = Math.max(0, this.minDuration - elapsed);

      setTimeout(() => {
        // Fade out loader
        loadingScreen.classList.add('fade-out');
        document.body.classList.remove('is-loading');

        // Reveal main content
        setTimeout(() => {
          mainContent.classList.add('visible');
          particleCanvas.classList.add('visible');
          // Initialize scroll animations after reveal
          initScrollAnimations();
        }, 400);

        // Remove loader from DOM after transition
        setTimeout(() => {
          loadingScreen.remove();
        }, 1200);
      }, remaining);
    }
  };

  /* Simulate loading progress while real assets load */
  function simulateProgress() {
    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress += Math.random() * 12 + 3;
      if (fakeProgress >= 90) {
        clearInterval(interval);
        fakeProgress = 90;
      }
      Loader.update(fakeProgress);
    }, 200);
    return interval;
  }

  const progressInterval = simulateProgress();

  /* Wait for fonts + images to be ready, then finish */
  window.addEventListener('load', () => {
    clearInterval(progressInterval);
    // Wait for fonts specifically
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        Loader.finish();
      });
    } else {
      Loader.finish();
    }
  });


  /* ═══════════════════════════════════════════════════════════
     2. THREE.JS — SUBTLE PARTICLE / ATMOSPHERE LAYER
     Uses floating gold particles that drift upward like
     diya flames / fireflies in a temple courtyard.
     ═══════════════════════════════════════════════════════════ */
  function initParticleAtmosphere() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded — skipping particle layer.');
      return;
    }

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      canvas: particleCanvas,
      alpha: true,
      antialias: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* Create particles */
    const PARTICLE_COUNT = 120;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = [];
    const opacities = new Float32Array(PARTICLE_COUNT);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 60;   // x
      positions[i3 + 1] = (Math.random() - 0.5) * 60;   // y
      positions[i3 + 2] = (Math.random() - 0.5) * 20;   // z

      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: Math.random() * 0.015 + 0.005,               // drift upward
        z: (Math.random() - 0.5) * 0.005
      });

      opacities[i] = Math.random() * 0.5 + 0.1;
      sizes[i] = Math.random() * 2.5 + 0.8;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));

    /* Custom shader for soft glow particles */
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xD4AF37) },  // gold
        uPixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        attribute float aOpacity;
        attribute float aSize;
        varying float vOpacity;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vOpacity = aOpacity * (0.5 + 0.5 * sin(uTime * 1.5 + position.x * 0.5));
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (20.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        uniform vec3 uColor;

        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * vOpacity;
          gl_FragColor = vec4(uColor, alpha * 0.35);
        }
      `
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    /* Scroll-linked vertical offset */
    let scrollY = 0;
    window.addEventListener('scroll', () => {
      scrollY = window.pageYOffset;
    }, { passive: true });

    /* Resize handler */
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    });

    /* Animation loop */
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;

      const posAttr = geometry.attributes.position;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        posAttr.array[i3]     += velocities[i].x;
        posAttr.array[i3 + 1] += velocities[i].y;
        posAttr.array[i3 + 2] += velocities[i].z;

        // Reset particle if it drifts too far up
        if (posAttr.array[i3 + 1] > 35) {
          posAttr.array[i3 + 1] = -35;
          posAttr.array[i3]     = (Math.random() - 0.5) * 60;
        }
      }
      posAttr.needsUpdate = true;

      // Subtle parallax with scroll
      particles.position.y = scrollY * 0.008;

      renderer.render(scene, camera);
    }
    animate();
  }

  // Start particle system right away (it renders behind the loader)
  initParticleAtmosphere();


  /* ═══════════════════════════════════════════════════════════
     X. MILESTONES RENDERER
     ═══════════════════════════════════════════════════════════ */
  function renderMilestones() {
    if (typeof CONTENT === 'undefined' || !CONTENT.milestones) return;
    const container = document.getElementById('timeline-cards');
    if (!container) return;

    // Helper to get SVG icon based on id
    const getIcon = (id) => {
      const svgs = {
        'temple': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3L4 9v12h16V9l-8-6zm0 2.5l5 3.75V20H7V9.25L12 5.5zM10 14h4v6h-4v-6z"/></svg>`,
        'rings': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>`,
        'home': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
        'family': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        'diya': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3s-3 4.5-3 8c0 1.66 1.34 3 3 3s3-1.34 3-3c0-3.5-3-8-3-8z"/><path d="M4 14c0 3 4 5 8 5s8-2 8-5H4z"/></svg>`,
        'trophy': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 21h8M12 17v4M7 4h10M6 4h12a2 2 0 0 1 2 2v2a8 8 0 0 1-16 0V6a2 2 0 0 1 2-2z"/></svg>`
      };
      return svgs[id] || svgs['diya']; // fallback
    };

    let html = '';
    CONTENT.milestones.forEach((item) => {
      html += `
        <div class="milestone-card">
          <div class="milestone-dot" aria-hidden="true"></div>
          <div class="milestone-connector" aria-hidden="true"></div>
          <div class="milestone-card-body">
            <span class="milestone-year">${item.year}</span>
            <div class="milestone-title-row">
              <div class="milestone-icon">${getIcon(item.icon)}</div>
              <h3 class="milestone-title">${item.title}</h3>
            </div>
            <p class="milestone-caption">${item.caption}</p>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════════════
     3. GSAP + SCROLLTRIGGER — SCROLL REVEAL ANIMATIONS
     Called after loading screen fades out.
     ═══════════════════════════════════════════════════════════ */
  function initScrollAnimations() {
    renderMilestones(); // Ensure DOM is populated before GSAP measures it

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP/ScrollTrigger not loaded — skipping scroll anims.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* ── Populate hero text from content.js ── */
    if (typeof CONTENT !== 'undefined') {
      const dadEl   = document.getElementById('hero-dad-name');
      const momEl   = document.getElementById('hero-mom-name');
      const yearsEl = document.getElementById('hero-years');
      if (dadEl)   dadEl.textContent = CONTENT.dadName;
      if (momEl)   momEl.textContent = CONTENT.momName;
      if (yearsEl) yearsEl.textContent = CONTENT.yearsTogether;
    }

    /* ── Hero: Staggered fade-in entrance ── */
    const heroAnims = document.querySelectorAll('.hero-anim');
    if (heroAnims.length) {
      heroAnims.forEach(el => {
        const delay = parseFloat(el.dataset.delay) * 0.25 + 0.3;
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: delay,
          ease: 'power3.out'
        });
      });
    }

    /* ── Hero: Parallax on scroll (image moves, content fades) ── */
    const heroBg = document.querySelector('.hero-bg-img');
    const heroContent = document.querySelector('.hero-content');
    const heroScrollCue = document.querySelector('.hero-scroll-cue');

    if (heroBg && heroContent) {
      gsap.to(heroBg, {
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: 120,
        scale: 1.08,
        ease: 'none'
      });

      gsap.to(heroContent, {
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: '60% top',
          scrub: true
        },
        y: -60,
        opacity: 0.2,
        ease: 'none'
      });

      // Fade out scroll cue
      if (heroScrollCue) {
        gsap.to(heroScrollCue, {
          scrollTrigger: {
            trigger: '#hero',
            start: '10% top',
            end: '30% top',
            scrub: true
          },
          opacity: 0,
          y: -20,
          ease: 'none'
        });
      }
    }

    /* ── Blessing Arch: Populate from content.js + scale-in reveal ── */
    if (typeof CONTENT !== 'undefined') {
      const bHead = document.getElementById('blessing-heading');
      const bText = document.getElementById('blessing-text');
      const bSub  = document.getElementById('blessing-subtext');
      if (bHead && CONTENT.blessingHeading) bHead.textContent = CONTENT.blessingHeading;
      if (bText && CONTENT.blessingText)    bText.textContent = CONTENT.blessingText;
      if (bSub  && CONTENT.blessingSubtext) bSub.textContent  = CONTENT.blessingSubtext;
    }

    const blessingEl = document.querySelector('.reveal-blessing');
    if (blessingEl) {
      gsap.to(blessingEl, {
        scrollTrigger: {
          trigger: blessingEl,
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    }

    /* ── Ceremony Caption: Populate from content.js ── */
    if (typeof CONTENT !== 'undefined') {
      const cerCap = document.getElementById('ceremony-caption');
      if (cerCap && CONTENT.ceremonyCaption) {
        cerCap.textContent = CONTENT.ceremonyCaption.replace('[yearsTogether]', CONTENT.yearsTogether || '');
      }
    }

    /* ── Story Narrative: Populate from content.js ── */
    if (typeof CONTENT !== 'undefined' && CONTENT.storyParagraphs) {
      const storyContainer = document.getElementById('story-paragraphs');
      if (storyContainer) {
        // Skip the first paragraph (used in the intro panel)
        const paragraphs = CONTENT.storyParagraphs.slice(1);
        storyContainer.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
      }
    }

    /* ── Phase 8: Story Photo + Narrative Reveal ── */
    const storyPhotoSec = document.querySelector('.story-photo-section');
    if (storyPhotoSec) {
      const paras = storyPhotoSec.querySelector('.story-paragraphs');
      const frame = storyPhotoSec.querySelector('.reveal-frame');
      
      const stTl = gsap.timeline({
        scrollTrigger: {
          trigger: storyPhotoSec,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
      
      if (paras) {
        stTl.from(paras, { opacity: 0, y: 30, duration: 1, ease: 'power2.out' });
      }
      if (frame) {
        stTl.from(frame, { opacity: 0, scale: 0.9, duration: 1.2, ease: 'back.out(1.2)' }, '-=0.5');
      }
    }

    /* ── Celebration Intro: Populate from content.js + GSAP timeline ── */
    if (typeof CONTENT !== 'undefined') {
      const celYears = document.getElementById('cel-years');
      const celDad   = document.getElementById('cel-dad');
      const celMom   = document.getElementById('cel-mom');
      const celDate  = document.getElementById('cel-date');
      if (celYears) celYears.textContent = CONTENT.yearsTogether;
      if (celDad)   celDad.textContent   = CONTENT.dadName;
      if (celMom)   celMom.textContent   = CONTENT.momName;
      if (celDate)  celDate.textContent  = CONTENT.weddingDate;
    }

    const celItems = document.querySelectorAll('.cel-item');
    if (celItems.length) {
      const celTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#celebration',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      // Sort by data-cel-delay and stagger
      const sorted = Array.from(celItems).sort((a, b) =>
        parseFloat(a.dataset.celDelay) - parseFloat(b.dataset.celDelay)
      );

      sorted.forEach((el, i) => {
        celTl.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out'
        }, i * 0.2); // 0.2s stagger between items
      });
    }

    /* ── Milestones: Individual card scroll reveal ── */
    gsap.utils.toArray('.milestone-card').forEach(card => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    /* ── Phase 9: Gallery Populate ── */
    if (typeof CONTENT !== 'undefined' && CONTENT.galleryImages) {
      const gHeading = document.getElementById('gallery-heading');
      if (gHeading) gHeading.textContent = CONTENT.galleryHeading || "Moments in Gold";

      const gCaption = document.getElementById('gallery-caption');
      if (gCaption) {
        gCaption.textContent = `செப்டம்பர் 12, 2004 — அனைத்தும் தொடங்கிய அந்த புனித நாள்.`;
      }

      const gGrid = document.getElementById('gallery-grid');
      if (gGrid) {
        gGrid.innerHTML = CONTENT.galleryImages.map(img => `
          <div class="gallery-item reveal-child">
            <img src="${img.src}" alt="${img.caption}" class="gallery-item-img" loading="lazy" />
            <div class="gallery-item-caption">${img.caption}</div>
          </div>
        `).join('');
      }
    }

    /* ── Phase 10: Countdown Animation ── */
    if (typeof CONTENT !== 'undefined') {
      const counterEl = document.getElementById('years-counter');
      if (counterEl) {
        const targetYears = new Date().getFullYear() - 2004;
        const counterObj = { val: 0 };
        
        gsap.to(counterObj, {
          scrollTrigger: {
            trigger: '.section--countdown',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          val: targetYears,
          duration: 2.5,
          ease: 'power1.out',
          onUpdate: () => {
            counterEl.textContent = Math.floor(counterObj.val);
          }
        });
      }
    }

    /* ── Phase 11: Family Photo Gallery ── */
    if (typeof CONTENT !== 'undefined' && CONTENT.familyPhotos) {
      const famHeading = document.getElementById('family-gallery-heading');
      if (famHeading) famHeading.textContent = CONTENT.familyPhotosHeading || "Gallery";

      const polaroidCollage = document.getElementById('polaroid-collage');
      if (polaroidCollage) {
        // Duplicate the photos for a seamless infinite marquee
        const marqueePhotos = [...CONTENT.familyPhotos, ...CONTENT.familyPhotos];
        
        polaroidCollage.innerHTML = marqueePhotos.map((img, i) => `
          <div class="polaroid polaroid-item">
            <img src="${img.src}" alt="Family Photo ${i+1}" class="polaroid-img" loading="lazy" />
          </div>
        `).join('');

        const polaroids = polaroidCollage.querySelectorAll('.polaroid-item');

        // Setup polaroids - keep random rotation for aesthetic, make them visible
        gsap.set(polaroids, {
          opacity: 1,
          scale: 1,
          rotation: () => gsap.utils.random(-10, 10)
        });

        // Calculate exact distance to scroll: half of total scroll width (since it's duplicated)
        // We use a small timeout to let the DOM calculate widths properly after images start loading
        setTimeout(() => {
          const totalWidth = polaroidCollage.scrollWidth;
          const halfWidth = totalWidth / 2;
          
          const marqueeTween = gsap.to(polaroidCollage, {
            x: -halfWidth,
            ease: "none",
            duration: 20, // Adjust this to make it faster/slower
            repeat: -1
          });

          // Pause on hover
          polaroidCollage.addEventListener('mouseenter', () => marqueeTween.pause());
          polaroidCollage.addEventListener('mouseleave', () => marqueeTween.play());
        }, 100);
      }
    }

    /* ── Phase 12: Closing Scene ── */
    if (typeof CONTENT !== 'undefined') {
      const closingMsg = document.getElementById('closing-message');
      if (closingMsg) {
        const kids = CONTENT.kidsNames ? CONTENT.kidsNames.join(' & ') : '';
        const years = new Date().getFullYear() - 2004;
        closingMsg.innerHTML = `இனிய ${years} ஆம் ஆண்டு திருமண நாள் வாழ்த்துக்கள், அம்மா & அப்பா!<br>இந்த அன்பு என்றென்றும் தொடரட்டும்.<br><span style="font-family: var(--font-script); font-size: 1.4em; color: var(--gold-dark); margin-top: 16px; display: inline-block;">அன்புடன், ${kids}</span>`;
      }
    }

    /* ── Generic reveal for all sections ── */
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
      });
    });

    // Staggered children reveal
    gsap.utils.toArray('.reveal-stagger').forEach(container => {
      const children = container.querySelectorAll('.reveal-child');
      gsap.from(children, {
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
      });
    });

    console.log('✨ Scroll animations initialised');
  }


  /* ═══════════════════════════════════════════════════════════
     4. AUDIO CONTROLLER (Background Temple Music)
     ——————————————————————————————————————————————————————————
     • Autoplays MUTED on load (browsers allow muted autoplay)
     • Toggle unmutes/mutes without pausing — audio continues
       in the background so unmuting resumes seamlessly
     • Smooth volume fade-in / fade-out on toggle
     ═══════════════════════════════════════════════════════════ */
  function initAudio() {
    const btn   = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    if (!btn || !audio) return;

    const TARGET_VOLUME = 0.35;
    const FADE_DURATION = 600; // ms

    // Attempt muted autoplay on load
    audio.muted  = true;
    audio.volume = 0;
    audio.play().catch(() => {
      // Autoplay blocked even muted — will start on first toggle
      console.log('Autoplay blocked — music will start on first interaction.');
    });

    let isMuted = true;

    /* Smooth volume ramp */
    function fadeVolume(from, to, duration, callback) {
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        audio.volume = from + (to - from) * eased;
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          audio.volume = to;
          if (callback) callback();
        }
      }
      requestAnimationFrame(step);
    }

    btn.addEventListener('click', () => {
      if (isMuted) {
        /* ── UNMUTE ── */
        // If audio hasn't started yet (autoplay was blocked), start it
        if (audio.paused) {
          audio.muted = false;
          audio.volume = 0;
          audio.play().catch(() => {});
        } else {
          audio.muted = false;
        }
        fadeVolume(0, TARGET_VOLUME, FADE_DURATION);

        btn.classList.remove('is-muted');
        btn.setAttribute('aria-label', 'Mute music');
        btn.title = 'Mute background music';
      } else {
        /* ── MUTE ── */
        fadeVolume(audio.volume, 0, FADE_DURATION, () => {
          audio.muted = true;
        });

        btn.classList.add('is-muted');
        btn.setAttribute('aria-label', 'Unmute music');
        btn.title = 'Unmute background music';
      }
      isMuted = !isMuted;
    });

    console.log('🎵 Audio controller initialised (muted autoplay)');
  }

  // Init audio after DOM + assets ready
  window.addEventListener('load', () => {
    setTimeout(initAudio, 200);
  });

})();
