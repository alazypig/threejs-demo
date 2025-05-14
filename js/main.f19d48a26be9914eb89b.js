/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/controller/orbit-controller.js":
/*!********************************************!*\
  !*** ./src/controller/orbit-controller.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initOrbitControls": () => (/* binding */ initOrbitControls)
/* harmony export */ });
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");


const initOrbitControls = (camera, renderer) => {
  const controller = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement)
  controller.enableDamping = true
  controller.dampingFactor = 0.05
  controller.minDistance = 1
  controller.maxDistance = 100
  controller.minPolarAngle = Math.PI / 4
  controller.maxPolarAngle = (3 * Math.PI) / 4

  return controller
}


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_geometries_TextGeometry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/geometries/TextGeometry */ "./node_modules/three/examples/jsm/geometries/TextGeometry.js");
/* harmony import */ var three_examples_jsm_loaders_FontLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/loaders/FontLoader */ "./node_modules/three/examples/jsm/loaders/FontLoader.js");
/* harmony import */ var three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/loaders/GLTFLoader */ "./node_modules/three/examples/jsm/loaders/GLTFLoader.js");
/* harmony import */ var _util_modelUtil__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/modelUtil */ "./src/util/modelUtil.js");
/* harmony import */ var _util_sprite_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util/sprite-util */ "./src/util/sprite-util.js");
/* harmony import */ var _util_standard_scene__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util/standard-scene */ "./src/util/standard-scene.js");
// Use sprites and sprite material for a simple rendering








const createPoints = () => {
  const points = []
  const range = 5
  for (let i = 0; i < 10000; i++) {
    let particle = new three__WEBPACK_IMPORTED_MODULE_6__.Vector3(
      Math.random() * range - range / 2 - 4, // 整体向左移动
      Math.random() * range - range / 2,
      Math.random() * range - range / 2
    )

    points.push(particle)
  }

  const colors = new Float32Array(points.length * 3)
  points.forEach((e, i) => {
    const c = new three__WEBPACK_IMPORTED_MODULE_6__.Color(Math.random() * 0xffffff)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  })

  const geom = new three__WEBPACK_IMPORTED_MODULE_6__.BufferGeometry().setFromPoints(points)
  geom.setAttribute("color", new three__WEBPACK_IMPORTED_MODULE_6__.BufferAttribute(colors, 3, true))

  return geom
}

const createTextMesh = () => {
  return new Promise((resolve, reject) => {
    // 加载字体
    const loader = new three_examples_jsm_loaders_FontLoader__WEBPACK_IMPORTED_MODULE_1__.FontLoader()
    loader.load(
      "/threejs-demo/assets/fonts/helvetiker_regular.typeface.json",
      // "/assets/fonts/helvetiker_regular.typeface.json",
      (font) => {
        // 创建文字几何体
        const textGeometry = new three_examples_jsm_geometries_TextGeometry__WEBPACK_IMPORTED_MODULE_0__.TextGeometry("Edward", {
          font: font,
          size: 1, // 文字大小
          height: 0.2, // 文字深度
          curveSegments: 12, // 曲线细分程度
          bevelEnabled: false, // 是否启用斜面
        })

        // 将文字几何体居中
        textGeometry.center()
        // 创建材质
        const textMaterial = new three__WEBPACK_IMPORTED_MODULE_6__.MeshBasicMaterial({
          color: 0xa44bcd, // 文字主体颜色（紫色）
        })
        // 创建 Mesh
        const textMesh = new three__WEBPACK_IMPORTED_MODULE_6__.Mesh(textGeometry, textMaterial)
        // 调整位置（可选：避免与点云重叠）
        textMesh.position.z = 0
        textMesh.position.x = -0.5 // 向左偏
        textMesh.position.y = 5

        resolve(textMesh)
      },
      undefined,
      (error) => {
        reject(error)
      }
    )
  })
}

