import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import './RaceGame.css'

// --- World constants ---
const WORLD_HALF = 150 // world spans -150..150 on X and Z
const ROAD_STEP = 60 // grid spacing between roads
const ROAD_WIDTH = 12
const CAR_RADIUS = 1.3
const MINIMAP = 150

// Arcade car physics
const ACCEL = 30
const BRAKE = 45
const MAX_SPEED = 60
const REVERSE_MAX = -20
const TURN_RATE = 1.9

function makeSkyTexture() {
  const c = document.createElement('canvas')
  c.width = 16
  c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, 256)
  g.addColorStop(0, '#1a2a55')
  g.addColorStop(0.5, '#4f6fb5')
  g.addColorStop(0.8, '#9ec3e6')
  g.addColorStop(1, '#dfeefc')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 16, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeSportsCar(bodyColor, accent = 0x111111, withLights = true) {
  const car = new THREE.Group()
  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.5, roughness: 0.35 })

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.3, 2.4), bodyMat)
  chassis.position.y = 0.35
  chassis.castShadow = true
  car.add(chassis)

  const upper = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.32, 1.9), bodyMat)
  upper.position.set(0, 0.62, 0)
  upper.castShadow = true
  car.add(upper)

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.34, 0.95),
    new THREE.MeshStandardMaterial({ color: 0x111522, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.85 })
  )
  glass.position.set(0, 0.92, -0.05)
  car.add(glass)

  const spoilerMat = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.4, roughness: 0.5 })
  const wing = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.06, 0.35), spoilerMat)
  wing.position.set(0, 0.85, 1.15)
  car.add(wing)
  for (const sx of [-0.45, 0.45]) {
    const strut = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), spoilerMat)
    strut.position.set(sx, 0.72, 1.15)
    car.add(strut)
  }

  const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.24, 16)
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8 })
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 })
  const wheels = []
  for (const [wx, wz] of [[-0.62, 0.75], [0.62, 0.75], [-0.62, -0.75], [0.62, -0.75]]) {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat)
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(wx, 0.3, wz)
    wheel.castShadow = true
    car.add(wheel)
    wheels.push(wheel)
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.26, 12), rimMat)
    rim.rotation.z = Math.PI / 2
    rim.position.set(wx, 0.3, wz)
    car.add(rim)
    wheels.push(rim)
  }
  car.userData.wheels = wheels

  if (withLights) {
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff4cc, emissiveIntensity: 1.4 })
    for (const sx of [-0.35, 0.35]) {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.06), headMat)
      hl.position.set(sx, 0.5, -1.22)
      car.add(hl)
    }
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.6 })
    for (const sx of [-0.35, 0.35]) {
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.05), tailMat)
      tl.position.set(sx, 0.5, 1.22)
      car.add(tl)
    }
    car.userData.tailMat = tailMat
  }
  return car
}

function makeTree() {
  const tree = new THREE.Group()
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.25, 1.2, 7),
    new THREE.MeshStandardMaterial({ color: 0x5b3a1e, roughness: 1 })
  )
  trunk.position.y = 0.6
  trunk.castShadow = true
  tree.add(trunk)
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.9 })
  const f1 = new THREE.Mesh(new THREE.ConeGeometry(1, 1.8, 8), foliageMat)
  f1.position.y = 1.8
  f1.castShadow = true
  tree.add(f1)
  const f2 = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.4, 8), foliageMat)
  f2.position.y = 2.7
  f2.castShadow = true
  tree.add(f2)
  return tree
}

// True if (x,z) is on a grid road (so we keep it clear of buildings/trees).
function onRoad(x, z) {
  const nx = Math.abs(((x + WORLD_HALF) % ROAD_STEP) - ROAD_STEP / 2)
  const nz = Math.abs(((z + WORLD_HALF) % ROAD_STEP) - ROAD_STEP / 2)
  return nx < ROAD_WIDTH / 2 + 2 || nz < ROAD_WIDTH / 2 + 2
}

