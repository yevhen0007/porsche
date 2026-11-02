/* ===================================================================
   PORSCHE 911 CARRERA S — MASTER LUXURY SCRIPT
   UI/UX Pro Max Architecture · Framer Motion Physics · Original Audio
   =================================================================== */

(function () {
    'use strict';

    /* ===================================================================
       1. SMOOTH SCROLL (LENIS INTEGRATION & SCROLLTRIGGER)
       =================================================================== */
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            smoothTouch: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    /* ===================================================================
       2. SITE HEADER SCROLL STATE
       =================================================================== */
    const siteHeader = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            siteHeader?.classList.add('scrolled');
        } else {
            siteHeader?.classList.remove('scrolled');
        }
    }, { passive: true });


    /* ===================================================================
       4. SECTION 01: 1ST ANIMATION SCROLLING EXPERIENCE
       (299-Frame Canvas Scrubbing · Pure Car Visual · Zero Obstruction)
       =================================================================== */
    const heroSection = document.getElementById('hero');
    const heroCanvas = document.getElementById('hero-scroll-canvas');
    const heroPrompt = document.querySelector('.hero-scroll-prompt');
    const heroOverlay = document.getElementById('hero-editorial-overlay');
    const editorialTopLeft = document.getElementById('editorial-top-left');
    const editorialTopRight = document.getElementById('editorial-top-right');
    const editorialBottomCenter = document.getElementById('editorial-bottom-center');
    const editorialBottomRight = document.getElementById('editorial-bottom-right');

    if (heroSection && heroCanvas) {
        const heroCtx = heroCanvas.getContext('2d');
        const heroFrameCount = 299;
        const heroFrames = new Array(heroFrameCount);
        let heroFramesLoaded = 0;
        let currentHeroFrameIdx = 0;

        function resizeHeroCanvas() {
            const dpr = window.devicePixelRatio || 1;
            const clientW = heroCanvas.clientWidth || 1180;
            // Native Full HD 1080p target buffer (at least 1920x1080 for razor-sharp visual clarity)
            const targetW = Math.max(1920, Math.round(clientW * dpr));
            const targetH = Math.round(targetW * (1080 / 1920));
            heroCanvas.width = targetW;
            heroCanvas.height = targetH;
            heroCtx.imageSmoothingEnabled = true;
            heroCtx.imageSmoothingQuality = 'high';
            drawHeroFrame(currentHeroFrameIdx);
        }
        window.addEventListener('resize', resizeHeroCanvas);

        function drawHeroFrame(idx) {
            const img = heroFrames[idx];
            if (!img || !img.complete || !img.naturalWidth) return;

            const cw = heroCanvas.width;
            const ch = heroCanvas.height;
            heroCtx.clearRect(0, 0, cw, ch);
            heroCtx.imageSmoothingEnabled = true;
            heroCtx.imageSmoothingQuality = 'high';

            const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
            const w = img.naturalWidth * scale;
            const h = img.naturalHeight * scale;
            const x = (cw - w) / 2;
            const y = (ch - h) / 2;

            heroCtx.drawImage(img, x, y, w, h);
        }

        // Preload 299 high-res frames (No-Watermark Asset)
        for (let i = 0; i < heroFrameCount; i++) {
            const img = new Image();
            const numStr = String(i + 1).padStart(3, '0');
            img.src = `1st animation vid no watermark frames/ezgif-frame-${numStr}.jpg`;
            img.onload = () => {
                heroFramesLoaded++;
                if (heroFramesLoaded === 1) {
                    resizeHeroCanvas();
                }
            };
            heroFrames[i] = img;
        }

        function onHeroScroll() {
            const rect = heroSection.getBoundingClientRect();
            const scrollDistance = heroSection.offsetHeight - window.innerHeight;
            if (scrollDistance <= 0) return;

            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));

            const frameIdx = Math.min(heroFrameCount - 1, Math.floor(progress * heroFrameCount));
            if (frameIdx !== currentHeroFrameIdx) {
                currentHeroFrameIdx = frameIdx;
                drawHeroFrame(frameIdx);
            }

            // Editorial Overlay Smooth Fade-Out (Between scroll progress 0.00 and 0.16)
            if (heroOverlay) {
                if (progress <= 0.003) {
                    heroOverlay.style.opacity = '1';
                    heroOverlay.style.visibility = 'visible';
                    if (editorialTopLeft) editorialTopLeft.style.transform = 'translate3d(0, 0, 0)';
                    if (editorialTopRight) editorialTopRight.style.transform = 'translate3d(0, 0, 0)';
                    if (editorialBottomCenter) editorialBottomCenter.style.transform = 'translate3d(-50%, 0, 0)';
                    if (editorialBottomRight) editorialBottomRight.style.transform = 'translate3d(0, 0, 0)';
                } else if (progress < 0.16) {
                    const fade = 1 - (progress / 0.16);
                    const easedFade = fade * fade; // Smooth cubic-like ease out
                    heroOverlay.style.opacity = Math.max(0, easedFade).toFixed(3);
                    heroOverlay.style.visibility = 'visible';

                    const shift = progress / 0.16;
                    if (editorialTopLeft) editorialTopLeft.style.transform = `translate3d(0, -${shift * 24}px, 0)`;
                    if (editorialTopRight) editorialTopRight.style.transform = `translate3d(0, -${shift * 20}px, 0)`;
                    if (editorialBottomCenter) editorialBottomCenter.style.transform = `translate3d(-50%, ${shift * 22}px, 0)`;
                    if (editorialBottomRight) editorialBottomRight.style.transform = `translate3d(0, ${shift * 18}px, 0)`;
                } else {
                    heroOverlay.style.opacity = '0';
                    heroOverlay.style.visibility = 'hidden';
                }
            }

            // Fade out scroll prompt once scrolling begins
            if (heroPrompt) {
                if (progress > 0.04) {
                    heroPrompt.style.opacity = '0';
                    heroPrompt.style.pointerEvents = 'none';
                } else {
                    heroPrompt.style.opacity = '1';
                }
            }
        }

        window.addEventListener('scroll', onHeroScroll, { passive: true });
        onHeroScroll();
    }


    /* ===================================================================
       5. SECTION 02: SEAMLESS 0-CUT REPAIRED LOOPING ANIMATION
       (Ping-Pong Bidirectional Playback · Zero Discontinuity)
       =================================================================== */
    const loopCanvas = document.getElementById('loop-canvas');
    if (loopCanvas) {
        const loopCtx = loopCanvas.getContext('2d');
        const loopFrameCount = 179;
        const loopFrames = new Array(loopFrameCount);
        let loopFramesLoaded = 0;
        let currentLoopIdx = 0;
        let loopDirection = 1;
        let lastFrameTime = 0;
        const frameInterval = 1000 / 30; // 30 FPS

        // Preload frames
        for (let i = 0; i < loopFrameCount; i++) {
            const img = new Image();
            const numStr = String(i + 1).padStart(3, '0');
            img.src = `Porsche looping/ezgif-frame-${numStr}.jpg`;
            img.onload = () => {
                loopFramesLoaded++;
            };
            loopFrames[i] = img;
        }

        function renderLoopFrame(now) {
            if (loopFramesLoaded > 10) {
                if (now - lastFrameTime > frameInterval) {
                    lastFrameTime = now;
                    const img = loopFrames[currentLoopIdx];
                    if (img && img.complete) {
                        const cw = loopCanvas.width;
                        const ch = loopCanvas.height;
                        loopCtx.clearRect(0, 0, cw, ch);

                        // Scale slightly to remove the Gemini watermark in bottom right
                        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * 1.06;
                        const w = img.naturalWidth * scale;
                        const h = img.naturalHeight * scale;
                        const x = (cw - w) / 2;
                        const y = (ch - h) / 2;

                        loopCtx.drawImage(img, x, y, w, h);
                    }

                    // Seamless Ping-Pong (1 -> 179 -> 1)
                    currentLoopIdx += loopDirection;
                    if (currentLoopIdx >= loopFrameCount - 1) {
                        loopDirection = -1;
                    } else if (currentLoopIdx <= 0) {
                        loopDirection = 1;
                    }
                }
            }
            requestAnimationFrame(renderLoopFrame);
        }
        requestAnimationFrame(renderLoopFrame);
    }


    /* ===================================================================
       6. SECTION 04: PORSCHE 3D STUDIO & REALISTIC AUDIO SYSTEM
       (Startup Once -> Seamless Continuous Idle -> Dynamic Revving)
       =================================================================== */
    const threeCanvas = document.getElementById('three-canvas');
    const glbLoader = document.getElementById('glb-loader');
    const hudRpm = document.getElementById('hud-rpm');
    const hudStatus = document.getElementById('hud-status');
    const hudLights = document.getElementById('hud-lights');
    const tachoArc = document.getElementById('tacho-arc');
    const btnStart = document.getElementById('btn-start');
    const btnStartLabel = document.getElementById('btn-start-label');
    const btnAccelerate = document.getElementById('btn-accelerate');
    const btnReset = document.getElementById('btn-reset');
    const colorSwatches = document.querySelectorAll('.swatch-btn');
    const soundStatusText = document.getElementById('sound-status-text');

    // ===================================================================
    // ORIGINAL PROCEDURAL FLAT-SIX AUDIO ENGINE (WEB AUDIO API)
    // Realistic Boxer Pulse · Dynamic RPM Pitch · Turbo Spool · Overrun Pops
    // ===================================================================
    class PorscheAudioEngine {
        constructor() {
            this.ctx = null;
            this.isStarted = false;
            this.rpm = 0;
            this.targetRpm = 0;
            this.throttle = false;

            // Audio Nodes
            this.masterGain = null;
            this.idleOsc1 = null;
            this.idleOsc2 = null;
            this.subOsc = null;
            this.engineFilter = null;
            this.turboGain = null;
            this.turboFilter = null;
            this.overrunCooldown = 0;

            this._animFrame = null;
        }

        init() {
            if (this.ctx) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            // Engine Body Lowpass Filter
            this.engineFilter = this.ctx.createBiquadFilter();
            this.engineFilter.type = 'lowpass';
            this.engineFilter.frequency.setValueAtTime(250, this.ctx.currentTime);
            this.engineFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);
            this.engineFilter.connect(this.masterGain);

            // Flat-Six Combustion Pulse Oscillators (3 firing events / rev)
            this.idleOsc1 = this.ctx.createOscillator();
            this.idleOsc1.type = 'sawtooth';
            this.idleOsc1.frequency.setValueAtTime(40, this.ctx.currentTime);

            this.idleOsc2 = this.ctx.createOscillator();
            this.idleOsc2.type = 'pulse' in this.idleOsc2 ? 'pulse' : 'square';
            this.idleOsc2.frequency.setValueAtTime(40.5, this.ctx.currentTime);

            this.subOsc = this.ctx.createOscillator();
            this.subOsc.type = 'sine';
            this.subOsc.frequency.setValueAtTime(20, this.ctx.currentTime);

            const oscGain = this.ctx.createGain();
            oscGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

            this.idleOsc1.connect(this.engineFilter);
            this.idleOsc2.connect(this.engineFilter);
            this.subOsc.connect(oscGain);
            oscGain.connect(this.masterGain);

            this.idleOsc1.start();
            this.idleOsc2.start();
            this.subOsc.start();

            // Turbocharger Spool Noise
            this._setupTurbo();

            // Dynamics Loop
            this._loop();
        }

        _setupTurbo() {
            const bufferSize = this.ctx.sampleRate * 2;
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            this.turboFilter = this.ctx.createBiquadFilter();
            this.turboFilter.type = 'bandpass';
            this.turboFilter.frequency.setValueAtTime(2200, this.ctx.currentTime);
            this.turboFilter.Q.setValueAtTime(6.0, this.ctx.currentTime);

            this.turboGain = this.ctx.createGain();
            this.turboGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

            whiteNoise.connect(this.turboFilter);
            this.turboFilter.connect(this.turboGain);
            this.turboGain.connect(this.masterGain);

            whiteNoise.start();
        }

        startEngine() {
            if (!this.ctx) this.init();
            if (this.ctx.state === 'suspended') this.ctx.resume();

            this.isStarted = true;
            this.targetRpm = 850;

            // Starter motor crank burst
            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(0.05, now);
            this.masterGain.gain.exponentialRampToValueAtTime(0.38, now + 0.6);
        }

        stopEngine() {
            this.isStarted = false;
            this.targetRpm = 0;
            if (this.ctx && this.masterGain) {
                const now = this.ctx.currentTime;
                this.masterGain.gain.cancelScheduledValues(now);
                this.masterGain.gain.linearRampToValueAtTime(0.0, now + 0.8);
            }
        }

        setThrottle(isHolding) {
            if (!this.isStarted) return;
            const prevThrottle = this.throttle;
            this.throttle = isHolding;

            if (isHolding) {
                this.targetRpm = 7400; // Redline surge
            } else {
                this.targetRpm = 850;
                // Trigger overrun exhaust pop / crackle ("phat phat") if releasing from high RPM
                if (prevThrottle && this.rpm > 3000) {
                    this._triggerOverrunPops();
                }
            }
        }

        _triggerOverrunPops() {
            if (!this.ctx) return;
            const popCount = 3 + Math.floor(Math.random() * 4);
            for (let i = 0; i < popCount; i++) {
                const delay = i * (0.06 + Math.random() * 0.05);
                setTimeout(() => {
                    if (!this.ctx || !this.isStarted) return;
                    const popOsc = this.ctx.createOscillator();
                    const popGain = this.ctx.createGain();
                    popOsc.type = 'triangle';
                    popOsc.frequency.setValueAtTime(80 + Math.random() * 70, this.ctx.currentTime);
                    popOsc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.04);

                    popGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
                    popGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

                    popOsc.connect(popGain);
                    popGain.connect(this.masterGain);
                    popOsc.start();
                    popOsc.stop(this.ctx.currentTime + 0.05);
                }, delay * 1000);
            }
        }

        _loop() {
            const lerpFactor = this.throttle ? 0.08 : 0.05;
            this.rpm += (this.targetRpm - this.rpm) * lerpFactor;

            if (this.isStarted && this.ctx) {
                const now = this.ctx.currentTime;
                // 3 pulses per revolution for Boxer 6
                const fundamental = Math.max(20, (this.rpm / 60) * 3);
                this.idleOsc1.frequency.setTargetAtTime(fundamental, now, 0.04);
                this.idleOsc2.frequency.setTargetAtTime(fundamental * 1.01, now, 0.04);
                this.subOsc.frequency.setTargetAtTime(fundamental * 0.5, now, 0.04);

                // Filter opening with revs
                const cutoff = 250 + (this.rpm / 7500) * 2600;
                this.engineFilter.frequency.setTargetAtTime(cutoff, now, 0.05);

                // Turbo Spool sound
                if (this.turboGain && this.turboFilter) {
                    const turboVol = Math.max(0, (this.rpm - 2000) / 5500) * 0.14;
                    const turboFreq = 2200 + (this.rpm / 7500) * 2400;
                    this.turboGain.gain.setTargetAtTime(turboVol, now, 0.06);
                    this.turboFilter.frequency.setTargetAtTime(turboFreq, now, 0.06);
                }
            }

            this._animFrame = requestAnimationFrame(() => this._loop());
        }
    }

    const audioEngine = new PorscheAudioEngine();

    let renderer, scene, camera, controls;
    let carModel = null;
    let bodyPaintMaterial = null;
    let rearWheelsPivot = null;
    let wheelRotationSpeed = 0;

    // Interactive Headlights (Light Blue) & Taillights (Shiny Red)
    const headlightMaterials = [];
    const taillightMaterials = [];
    let spotLeft = null;
    let spotRight = null;
    let rearPointLight = null;
    let leftHeadlightSprite = null;
    let rightHeadlightSprite = null;
    let taillightSprite = null;
    let carLightsOn = false;
    let currentLightIntensity = 0;

    // Helper: Dynamic Radial Lens Flare Glow Texture Generator
    function makeGlowTexture(coreColor, edgeColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.2, coreColor);
        grad.addColorStop(0.6, edgeColor);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(canvas);
    }

    if (threeCanvas && typeof THREE !== 'undefined') {
        scene = new THREE.Scene();
        // Warm Zen Shades showroom floor
        scene.background = new THREE.Color('#E9E4D8');

        camera = new THREE.PerspectiveCamera(38, threeCanvas.clientWidth / threeCanvas.clientHeight, 0.1, 100);
        camera.position.set(4.5, 1.8, 5.2);

        renderer = new THREE.WebGLRenderer({
            canvas: threeCanvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(threeCanvas.clientWidth, threeCanvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // Standard balanced tone mapping exposure
        renderer.toneMappingExposure = 1.0;

        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, threeCanvas);
            controls.enableDamping = true;
            controls.dampingFactor = 0.06;
            controls.maxPolarAngle = Math.PI / 2 - 0.04;
            controls.minDistance = 2.8;
            controls.maxDistance = 8.5;
            controls.target.set(0, 0.2, 0);
        }

        // Clean Showroom Lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd0cbbe, 1.0);
        scene.add(hemiLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.bias = -0.0005;
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xf4efe4, 0.7);
        fillLight.position.set(-6, 4, -4);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
        rimLight.position.set(0, 8, -6);
        scene.add(rimLight);

        // Ground Shadow Plane
        const floorGeo = new THREE.PlaneGeometry(30, 30);
        const floorMat = new THREE.ShadowMaterial({ opacity: 0.14 });
        const floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.y = -0.01;
        floorMesh.receiveShadow = true;
        scene.add(floorMesh);

        // Load Porsche 911 GLB Model
        if (typeof THREE.GLTFLoader !== 'undefined') {
            const loader = new THREE.GLTFLoader();
            loader.load(
                'Porsche 911 glb.glb',
                (gltf) => {
                    carModel = gltf.scene;

                    const bbox = new THREE.Box3().setFromObject(carModel);
                    const center = bbox.getCenter(new THREE.Vector3());
                    carModel.position.x += -center.x;
                    carModel.position.y += -bbox.min.y;
                    carModel.position.z += -center.z;

                    carModel.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;

                            if (child.material) {
                                const matName = (child.material.name || '').toLowerCase();
                                const nodeName = (child.name || '').toLowerCase();

                                if (matName === 'paint') {
                                    bodyPaintMaterial = child.material;
                                }

                                // 1. Outer Headlight Glass Lenses: crystal-clear so lights inside shine brilliantly!
                                if (nodeName.includes('bumper_front.007') || nodeName.includes('bumper_front.003_1') || matName === 'glass') {
                                    child.material = child.material.clone();
                                    child.material.transparent = true;
                                    child.material.opacity = 0.18;
                                    child.material.roughness = 0.05;
                                    child.material.depthWrite = false;
                                }

                                // 2. Headlight Projectors & Bulbs (bumper_front.004_0, bumper_front.004_1, bumper_front.001_2, mat 'lights')
                                if (nodeName.includes('bumper_front.004_0') || nodeName.includes('bumper_front.004_1') || nodeName.includes('bumper_front.001_2') || matName === 'lights') {
                                    child.material = new THREE.MeshStandardMaterial({
                                        color: new THREE.Color(0x1e242c),
                                        emissive: new THREE.Color(0x000000),
                                        emissiveIntensity: 0,
                                        roughness: 0.1,
                                        metalness: 0.1,
                                        toneMapped: false // Maximum uncompressed radiant Light Blue!
                                    });
                                    headlightMaterials.push(child.material);
                                }

                                // 3. Rear Continuous Taillight Bar (boot.003_0): Replace with pure shiny red glowing material (no black emissiveMap!)
                                if (nodeName.includes('boot.003') || nodeName === 'boot.003_0') {
                                    child.material = new THREE.MeshStandardMaterial({
                                        color: new THREE.Color(0x280407),
                                        emissive: new THREE.Color(0x000000),
                                        emissiveIntensity: 0,
                                        roughness: 0.02,
                                        metalness: 0.15,
                                        toneMapped: false // Maximum saturated Shiny Red!
                                    });
                                    taillightMaterials.push(child.material);
                                }
                            }
                        }
                    });

                    // Rear wheel rotation setup (Cylinder.000)
                    const rearWheelsNode = carModel.getObjectByName('Cylinder.000');
                    if (rearWheelsNode) {
                        const wheelBox = new THREE.Box3().setFromObject(rearWheelsNode);
                        const axleCenter = wheelBox.getCenter(new THREE.Vector3());

                        rearWheelsPivot = new THREE.Group();
                        rearWheelsPivot.position.copy(axleCenter);
                        rearWheelsNode.parent.add(rearWheelsPivot);

                        rearWheelsNode.position.sub(axleCenter);
                        rearWheelsPivot.add(rearWheelsNode);
                    }

                    scene.add(carModel);

                    // Optical Glow Sprites (Photorealistic Headlight & Taillight Bloom)
                    const blueGlowTex = makeGlowTexture('#7dd3fc', 'rgba(56, 189, 248, 0.45)');
                    const headlightSpriteMat = new THREE.SpriteMaterial({
                        map: blueGlowTex,
                        color: 0xffffff,
                        transparent: true,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    });

                    leftHeadlightSprite = new THREE.Sprite(headlightSpriteMat);
                    leftHeadlightSprite.position.set(-0.70, 0.70, 1.76);
                    leftHeadlightSprite.scale.set(0.001, 0.001, 1);
                    leftHeadlightSprite.visible = false;
                    scene.add(leftHeadlightSprite);

                    rightHeadlightSprite = new THREE.Sprite(headlightSpriteMat.clone());
                    rightHeadlightSprite.position.set(0.70, 0.70, 1.76);
                    rightHeadlightSprite.scale.set(0.001, 0.001, 1);
                    rightHeadlightSprite.visible = false;
                    scene.add(rightHeadlightSprite);

                    const redGlowTex = makeGlowTexture('#ff3355', 'rgba(255, 0, 34, 0.55)');
                    const taillightSpriteMat = new THREE.SpriteMaterial({
                        map: redGlowTex,
                        color: 0xffffff,
                        transparent: true,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    });
                    taillightSprite = new THREE.Sprite(taillightSpriteMat);
                    taillightSprite.position.set(0, 0.71, -2.18);
                    taillightSprite.scale.set(0.001, 0.001, 1);
                    taillightSprite.visible = false;
                    scene.add(taillightSprite);

                    // Forward Projecting Headlight Spotlights onto Ground
                    spotLeft = new THREE.SpotLight(0x70d6ff, 0, 16, Math.PI / 4, 0.4, 1.2);
                    spotLeft.position.set(-0.70, 0.70, 1.75);
                    spotLeft.target.position.set(-0.70, 0, 5.0);
                    scene.add(spotLeft);
                    scene.add(spotLeft.target);

                    spotRight = new THREE.SpotLight(0x70d6ff, 0, 16, Math.PI / 4, 0.4, 1.2);
                    spotRight.position.set(0.70, 0.70, 1.75);
                    spotRight.target.position.set(0.70, 0, 5.0);
                    scene.add(spotRight);
                    scene.add(spotRight.target);

                    // Rear Red Point Light
                    rearPointLight = new THREE.PointLight(0xff0022, 0, 10, 1.5);
                    rearPointLight.position.set(0, 0.71, -2.35);
                    scene.add(rearPointLight);

                    glbLoader?.classList.add('hidden');
                },
                undefined,
                (error) => {
                    console.error('Error loading Porsche 911 GLB:', error);
                    glbLoader?.classList.add('hidden');
                }
            );
        }

        // Nanotechnology Colour Transformation
        function applyNanotechColor(hex, isNanotech) {
            if (!bodyPaintMaterial) return;

            const startColor = bodyPaintMaterial.color.clone();
            const targetColor = isNanotech ? new THREE.Color('#2563eb') : new THREE.Color(hex);

            let progress = 0;
            const startTime = performance.now();
            const duration = 1100;

            function animateTransition(now) {
                progress = Math.min(1, (now - startTime) / duration);
                bodyPaintMaterial.color.lerpColors(startColor, targetColor, progress);

                const pulse = Math.sin(progress * Math.PI) * 0.4;
                bodyPaintMaterial.emissive.setRGB(pulse * 0.2, pulse * 0.6, pulse * 1.0);

                if (isNanotech) {
                    bodyPaintMaterial.roughness = 0.15;
                    bodyPaintMaterial.metalness = 0.85;
                } else {
                    bodyPaintMaterial.roughness = 0.26;
                    bodyPaintMaterial.metalness = 0.38;
                }

                if (progress < 1) {
                    requestAnimationFrame(animateTransition);
                } else {
                    bodyPaintMaterial.emissive.setRGB(0, 0, 0);
                }
            }
            requestAnimationFrame(animateTransition);
        }

        colorSwatches.forEach((swatch) => {
            swatch.addEventListener('click', () => {
                colorSwatches.forEach((s) => s.classList.remove('active'));
                swatch.classList.add('active');

                const colorCode = swatch.getAttribute('data-color');
                const isNanotech = colorCode === 'nanotech';
                applyNanotechColor(colorCode, isNanotech);
            });
        });

        // ===================================================================
        // ENGINE START/STOP & REVVING CONTROLS (PROCEDURAL WEB AUDIO)
        // ===================================================================
        btnStart?.addEventListener('click', () => {
            if (!audioEngine.isStarted) {
                audioEngine.startEngine();
                carLightsOn = true; // Turn ON Headlights (Light Blue) & Taillights (Shiny Red)!
                btnStartLabel.textContent = 'STOP ENGINE';
                btnStart.classList.add('active');
                if (hudStatus) hudStatus.textContent = 'IDLE 850 RPM';
                if (hudLights) hudLights.textContent = 'ON';
                if (soundStatusText) soundStatusText.textContent = 'ENGINE ACTIVE';
            } else {
                audioEngine.stopEngine();
                carLightsOn = false; // Turn OFF Headlights & Taillights
                btnStartLabel.textContent = 'START ENGINE';
                btnStart.classList.remove('active');
                if (hudStatus) hudStatus.textContent = 'ENGINE OFF';
                if (hudLights) hudLights.textContent = 'OFF';
                if (soundStatusText) soundStatusText.textContent = 'AUDIO READY';
            }
        });

        function startRevving(e) {
            e.preventDefault();
            if (!audioEngine.isStarted) {
                if (hudStatus) {
                    hudStatus.textContent = 'START ENGINE FIRST';
                    setTimeout(() => {
                        if (!audioEngine.isStarted) hudStatus.textContent = 'ENGINE OFF';
                    }, 1500);
                }
                return;
            }

            audioEngine.setThrottle(true);
            btnAccelerate?.classList.add('holding');
            if (hudStatus) hudStatus.textContent = 'ACCELERATING (7400 RPM)';
            if (soundStatusText) soundStatusText.textContent = 'REVVING';
        }

        function stopRevving() {
            if (!audioEngine.throttle) return;
            audioEngine.setThrottle(false);
            btnAccelerate?.classList.remove('holding');
            if (hudStatus) hudStatus.textContent = audioEngine.isStarted ? 'IDLE 850 RPM' : 'ENGINE OFF';
            if (soundStatusText) soundStatusText.textContent = audioEngine.isStarted ? 'ENGINE ACTIVE' : 'AUDIO READY';
        }

        btnAccelerate?.addEventListener('mousedown', startRevving);
        window.addEventListener('mouseup', stopRevving);
        btnAccelerate?.addEventListener('touchstart', startRevving, { passive: false });
        window.addEventListener('touchend', stopRevving);

        // Sound Indicator Pill Click Toggle
        const soundIndicator = document.getElementById('sound-indicator');
        soundIndicator?.addEventListener('click', () => {
            btnStart?.click();
        });

        btnReset?.addEventListener('click', () => {
            if (controls) {
                controls.reset();
                camera.position.set(4.5, 1.8, 5.2);
                controls.target.set(0, 0.2, 0);
            }
        });

        window.addEventListener('resize', () => {
            if (!threeCanvas || !renderer || !camera) return;
            const width = threeCanvas.clientWidth;
            const height = threeCanvas.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });

        const clock = new THREE.Clock();

        function renderScene() {
            const delta = clock.getDelta();

            // Telemetry & Wheel Spin driven directly by Procedural Engine RPM
            const currentRpm = audioEngine.rpm;
            if (hudRpm) hudRpm.textContent = Math.round(currentRpm);

            if (tachoArc) {
                const fraction = Math.min(1, currentRpm / 7500);
                const offset = 301.59 * (1 - fraction * 0.75);
                tachoArc.style.strokeDashoffset = offset;
            }

            // Strictly ONLY rear wheels rotate
            if (rearWheelsPivot && currentRpm > 100) {
                wheelRotationSpeed = (currentRpm / 60) * Math.PI * 2 * 0.08;
                rearWheelsPivot.rotation.x += wheelRotationSpeed * delta;
            }

            // ===============================================================
            // DYNAMIC HEADLIGHTS (LIGHT BLUE) & REAR TAILLIGHTS (SHINY RED)
            // ===============================================================
            const targetLightIntensity = carLightsOn ? 1.0 : 0.0;
            currentLightIntensity += (targetLightIntensity - currentLightIntensity) * 0.16;

            // Voltage flare when revving (dynamically boosts illumination)
            const revFlare = (currentRpm > 1000) ? (currentRpm / 7500) * 0.35 : 0;
            const activeIntensity = Math.min(1.5, currentLightIntensity + revFlare * currentLightIntensity);

            if (currentLightIntensity > 0.01) {
                // 1. Headlights: Radiant Light Blue Glow (#38bdf8 / #a0e6ff)
                headlightMaterials.forEach((mat) => {
                    mat.toneMapped = false;
                    mat.color.set('#bbf2f6');
                    mat.emissive.set('#38bdf8');
                    mat.emissiveIntensity = activeIntensity * 8.0;
                });

                // 2. Rear Tail Light: Glowing Shiny Red (#ff0022)
                taillightMaterials.forEach((mat) => {
                    mat.toneMapped = false;
                    mat.color.set('#ff0022');
                    mat.emissive.set('#ff0011');
                    mat.emissiveIntensity = activeIntensity * 9.5;
                    mat.roughness = 0.02;
                });

                // 3. Optical Glow Sprites (Bloom Effect)
                if (leftHeadlightSprite && rightHeadlightSprite) {
                    leftHeadlightSprite.visible = true;
                    rightHeadlightSprite.visible = true;
                    const hScale = 0.72 * activeIntensity;
                    leftHeadlightSprite.scale.set(hScale, hScale, 1);
                    rightHeadlightSprite.scale.set(hScale, hScale, 1);
                }

                if (taillightSprite) {
                    taillightSprite.visible = true;
                    taillightSprite.scale.set(1.5 * activeIntensity, 0.32 * activeIntensity, 1);
                }

                // 4. Ground Illumination
                if (spotLeft) spotLeft.intensity = activeIntensity * 4.0;
                if (spotRight) spotRight.intensity = activeIntensity * 4.0;
                if (rearPointLight) rearPointLight.intensity = activeIntensity * 3.5;
            } else {
                // Lights Turned Off
                headlightMaterials.forEach((mat) => {
                    mat.toneMapped = true;
                    mat.color.set(0x1e242c);
                    mat.emissive.set(0x000000);
                    mat.emissiveIntensity = 0;
                });
                taillightMaterials.forEach((mat) => {
                    mat.toneMapped = true;
                    mat.color.set(0x280407);
                    mat.emissive.set(0x000000);
                    mat.emissiveIntensity = 0;
                    mat.roughness = 0.2;
                });

                if (leftHeadlightSprite) leftHeadlightSprite.visible = false;
                if (rightHeadlightSprite) rightHeadlightSprite.visible = false;
                if (taillightSprite) taillightSprite.visible = false;

                if (spotLeft) spotLeft.intensity = 0;
                if (spotRight) spotRight.intensity = 0;
                if (rearPointLight) rearPointLight.intensity = 0;
            }

            if (controls) controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(renderScene);
        }
        renderScene();
    }


    /* ===================================================================
       7. SECTION 05: FIVE GENERATIONS WHOLE-IMAGE SLIDE INTERACTION
       (NEVER SPLITS IN HALF · SLIDES AS ONE COMPLETE IMAGE!)
       =================================================================== */
    const zigzagCards = document.querySelectorAll('.zigzag-item');
    zigzagCards.forEach((item) => {
        item.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            zigzagCards.forEach((c) => c.classList.remove('active'));
            if (!wasActive) item.classList.add('active');
        });
    });


    /* ===================================================================
       8. SECTION 06: EXPLODED ENGINE SCROLL EXPERIENCE
       (Mechanical Anatomy · High-Contrast Callouts · Zero Overlap)
       =================================================================== */
    const engineSection = document.getElementById('engine-section');
    const engineCanvas = document.getElementById('engine-canvas');
    const engineCallouts = document.querySelectorAll('.callout-card');

    if (engineSection && engineCanvas) {
        const ctx = engineCanvas.getContext('2d');
        const frameCount = 238;
        const frames = new Array(frameCount);
        let loadedFrames = 0;
        let currentFrameIdx = 0;

        function resizeEngineCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = engineCanvas.clientWidth || 1160;
            const h = engineCanvas.clientHeight || 652;
            engineCanvas.width = Math.round(w * dpr);
            engineCanvas.height = Math.round(h * dpr);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            drawEngineFrame(currentFrameIdx);
        }
        window.addEventListener('resize', resizeEngineCanvas);

        function drawEngineFrame(idx) {
            const img = frames[idx];
            if (!img || !img.complete || !img.naturalWidth) return;

            const cw = engineCanvas.width;
            const ch = engineCanvas.height;
            ctx.clearRect(0, 0, cw, ch);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // High-fidelity grand scale fit (native 1920x1080 resolution, full large scale)
            const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight) * 0.98;
            const w = img.naturalWidth * scale;
            const h = img.naturalHeight * scale;
            const x = (cw - w) / 2;
            const y = (ch - h) / 2;

            ctx.drawImage(img, x, y, w, h);
        }

        // Preload exploded engine frames
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            const numStr = String(i + 1).padStart(3, '0');
            img.src = `exploded engine/ezgif-frame-${numStr}.jpg`;
            img.onload = () => {
                loadedFrames++;
                if (loadedFrames === 1) {
                    resizeEngineCanvas();
                }
            };
            frames[i] = img;
        }

        // Scroll Scrub Handler
        function onEngineScroll() {
            const rect = engineSection.getBoundingClientRect();
            const scrollDistance = engineSection.offsetHeight - window.innerHeight;
            if (scrollDistance <= 0) return;

            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));

            const frameIdx = Math.min(frameCount - 1, Math.floor(progress * frameCount));
            if (frameIdx !== currentFrameIdx) {
                currentFrameIdx = frameIdx;
                drawEngineFrame(frameIdx);
            }

            // Sync Progressive Editorial Callouts (callout-card elements)
            engineCallouts.forEach((callout) => {
                const start = parseFloat(callout.getAttribute('data-frame-start') || '0');
                const end = parseFloat(callout.getAttribute('data-frame-end') || '1');
                if (progress >= start && progress <= end) {
                    callout.classList.add('visible');
                } else {
                    callout.classList.remove('visible');
                }
            });
        }

        window.addEventListener('scroll', onEngineScroll, { passive: true });
        onEngineScroll();
    }

})();