const loadGltfModel = () => {
  return new Promise((resolve, reject) => {
    const loader = new three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_2__.GLTFLoader()
    loader
      .loadAsync("/threejs-demo/assets/models/forest_house/scene.gltf")
      // .loadAsync("/assets/models/forest_house/scene.gltf")
      .then((structure) => {
        structure.scene.scale.setScalar(40)
        ;(0,_util_modelUtil__WEBPACK_IMPORTED_MODULE_3__.visitChildren)(structure.scene, (child) => {
          if (child.material) {
            child.material.depthWrite = true
          }
        })
        // 调整模型位置（可选：确保与文字和点云不冲突）
        structure.scene.position.x = 4
        structure.scene.position.y = -3
        structure.scene.position.z = 0
        resolve(structure.scene)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const createFloor = () => {
  // 创建一个有厚度的地板，使用 BoxGeometry
  const floorGeometry = new three__WEBPACK_IMPORTED_MODULE_6__.BoxGeometry(20, 0.5, 20) // 宽度 20，厚度 0.5，深度 20
  // 创建材质，颜色为白灰色，支持光照
  const floorMaterial = new three__WEBPACK_IMPORTED_MODULE_6__.MeshPhongMaterial({
    color: 0xcccccc, // 白灰色
    shininess: 60, // 适中的高光反射，适合聚光灯效果
  })
  // 创建地板 Mesh
  const floor = new three__WEBPACK_IMPORTED_MODULE_6__.Mesh(floorGeometry, floorMaterial)
  // 调整位置，放置在场景底部
  floor.position.y = -3 // 低于点云和模型
  floor.castShadow = false
  return floor
}

const createSpotLight = () => {
  // 创建聚光灯
  const spotLight = new three__WEBPACK_IMPORTED_MODULE_6__.SpotLight(
    0xffffff, // 白色光
    1.5, // 强度
    30, // 最大照射距离
    0.3, // 照射角度（30度）
    0.5, // 半影衰减（边缘柔和度）
    1.5 // 衰减率
  )
  // 设置聚光灯位置（上方偏侧）
  spotLight.position.set(12, 9, -8)
  // 设置聚光灯目标（聚焦于场景中心下方，靠近 GLTF 模型）
  spotLight.target.position.set(0, -5, 0)
  // 启用阴影投射
  spotLight.castShadow = true
  // 调整阴影参数（可选：提高阴影质量）
  spotLight.shadow.mapSize.width = 2048 // 提高分辨率
  spotLight.shadow.mapSize.height = 2048
  spotLight.shadow.camera.near = 0.1 // 缩小 near 值
  spotLight.shadow.camera.far = 40 // 增加 far 值
  spotLight.shadow.camera.left = -15 // 扩大阴影相机范围
  spotLight.shadow.camera.right = 15
  spotLight.shadow.camera.top = 15
  spotLight.shadow.camera.bottom = -15

  return { spotLight, target: spotLight.target }
}

// 在全局范围内存储文字对象和链接的映射
const textMeshes = []
const textLinks = {}
// 创建多个 TextGeometry 并放置在地板上
const createMultipleTextMeshes = () => {
  return new Promise((resolve, reject) => {
    const loader = new three_examples_jsm_loaders_FontLoader__WEBPACK_IMPORTED_MODULE_1__.FontLoader()
    loader.load(
      "/threejs-demo/assets/fonts/helvetiker_regular.typeface.json",
      // "/assets/fonts/helvetiker_regular.typeface.json",
      (font) => {
        // 定义多个文字和对应的跳转链接
        const texts = [
          {
            content: "Blog",
            link: "https://alazypig.com/",
            x: 4,
            y: -2.7,
            z: 3,
          },
          {
            content: "Github",
            link: "https://github.com/alazypig",
            x: 4,
            y: -2.7,
            z: 4,
          },
          {
            content: "Photography",
            link: "album.alazypig.com",
            x: 4,
            y: -2.7,
            z: 5,
          },
        ]
        texts.forEach((item) => {
          // 创建文字几何体
          const textGeometry = new three_examples_jsm_geometries_TextGeometry__WEBPACK_IMPORTED_MODULE_0__.TextGeometry(item.content, {
            font: font,
            size: 0.5, // 文字大小
            height: 0.1, // 文字深度
            curveSegments: 12,
            bevelEnabled: false,
          })

          textGeometry.computeBoundingBox()
          const boundingBox = textGeometry.boundingBox
          const width = boundingBox.max.x - boundingBox.min.x

          const textMaterial = new three__WEBPACK_IMPORTED_MODULE_6__.MeshBasicMaterial({
            color: 0xa44bcd, // 紫色，与场景风格一致
          })
          const textMesh = new three__WEBPACK_IMPORTED_MODULE_6__.Mesh(textGeometry, textMaterial)

          // 设置文字位置（在地板上方）
          textMesh.position.set(item.x - width, item.y, item.z)
          textMesh.rotation.x = -Math.PI / 2 // 使文字垂直向上

          textMeshes.push(textMesh) // 存储文字对象以便后续交互
          textLinks[textMesh.uuid] = item.link // 存储文字和链接的映射
        })
        resolve(textMeshes)
      },
      undefined,
      (error) => {
        reject(error)
      }
    )
  })
}

// 设置 Raycaster 和鼠标事件监听以实现点击跳转
const setupInteraction = (scene, camera) => {
  const raycaster = new three__WEBPACK_IMPORTED_MODULE_6__.Raycaster()
  const mouse = new three__WEBPACK_IMPORTED_MODULE_6__.Vector2()
  // 鼠标移动事件（hover 效果）
  const onMouseMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(textMeshes, true)
    if (intersects.length > 0) {
      // 如果鼠标悬停在文字上，改变光标样式
      document.body.style.cursor = "pointer"
      intersects[0].object.material.color.set(0xff69b4) // 高亮颜色
    } else {
      document.body.style.cursor = "default"
      // 恢复默认颜色
      textMeshes.forEach((mesh) => mesh.material.color.set(0xa44bcd))
    }
  }
  // 鼠标点击事件（跳转网页）
  const onMouseClick = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(textMeshes, true)
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object
      const link = textLinks[clickedMesh.uuid]
      if (link) {
        window.open(link, "_blank") // 在新标签页中打开链接
      }
    }
  }
  // 绑定事件监听
  window.addEventListener("mousemove", onMouseMove, false)
  window.addEventListener("click", onMouseClick, false)
}

async function initScene() {
  // 创建文字 Mesh
  const textMesh = await createTextMesh()
  const model = await loadGltfModel()
  const floor = createFloor()
  const { spotLight, target } = createSpotLight()
  const multipleTextMeshes = await createMultipleTextMeshes()

  ;(0,_util_standard_scene__WEBPACK_IMPORTED_MODULE_5__.bootstrapGeometryScene)({
    geometry: createPoints(),
    backgroundColor: 0x404040,
    provideGui: (gui, points, scene, camera) => {
      scene.add(floor)
      scene.add(textMesh)
      scene.add(model)
      scene.add(spotLight)
      scene.add(target)

      multipleTextMeshes.forEach((textMesh) => scene.add(textMesh))

      // 遍历 GLTF 模型子对象，启用阴影接收
      ;(0,_util_modelUtil__WEBPACK_IMPORTED_MODULE_3__.visitChildren)(model, (child) => {
        if (child.isMesh) {
          child.receiveShadow = true
          child.castShadow = true // 可选：模型也投射阴影
        }
      })

      setupInteraction(scene, camera)
    },
    material: new three__WEBPACK_IMPORTED_MODULE_6__.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      color: 0xffffff,
      map: (0,_util_sprite_util__WEBPACK_IMPORTED_MODULE_4__.createGhostTexture)(),
    }),
  }).then()
}

initScene().catch((error) => {
  console.error("Failed to initialize scene:", error)
})


/***/ }),

/***/ "./src/util/bootstrap.js":
/*!*******************************!*\
  !*** ./src/util/bootstrap.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initScene": () => (/* binding */ initScene)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _controller_orbit_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controller/orbit-controller */ "./src/controller/orbit-controller.js");
/* harmony import */ var _update_on_resize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./update-on-resize */ "./src/util/update-on-resize.js");




const initScene = ({
  backgroundColor,
  fogColor,
  disableDefaultControls,
}) => {
  const init = (fn) => {
    // basic scene setup
    const scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene()
    if (backgroundColor) {
      scene.backgroundColor = backgroundColor
    }

    if (fogColor) {
      scene.fog = new three__WEBPACK_IMPORTED_MODULE_2__.Fog(fogColor, 0.0025, 50)
    }

    // setup camera and basic renderer
    const camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer({ antialias: true })
    renderer.outputEncoding = three__WEBPACK_IMPORTED_MODULE_2__.sRGBEncoding
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = three__WEBPACK_IMPORTED_MODULE_2__.PCFSoftShadowMap
    renderer.setClearColor(backgroundColor)

    ;(0,_update_on_resize__WEBPACK_IMPORTED_MODULE_1__.onResize)(camera, renderer)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // initialize orbit controls
    let orbitControls
    if (!disableDefaultControls) {
      orbitControls = (0,_controller_orbit_controller__WEBPACK_IMPORTED_MODULE_0__.initOrbitControls)(camera, renderer)
    }

    fn({ scene, camera, renderer, orbitControls })
  }

  return init
}


/***/ }),

