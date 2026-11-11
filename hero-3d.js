(() => {
  "use strict";

  const HERO_CONFIG = Object.freeze({
    grid: {
      desktopBreakpoint: 768,
      desktop: { cols: 120, rows: 60 },
      mobile: { cols: 70, rows: 35 },
      spacing: 0.45,
    },
    points: {
      size: 0.12,
      darkOpacity: 0.5,
      lightOpacity: 0.35,
    },
    wave: {
      timeScale: 0.6,
      freqX: 0.35,
      ampX: 0.8,
      freqZ: 0.45,
      ampZ: 0.6,
      timeMultZ: 0.8,
    },
    sway: {
      speed: 0.15,
      angle: 0.12,
    },
    camera: {
      fov: 60,
      base: { x: 0, y: 6, z: 22 },
      // Aiming above the origin pushes the field into the lower half, away from the hero copy.
      lookAtY: 4,
      parallaxX: 3,
      parallaxY: 1.5,
      easing: 0.05,
    },
    maxPixelRatio: 2,
    maxFrameSeconds: 0.1,
  });

  function waveHeight(x, z, t, wave) {
    return (
      Math.sin(x * wave.freqX + t) * wave.ampX +
      Math.cos(z * wave.freqZ + t * wave.timeMultZ) * wave.ampZ
    );
  }

  function readThemePalette(pointsConfig) {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const isLight = root.getAttribute("data-theme") === "light";
    return {
      from: new THREE.Color(styles.getPropertyValue("--primary").trim()),
      to: new THREE.Color(styles.getPropertyValue("--secondary").trim()),
      opacity: isLight ? pointsConfig.lightOpacity : pointsConfig.darkOpacity,
    };
  }

  function createWaveField(config) {
    const isDesktop = window.innerWidth >= config.grid.desktopBreakpoint;
    const { cols, rows } = isDesktop ? config.grid.desktop : config.grid.mobile;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const offsetX = ((cols - 1) * config.grid.spacing) / 2;
    const offsetZ = ((rows - 1) * config.grid.spacing) / 2;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (i % cols) * config.grid.spacing - offsetX;
      positions[i * 3 + 2] = Math.floor(i / cols) * config.grid.spacing - offsetZ;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // NormalBlending keeps particles visible on the light theme, where AdditiveBlending washes out.
    const material = new THREE.PointsMaterial({
      size: config.points.size,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
      blending: THREE.NormalBlending,
    });
    const points = new THREE.Points(geometry, material);

    function applyPalette(palette) {
      const mixed = new THREE.Color();
      for (let i = 0; i < count; i++) {
        mixed.copy(palette.from).lerp(palette.to, (i % cols) / (cols - 1));
        mixed.toArray(colors, i * 3);
      }
      material.opacity = palette.opacity;
      geometry.attributes.color.needsUpdate = true;
    }

    function setTime(seconds) {
      const t = seconds * config.wave.timeScale;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] = waveHeight(positions[i * 3], positions[i * 3 + 2], t, config.wave);
      }
      points.rotation.y = Math.sin(seconds * config.sway.speed) * config.sway.angle;
      geometry.attributes.position.needsUpdate = true;
    }

    return { points, applyPalette, setTime };
  }

  function createParallaxCamera(cameraConfig) {
    const { base, lookAtY } = cameraConfig;
    const camera = new THREE.PerspectiveCamera(cameraConfig.fov, 1, 0.1, 1000);

    function reset() {
      camera.position.set(base.x, base.y, base.z);
      camera.lookAt(0, lookAtY, 0);
    }

    function easeToward(pointer) {
      const targetX = base.x + pointer.x * cameraConfig.parallaxX;
      const targetY = base.y + pointer.y * cameraConfig.parallaxY;
      camera.position.x += (targetX - camera.position.x) * cameraConfig.easing;
      camera.position.y += (targetY - camera.position.y) * cameraConfig.easing;
      camera.lookAt(0, lookAtY, 0);
    }

    function setAspect(aspect) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }

    reset();
    return { camera, reset, easeToward, setAspect };
  }

  function trackPointer() {
    const pointer = { x: 0, y: 0 };
    window.addEventListener(
      "pointermove",
      (event) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = 1 - (event.clientY / window.innerHeight) * 2;
      },
      { passive: true },
    );
    return pointer;
  }

  function createFrameLoop(onFrame, maxFrameSeconds) {
    let frameId = null;
    let lastTime = 0;
    let elapsedSeconds = 0;

    function tick(now) {
      elapsedSeconds += Math.min((now - lastTime) / 1000, maxFrameSeconds);
      lastTime = now;
      onFrame(elapsedSeconds);
      frameId = requestAnimationFrame(tick);
    }

    function start() {
      if (frameId !== null) {
        return;
      }
      lastTime = performance.now();
      frameId = requestAnimationFrame(tick);
    }

    function stop() {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    }

    return { start, stop };
  }

  function createRenderer(canvas) {
    // WebGL can be disabled or unavailable; returning null leaves the CSS blobs as the background.
    try {
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, HERO_CONFIG.maxPixelRatio));
      return renderer;
    } catch {
      return null;
    }
  }

  function initHeroScene(canvas, config) {
    const renderer = createRenderer(canvas);
    if (!renderer) {
      return;
    }

    const hero = canvas.parentElement;
    const scene = new THREE.Scene();
    const field = createWaveField(config);
    const view = createParallaxCamera(config.camera);
    const pointer = trackPointer();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let heroVisible = false;

    scene.add(field.points);
    field.applyPalette(readThemePalette(config.points));

    const render = () => renderer.render(scene, view.camera);

    const loop = createFrameLoop((seconds) => {
      field.setTime(seconds);
      view.easeToward(pointer);
      render();
    }, config.maxFrameSeconds);

    function renderStill() {
      view.reset();
      field.setTime(0);
      render();
    }

    function syncPlayback() {
      if (reducedMotion.matches) {
        loop.stop();
        renderStill();
      } else if (heroVisible && !document.hidden) {
        loop.start();
      } else {
        loop.stop();
      }
    }

    function resize() {
      const { clientWidth: width, clientHeight: height } = hero;
      if (width === 0 || height === 0) {
        return;
      }
      view.setAspect(width / height);
      // false keeps three.js from writing inline pixel sizes over the CSS layout.
      renderer.setSize(width, height, false);
      if (reducedMotion.matches) {
        renderStill();
      }
    }

    new ResizeObserver(resize).observe(hero);

    new MutationObserver(() => {
      field.applyPalette(readThemePalette(config.points));
      if (reducedMotion.matches) {
        renderStill();
      }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    new IntersectionObserver((entries) => {
      heroVisible = entries[entries.length - 1].isIntersecting;
      syncPlayback();
    }).observe(hero);

    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);

    resize();
    syncPlayback();
  }

  const canvas = document.getElementById("hero-canvas");
  if (canvas && window.THREE) {
    initHeroScene(canvas, HERO_CONFIG);
  }
})();
