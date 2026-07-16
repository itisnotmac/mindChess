import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Crown } from 'lucide-react';

export default function IntroSequence({ onComplete }) {
  const mountRef = useRef(null);
  const [phase, setPhase] = useState('splash');
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setPhase('scene'), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'entering') return;
    const t = setTimeout(() => onComplete && onComplete(), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'scene') return;
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x002060);
    scene.fog = new THREE.Fog(0x001840, 14, 95);

    const camera = new THREE.PerspectiveCamera(62, mount.clientWidth / mount.clientHeight, 0.1, 400);
    camera.position.set(0, 1.7, 46);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x445588, 0.55));
    const moonLight = new THREE.DirectionalLight(0xaabbff, 0.7);
    moonLight.position.set(-30, 50, -20);
    scene.add(moonLight);
    const facadeWarm = new THREE.PointLight(0xffe0a0, 1.6, 40);
    facadeWarm.position.set(0, 6, 10);
    scene.add(facadeWarm);
    const entranceWarm = new THREE.PointLight(0xffcaa0, 1.2, 14);
    entranceWarm.position.set(0, 3, 4);
    scene.add(entranceWarm);

    const stoneTex = makeStoneTexture();
    const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.95, metalness: 0 });
    const slateMat = new THREE.MeshStandardMaterial({ color: 0x3a3a44, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3a2418, roughness: 0.65, emissive: 0x1a0f08, emissiveIntensity: 0.3 });
    const winMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffe9b0, emissiveIntensity: 1.0 });
    const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x0c140c, roughness: 1 });
    const urnMat = new THREE.MeshStandardMaterial({ color: 0xc6c6c0, roughness: 0.8 });
    const evergreenMat = new THREE.MeshStandardMaterial({ color: 0x14361a, roughness: 1 });
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x070a07, roughness: 1 });
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x0a0f0a, roughness: 1 });
    const driveMat = new THREE.MeshStandardMaterial({ map: makeBeigeBrickTexture(), roughness: 0.95 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.9 });

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), grassMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const mansion = new THREE.Group();

    // Central block
    const hall = new THREE.Mesh(new THREE.BoxGeometry(11, 9, 6), stoneMat);
    hall.position.set(0, 4.5, 0); mansion.add(hall);
    // Central roof (steep pyramid)
    const roof = new THREE.Mesh(new THREE.ConeGeometry(8.2, 4.5, 4), slateMat);
    roof.position.set(0, 11.25, 0); roof.rotation.y = Math.PI / 4; mansion.add(roof);

    // Wings
    const wingGeo = new THREE.BoxGeometry(6, 7, 6);
    const leftWing = new THREE.Mesh(wingGeo, stoneMat); leftWing.position.set(-9.5, 3.5, 0); mansion.add(leftWing);
    const rightWing = new THREE.Mesh(wingGeo, stoneMat); rightWing.position.set(9.5, 3.5, 0); mansion.add(rightWing);
    const wRoofGeo = new THREE.ConeGeometry(5.0, 3.6, 4);
    const lwRoof = new THREE.Mesh(wRoofGeo, slateMat); lwRoof.position.set(-9.5, 8.8, 0); lwRoof.rotation.y = Math.PI / 4; mansion.add(lwRoof);
    const rwRoof = new THREE.Mesh(wRoofGeo, slateMat); rwRoof.position.set(9.5, 8.8, 0); rwRoof.rotation.y = Math.PI / 4; mansion.add(rwRoof);

    // Dormers on wings
    function addDormer(x, z) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1.6), stoneMat);
      d.position.set(x, 8, z); mansion.add(d);
      const dRoof = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.4, 4), slateMat);
      dRoof.position.set(x, 9.7, z); dRoof.rotation.y = Math.PI / 4; mansion.add(dRoof);
      const dw = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.2), winMat);
      dw.position.set(x, 8, z + 0.81); mansion.add(dw);
    }
    addDormer(-9.5, 2.2); addDormer(9.5, 2.2);

    // Grand arched entrance
    const pierGeo = new THREE.BoxGeometry(0.9, 7, 1.2);
    const lpier = new THREE.Mesh(pierGeo, stoneMat); lpier.position.set(-1.9, 3.5, 3.0); mansion.add(lpier);
    const rpier = new THREE.Mesh(pierGeo, stoneMat); rpier.position.set(1.9, 3.5, 3.0); mansion.add(rpier);
    const arch = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.35, 12, 24, Math.PI), stoneMat);
    arch.position.set(0, 7, 3.0); mansion.add(arch);
    // recess backing
    const recess = new THREE.Mesh(new THREE.BoxGeometry(3.4, 6.6, 0.4), darkMat);
    recess.position.set(0, 3.3, 2.9); mansion.add(recess);
    // double doors
    const doorGeo = new THREE.BoxGeometry(0.92, 4.6, 0.3);
    const doorL = new THREE.Mesh(doorGeo, woodMat); doorL.position.set(-0.52, 2.3, 3.0); doorL.userData.door = true; mansion.add(doorL);
    const doorR = new THREE.Mesh(doorGeo, woodMat); doorR.position.set(0.52, 2.3, 3.0); doorR.userData.door = true; mansion.add(doorR);

    // Columns flanking entrance
    function addColumn(x) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 7, 16), stoneMat);
      col.position.set(x, 3.5, 3.9); mansion.add(col);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.9), stoneMat);
      cap.position.set(x, 7.15, 3.9); mansion.add(cap);
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.9), stoneMat);
      base.position.set(x, 0.15, 3.9); mansion.add(base);
    }
    addColumn(-2.7); addColumn(2.7);

    // Arched windows
    function addArchedWindow(x, y, z) {
      const g = new THREE.Group();
      const rect = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.8), winMat);
      g.add(rect);
      const top = new THREE.Mesh(new THREE.CircleGeometry(0.65, 24, 0, Math.PI), winMat);
      top.position.y = 0.9; g.add(top);
      g.position.set(x, y, z); mansion.add(g);
    }
    addArchedWindow(-9.5, 3.5, 3.01); addArchedWindow(9.5, 3.5, 3.01);
    addArchedWindow(-9.5, 5.6, 3.01); addArchedWindow(9.5, 5.6, 3.01);
    addArchedWindow(-4.2, 5.8, 3.01); addArchedWindow(4.2, 5.8, 3.01);
    addArchedWindow(0, 8.6, 3.01);

    // Steps
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 0.6), stoneMat); step1.position.set(0, 0.1, 3.7); mansion.add(step1);
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.2, 0.6), stoneMat); step2.position.set(0, 0.1, 4.2); mansion.add(step2);

    // Hedges along base
    for (let x = -13; x <= 13; x += 2.2) {
      if (Math.abs(x) < 2.4) continue;
      const h = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 0.8), hedgeMat);
      h.position.set(x, 0.7, 4.6); mansion.add(h);
    }

    // Chimneys
    const chimGeo = new THREE.BoxGeometry(0.9, 2.2, 0.9);
    const c1 = new THREE.Mesh(chimGeo, stoneMat); c1.position.set(-3.5, 11.5, 0.5); mansion.add(c1);
    const c2 = new THREE.Mesh(chimGeo, stoneMat); c2.position.set(3.5, 11.5, -1.5); mansion.add(c2);

    scene.add(mansion);

    // Brick courtyard (clickable)
    const clickables = [doorL, doorR];
    const STEP = 7;
    const DOOR_Z = 3;
    const CLAMP_Z = 7;
    for (let z = 6; z <= 44; z += 1.3) {
      for (let xi = -2; xi <= 2; xi++) {
        const brick = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.16, 1.1), driveMat);
        brick.position.set(xi * 2.05, 0.08, z + (xi % 2 === 0 ? 0 : 0.65));
        brick.userData.brick = true;
        scene.add(brick);
        clickables.push(brick);
      }
    }

    // Urn planters with conical evergreens flanking the path
    function addUrn(x, z) {
      const pedestal = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 1.0), urnMat);
      pedestal.position.set(x, 0.5, z); scene.add(pedestal);
      const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.3, 0.6, 12), urnMat);
      urn.position.set(x, 1.3, z); scene.add(urn);
      const tree = new THREE.Mesh(new THREE.ConeGeometry(0.85, 3.2, 12), evergreenMat);
      tree.position.set(x, 3.0, z); scene.add(tree);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 8), treeMat);
      trunk.position.set(x, 1.7, z); scene.add(trunk);
    }
    addUrn(-2.7, 42); addUrn(2.7, 42);
    addUrn(-2.9, 10); addUrn(2.9, 10);

    // Background tree silhouettes
    function addTree(x, z, h) {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, h * 0.4, 8), treeMat);
      trunk.position.set(x, h * 0.2, z); scene.add(trunk);
      const crown = new THREE.Mesh(new THREE.ConeGeometry(2.4, h, 10), treeMat);
      crown.position.set(x, h * 0.4 + h / 2, z); scene.add(crown);
    }
    addTree(-22, 6, 14); addTree(-26, 20, 16); addTree(-30, -10, 18);
    addTree(22, 6, 14); addTree(26, 20, 16); addTree(30, -10, 18);

    // Moon
    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf3f3e6 }));
    moonMesh.position.set(-34, 40, -70); scene.add(moonMesh);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 300;
      starPos[i * 3 + 1] = Math.random() * 100 + 25;
      starPos[i * 3 + 2] = -Math.random() * 160 - 20;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.4 }));
    scene.add(stars);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let targetZ = camera.position.z;
    let entering = false;
    let bobT = 0;

    function onPointerDown(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickables);
      if (!hits.length) return;
      const obj = hits[0].object;
      setShowHint(false);
      if (obj.userData.door) {
        entering = true;
        targetZ = DOOR_Z;
      } else {
        targetZ = Math.max(CLAMP_Z, targetZ - STEP);
      }
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      const dz = targetZ - camera.position.z;
      if (Math.abs(dz) > 0.02) {
        camera.position.z += dz * 0.05;
        bobT += 0.18;
        camera.position.y = 1.7 + Math.sin(bobT) * 0.045;
      } else {
        camera.position.y += (1.7 - camera.position.y) * 0.1;
      }
      camera.lookAt(0, 2.2, Math.max(0, camera.position.z - 6));
      if (entering && Math.abs(dz) < 0.05) {
        setPhase('entering');
      }
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      stoneTex.dispose();
      driveMat.map.dispose();
    };
  }, [phase]);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden select-none">
      <div ref={mountRef} className="absolute inset-0" style={{ opacity: phase === 'scene' || phase === 'entering' ? 1 : 0, transition: 'opacity 1s ease-in' }} />

      {phase === 'splash' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-12 h-12 text-primary teal-text-glow animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-primary teal-text-glow">MIND CHESS</h1>
          </div>
          <p className="text-sm text-muted-foreground italic mb-8">Let&apos;s Chess!</p>
          <div className="w-40 h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {phase === 'scene' && showHint && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none px-4">
          <div className="bg-card/80 backdrop-blur border border-primary/30 rounded-full px-5 py-2 text-sm text-foreground teal-glow-sm text-center">
            Touch the path to walk forward • Touch the door to enter
          </div>
        </div>
      )}

      {phase === 'entering' && <div className="absolute inset-0 bg-black" />}

      <button onClick={() => onComplete && onComplete()} className="absolute top-3 right-3 text-xs text-muted-foreground hover:text-foreground bg-card/60 px-3 py-1.5 rounded-full border border-border">
        Skip
      </button>
    </div>
  );
}

function makeStoneTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#D9D9D9'; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2400; i++) {
    const v = 180 + Math.floor(Math.random() * 60);
    ctx.fillStyle = `rgba(${v},${v},${v},0.5)`;
    const s = Math.random() * 2 + 0.5;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, s, s);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function makeBeigeBrickTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#B8A987'; ctx.fillRect(0, 0, 256, 256);
  const bw = 64, bh = 24, m = 4;
  for (let row = 0; row * bh < 256; row++) {
    const off = (row % 2) * (bw / 2);
    for (let x = -bw; x < 256 + bw; x += bw) {
      const bx = x + off + m / 2, by = row * bh + m / 2;
      const v = 192 + Math.floor(Math.random() * 28);
      ctx.fillStyle = `rgb(${v},${v - 22},${v - 52})`;
      ctx.fillRect(bx, by, bw - m, bh - m);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}