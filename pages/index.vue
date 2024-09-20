<template>
  <div class="home-page">
    <div ref="wrapperRef" class="wrapper" />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const { $gsap, $ScrollTrigger } = useNuxtApp()
const loader = new GLTFLoader()
const wrapperRef = ref()
const modelContainer = new THREE.Object3D()
let cameraDistanceIndex = 0.49
let cameraFov = 15
let scene
let camera
let model
let renderer

const loadModel = async () => {
  return await new Promise((resolve) => {
    loader.load('/3D/whisk.glb', (gltf) => {
      resolve(gltf.scene)
    })
  })
}

const changeModelRotation = (rotation: { x: number; y: number; z: number }) => {
  if (!rotation) return

  const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180

  if (!isNaN(rotation.z)) {
    modelContainer.rotation.z = degreesToRadians(rotation.z)
  }

  if (!isNaN(+rotation.y)) {
    modelContainer.rotation.y = degreesToRadians(rotation.y)
  }

  if (!isNaN(+rotation.x)) {
    modelContainer.rotation.x = degreesToRadians(rotation.x)
  }

  console.log('changeModelRotation - rotation: ', modelContainer.rotation)

  // $gsap.to(modelContainer.rotation, {
  //   duration: 2,
  //   y: degreesToRadians(rotation.y),
  //   x: degreesToRadians(rotation.x),
  //   z: degreesToRadians(rotation.z),
  // })
}

const updateCamera = (settings: {
  fov?: number
  distanceIndex?: number
  position?: { x?: number; y?: number; z?: number }
}) => {
  if (!isNaN(settings.fov)) {
    camera.fov = settings.fov
    camera.updateProjectionMatrix()
  }

  if (!isNaN(settings.distanceIndex)) {
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.fov * (Math.PI / 180) // Конвертуємо FOV у радіани
    const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * settings.distanceIndex
    console.log('updateCamera - settings.distanceIndex: ', { x: center.x, y: center.y, z: cameraDistance })
    camera.position.set(center.x, center.y, cameraDistance)
  }

  if (!settings?.position) return
  const fov = (camera.fov * Math.PI) / 180 // Конвертуємо FOV у радіани
  const depth = camera.position.z // Відстань до об'єкта (глибина)

  const height = 2 * Math.tan(fov / 2) * depth // Видима висота на цій відстані
  const width = height * camera.aspect // Видима ширина (враховуючи співвідношення сторін)

  // $gsap.to(camera.position, {
  //   duration: 2, // Тривалість анімації в секундах
  //   x: (width / 100) * (settings.position.x || 0), // Кінцева позиція по осі X
  //   y: (height / 100) * (settings.position.y || 0), // Кінцева позиція по осі Y
  // })

  console.log('updateCamera - settings.position: ', {
    x: (width / 100) * (settings.position.x || 0),
    y: (height / 100) * (settings.position.y || 0),
  })
  camera.position.x = (width / 100) * (settings.position.x || 0)
  camera.position.y = (height / 100) * (settings.position.y || 0)
}

const animate = () => {
  if (model) {
    // model.rotation.y += 0.01
  }

  renderer.render(scene, camera)
}

