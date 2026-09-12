import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef, useMemo, useCallback } from 'react';
import './FaultyTerminal.css';

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Optimized fragment shader:
//  - rotation matrices passed as uniforms (no per-pixel sin/cos)
//  - glow approximated analytically (1 digit() call instead of 9)
const fragmentShader = `
precision mediump float;
varying vec2 vUv;
uniform float iTime;
uniform vec3  iResolution;
uniform float uScale;
uniform vec2  uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3  uTint;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;
uniform mat2  uRotA;
uniform mat2  uRotB;
uniform mat2  uRotPat;
uniform mat2  uRotFixed;
float time;
float hash21(vec2 p){
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2;
}
float fbm(vec2 p){
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  f += amp * noise(p); p = uRotA * p * 2.0; amp *= 0.454545;
  f += amp * noise(p); p = uRotA * p * 2.0; amp *= 0.454545;
  f += amp * noise(p);
  return f;
}
float pattern(vec2 p) {
  vec2 offset1 = vec2(1.0); vec2 offset0 = vec2(0.0);
  vec2 q = vec2(fbm(p + offset1), fbm(uRotPat * p + offset1));
  vec2 r = vec2(fbm(uRotFixed * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}
// Returns (mainBrightness, cellIntensity) so glow can be approximated cheaply.
vec2 digit2(vec2 p){
    vec2 grid = uGridMul * 15.0;
    vec2 s = floor(p * grid) / grid;
    p = p * grid;
    float intensity = pattern(s * 0.1) * 1.3 - 0.03;
    if(uUsePageLoadAnimation > 0.5){
        float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
        float cellDelay = cellRandom * 0.8;
        float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
        intensity *= smoothstep(0.0, 1.0, cellProgress);
    }
    p = fract(p);
    p *= uDigitSize;
    float px5 = p.x * 5.0;
    float py5 = (1.0 - p.y) * 5.0;
    float x = fract(px5);
    float y = fract(py5);
    float i = floor(py5) - 2.0;
    float j = floor(px5) - 2.0;
    float n = i * i + j * j;
    float f = n * 0.0625;
    float isOn = step(0.1, intensity - f);
    float bright = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
    float mask = step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0);
    return vec2(mask * bright, max(intensity, 0.0));
}
float onOff(float a, float b, float c){
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}
float displace(vec2 look){
    float y = look.y - mod(iTime * 0.25, 1.0);
    float window = 1.0 / (1.0 + 50.0 * y * y);
    return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
}
vec3 getColor(vec2 p){
    float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
    bar *= uScanlineIntensity;
    float displacement = displace(p);
    p.x += displacement;
    if (uGlitchAmount != 1.0) {
      p.x += displacement * (uGlitchAmount - 1.0);
    }
    vec2 d = digit2(p);
    // Analytic glow: scale by cell intensity, no extra digit() calls.
    float glow = d.y * 0.9;
    vec3 baseColor = vec3(0.9) * d.x + glow * 0.1 * bar;
    return baseColor;
}
vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}
void main() {
    time = iTime * 0.333333;
    vec2 uv = vUv;
    if(uCurvature != 0.0){ uv = barrel(uv); }
    vec2 p = uv * uScale;
    vec3 col = getColor(p);
    if(uChromaticAberration != 0.0){
      vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
      col.r = getColor(p + ca).r;
      col.b = getColor(p - ca).b;
    }
    col *= uTint;
    col *= uBrightness;
    if(uDither > 0.0){
      float rnd = hash21(gl_FragCoord.xy);
      col += (rnd - 0.5) * (uDither * 0.003922);
    }
    gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex) {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const num = parseInt(h, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(pointer: coarse)').matches || window.innerWidth < 768;
}

function computeDpr(custom) {
  if (typeof window === 'undefined') return 1;
  if (typeof custom === 'number') return custom;
  const raw = window.devicePixelRatio || 1;
  // Mobile GPUs choke on full-res fullscreen shaders: render at ~60% and upscale.
  return isMobileDevice() ? Math.min(raw, 0.65) : Math.min(raw, 1.5);
}

export default function FaultyTerminal({
  scale = 1, gridMul = [2, 1], digitSize = 1.5, timeScale = 0.3, pause = false,
  scanlineIntensity = 0.3, glitchAmount = 1, flickerAmount = 1, noiseAmp = 0,
  chromaticAberration = 0, dither = 0, curvature = 0.2, tint = '#ffffff',
  dpr, pageLoadAnimation = true, brightness = 1, className = '', style, ...rest
}) {
  const containerRef = useRef(null);
  const frozenTimeRef = useRef(0);
  const rafRef = useRef(0);
  const visibleRef = useRef(true);
  const loadAnimationStartRef = useRef(0);
  const timeOffsetRef = useRef(Math.random() * 100);
  const tintVec = useMemo(() => hexToRgb(tint), [tint]);
  const ditherValue = useMemo(() => (typeof dither === 'boolean' ? (dither ? 1 : 0) : dither), [dither]);
  const resolvedDpr = useMemo(() => computeDpr(dpr), [dpr]);

  const noop = useCallback(() => {}, []);
  void noop;

  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;
    const mobile = isMobileDevice();
    const renderer = new Renderer({
      dpr: resolvedDpr,
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power'
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    const geometry = new Triangle(gl);

    // Pre-allocated rotation matrices (column-major for WebGL mat2).
    const rotA = new Float32Array(4);
    const rotB = new Float32Array(4);
    const rotPat = new Float32Array(4);
    const rotFixed = new Float32Array(4);
    const setRot = (out, a) => {
      const c = Math.cos(a), s = Math.sin(a);
      out[0] = c; out[1] = s; out[2] = -s; out[3] = c;
    };
    setRot(rotFixed, 0.1);

    const program = new Program(gl, {
      vertex: vertexShader, fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        uScale: { value: scale },
        uGridMul: { value: new Float32Array(gridMul) },
        uDigitSize: { value: digitSize },
        uScanlineIntensity: { value: scanlineIntensity },
        uGlitchAmount: { value: glitchAmount },
        uFlickerAmount: { value: flickerAmount },
        uNoiseAmp: { value: noiseAmp },
        uChromaticAberration: { value: chromaticAberration },
        uDither: { value: ditherValue },
        uCurvature: { value: curvature },
        uTint: { value: new Color(tintVec[0], tintVec[1], tintVec[2]) },
        uPageLoadProgress: { value: pageLoadAnimation ? 0 : 1 },
        uUsePageLoadAnimation: { value: pageLoadAnimation ? 1 : 0 },
        uBrightness: { value: brightness },
        uRotA: { value: rotA },
        uRotB: { value: rotB },
        uRotPat: { value: rotPat },
        uRotFixed: { value: rotFixed }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });

    let lastW = 0;
    let lastH = 0;
    function resize(force) {
      if (!ctn) return;
      const w = ctn.offsetWidth;
      const h = ctn.offsetHeight;
      // On mobile the URL bar collapsing changes the height by ~60-120px mid
      // scroll; re-sizing the canvas there causes the visible "jump". Ignore
      // height-only changes on touch devices.
      if (!force && mobile && w === lastW && Math.abs(h - lastH) < 160) return;
      if (!force && w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      renderer.setSize(w, h);
      program.uniforms.iResolution.value = new Color(
        gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height
      );
    }
    const resizeObserver = new ResizeObserver(() => resize(false));
    resizeObserver.observe(ctn);
    resize(true);

    // Pause render loop when offscreen (saves GPU on scroll).
    const io = new IntersectionObserver(
      entries => {
        const wasVisible = visibleRef.current;
        visibleRef.current = entries[0].isIntersecting;
        if (!wasVisible && visibleRef.current && !rafRef.current) {
          rafRef.current = requestAnimationFrame(update);
        }
      },
      { threshold: 0.01 }
    );
    io.observe(ctn);

    const update = t => {
      if (!visibleRef.current) {
        rafRef.current = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(update);
      if (pageLoadAnimation && loadAnimationStartRef.current === 0) loadAnimationStartRef.current = t;

      let elapsed = frozenTimeRef.current;
      if (!pause) {
        elapsed = (t * 0.001 + timeOffsetRef.current) * timeScale;
        frozenTimeRef.current = elapsed;
      }
      program.uniforms.iTime.value = elapsed;

      // Update rotation matrices on the CPU once per frame.
      const tt = elapsed * 0.333333;
      setRot(rotA, tt * 0.02);
      setRot(rotB, tt * 0.08);
      setRot(rotPat, 0.1 * tt);

      if (pageLoadAnimation && loadAnimationStartRef.current > 0) {
        const progress = Math.min((t - loadAnimationStartRef.current) / 2000, 1);
        program.uniforms.uPageLoadProgress.value = progress;
      }

      renderer.render({ scene: mesh });
    };
    rafRef.current = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      io.disconnect();
      resizeObserver.disconnect();
      if (gl.canvas.parentElement === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      loadAnimationStartRef.current = 0;
      timeOffsetRef.current = Math.random() * 100;
    };
  }, [resolvedDpr, pause, timeScale, scale, gridMul, digitSize, scanlineIntensity, glitchAmount, flickerAmount, noiseAmp, chromaticAberration, ditherValue, curvature, tintVec, pageLoadAnimation, brightness]);

  return <div ref={containerRef} className={`faulty-terminal-container ${className}`} style={style} {...rest} />;
}