function RaceGame() {
  const mountRef = useRef(null)
  const miniRef = useRef(null)
  const apiRef = useRef(null)
  const [status, setStatus] = useState('ready') // 'ready' | 'playing'
  const [coins, setCoins] = useState(0)
  const [speedKmh, setSpeedKmh] = useState(0)
  const [best, setBest] = useState(0)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let width = mount.clientWidth
    let height = mount.clientHeight

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true })
    } catch (err) {
      console.warn('RaceGame: WebGL unavailable.', err)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = makeSkyTexture()
    scene.fog = new THREE.Fog(0x9ec3e6, 80, 220)

    const camera = new THREE.PerspectiveCamera(68, width / height, 0.1, 600)

    // --- Lights ---
    scene.add(new THREE.HemisphereLight(0xcfe4ff, 0x33402f, 0.85))
    const sun = new THREE.DirectionalLight(0xfff2d6, 1.1)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 80
    sun.shadow.camera.left = -30
    sun.shadow.camera.right = 30
    sun.shadow.camera.top = 30
    sun.shadow.camera.bottom = -30
    scene.add(sun)
    scene.add(sun.target)

    // --- Ground ---
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(WORLD_HALF * 2 + 80, WORLD_HALF * 2 + 80),
      new THREE.MeshStandardMaterial({ color: 0x3c7a40, roughness: 1 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // --- Road grid ---
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x23242c, roughness: 0.95 })
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf5c518 })
    for (let g = -WORLD_HALF; g <= WORLD_HALF; g += ROAD_STEP) {
      // road running along Z
      const rz = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_WIDTH, WORLD_HALF * 2 + 80), roadMat)
      rz.rotation.x = -Math.PI / 2
      rz.position.set(g, 0.01, 0)
      scene.add(rz)
      // road running along X
      const rx = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_HALF * 2 + 80, ROAD_WIDTH), roadMat)
      rx.rotation.x = -Math.PI / 2
      rx.position.set(0, 0.011, g)
      scene.add(rx)
      // centre lines
      const lz = new THREE.Mesh(new THREE.PlaneGeometry(0.25, WORLD_HALF * 2 + 80), lineMat)
      lz.rotation.x = -Math.PI / 2
      lz.position.set(g, 0.02, 0)
      scene.add(lz)
      const lx = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_HALF * 2 + 80, 0.25), lineMat)
      lx.rotation.x = -Math.PI / 2
      lx.position.set(0, 0.021, g)
      scene.add(lx)
    }

    // --- Buildings (block obstacles) ---
    const buildingBodies = [] // {x, z, r}
    const buildingPalette = [0x8d99ae, 0x6d6875, 0xb56576, 0x4a6fa5, 0x9a8c98, 0x707b7c]
    const buildingGeo = new THREE.BoxGeometry(1, 1, 1)
    for (let i = 0; i < 60; i++) {
      let x, z, tries = 0
      do {
        x = (Math.random() * 2 - 1) * (WORLD_HALF - 10)
        z = (Math.random() * 2 - 1) * (WORLD_HALF - 10)
        tries++
      } while (onRoad(x, z) && tries < 20)
      if (onRoad(x, z)) continue
      const w = 6 + Math.random() * 10
      const d = 6 + Math.random() * 10
      const h = 6 + Math.random() * 26
      const b = new THREE.Mesh(
        buildingGeo,
        new THREE.MeshStandardMaterial({ color: buildingPalette[i % buildingPalette.length], roughness: 0.85 })
      )
      b.scale.set(w, h, d)
      b.position.set(x, h / 2, z)
      b.castShadow = true
      b.receiveShadow = true
      scene.add(b)
      buildingBodies.push({ x, z, r: Math.max(w, d) / 2 })
    }

    // --- Trees ---
    for (let i = 0; i < 70; i++) {
      let x, z, tries = 0
      do {
        x = (Math.random() * 2 - 1) * WORLD_HALF
        z = (Math.random() * 2 - 1) * WORLD_HALF
        tries++
      } while (onRoad(x, z) && tries < 20)
      if (onRoad(x, z)) continue
      // skip if inside a building footprint
      if (buildingBodies.some((b) => Math.hypot(b.x - x, b.z - z) < b.r + 2)) continue
      const t = makeTree()
      t.position.set(x, 0, z)
      t.scale.setScalar(0.8 + Math.random() * 0.8)
      scene.add(t)
    }

    // --- Coins (collectibles) ---
    const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd24a, emissive: 0xffb300, emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.3 })
    const coinGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.18, 20)
    const coinList = []
    const placeCoin = (coin) => {
      let x, z, tries = 0
      do {
        x = (Math.random() * 2 - 1) * (WORLD_HALF - 5)
        z = (Math.random() * 2 - 1) * (WORLD_HALF - 5)
        tries++
      } while (buildingBodies.some((b) => Math.hypot(b.x - x, b.z - z) < b.r + 2) && tries < 30)
      coin.position.set(x, 1.1, z)
      coin.visible = true
    }
    for (let i = 0; i < 14; i++) {
      const coin = new THREE.Mesh(coinGeo, coinMat)
      coin.rotation.x = Math.PI / 2
      placeCoin(coin)
      scene.add(coin)
      coinList.push(coin)
    }

    // --- Player car ---
    const player = makeSportsCar(0x4f7bff, 0x1b1b1b)
    scene.add(player)
    const headlight = new THREE.SpotLight(0xfff2cc, 3, 45, Math.PI / 6, 0.4, 1)
    scene.add(headlight)
    scene.add(headlight.target)

    // --- Dust particles ---
    const PCOUNT = 100
    const pPos = new Float32Array(PCOUNT * 3)
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xcfc4b0, size: 0.14, transparent: true, opacity: 0.45 }))
    scene.add(particles)

    // --- Input ---
    const keys = new Set()
    const onKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault()
      keys.add(e.key)
    }
    const onKeyUp = (e) => keys.delete(e.key)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    // --- Car state ---
    const car = { x: 6, z: 6, heading: 0, speed: 0 }
    const game = { running: false, coins: 0 }
    let pIdx = 0

    apiRef.current = {
      start() {
        car.x = 6
        car.z = 6
        car.heading = 0
        car.speed = 0
        game.running = true
        game.coins = 0
        coinList.forEach((c) => placeCoin(c))
        // init dust behind car
        for (let i = 0; i < PCOUNT; i++) {
          pPos[i * 3] = car.x
          pPos[i * 3 + 1] = 0.1
          pPos[i * 3 + 2] = car.z
        }
      },
    }

    const onResize = () => {
      width = mount.clientWidth
      height = mount.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
    const clock = new THREE.Clock()
    let frameId
    let uiThrottle = 0

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05)

      // spin coins
      coinList.forEach((c) => { if (c.visible) c.rotation.z += dt * 2 })

      if (game.running) {
        const left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A')
        const right = keys.has('ArrowRight') || keys.has('d') || keys.has('D')
        const accel = keys.has('ArrowUp') || keys.has('w') || keys.has('W')
        const brake = keys.has('ArrowDown') || keys.has('s') || keys.has('S')

        if (accel) car.speed += ACCEL * dt
        else if (brake) car.speed -= BRAKE * dt
        else car.speed *= 0.96 // coast/drag
        car.speed = clamp(car.speed, REVERSE_MAX, MAX_SPEED)
        if (Math.abs(car.speed) < 0.05) car.speed = 0

        // steering scales with speed and reverses when going backwards
        const steer = (left ? 1 : 0) - (right ? 1 : 0)
        const grip = Math.min(Math.abs(car.speed) / 6, 1) * Math.sign(car.speed || 1)
        car.heading += steer * TURN_RATE * dt * grip

        // forward vector after Y-rotation = (-sin h, -cos h)
        const fx = -Math.sin(car.heading)
        const fz = -Math.cos(car.heading)
        let nx = car.x + fx * car.speed * dt
        let nz = car.z + fz * car.speed * dt
        nx = clamp(nx, -WORLD_HALF, WORLD_HALF)
        nz = clamp(nz, -WORLD_HALF, WORLD_HALF)

        // building collision — block and bleed off speed
        const hit = buildingBodies.some((b) => Math.hypot(b.x - nx, b.z - nz) < b.r + CAR_RADIUS)
        if (hit) car.speed *= -0.25
        else { car.x = nx; car.z = nz }

        // coin pickup
        coinList.forEach((c) => {
          if (c.visible && Math.hypot(c.position.x - car.x, c.position.z - car.z) < 2.2) {
            c.visible = false
            game.coins += 1
            placeCoin(c) // respawn elsewhere → endless
            setCoins(game.coins)
            setBest((bs) => Math.max(bs, game.coins))
          }
        })

        // apply transform to car model
        player.position.set(car.x, 0, car.z)
        player.rotation.y = car.heading
        player.rotation.z = -steer * 0.08 * Math.min(Math.abs(car.speed) / 20, 1) // body roll
        player.userData.wheels.forEach((w) => { w.rotation.x -= car.speed * dt * 0.5 })
        if (player.userData.tailMat) player.userData.tailMat.emissiveIntensity = brake ? 2.2 : 0.6

        // headlight forward
        headlight.position.set(car.x + fx, 1.2, car.z + fz)
        headlight.target.position.set(car.x + fx * 20, 0, car.z + fz * 20)

        // dust behind car when moving fast
        const arr = pGeo.attributes.position.array
        for (let i = 0; i < PCOUNT; i++) {
          if (arr[i * 3 + 1] > 1.4 || Math.random() < 0.04) {
            arr[i * 3] = car.x - fx * 1.2 + (Math.random() - 0.5) * 0.8
            arr[i * 3 + 1] = 0.1
            arr[i * 3 + 2] = car.z - fz * 1.2 + (Math.random() - 0.5) * 0.8
          } else {
            arr[i * 3 + 1] += dt * 0.6
          }
        }
        pGeo.attributes.position.needsUpdate = true

        // sun + shadow follow the car
        sun.position.set(car.x - 20, 40, car.z + 12)
        sun.target.position.set(car.x, 0, car.z)

        // chase camera (behind = -forward)
        const camDist = 9 + Math.abs(car.speed) * 0.08
        const desiredX = car.x - fx * camDist
        const desiredZ = car.z - fz * camDist
        camera.position.x += (desiredX - camera.position.x) * Math.min(1, 6 * dt)
        camera.position.z += (desiredZ - camera.position.z) * Math.min(1, 6 * dt)
        camera.position.y += (5.5 - camera.position.y) * Math.min(1, 6 * dt)
        const targetFov = 68 + Math.max(0, car.speed) * 0.3
        camera.fov += (targetFov - camera.fov) * 0.05
        camera.updateProjectionMatrix()
        camera.lookAt(car.x + fx * 4, 1.2, car.z + fz * 4)

        // HUD throttle
        uiThrottle += dt
        if (uiThrottle > 0.1) {
          uiThrottle = 0
          setSpeedKmh(Math.round(Math.abs(car.speed) * 3.6))
        }
      } else {
        // slow idle orbit on the menu
        pIdx += dt * 0.15
        camera.position.set(Math.sin(pIdx) * 18, 9, Math.cos(pIdx) * 18 + 6)
        camera.lookAt(0, 0, 0)
        sun.position.set(-20, 40, 12)
        sun.target.position.set(0, 0, 0)
      }

      // --- Minimap ---
      const mini = miniRef.current
      const mctx = mini ? mini.getContext('2d') : null
      if (mctx) {
        mctx.clearRect(0, 0, MINIMAP, MINIMAP)
        mctx.fillStyle = 'rgba(20,28,46,0.85)'
        mctx.fillRect(0, 0, MINIMAP, MINIMAP)
        const sc = MINIMAP / (WORLD_HALF * 2)
        const toX = (x) => MINIMAP / 2 + x * sc
        const toY = (z) => MINIMAP / 2 + z * sc
        // buildings
        mctx.fillStyle = '#5b6478'
        buildingBodies.forEach((b) => mctx.fillRect(toX(b.x) - 1.5, toY(b.z) - 1.5, 3, 3))
        // coins
        mctx.fillStyle = '#ffd24a'
        coinList.forEach((c) => { if (c.visible) { mctx.beginPath(); mctx.arc(toX(c.position.x), toY(c.position.z), 2, 0, Math.PI * 2); mctx.fill() } })
        // player arrow
        mctx.save()
        mctx.translate(toX(car.x), toY(car.z))
        mctx.rotate(-car.heading)
        mctx.fillStyle = '#4f7bff'
        mctx.beginPath()
        mctx.moveTo(0, -5)
        mctx.lineTo(3.5, 4)
        mctx.lineTo(-3.5, 4)
        mctx.closePath()
        mctx.fill()
        mctx.restore()
      }

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onResize)
      apiRef.current = null
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => m.dispose())
        }
      })
      if (scene.background && scene.background.dispose) scene.background.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      renderer.forceContextLoss()
      renderer.dispose()
    }
  }, [])

  const handleStart = () => {
    setCoins(0)
    setSpeedKmh(0)
    setStatus('playing')
    apiRef.current?.start()
  }

  return (
    <div className="race-game">
      <div className="race-canvas" ref={mountRef} />

      {status === 'playing' && (
        <>
          <div className="race-hud">
            <div className="race-gauge">
              <span className="race-kmh">{speedKmh}</span>
              <span className="race-kmh-label">km/h</span>
            </div>
            <div className="race-dist">
              <span className="race-score">🪙 {coins}</span>
              <span className="race-kmh-label">coins</span>
            </div>
            <span className="race-hint">↑ drive · ↓ reverse/brake · ← → steer</span>
          </div>
          <canvas className="race-minimap" ref={miniRef} width={MINIMAP} height={MINIMAP} />
        </>
      )}

      {status === 'ready' && (
        <div className="race-overlay">
          <h3>🌍 Open World Drive</h3>
          <p>Free-roam an open city. Cruise the roads, explore the blocks, and grab the gold coins.</p>
          <button className="btn btn-primary btn-lg" onClick={handleStart}>
            Start Driving
          </button>
          <span className="race-controls">↑ drive · ↓ reverse/brake · ← → steer · best: {best} 🪙</span>
        </div>
      )}
    </div>
  )
}

export default RaceGame