/***/ "./src/util/modelUtil.js":
/*!*******************************!*\
  !*** ./src/util/modelUtil.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyShadowsAndDepthWrite": () => (/* binding */ applyShadowsAndDepthWrite),
/* harmony export */   "findChild": () => (/* binding */ findChild),
/* harmony export */   "visitChildren": () => (/* binding */ visitChildren)
/* harmony export */ });
const visitChildren = (object, fn) => {
  if (object.children && object.children.length > 0) {
    for (const child of object.children) {
      visitChildren(child, fn)
    }
  } else {
    fn(object)
  }
}

const applyShadowsAndDepthWrite = (object) => {
  visitChildren(object, (child) => {
    if (child.material) {
      child.material.depthWrite = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

const findChild = (object, name) => {
  if (object.children && object.children.length > 0) {
    for (const child of object.children) {
      if (name === child.name) {
        return child
      } else {
        const res = findChild(child, name)
        if (res) {
          return res
        }
      }
    }
  } else {
    if (name === object.name) {
      return object
    } else {
      return undefined
    }
  }
}


/***/ }),

/***/ "./src/util/sprite-util.js":
/*!*********************************!*\
  !*** ./src/util/sprite-util.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createGhostTexture": () => (/* binding */ createGhostTexture)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");


const createGhostTexture = () => {
  const canvas = document.createElement("canvas")
  canvas.width = 32
  canvas.height = 32

  const ctx = canvas.getContext("2d")

  const img = new Image()
  img.src = "/threejs-demo/assets/avatar.jpeg"
  // img.src = "/assets/avatar.jpeg"
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    texture.needsUpdate = true
  }

  const texture = new three__WEBPACK_IMPORTED_MODULE_0__.Texture(canvas)
  texture.needsUpdate = true
  return texture
}


/***/ }),

/***/ "./src/util/standard-scene.js":
/*!************************************!*\
  !*** ./src/util/standard-scene.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bootstrapGeometryScene": () => (/* binding */ bootstrapGeometryScene)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bootstrap */ "./src/util/bootstrap.js");



const bootstrapGeometryScene = async ({
  geometry,
  provideGui,
  material,
  isSprite,
  spritePosition,
  onRender,
  provideMesh,
  backgroundColor,
}) => {
  const props = {
    backgroundColor: backgroundColor ?? 0xffffff,
    fogColor: 0xffffff,
    disableLights: true,
  }

  // const gui = new GUI()
  const points = provideMesh
    ? provideMesh(geometry)
    : isSprite
      ? new three__WEBPACK_IMPORTED_MODULE_1__.Sprite(material)
      : new three__WEBPACK_IMPORTED_MODULE_1__.Points(geometry, material)

  if (spritePosition) points.position.copy(spritePosition)

  const init = async () => {
    ;(0,_bootstrap__WEBPACK_IMPORTED_MODULE_0__.initScene)(props)(({ scene, camera, renderer, orbitControls }) => {
      renderer.shadowMap.type = three__WEBPACK_IMPORTED_MODULE_1__.PCFSoftShadowMap
      camera.position.x = 2
      camera.position.z = 10
      camera.position.y = 5
      orbitControls.update()

      function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        orbitControls.update()
        if (onRender) onRender(points)
      }

      animate()

      scene.add(points)
      provideGui(null, points, scene, camera)
    })
  }

  init().then()
}


/***/ }),

/***/ "./src/util/update-on-resize.js":
/*!**************************************!*\
  !*** ./src/util/update-on-resize.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onResize": () => (/* binding */ onResize)