const steps = {
  step_1: {
    camera: {
      fov: 15,
      position: {
        x: 15.08708153626143,
        y: 0,
        z: 83.88525010479177,
      },
    },
    modelRotation: {
      x: 0,
      y: 0,
      z: -1.1344640137963142,
    },
  },
  step_2: {
    camera: {
      fov: 35,
      position: {
        x: -2.7276362739661293,
        y: 0,
        z: 36.41174296490267,
      },
    },
    modelRotation: {
      x: -1.3089969389957472,
      y: 0,
      z: 2.6529004630313806,
    },
  },
}
onMounted(async () => {
  model = await loadModel()
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(15, wrapperRef.value.clientWidth / wrapperRef.value.clientHeight, 0.001, 1000)
  renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, alpha: true })

  // Add a model and model container to the scene
  scene.add(model)
  modelContainer.add(model)
  scene.add(modelContainer)

  // Lighting settings
  const directionalLight = new THREE.DirectionalLight(0xffffff, 15)
  directionalLight.position.set(45, 45, 45)
  scene.add(directionalLight)

  // {
  //   "x": -0.002935499830156063,
  //   "y": 2.1911080408492865,
  //   "z": 83.88525010479177
  // }
  // -- POSITION STEP 1 START --
  // updateCamera({ fov: 15, distanceIndex: 0.49, position: { x: 46 } })
  // changeModelRotation({ x: 0, y: 0, z: -65 })
  camera.fov = 15
  camera.position.set(15.08708153626143, 0, 83.88525010479177)
  modelContainer.rotation.set(0, 0, -1.1344640137963142)
  camera.updateProjectionMatrix()

  // // -- POSITION STEP 2 START --
  // updateCamera({ fov: 35, distanceIndex: 0.49, position: { x: -8 } })
  // changeModelRotation({ x: -75, y: 0, z: 152 })
  // camera.fov = 35
  // camera.position.set(-2.7276362739661293, 0, 36.41174296490267)
  // modelContainer.rotation.set(-1.3089969389957472, 0, 2.6529004630313806)
  // camera.updateProjectionMatrix()
  //
  // // -- POSITION STEP 3 START --
  // updateCamera({ fov: 25, distanceIndex: 0.535, position: { x: 23.5 } })
  // changeModelRotation({ x: 60, y: 0, z: 25 })
  //
  // // -- POSITION STEP 4 START --
  // updateCamera({ fov: 25, distanceIndex: 0.41, position: { x: 23.5 } })
  // changeModelRotation({ x: -10, y: 60, z: 270 })
  //
  // // -- POSITION STEP 5 START --
  // updateCamera({ fov: 15, distanceIndex: 0.49, position: { x: 46 } })
  // changeModelRotation({ x: 0, y: 0, z: -65 })
  //

  // Update render and animation
  renderer.setSize(wrapperRef.value.clientWidth, wrapperRef.value.clientHeight)
  renderer.setAnimationLoop(animate)
  wrapperRef.value.appendChild(renderer.domElement)

  // camera.fov = settings.fov
  // camera.updateProjectionMatrix()
  // -- POSITION STEP 2 START --

  $gsap.to(camera, {
    fov: 35,
    scrollTrigger: {
      trigger: '.home-page',
      start: 'top top',
      end: '1000px top',
      scrub: true,
      markers: true,
      onUpdate: () => {
        camera.updateProjectionMatrix() // Оновлюємо матрицю проекції після зміни fov
      },
    },
  })

  $gsap.to(camera.position, {
    x: -2.7276362739661293,
    y: 0,
    z: 36.41174296490267,
    scrollTrigger: {
      trigger: '.home-page',
      start: 'top top',
      end: '1000px top',
      scrub: true,
      markers: true,
      pin: wrapperRef.value, // Фіксуємо блок у центрі
    },
  })

  $gsap.to(modelContainer.rotation, {
    x: -1.3089969389957472,
    y: 0,
    z: 2.6529004630313806,
    scrollTrigger: {
      trigger: '.home-page',
      start: 'top top',
      end: '1000px top',
      scrub: true,
      markers: true,
    },
  })

  // $gsap.to(renderer.domElement, {
  //   ease: 'none',
  //   // x: () => -(carouselLeft.value.scrollWidth - window.innerWidth),
  //   scrollTrigger: {
  //     trigger: wrapperRef.value,
  //     pin: wrapperRef.value,
  //     start: 'center center',
  //     end: () => '+=' + 5000,
  //     scrub: true,
  //     invalidateOnRefresh: true,
  //     // markers: true,
  //   },
  // })
})
</script>

<style lang="scss" scoped>
.home-page {
  position: relative;
  min-height: 7000px;

  .wrapper {
    width: 100vw;
    height: 100vh;
    border-bottom: 1px solid red;
  }
}
</style>
