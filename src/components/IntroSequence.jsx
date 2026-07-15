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
    scene.background = new THREE.Color(0x07070d);
    scene.fog = new THREE.Fog(0x07070d, 12, 80);

    const camera = new THREE.PerspectiveCamera(62, mount.clientWidth / mount.clientHeight, 0.1, 300);
    camera.position.set(0, 1.7, 46);
    camera.lookAt(0, 1.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x404060, 0.7));
    const moonLight = new THREE.DirectionalLight(0xb0c4ff, 0.9);
    moonLight.position.set(-30, 40, -30);
    scene.add(moonLight);
    const warmGlow = new THREE.PointLight(0xffaa55, 1.4, 30);
    warmGlow.position.set(0, 3, 4);
    scene.add(warmGlow);

    const brickTex = makeBrickTexture();
    const wallTex = brickTex.clone(); wallTex.needsUpdate = true; wallTex.repeat.set(2, 1.5);
    const pathTex = brickTex.clone(); pathTex.needsUpdate = true; pathTex.repeat.set(1, 6);

    const brickMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95, metalness: 0 });
    const slateMat = new THREE.MeshStandardMaterial({ color: 0x2a2a35, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3a2418, roughness: 0.7, emissive: 0x1a0f08, emissiveIntensity: 0.35 });
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x161b13, roughness: 1 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d0, roughness: 0.8 });

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), grassMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const mansion = new THREE.Group();
    const hall = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 5), brickMat);
    hall.position.set(0, 3, 0); mansion.add(hall);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(6.6, 3.6, 4), slateMat);
    roof.position.set(0, 7.8, 0); roof.rotation.y = Math.PI / 4; mansion.add(roof);

    const towerGeo = new THREE.BoxGeometry(2.2, 8, 2.2);
    const leftTower = new THREE.Mesh(towerGeo, brickMat); leftTower.position.set(-5, 4, -1); mansion.add(leftTower);
    const rightTower = new THREE.Mesh(towerGeo, brickMat); rightTower.position.set(5, 4, -1); mansion.add(rightTower);
    const tRoofGeo = new THREE.ConeGeometry(2.1, 3.2, 4);
    const lRoof = new THREE.Mesh(tRoofGeo, slateMat); lRoof.position.set(-5, 8.6, -1); lRoof.rotation.y = Math.PI / 4; mansion.add(lRoof);
    const rRoof = new THREE.Mesh(tRoofGeo, slateMat); rRoof.position.set(5, 8.6, -1); rRoof.rotation.y = Math.PI / 4; mansion.add(rRoof);

    const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3, 0.3), woodMat);
    door.position.set(0, 1.5, 2.6); door.userData.door = true; mansion.add(door);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 3.5, 0.2), new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.8 }));
    frame.position.set(0, 1.75, 2.5); mansion.add(frame);

    const winMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffcc66, emissiveIntensity: 0.95 });
    const winGeo = new THREE.PlaneGeometry(1.2, 1.7);
    const w1 = new THREE.Mesh(winGeo, winMat); w1.position.set(-2.6, 4, 2.51); mansion.add(w1);
    const w2 = new THREE.Mesh(winGeo, winMat); w2.position.set(2.6, 4, 2.51); mansion.add(w2);
    const oculus = new THREE.Mesh(new THREE.CircleGeometry(0.6, 16), winMat);
    oculus.position.set(0, 5.2, 2.51); mansion.add(oculus);

    const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 1.6), slateMat);
    porchRoof.position.set(0, 3.4, 3.2); mansion.add(porchRoof);
    const pGeo = new THREE.BoxGeometry(0.22, 3.4, 0.22);
    const pl = new THREE.Mesh(pGeo, pillarMat); pl.position.set(-1.35, 1.7, 3.2); mansion.add(pl);
    const pr = new THREE.Mesh(pGeo, pillarMat); pr.position.set(1.35, 1.7, 3.2); mansion.add(pr);

    const step1 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 0.5), stoneMat); step1.position.set(0, 0.1, 3.1); mansion.add(step1);
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 0.5), stoneMat); step2.position.set(0, 0.1, 3.5); mansion.add(step2);

    const chimGeo = new THREE.BoxGeometry(0.8, 2, 0.8);
    const c1 = new THREE.Mesh(chimGeo, brickMat); c1.position.set(-2.5, 8, 0.5); mansion.add(c1);
    const c2 = new THREE.Mesh(chimGeo, brickMat); c2.position.set(2.5, 8, -1.5); mansion.add(c2);

    const lanternMat = new THREE.MeshStandardMaterial({ emissive: 0xffcc66, emissiveIntensity: 1.3, color: 0x000000 });
    const lanternGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const ll = new THREE.Mesh(lanternGeo, lanternMat); ll.position.set(-1.25, 2.4, 2.75); mansion.add(ll);
    const lr = new THREE.Mesh(lanternGeo, lanternMat); lr.position.set(1.25, 2.4, 2.75); mansion.add(lr);
    const llLight = new THREE.PointLight(0xffaa55, 0.9, 8); llLight.position.copy(ll.position); mansion.add(llLight);
    const lrLight = new THREE.PointLight(0xffaa55, 0.9, 8); lrLight.position.copy(lr.position); mansion.add(lrLight);

    scene.add(mansion);

    const pathMat = new THREE.MeshStandardMaterial({ map: pathTex, roughness: 0.95 });
    const clickables = [];
    const STEP = 7;
    const DOOR_Z = 5.5;
    for (let z = 6; z <= 44; z += 1.2) {
      const brick = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 1.0), pathMat);
      brick.position.set(0, 0.07, z);
      brick.userData.brick = true;
      scene.add(brick);
      clickables.push(brick);
    }
    clickables.push(door);

    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf5f5e8 }));
    moonMesh.position.set(-30, 38, -60); scene.add(moonMesh);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 250;
      starPos[i * 3 + 1] = Math.random() * 90 + 20;
      starPos[i * 3 + 2] = -Math.random() * 140 - 20;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.35 }));
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
        targetZ = Math.max(DOOR_Z + 0.5, targetZ - STEP);
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
      camera.lookAt(0, 1.6, Math.max(0, camera.position.z - 6));
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
      brickTex.dispose(); wallTex.dispose(); pathTex.dispose();
    };
  }, [phase]);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden select-none">
      <div ref={mountRef} className="absolute inset-0" style={{ opacity: phase === 'scene' || phase === 'entering' ? 1 : 0, transition: 'opacity 1s ease-in' }} />

      {phase === 'splash' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-12 h-12 text-primary teal-text-glow animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-primary teal-text-glow">CHESS MIND</h1>
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

function makeBrickTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#2a1a14'; ctx.fillRect(0, 0, 256, 256);
  const bw = 70, bh = 26, m = 4;
  for (let row = 0; row * bh < 256; row++) {
    const off = (row % 2) * (bw / 2);
    for (let x = -bw; x < 256 + bw; x += bw) {
      const bx = x + off + m / 2, by = row * bh + m / 2;
      const r = 120 + Math.floor(Math.random() * 30);
      const g = 60 + Math.floor(Math.random() * 20);
      const b = 45 + Math.floor(Math.random() * 15);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(bx, by, bw - m, bh - m);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}