/* harmony export */ });
const onResize = (camera, renderer) => {
  const resizer = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', resizer, false)
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkltjs_fourth"] = self["webpackChunkltjs_fourth"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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REFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sdGpzLWZvdXJ0aC8uL3NyYy9jb250cm9sbGVyL29yYml0LWNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vbHRqcy1mb3VydGgvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbHRqcy1mb3VydGgvLi9zcmMvdXRpbC9ib290c3RyYXAuanMiLCJ3ZWJwYWNrOi8vbHRqcy1mb3VydGgvLi9zcmMvdXRpbC9tb2RlbFV0aWwuanMiLCJ3ZWJwYWNrOi8vbHRqcy1mb3VydGgvLi9zcmMvdXRpbC9zcHJpdGUtdXRpbC5qcyIsIndlYnBhY2s6Ly9sdGpzLWZvdXJ0aC8uL3NyYy91dGlsL3N0YW5kYXJkLXNjZW5lLmpzIiwid2VicGFjazovL2x0anMtZm91cnRoLy4vc3JjL3V0aWwvdXBkYXRlLW9uLXJlc2l6ZS5qcyIsIndlYnBhY2s6Ly9sdGpzLWZvdXJ0aC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9sdGpzLWZvdXJ0aC93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2x0anMtZm91cnRoL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9sdGpzLWZvdXJ0aC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2x0anMtZm91cnRoL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbHRqcy1mb3VydGgvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vbHRqcy1mb3VydGgvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9sdGpzLWZvdXJ0aC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vbHRqcy1mb3VydGgvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scydcblxuZXhwb3J0IGNvbnN0IGluaXRPcmJpdENvbnRyb2xzID0gKGNhbWVyYSwgcmVuZGVyZXIpID0+IHtcbiAgY29uc3QgY29udHJvbGxlciA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudClcbiAgY29udHJvbGxlci5lbmFibGVEYW1waW5nID0gdHJ1ZVxuICBjb250cm9sbGVyLmRhbXBpbmdGYWN0b3IgPSAwLjA1XG4gIGNvbnRyb2xsZXIubWluRGlzdGFuY2UgPSAxXG4gIGNvbnRyb2xsZXIubWF4RGlzdGFuY2UgPSAxMDBcbiAgY29udHJvbGxlci5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDRcbiAgY29udHJvbGxlci5tYXhQb2xhckFuZ2xlID0gKDMgKiBNYXRoLlBJKSAvIDRcblxuICByZXR1cm4gY29udHJvbGxlclxufVxuIiwiLy8gVXNlIHNwcml0ZXMgYW5kIHNwcml0ZSBtYXRlcmlhbCBmb3IgYSBzaW1wbGUgcmVuZGVyaW5nXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIlxuaW1wb3J0IHsgVGV4dEdlb21ldHJ5IH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9nZW9tZXRyaWVzL1RleHRHZW9tZXRyeVwiXG5pbXBvcnQgeyBGb250TG9hZGVyIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0ZvbnRMb2FkZXJcIlxuaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9HTFRGTG9hZGVyXCJcbmltcG9ydCB7IHZpc2l0Q2hpbGRyZW4gfSBmcm9tIFwiLi91dGlsL21vZGVsVXRpbFwiXG5pbXBvcnQgeyBjcmVhdGVHaG9zdFRleHR1cmUgfSBmcm9tIFwiLi91dGlsL3Nwcml0ZS11dGlsXCJcbmltcG9ydCB7IGJvb3RzdHJhcEdlb21ldHJ5U2NlbmUgfSBmcm9tIFwiLi91dGlsL3N0YW5kYXJkLXNjZW5lXCJcblxuY29uc3QgY3JlYXRlUG9pbnRzID0gKCkgPT4ge1xuICBjb25zdCBwb2ludHMgPSBbXVxuICBjb25zdCByYW5nZSA9IDVcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDAwMDsgaSsrKSB7XG4gICAgbGV0IHBhcnRpY2xlID0gbmV3IFRIUkVFLlZlY3RvcjMoXG4gICAgICBNYXRoLnJhbmRvbSgpICogcmFuZ2UgLSByYW5nZSAvIDIgLSA0LCAvLyDmlbTkvZPlkJHlt6bnp7vliqhcbiAgICAgIE1hdGgucmFuZG9tKCkgKiByYW5nZSAtIHJhbmdlIC8gMixcbiAgICAgIE1hdGgucmFuZG9tKCkgKiByYW5nZSAtIHJhbmdlIC8gMlxuICAgIClcblxuICAgIHBvaW50cy5wdXNoKHBhcnRpY2xlKVxuICB9XG5cbiAgY29uc3QgY29sb3JzID0gbmV3IEZsb2F0MzJBcnJheShwb2ludHMubGVuZ3RoICogMylcbiAgcG9pbnRzLmZvckVhY2goKGUsIGkpID0+IHtcbiAgICBjb25zdCBjID0gbmV3IFRIUkVFLkNvbG9yKE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZilcbiAgICBjb2xvcnNbaSAqIDNdID0gYy5yXG4gICAgY29sb3JzW2kgKiAzICsgMV0gPSBjLmdcbiAgICBjb2xvcnNbaSAqIDMgKyAyXSA9IGMuYlxuICB9KVxuXG4gIGNvbnN0IGdlb20gPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKS5zZXRGcm9tUG9pbnRzKHBvaW50cylcbiAgZ2VvbS5zZXRBdHRyaWJ1dGUoXCJjb2xvclwiLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKGNvbG9ycywgMywgdHJ1ZSkpXG5cbiAgcmV0dXJuIGdlb21cbn1cblxuY29uc3QgY3JlYXRlVGV4dE1lc2ggPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgLy8g5Yqg6L295a2X5L2TXG4gICAgY29uc3QgbG9hZGVyID0gbmV3IEZvbnRMb2FkZXIoKVxuICAgIGxvYWRlci5sb2FkKFxuICAgICAgXCIvdGhyZWVqcy1kZW1vL2Fzc2V0cy9mb250cy9oZWx2ZXRpa2VyX3JlZ3VsYXIudHlwZWZhY2UuanNvblwiLFxuICAgICAgLy8gXCIvYXNzZXRzL2ZvbnRzL2hlbHZldGlrZXJfcmVndWxhci50eXBlZmFjZS5qc29uXCIsXG4gICAgICAoZm9udCkgPT4ge1xuICAgICAgICAvLyDliJvlu7rmloflrZflh6DkvZXkvZNcbiAgICAgICAgY29uc3QgdGV4dEdlb21ldHJ5ID0gbmV3IFRleHRHZW9tZXRyeShcIkVkd2FyZFwiLCB7XG4gICAgICAgICAgZm9udDogZm9udCxcbiAgICAgICAgICBzaXplOiAxLCAvLyDmloflrZflpKflsI9cbiAgICAgICAgICBoZWlnaHQ6IDAuMiwgLy8g5paH5a2X5rex5bqmXG4gICAgICAgICAgY3VydmVTZWdtZW50czogMTIsIC8vIOabsue6v+e7huWIhueoi+W6plxuICAgICAgICAgIGJldmVsRW5hYmxlZDogZmFsc2UsIC8vIOaYr+WQpuWQr+eUqOaWnOmdolxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIOWwhuaWh+Wtl+WHoOS9leS9k+WxheS4rVxuICAgICAgICB0ZXh0R2VvbWV0cnkuY2VudGVyKClcbiAgICAgICAgLy8g5Yib5bu65p2Q6LSoXG4gICAgICAgIGNvbnN0IHRleHRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgICAgY29sb3I6IDB4YTQ0YmNkLCAvLyDmloflrZfkuLvkvZPpopzoibLvvIjntKvoibLvvIlcbiAgICAgICAgfSlcbiAgICAgICAgLy8g5Yib5bu6IE1lc2hcbiAgICAgICAgY29uc3QgdGV4dE1lc2ggPSBuZXcgVEhSRUUuTWVzaCh0ZXh0R2VvbWV0cnksIHRleHRNYXRlcmlhbClcbiAgICAgICAgLy8g6LCD5pW05L2N572u77yI5Y+v6YCJ77ya6YG/5YWN5LiO54K55LqR6YeN5Y+g77yJXG4gICAgICAgIHRleHRNZXNoLnBvc2l0aW9uLnogPSAwXG4gICAgICAgIHRleHRNZXNoLnBvc2l0aW9uLnggPSAtMC41IC8vIOWQkeW3puWBj1xuICAgICAgICB0ZXh0TWVzaC5wb3NpdGlvbi55ID0gNVxuXG4gICAgICAgIHJlc29sdmUodGV4dE1lc2gpXG4gICAgICB9LFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIH1cbiAgICApXG4gIH0pXG59XG5cbmNvbnN0IGxvYWRHbHRmTW9kZWwgPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgbG9hZGVyID0gbmV3IEdMVEZMb2FkZXIoKVxuICAgIGxvYWRlclxuICAgICAgLmxvYWRBc3luYyhcIi90aHJlZWpzLWRlbW8vYXNzZXRzL21vZGVscy9mb3Jlc3RfaG91c2Uvc2NlbmUuZ2x0ZlwiKVxuICAgICAgLy8gLmxvYWRBc3luYyhcIi9hc3NldHMvbW9kZWxzL2ZvcmVzdF9ob3VzZS9zY2VuZS5nbHRmXCIpXG4gICAgICAudGhlbigoc3RydWN0dXJlKSA9PiB7XG4gICAgICAgIHN0cnVjdHVyZS5zY2VuZS5zY2FsZS5zZXRTY2FsYXIoNDApXG4gICAgICAgIHZpc2l0Q2hpbGRyZW4oc3RydWN0dXJlLnNjZW5lLCAoY2hpbGQpID0+IHtcbiAgICAgICAgICBpZiAoY2hpbGQubWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIGNoaWxkLm1hdGVyaWFsLmRlcHRoV3JpdGUgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAvLyDosIPmlbTmqKHlnovkvY3nva7vvIjlj6/pgInvvJrnoa7kv53kuI7mloflrZflkozngrnkupHkuI3lhrLnqoHvvIlcbiAgICAgICAgc3RydWN0dXJlLnNjZW5lLnBvc2l0aW9uLnggPSA0XG4gICAgICAgIHN0cnVjdHVyZS5zY2VuZS5wb3NpdGlvbi55ID0gLTNcbiAgICAgICAgc3RydWN0dXJlLnNjZW5lLnBvc2l0aW9uLnogPSAwXG4gICAgICAgIHJlc29sdmUoc3RydWN0dXJlLnNjZW5lKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfSlcbiAgfSlcbn1cblxuY29uc3QgY3JlYXRlRmxvb3IgPSAoKSA9PiB7XG4gIC8vIOWIm+W7uuS4gOS4quacieWOmuW6pueahOWcsOadv++8jOS9v+eUqCBCb3hHZW9tZXRyeVxuICBjb25zdCBmbG9vckdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDIwLCAwLjUsIDIwKSAvLyDlrr3luqYgMjDvvIzljprluqYgMC4177yM5rex5bqmIDIwXG4gIC8vIOWIm+W7uuadkOi0qO+8jOminOiJsuS4uueZveeBsOiJsu+8jOaUr+aMgeWFieeFp1xuICBjb25zdCBmbG9vck1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtcbiAgICBjb2xvcjogMHhjY2NjY2MsIC8vIOeZveeBsOiJslxuICAgIHNoaW5pbmVzczogNjAsIC8vIOmAguS4reeahOmrmOWFieWPjeWwhO+8jOmAguWQiOiBmuWFieeBr+aViOaenFxuICB9KVxuICAvLyDliJvlu7rlnLDmnb8gTWVzaFxuICBjb25zdCBmbG9vciA9IG5ldyBUSFJFRS5NZXNoKGZsb29yR2VvbWV0cnksIGZsb29yTWF0ZXJpYWwpXG4gIC8vIOiwg+aVtOS9jee9ru+8jOaUvue9ruWcqOWcuuaZr+W6lemDqFxuICBmbG9vci5wb3NpdGlvbi55ID0gLTMgLy8g5L2O5LqO54K55LqR5ZKM5qih5Z6LXG4gIGZsb29yLmNhc3RTaGFkb3cgPSBmYWxzZVxuICByZXR1cm4gZmxvb3Jcbn1cblxuY29uc3QgY3JlYXRlU3BvdExpZ2h0ID0gKCkgPT4ge1xuICAvLyDliJvlu7rogZrlhYnnga9cbiAgY29uc3Qgc3BvdExpZ2h0ID0gbmV3IFRIUkVFLlNwb3RMaWdodChcbiAgICAweGZmZmZmZiwgLy8g55m96Imy5YWJXG4gICAgMS41LCAvLyDlvLrluqZcbiAgICAzMCwgLy8g5pyA5aSn54Wn5bCE6Led56a7XG4gICAgMC4zLCAvLyDnhaflsITop5LluqbvvIgzMOW6pu+8iVxuICAgIDAuNSwgLy8g5Y2K5b2x6KGw5YeP77yI6L6557yY5p+U5ZKM5bqm77yJXG4gICAgMS41IC8vIOihsOWHj+eOh1xuICApXG4gIC8vIOiuvue9ruiBmuWFieeBr+S9jee9ru+8iOS4iuaWueWBj+S+p++8iVxuICBzcG90TGlnaHQucG9zaXRpb24uc2V0KDEyLCA5LCAtOClcbiAgLy8g6K6+572u6IGa5YWJ54Gv55uu5qCH77yI6IGa54Sm5LqO5Zy65pmv5Lit5b+D5LiL5pa577yM6Z2g6L+RIEdMVEYg5qih5Z6L77yJXG4gIHNwb3RMaWdodC50YXJnZXQucG9zaXRpb24uc2V0KDAsIC01LCAwKVxuICAvLyDlkK/nlKjpmLTlvbHmipXlsIRcbiAgc3BvdExpZ2h0LmNhc3RTaGFkb3cgPSB0cnVlXG4gIC8vIOiwg+aVtOmYtOW9seWPguaVsO+8iOWPr+mAie+8muaPkOmrmOmYtOW9sei0qOmHj++8iVxuICBzcG90TGlnaHQuc2hhZG93Lm1hcFNpemUud2lkdGggPSAyMDQ4IC8vIOaPkOmrmOWIhui+qOeOh1xuICBzcG90TGlnaHQuc2hhZG93Lm1hcFNpemUuaGVpZ2h0ID0gMjA0OFxuICBzcG90TGlnaHQuc2hhZG93LmNhbWVyYS5uZWFyID0gMC4xIC8vIOe8qeWwjyBuZWFyIOWAvFxuICBzcG90TGlnaHQuc2hhZG93LmNhbWVyYS5mYXIgPSA0MCAvLyDlop7liqAgZmFyIOWAvFxuICBzcG90TGlnaHQuc2hhZG93LmNhbWVyYS5sZWZ0ID0gLTE1IC8vIOaJqeWkp+mYtOW9seebuOacuuiMg+WbtFxuICBzcG90TGlnaHQuc2hhZG93LmNhbWVyYS5yaWdodCA9IDE1XG4gIHNwb3RMaWdodC5zaGFkb3cuY2FtZXJhLnRvcCA9IDE1XG4gIHNwb3RMaWdodC5zaGFkb3cuY2FtZXJhLmJvdHRvbSA9IC0xNVxuXG4gIHJldHVybiB7IHNwb3RMaWdodCwgdGFyZ2V0OiBzcG90TGlnaHQudGFyZ2V0IH1cbn1cblxuLy8g5Zyo5YWo5bGA6IyD5Zu05YaF5a2Y5YKo5paH5a2X5a+56LGh5ZKM6ZO+5o6l55qE5pig5bCEXG5jb25zdCB0ZXh0TWVzaGVzID0gW11cbmNvbnN0IHRleHRMaW5rcyA9IHt9XG4vLyDliJvlu7rlpJrkuKogVGV4dEdlb21ldHJ5IOW5tuaUvue9ruWcqOWcsOadv+S4ilxuY29uc3QgY3JlYXRlTXVsdGlwbGVUZXh0TWVzaGVzID0gKCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGxvYWRlciA9IG5ldyBGb250TG9hZGVyKClcbiAgICBsb2FkZXIubG9hZChcbiAgICAgIFwiL3RocmVlanMtZGVtby9hc3NldHMvZm9udHMvaGVsdmV0aWtlcl9yZWd1bGFyLnR5cGVmYWNlLmpzb25cIixcbiAgICAgIC8vIFwiL2Fzc2V0cy9mb250cy9oZWx2ZXRpa2VyX3JlZ3VsYXIudHlwZWZhY2UuanNvblwiLFxuICAgICAgKGZvbnQpID0+IHtcbiAgICAgICAgLy8g5a6a5LmJ5aSa5Liq5paH5a2X5ZKM5a+55bqU55qE6Lez6L2s6ZO+5o6lXG4gICAgICAgIGNvbnN0IHRleHRzID0gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IFwiQmxvZ1wiLFxuICAgICAgICAgICAgbGluazogXCJodHRwczovL2FsYXp5cGlnLmNvbS9cIixcbiAgICAgICAgICAgIHg6IDQsXG4gICAgICAgICAgICB5OiAtMi43LFxuICAgICAgICAgICAgejogMyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IFwiR2l0aHViXCIsXG4gICAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9hbGF6eXBpZ1wiLFxuICAgICAgICAgICAgeDogNCxcbiAgICAgICAgICAgIHk6IC0yLjcsXG4gICAgICAgICAgICB6OiA0LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGVudDogXCJQaG90b2dyYXBoeVwiLFxuICAgICAgICAgICAgbGluazogXCJhbGJ1bS5hbGF6eXBpZy5jb21cIixcbiAgICAgICAgICAgIHg6IDQsXG4gICAgICAgICAgICB5OiAtMi43LFxuICAgICAgICAgICAgejogNSxcbiAgICAgICAgICB9LFxuICAgICAgICBdXG4gICAgICAgIHRleHRzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAvLyDliJvlu7rmloflrZflh6DkvZXkvZNcbiAgICAgICAgICBjb25zdCB0ZXh0R2VvbWV0cnkgPSBuZXcgVGV4dEdlb21ldHJ5KGl0ZW0uY29udGVudCwge1xuICAgICAgICAgICAgZm9udDogZm9udCxcbiAgICAgICAgICAgIHNpemU6IDAuNSwgLy8g5paH5a2X5aSn5bCPXG4gICAgICAgICAgICBoZWlnaHQ6IDAuMSwgLy8g5paH5a2X5rex5bqmXG4gICAgICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAxMixcbiAgICAgICAgICAgIGJldmVsRW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIHRleHRHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKVxuICAgICAgICAgIGNvbnN0IGJvdW5kaW5nQm94ID0gdGV4dEdlb21ldHJ5LmJvdW5kaW5nQm94XG4gICAgICAgICAgY29uc3Qgd2lkdGggPSBib3VuZGluZ0JveC5tYXgueCAtIGJvdW5kaW5nQm94Lm1pbi54XG5cbiAgICAgICAgICBjb25zdCB0ZXh0TWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3I6IDB4YTQ0YmNkLCAvLyDntKvoibLvvIzkuI7lnLrmma/po47moLzkuIDoh7RcbiAgICAgICAgICB9KVxuICAgICAgICAgIGNvbnN0IHRleHRNZXNoID0gbmV3IFRIUkVFLk1lc2godGV4dEdlb21ldHJ5LCB0ZXh0TWF0ZXJpYWwpXG5cbiAgICAgICAgICAvLyDorr7nva7mloflrZfkvY3nva7vvIjlnKjlnLDmnb/kuIrmlrnvvIlcbiAgICAgICAgICB0ZXh0TWVzaC5wb3NpdGlvbi5zZXQoaXRlbS54IC0gd2lkdGgsIGl0ZW0ueSwgaXRlbS56KVxuICAgICAgICAgIHRleHRNZXNoLnJvdGF0aW9uLnggPSAtTWF0aC5QSSAvIDIgLy8g5L2/5paH5a2X5Z6C55u05ZCR5LiKXG5cbiAgICAgICAgICB0ZXh0TWVzaGVzLnB1c2godGV4dE1lc2gpIC8vIOWtmOWCqOaWh+Wtl+WvueixoeS7peS+v+WQjue7reS6pOS6klxuICAgICAgICAgIHRleHRMaW5rc1t0ZXh0TWVzaC51dWlkXSA9IGl0ZW0ubGluayAvLyDlrZjlgqjmloflrZflkozpk77mjqXnmoTmmKDlsIRcbiAgICAgICAgfSlcbiAgICAgICAgcmVzb2x2ZSh0ZXh0TWVzaGVzKVxuICAgICAgfSxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICB9XG4gICAgKVxuICB9KVxufVxuXG4vLyDorr7nva4gUmF5Y2FzdGVyIOWSjOm8oOagh+S6i+S7tuebkeWQrOS7peWunueOsOeCueWHu+i3s+i9rFxuY29uc3Qgc2V0dXBJbnRlcmFjdGlvbiA9IChzY2VuZSwgY2FtZXJhKSA9PiB7XG4gIGNvbnN0IHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIoKVxuICBjb25zdCBtb3VzZSA9IG5ldyBUSFJFRS5WZWN0b3IyKClcbiAgLy8g6byg5qCH56e75Yqo5LqL5Lu277yIaG92ZXIg5pWI5p6c77yJXG4gIGNvbnN0IG9uTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgbW91c2UueCA9IChldmVudC5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGgpICogMiAtIDFcbiAgICBtb3VzZS55ID0gLShldmVudC5jbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0KSAqIDIgKyAxXG4gICAgcmF5Y2FzdGVyLnNldEZyb21DYW1lcmEobW91c2UsIGNhbWVyYSlcbiAgICBjb25zdCBpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHModGV4dE1lc2hlcywgdHJ1ZSlcbiAgICBpZiAoaW50ZXJzZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyDlpoLmnpzpvKDmoIfmgqzlgZzlnKjmloflrZfkuIrvvIzmlLnlj5jlhYnmoIfmoLflvI9cbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCJcbiAgICAgIGludGVyc2VjdHNbMF0ub2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldCgweGZmNjliNCkgLy8g6auY5Lqu6aKc6ImyXG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCJcbiAgICAgIC8vIOaBouWkjem7mOiupOminOiJslxuICAgICAgdGV4dE1lc2hlcy5mb3JFYWNoKChtZXNoKSA9PiBtZXNoLm1hdGVyaWFsLmNvbG9yLnNldCgweGE0NGJjZCkpXG4gICAgfVxuICB9XG4gIC8vIOm8oOagh+eCueWHu+S6i+S7tu+8iOi3s+i9rOe9kemhte+8iVxuICBjb25zdCBvbk1vdXNlQ2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICBtb3VzZS54ID0gKGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiAyIC0gMVxuICAgIG1vdXNlLnkgPSAtKGV2ZW50LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQpICogMiArIDFcbiAgICByYXljYXN0ZXIuc2V0RnJvbUNhbWVyYShtb3VzZSwgY2FtZXJhKVxuICAgIGNvbnN0IGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyh0ZXh0TWVzaGVzLCB0cnVlKVxuICAgIGlmIChpbnRlcnNlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGNsaWNrZWRNZXNoID0gaW50ZXJzZWN0c1swXS5vYmplY3RcbiAgICAgIGNvbnN0IGxpbmsgPSB0ZXh0TGlua3NbY2xpY2tlZE1lc2gudXVpZF1cbiAgICAgIGlmIChsaW5rKSB7XG4gICAgICAgIHdpbmRvdy5vcGVuKGxpbmssIFwiX2JsYW5rXCIpIC8vIOWcqOaWsOagh+etvumhteS4reaJk+W8gOmTvuaOpVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyDnu5Hlrprkuovku7bnm5HlkKxcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUsIGZhbHNlKVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9uTW91c2VDbGljaywgZmFsc2UpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXRTY2VuZSgpIHtcbiAgLy8g5Yib5bu65paH5a2XIE1lc2hcbiAgY29uc3QgdGV4dE1lc2ggPSBhd2FpdCBjcmVhdGVUZXh0TWVzaCgpXG4gIGNvbnN0IG1vZGVsID0gYXdhaXQgbG9hZEdsdGZNb2RlbCgpXG4gIGNvbnN0IGZsb29yID0gY3JlYXRlRmxvb3IoKVxuICBjb25zdCB7IHNwb3RMaWdodCwgdGFyZ2V0IH0gPSBjcmVhdGVTcG90TGlnaHQoKVxuICBjb25zdCBtdWx0aXBsZVRleHRNZXNoZXMgPSBhd2FpdCBjcmVhdGVNdWx0aXBsZVRleHRNZXNoZXMoKVxuXG4gIGJvb3RzdHJhcEdlb21ldHJ5U2NlbmUoe1xuICAgIGdlb21ldHJ5OiBjcmVhdGVQb2ludHMoKSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IDB4NDA0MDQwLFxuICAgIHByb3ZpZGVHdWk6IChndWksIHBvaW50cywgc2NlbmUsIGNhbWVyYSkgPT4ge1xuICAgICAgc2NlbmUuYWRkKGZsb29yKVxuICAgICAgc2NlbmUuYWRkKHRleHRNZXNoKVxuICAgICAgc2NlbmUuYWRkKG1vZGVsKVxuICAgICAgc2NlbmUuYWRkKHNwb3RMaWdodClcbiAgICAgIHNjZW5lLmFkZCh0YXJnZXQpXG5cbiAgICAgIG11bHRpcGxlVGV4dE1lc2hlcy5mb3JFYWNoKCh0ZXh0TWVzaCkgPT4gc2NlbmUuYWRkKHRleHRNZXNoKSlcblxuICAgICAgLy8g6YGN5Y6GIEdMVEYg5qih5Z6L5a2Q5a+56LGh77yM5ZCv55So6Zi05b2x5o6l5pS2XG4gICAgICB2aXNpdENoaWxkcmVuKG1vZGVsLCAoY2hpbGQpID0+IHtcbiAgICAgICAgaWYgKGNoaWxkLmlzTWVzaCkge1xuICAgICAgICAgIGNoaWxkLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgICAgICAgY2hpbGQuY2FzdFNoYWRvdyA9IHRydWUgLy8g5Y+v6YCJ77ya5qih5Z6L5Lmf5oqV5bCE6Zi05b2xXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHNldHVwSW50ZXJhY3Rpb24oc2NlbmUsIGNhbWVyYSlcbiAgICB9LFxuICAgIG1hdGVyaWFsOiBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoe1xuICAgICAgc2l6ZTogMC4xLFxuICAgICAgdmVydGV4Q29sb3JzOiB0cnVlLFxuICAgICAgY29sb3I6IDB4ZmZmZmZmLFxuICAgICAgbWFwOiBjcmVhdGVHaG9zdFRleHR1cmUoKSxcbiAgICB9KSxcbiAgfSkudGhlbigpXG59XG5cbmluaXRTY2VuZSgpLmNhdGNoKChlcnJvcikgPT4ge1xuICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGluaXRpYWxpemUgc2NlbmU6XCIsIGVycm9yKVxufSlcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiXG5pbXBvcnQgeyBpbml0T3JiaXRDb250cm9scyB9IGZyb20gXCIuLi9jb250cm9sbGVyL29yYml0LWNvbnRyb2xsZXJcIlxuaW1wb3J0IHsgb25SZXNpemUgfSBmcm9tIFwiLi91cGRhdGUtb24tcmVzaXplXCJcblxuZXhwb3J0IGNvbnN0IGluaXRTY2VuZSA9ICh7XG4gIGJhY2tncm91bmRDb2xvcixcbiAgZm9nQ29sb3IsXG4gIGRpc2FibGVEZWZhdWx0Q29udHJvbHMsXG59KSA9PiB7XG4gIGNvbnN0IGluaXQgPSAoZm4pID0+IHtcbiAgICAvLyBiYXNpYyBzY2VuZSBzZXR1cFxuICAgIGNvbnN0IHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKClcbiAgICBpZiAoYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBzY2VuZS5iYWNrZ3JvdW5kQ29sb3IgPSBiYWNrZ3JvdW5kQ29sb3JcbiAgICB9XG5cbiAgICBpZiAoZm9nQ29sb3IpIHtcbiAgICAgIHNjZW5lLmZvZyA9IG5ldyBUSFJFRS5Gb2coZm9nQ29sb3IsIDAuMDAyNSwgNTApXG4gICAgfVxuXG4gICAgLy8gc2V0dXAgY2FtZXJhIGFuZCBiYXNpYyByZW5kZXJlclxuICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICAgIDc1LFxuICAgICAgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAwLjEsXG4gICAgICAxMDAwXG4gICAgKVxuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSlcbiAgICByZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZ1xuICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZVxuICAgIHJlbmRlcmVyLnNoYWRvd01hcC50eXBlID0gVEhSRUUuUENGU29mdFNoYWRvd01hcFxuICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IoYmFja2dyb3VuZENvbG9yKVxuXG4gICAgb25SZXNpemUoY2FtZXJhLCByZW5kZXJlcilcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KVxuXG4gICAgLy8gaW5pdGlhbGl6ZSBvcmJpdCBjb250cm9sc1xuICAgIGxldCBvcmJpdENvbnRyb2xzXG4gICAgaWYgKCFkaXNhYmxlRGVmYXVsdENvbnRyb2xzKSB7XG4gICAgICBvcmJpdENvbnRyb2xzID0gaW5pdE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlcilcbiAgICB9XG5cbiAgICBmbih7IHNjZW5lLCBjYW1lcmEsIHJlbmRlcmVyLCBvcmJpdENvbnRyb2xzIH0pXG4gIH1cblxuICByZXR1cm4gaW5pdFxufVxuIiwiZXhwb3J0IGNvbnN0IHZpc2l0Q2hpbGRyZW4gPSAob2JqZWN0LCBmbikgPT4ge1xuICBpZiAob2JqZWN0LmNoaWxkcmVuICYmIG9iamVjdC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBvYmplY3QuY2hpbGRyZW4pIHtcbiAgICAgIHZpc2l0Q2hpbGRyZW4oY2hpbGQsIGZuKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmbihvYmplY3QpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFwcGx5U2hhZG93c0FuZERlcHRoV3JpdGUgPSAob2JqZWN0KSA9PiB7XG4gIHZpc2l0Q2hpbGRyZW4ob2JqZWN0LCAoY2hpbGQpID0+IHtcbiAgICBpZiAoY2hpbGQubWF0ZXJpYWwpIHtcbiAgICAgIGNoaWxkLm1hdGVyaWFsLmRlcHRoV3JpdGUgPSB0cnVlXG4gICAgICBjaGlsZC5jYXN0U2hhZG93ID0gdHJ1ZVxuICAgICAgY2hpbGQucmVjZWl2ZVNoYWRvdyA9IHRydWVcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCBmaW5kQ2hpbGQgPSAob2JqZWN0LCBuYW1lKSA9PiB7XG4gIGlmIChvYmplY3QuY2hpbGRyZW4gJiYgb2JqZWN0LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG9iamVjdC5jaGlsZHJlbikge1xuICAgICAgaWYgKG5hbWUgPT09IGNoaWxkLm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXMgPSBmaW5kQ2hpbGQoY2hpbGQsIG5hbWUpXG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICByZXR1cm4gcmVzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKG5hbWUgPT09IG9iamVjdC5uYW1lKSB7XG4gICAgICByZXR1cm4gb2JqZWN0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVHaG9zdFRleHR1cmUgPSAoKSA9PiB7XG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIilcbiAgY2FudmFzLndpZHRoID0gMzJcbiAgY2FudmFzLmhlaWdodCA9IDMyXG5cbiAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuXG4gIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpXG4gIGltZy5zcmMgPSBcIi90aHJlZWpzLWRlbW8vYXNzZXRzL2F2YXRhci5qcGVnXCJcbiAgLy8gaW1nLnNyYyA9IFwiL2Fzc2V0cy9hdmF0YXIuanBlZ1wiXG4gIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodClcbiAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICB9XG5cbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGNhbnZhcylcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgcmV0dXJuIHRleHR1cmVcbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiXG5pbXBvcnQgeyBpbml0U2NlbmUgfSBmcm9tIFwiLi9ib290c3RyYXBcIlxuXG5leHBvcnQgY29uc3QgYm9vdHN0cmFwR2VvbWV0cnlTY2VuZSA9IGFzeW5jICh7XG4gIGdlb21ldHJ5LFxuICBwcm92aWRlR3VpLFxuICBtYXRlcmlhbCxcbiAgaXNTcHJpdGUsXG4gIHNwcml0ZVBvc2l0aW9uLFxuICBvblJlbmRlcixcbiAgcHJvdmlkZU1lc2gsXG4gIGJhY2tncm91bmRDb2xvcixcbn0pID0+IHtcbiAgY29uc3QgcHJvcHMgPSB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBiYWNrZ3JvdW5kQ29sb3IgPz8gMHhmZmZmZmYsXG4gICAgZm9nQ29sb3I6IDB4ZmZmZmZmLFxuICAgIGRpc2FibGVMaWdodHM6IHRydWUsXG4gIH1cblxuICAvLyBjb25zdCBndWkgPSBuZXcgR1VJKClcbiAgY29uc3QgcG9pbnRzID0gcHJvdmlkZU1lc2hcbiAgICA/IHByb3ZpZGVNZXNoKGdlb21ldHJ5KVxuICAgIDogaXNTcHJpdGVcbiAgICAgID8gbmV3IFRIUkVFLlNwcml0ZShtYXRlcmlhbClcbiAgICAgIDogbmV3IFRIUkVFLlBvaW50cyhnZW9tZXRyeSwgbWF0ZXJpYWwpXG5cbiAgaWYgKHNwcml0ZVBvc2l0aW9uKSBwb2ludHMucG9zaXRpb24uY29weShzcHJpdGVQb3NpdGlvbilcblxuICBjb25zdCBpbml0ID0gYXN5bmMgKCkgPT4ge1xuICAgIGluaXRTY2VuZShwcm9wcykoKHsgc2NlbmUsIGNhbWVyYSwgcmVuZGVyZXIsIG9yYml0Q29udHJvbHMgfSkgPT4ge1xuICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLnR5cGUgPSBUSFJFRS5QQ0ZTb2Z0U2hhZG93TWFwXG4gICAgICBjYW1lcmEucG9zaXRpb24ueCA9IDJcbiAgICAgIGNhbWVyYS5wb3NpdGlvbi56ID0gMTBcbiAgICAgIGNhbWVyYS5wb3NpdGlvbi55ID0gNVxuICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKVxuXG4gICAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSlcbiAgICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpXG4gICAgICAgIG9yYml0Q29udHJvbHMudXBkYXRlKClcbiAgICAgICAgaWYgKG9uUmVuZGVyKSBvblJlbmRlcihwb2ludHMpXG4gICAgICB9XG5cbiAgICAgIGFuaW1hdGUoKVxuXG4gICAgICBzY2VuZS5hZGQocG9pbnRzKVxuICAgICAgcHJvdmlkZUd1aShudWxsLCBwb2ludHMsIHNjZW5lLCBjYW1lcmEpXG4gICAgfSlcbiAgfVxuXG4gIGluaXQoKS50aGVuKClcbn1cbiIsImV4cG9ydCBjb25zdCBvblJlc2l6ZSA9IChjYW1lcmEsIHJlbmRlcmVyKSA9PiB7XG4gIGNvbnN0IHJlc2l6ZXIgPSAoKSA9PiB7XG4gICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0XG4gICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcbiAgfVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplciwgZmFsc2UpXG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2x0anNfZm91cnRoXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2x0anNfZm91cnRoXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LmpzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=