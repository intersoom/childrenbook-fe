import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PlayerIntro } from "../class/PlayerIntro";
import gsap from "gsap";
import { LoadingManager } from "three";
import { PrinceMainLight } from "../lights/PrinceMainLight";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { Font } from "../class/Font";
import { Snake } from "../class/Snake";
import { Crown } from "../class/Crown";
import { BackObjects } from "../class/BackObjects";
import { Airplane } from "../class/Airplane";
import { Floor } from "../class/Floor";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { Cloud } from "../class/Cloud";
import { Dunk } from "../class/Dunk";
import { LetterSnake } from "../class/LetterSnake";
import mySound from "../sound/page1.mp3";
import { Flower } from "../class/Flower";
import { useNavigate } from "react-router-dom";
import { KeyController } from "../utils/KeyController";
import { Bao } from "../class/Bao";
import { Fish } from "../class/Fish";
import { Question } from "../class/Question";
import { Picture } from "../class/Picture";
import { FlowerGlass } from "../class/FlowerGlass";
import { Myomok } from "../class/Myomok";
import { GrowFlower } from "../class/GrowFlower";
import { CustomEase } from "gsap/CustomEase";
import { Arrow } from "../class/Arrow";
import video from "../video/loadingVideo.mp4";
import SaveModal from "./atoms/SaveModal";

function Intro() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const infoRef = useRef(null);
  const flowerInfoRef = useRef(null);
  const baoInfoRef = useRef(null);
  const glassInfoRef = useRef(null);
  const loadingRef = useRef(null);
  const progressRef = useRef(null);
  const buttonRef = useRef(false);
  const snakeEndRef = useRef(false);

  const [loadingVal, setLoadingVal] = useState(0);
  const [loadBool, setLoadBool] = useState(false);
  const [infoBool, setInfoBool] = useState(false);
  const [infoFlowerBool, setInfoFlowerBool] = useState(false);
  const [infoBaoBool, setInfoBaoBool] = useState(false);
  const [infoGlassFlowerBool, setInfoGlassFlowerBool] = useState(false);
  const [infoRemove, setInfoRemove] = useState(false);
  const [infoFlowerRemove, setInfoFlowerRemove] = useState(false);
  const [infoBaoRemove, setInfoBaoRemove] = useState(false);
  const [snakeEndBool, setSnakeEndBool] = useState(false);
  const [infoGlassFlowerRemove, setInfoGlassFlowerRemove] = useState(false);

  const [coco, setCoco] = useState(false);
  const [flower, setFlower] = useState(false);
  const [fish, setFish] = useState(false);
  const [pullMode, setPullMode] = useState(0);
  const [quest, setQuest] = useState("");
  const [modal, setModal] = useState(false);

  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  useEffect(() => {
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    let selected = false;
    let flowerMode = false;
    let myomokMode = false;
    let myomokDone = false;
    let growDone = false;
    let myomokArrived = false;
    let growArrived = false;
    let fishJump = 0;
    let glassCount = 0;
    let added1 = 0;
    let added2 = 0;
    let added3 = 0;
    let added4 = 0;
    let added5 = 0;
    let added6 = 0;
    let added7 = 0;
    let pickOnce = false;

    // Texture
    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load("floor_tex.png");
    const snakeTexture = textureLoader.load("snake.png");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.x = 30;
    floorTexture.repeat.y = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();
    let background = scene.background;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    let exrCubeRenderTarget;
    let exrBackground;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    camera.position.x = 1;
    camera.position.y = 13;
    camera.position.z = -22;

    // scene.fog = new THREE.Fog("#e5b380", 0.0, 35.0);
    scene.fog = new THREE.Fog("#B6895A", 0.0, 35.0);
    // scene.fog = new THREE.FogExp2("#e5b380", 0.03);

    let cameraPosition = new THREE.Vector3(0, 3, 4.8);
    // camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    // camera.zoom = 0.18;
    // camera.updateProjectionMatrix();

    const camera2 = new THREE.PerspectiveCamera(75, width / height, 0.1, 500);

    camera2.position.x = 9 + 34;
    camera2.position.y = 1.5;
    camera2.position.z = 27 + 15;

    const flowerCam = new THREE.PerspectiveCamera(75, width / height, 0.1, 500);
    flowerCam.position.x = 40;
    flowerCam.position.y = 14;
    flowerCam.position.z = 28;
    flowerCam.zoom = 2;
    flowerCam.updateProjectionMatrix();

    const growFlowerCam = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      500
    );
    growFlowerCam.position.x = -2;
    growFlowerCam.position.y = 1;
    growFlowerCam.position.z = 23.5;
    growFlowerCam.zoom = 2;
    growFlowerCam.lookAt(-2, 1.2, 16);
    growFlowerCam.updateProjectionMatrix();

    const myomokCam = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      10000
    );
    myomokCam.position.x = 20;
    myomokCam.position.y = 4;
    myomokCam.position.z = 25;
    myomokCam.zoom = 2;
    myomokCam.updateProjectionMatrix();

    scene.add(camera, camera2, flowerCam, myomokCam);

    // Light
    new PrinceMainLight({ scene });

    // exr
    new EXRLoader().load("test4.exr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
      exrBackground = texture;
    });

    // Mesh
    const meshes = [];
    const meshes2 = [];
    const meshes3 = [];

    const loader = new FontLoader();

    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({
        color: "#6e5338",
        opacity: 0,
        transparent: true,
      })
    );
    floorMesh.name = "floor";

    floorMesh.rotation.x = -Math.PI / 2;

    const pointerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        color: "crimson",
        transparent: true,
        opacity: 0.0,
      })
    );
    pointerMesh.rotation.x = -Math.PI / 2;
    pointerMesh.position.y = 0.01;
    pointerMesh.receiveShadow = true;

    const spotMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshStandardMaterial({
        map: snakeTexture,
        transparent: true,
        opacity: 0.9,
      })
    );

    spotMesh.position.set(40, 0.005, 37);
    spotMesh.rotation.x = -Math.PI / 2;
    spotMesh.receiveShadow = true;
    scene.add(spotMesh);

    const flowerZoneTexture = textureLoader.load("flower.png");

    const flowerZoneMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: "yellow",
        // map: flowerZoneTexture,
        transparent: true,
        opacity: 0.7,
      })
    );

    flowerZoneMesh.position.set(40, -1, 16);
    flowerZoneMesh.rotation.x = -Math.PI / 2;
    scene.add(flowerZoneMesh);

    const baoZoneTexture = textureLoader.load("baobab.png");

    const baoZoneMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshStandardMaterial({
        // color: "yellow",
        map: baoZoneTexture,
        transparent: true,
        opacity: 0.7,
      })
    );

    baoZoneMesh.position.set(14.5, 0.05, 5);
    baoZoneMesh.rotation.x = -Math.PI / 2;
    // scene.add(baoZoneMesh);

    const fishZoneTexture = textureLoader.load("fish.png");

    const fishZoneMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshStandardMaterial({
        // color: "yellow",
        map: fishZoneTexture,
        transparent: true,
        opacity: 0.7,
      })
    );

    fishZoneMesh.position.set(-5.5, 0.001, -4);
    fishZoneMesh.rotation.x = -Math.PI / 2;
    fishZoneMesh.rotation.z = Math.PI / 3;
    // scene.add(fishZoneMesh);

    // Points
    const geometry = new THREE.BufferGeometry();
    const count = 200000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 80;
    }
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3) // 1개의 Vertex(정점)를 위해 값 3개 필요
    );
    const material = new THREE.PointsMaterial({
      size: 0.003,
      color: "#ffdfb2",
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Loading
    const MANAGER = new LoadingManager();

    MANAGER.onProgress = function (url, loaded, total) {
      setLoadingVal((loaded / total) * 100);
    };
    let loaded = false;
    MANAGER.onLoad = function () {
      setLoadBool(true);
      loaded = true;
    };

    // objects
    const gltfLoader = new GLTFLoader(MANAGER);

    const floor = new Floor({
      scene,
      gltfLoader,
      modelSrc: "floor.glb",
      meshes,
      meshes3,
    });

    const airplane = new Airplane({
      scene,
      gltfLoader,
      modelSrc: "airplane.glb",
    });

    // 어린왕자
    const player = new PlayerIntro({
      scene,
      meshes,
      gltfLoader,
      modelSrc: "fastfast.glb",
    });

    const font = new Font({ scene, camera, loader });

    const picture = new Picture({ scene, gltfLoader, modelSrc: "yesdae.glb" });

    const snake = new Snake({
      scene,
      meshes: meshes3,
      gltfLoader,
      snakeModelSrc: "lighterSnake.glb",
      eleModelSrc: "eleLonger.glb",
    });

    const crown = new Crown({
      scene,
      gltfLoader,
      modelSrc: "crown.glb",
    });

    const backObj = new BackObjects({
      scene,
      gltfLoader,
      meshes: meshes2,
      oasisModelSrc: "treeWind.glb",
      cactusModelSrc: "cactus.glb",
      waterModelSrc: "waterw.glb",
      rockModelSrc: "doll.glb",
    });

    const cloud = new Cloud({
      scene,
      gltfLoader,
      modelSrc: "cloud2.glb",
    });

    const flower = new Flower({
      scene,
      gltfLoader,
      pinkModelSrc: "NoScalePink.glb",
      orangeModelSrc: "NoScaleOrange.glb",
      blueModelSrc: "NoScaleBlue.glb",
      plantModelSrc: "ssakFlower.glb",
      jolModelSrc: "bobo.glb",
    });

    const dunk = new Dunk({
      scene,
      gltfLoader,
      modelSrc: "smallD.glb",
      model2Src: "midD.glb",
      model3Src: "bigDunk.glb",
    });

    const letterSnake = new LetterSnake({
      scene,
      gltfLoader,
      modelSrc: "letter2.glb",
      snakeModelBiggerSrc: "snakeBigM.glb",
      snakeModelSrc: "outSnake.glb",
      snakeModel2Src: "snakesize.glb",
    });

    const bao = new Bao({
      scene,
      gltfLoader,
      modelSrc: "bao.glb",
      meshes: meshes3,
    });

    const fish = new Fish({
      scene,
      gltfLoader,
      blueModelSrc: "blueFish.glb",
      orangeModelSrc: "orangeFish.glb",
      yellowModelSrc: "yellowFish.glb",
    });

    const question = new Question({
      scene,
      gltfLoader,
      modelSrc: "qqq.glb",
      camera: { x: 0, y: 0, z: 4.8 },
    });

    const flowerGlass = new FlowerGlass({
      scene,
      gltfLoader,
      modelSrc: "centerdFlowers.glb",
      nobreakModelSrc: "noBreak.glb",
      glass1modelSrc: "firstFrame1.glb",
      glass2modelSrc: "firstFrame2.glb",
      glass3modelSrc: "firstFrame3.glb",
      glass4modelSrc: "firstFrame4.glb",
      glass5modelSrc: "firstFrame5.glb",
      glass6modelSrc: "firstFrame6.glb",
      glass7modelSrc: "firstFrame7.glb",
    });

    const growFlower = new GrowFlower({
      scene,
      gltfLoader,
      modelSrc: "pleaseLastboon.glb",
      flowerModelSrc: "sideunFlower.glb",
    });

    const myomok = new Myomok({
      scene,
      gltfLoader,
      princeModelSrc: "sweatas.glb",
      treeModelSrc: "myoTMyo.glb",
      sweatModelSrc: "sweat.glb",
    });

    const arrow = new Arrow({
      scene,
      gltfLoader,
      modelSrc: "arrow.glb",
    });
    // 키보드 컨트롤
    const keyController = new KeyController();

    function walk() {
      let directionOffset = 0;
      if (keyController.keys["KeyW"] || keyController.keys["ArrowUp"]) {
        if (keyController.keys["KeyA"] || keyController.keys["ArrowLeft"]) {
          directionOffset = -Math.PI / 4 - Math.PI / 2; // s + d
        } else if (
          keyController.keys["KeyD"] ||
          keyController.keys["ArrowRight"]
        ) {
          directionOffset = Math.PI / 4 + Math.PI / 2; // s + a
        } else {
          directionOffset = Math.PI;
        }
      } else if (
        keyController.keys["KeyS"] ||
        keyController.keys["ArrowDown"]
      ) {
        if (keyController.keys["KeyA"] || keyController.keys["ArrowLeft"]) {
          directionOffset = -Math.PI / 4; // w + d
        } else if (
          keyController.keys["KeyD"] ||
          keyController.keys["ArrowRight"]
        ) {
          directionOffset = Math.PI / 4; // w + a
        }
      } else if (
        keyController.keys["KeyA"] ||
        keyController.keys["ArrowLeft"]
      ) {
        directionOffset = -Math.PI / 2; // d
      } else if (
        keyController.keys["KeyD"] ||
        keyController.keys["ArrowRight"]
      ) {
        directionOffset = Math.PI / 2; // a
      }

      return directionOffset;
    }

    function walkCheck() {
      if (keyController.keys["KeyW"] || keyController.keys["ArrowUp"]) {
        player.moving = true;
      } else if (
        keyController.keys["KeyS"] ||
        keyController.keys["ArrowDown"]
      ) {
        player.moving = true;
      } else if (
        keyController.keys["KeyA"] ||
        keyController.keys["ArrowLeft"]
      ) {
        player.moving = true;
      } else if (
        keyController.keys["KeyD"] ||
        keyController.keys["ArrowRight"]
      ) {
        player.moving = true;
      } else {
        player.moving = false;
      }
    }

    let growFlowerZoneMode = false;

    let flowerZoneMode = false;

    function flowerCheck() {
      // 꽃 위치 도달시
      if (
        Math.abs(flowerZoneMesh.position.x - player.modelMesh.position.x) < 6 &&
        Math.abs(flowerZoneMesh.position.z - player.modelMesh.position.z) < 6
      ) {
        if (!flowerZoneMode) {
          flowerZoneMode = true;
          // flowerGlass.fullGlassActions[0].play();
          camera.position.x = flowerCam.position.x;
          camera.position.y = flowerCam.position.y;
          camera.position.z = flowerCam.position.z;
        }
        player.box.setFromObject(player.modelMesh);

        player.speed = 4;

        if (glassCount === 7) {
          setTimeout(() => {
            scene.add(flowerGlass.nobreakModelMesh);

            flowerGlass.glassModelMesh1.clear();
            flowerGlass.glassModelMesh2.clear();
            flowerGlass.glassModelMesh3.clear();
            flowerGlass.glassModelMesh4.clear();
            flowerGlass.glassModelMesh5.clear();
            flowerGlass.glassModelMesh6.clear();
            flowerGlass.glassModelMesh7.clear();

            flowerGlass.fullGlassActions[0].play();
          }, 4000);
        }
        if (flowerGlass.fullGlassActions[0].time >= 2.93) {
          setInfoGlassFlowerBool(true);
          if (infoGlassFlowerBool) {
            setQuest("");
          }
        } else {
          setQuest("유리조각을 모아서 장미에게 유리관을 씌워주세요");
        }
        console.log(flowerGlass.fullGlassActions[0]);
        if (flowerGlass.glassBoxMesh1.intersectsBox(player.box)) {
          console.log("box1");
          flowerGlass.actions[0].play();
          if (added1 === 0) {
            glassCount += 1;
            added1 += 1;
          }
        }
        if (flowerGlass.glassBoxMesh2.intersectsBox(player.box)) {
          console.log("box2");
          flowerGlass.actions2[0].play();
          if (added2 === 0) {
            glassCount += 1;
            added2 += 1;
          }
        }
        if (flowerGlass.glassBoxMesh3.intersectsBox(player.box)) {
          console.log("box3");
          flowerGlass.actions3[0].play();
          if (added3 === 0) {
            glassCount += 1;
            added3 += 1;
          }
        }
        if (flowerGlass.glassBoxMesh4.intersectsBox(player.box)) {
          console.log("box4");
          flowerGlass.actions4[0].play();
          if (added4 === 0) {
            glassCount += 1;
            added4 += 1;
          }
        }
        if (flowerGlass.glassBoxMesh5.intersectsBox(player.box)) {
          console.log("box5");
          flowerGlass.actions5[0].play();
          if (added5 === 0) {
            glassCount += 1;
            added5 += 1;
          }
        }
        if (flowerGlass.glassBoxMesh6.intersectsBox(player.box)) {
          console.log("box6");
          flowerGlass.actions6[0].play();
          if (added6 === 0) {
            glassCount += 1;
            added6 += 1;
          }
        }
        if (flowerGlass.glassBoxMesh7.intersectsBox(player.box)) {
          console.log("box7");
          flowerGlass.actions7[0].play();
          if (added7 === 0) {
            glassCount += 1;
            added7 += 1;
          }
        }
      } else {
        if (flowerZoneMode) {
          gsap.to(camera.position, {
            duration: 0.5,
            x: player.modelMesh.position.x,
            y: 7,
            z: player.modelMesh.position.z + 10,
            onComplete: function () {
              flowerZoneMode = false;
              player.speed = 5;
            },
          });
        }
      }
    }
    let test = true;
    let test2 = true;

    function updateCameraTarget(moveX, moveZ) {
      if (!flowerZoneMode && !myomokMode) {
        // // move camera
        camera.position.x -= moveX;
        camera.position.z -= moveZ;

        // camera.position.x = player.modelMesh.position.x;
        // camera.position.z = player.modelMesh.position.z + 10;
      }
    }
    flowerCam.lookAt(40.5, 0, 18);

    camera2.updateProjectionMatrix();

    const raycaster = new THREE.Raycaster();
    const playerRaycater = new THREE.Raycaster();
    const flowerRaycater = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    let angle = 0;
    let isPressed = false; // 마우스를 누르고 있는 상태

    const targetOrientation = new THREE.Quaternion(
      0,
      0.9812428633760961,
      0,
      0.19277562883694618
    );
    const targetOrientation2 = camera2.quaternion.clone();
    const startCamOrientation2 = camera.quaternion.clone();
    const mymokOrientation = new THREE.Quaternion(1, 0, 0, 0);

    // 그리기
    const clock = new THREE.Clock();
    const playClock = new THREE.Clock();
    // const controls = new OrbitControls(camera, renderer.domElement);

    // quaternion
    const rotateQuarternion = new THREE.Quaternion();
    const rotateAngle = new THREE.Vector3(0, 1, 0);
    const walkDirection = new THREE.Vector3();

    let tweenCam = null;
    function animationComplete() {
      if (tweenCam) {
        tweenCam.kill(); // Tweens를 중지합니다.
        tweenCam = null; // 변수를 초기화합니다.
      }
    }

    let once = 0;
    let once2 = 0;

    function draw() {
      const delta = clock.getDelta();
      renderer.setAnimationLoop(draw);
      if (keyController.keys["KeyR"]) {
        navigate("/start");
      }
      // controls.update();
      // newEnvMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null;
      background = exrBackground;
      scene.background = exrBackground;

      if (player.modelMesh) {
        particles.position.y = player.modelMesh.position.y;
        particles.position.z = player.modelMesh.position.z;
      }

      if (particles.position.x < 10) {
        particles.position.x += 0.04;
      } else {
        particles.position.x = -10;
      }

      if (cloud.modelMesh && cloud.modelMesh2) {
        if (cloud.modelMesh.position.x < 70) {
          cloud.modelMesh.position.x += 0.075;
        } else {
          cloud.modelMesh.position.x = -70;
        }

        if (cloud.modelMesh2.position.x < 70) {
          cloud.modelMesh2.position.x += 0.075;
        } else {
          cloud.modelMesh2.position.x = -70;
        }
      }

      if (snake.snakeMixer) snake.snakeMixer.update(delta);
      if (snake.eleMixer) snake.eleMixer.update(delta);
      if (airplane.mixer) airplane.mixer.update(delta);
      if (floor.mixer) floor.mixer.update(delta);
      if (backObj.mixer) backObj.mixer.update(delta);
      if (dunk.mixer) dunk.mixer.update(delta);
      if (dunk.mixer2) dunk.mixer2.update(delta);
      if (dunk.mixer3) dunk.mixer3.update(delta);
      if (letterSnake.mixer) letterSnake.mixer.update(delta);
      if (letterSnake.snakeMixer) letterSnake.snakeMixer.update(delta);
      if (letterSnake.snake2Mixer) letterSnake.snake2Mixer.update(delta);
      if (letterSnake.snakeBiggerMixer)
        letterSnake.snakeBiggerMixer.update(delta);
      if (flower.pinkMixer) flower.pinkMixer.update(delta);
      if (flower.blueMixer) flower.blueMixer.update(delta);
      if (flower.orangeMixer) flower.orangeMixer.update(delta);
      if (flower.plantMixer) flower.plantMixer.update(delta);
      if (flower.jolMixer) flower.jolMixer.update(delta);
      if (bao.mixer) bao.mixer.update(delta);

      if (growFlower.flowerMixer) growFlower.flowerMixer.update(delta);
      if (myomok.princeMixer) myomok.princeMixer.update(delta);
      if (myomok.treeMixer) myomok.treeMixer.update(delta);
      if (myomok.sweatMixer) myomok.sweatMixer.update(delta);
      if (fish.blueFishMixer) fish.blueFishMixer.update(delta);
      if (fish.orangeFishMixer) fish.orangeFishMixer.update(delta);
      if (fish.yellowFishMixer) fish.yellowFishMixer.update(delta);
      if (flowerGlass.nobreakGlassMixer)
        flowerGlass.nobreakGlassMixer.update(delta);
      if (flowerGlass.glassMixer) flowerGlass.glassMixer.update(delta);
      if (flowerGlass.glassMixer2) flowerGlass.glassMixer2.update(delta);
      if (flowerGlass.glassMixer3) flowerGlass.glassMixer3.update(delta);
      if (flowerGlass.glassMixer4) flowerGlass.glassMixer4.update(delta);
      if (flowerGlass.glassMixer5) flowerGlass.glassMixer5.update(delta);
      if (flowerGlass.glassMixer6) flowerGlass.glassMixer6.update(delta);
      if (flowerGlass.glassMixer7) flowerGlass.glassMixer7.update(delta);
      if (crown.crownBool) crown.modelMesh.rotation.y += delta;
      if (player.modelMesh && !snake.visible) {
        camera.lookAt(
          player.modelMesh.position.x,
          player.modelMesh.position.y + 1,
          player.modelMesh.position.z
        );

        camera.updateProjectionMatrix();
        flowerCheck();
      }

      for (let i = 0; i < flower.flowerMixers.length; i++) {
        if (flower.flowerMixers[i]) {
          flower.flowerMixers[i].update(delta);
        }
      }

      if (bao.actions && bao.actions[1].time > 2.666) {
        bao.actions[2].play();
      }

      if (airplane.modelMesh && !airplane.airPlaneDone && loaded) {
        const planeLook = new THREE.Vector3(
          0,
          airplane.modelMesh.position.y,
          airplane.modelMesh.position.z
        );

        camera.updateProjectionMatrix();
        const airTime = airplane.actions[0].time;
        // if (loadBool) {
        airplane.actions[0].play();
        // }

        camera.lookAt(planeLook);
        if (airplane.modelMesh.position.y >= 0.05) {
          airplane.modelMesh.position.y -= 0.07;
        } else {
          if (airTime >= 4.2 && airTime < 7.9 && player.modelMesh) {
            gsap.to(camera.position, {
              duration: 1,
              // x: 0,
              // y: 3,
              // z: 4.8 - 30,
              x: 0,
              y: 7,
              z: 10 - 30,
              onUpdate: function () {
                gsap.to(camera, {
                  duration: 2,
                  zoom: 2,
                  ease: "slow(0.3, 0.3, false)",
                  onUpdate: function () {
                    airplane.airPlaneDone = true;
                  },
                });
                camera.updateProjectionMatrix();
              },
              onComplete: function () {
                // cameraPosition = new THREE.Vector3(0, 3, 4.8 - 30);
                cameraPosition = new THREE.Vector3(0, 7, 10 - 30);
                camera.zoom = 2;
                camera.updateProjectionMatrix();
              },
            });
            gsap.to(camera, {
              duration: 1,
              zoom: 2,
            });
          }
        }
      }

      // airplane
      if (player.modelMesh && airplane.modelMesh) {
        if (
          airplane.modelMesh.children[0] &&
          airplane.modelMesh.children[2] &&
          airplane.actions[0].time >= 7.9
        ) {
          airplane.modelMesh.children[0].removeFromParent();
          // airplane.modelMesh.children[2].removeFromParent();
          scene.add(player.modelMesh);
          player.actions[0].play();
          setTimeout(() => {
            setInfoBool(true);
          }, 2000);
        }
        if (isPressed && !flowerMode) {
          raycasting();
          playerRaycasting();
        }
        // fish
        if (fishJump === 1) {
          if (fish.blueFishActions[0].time < 0.5) {
            fish.blueFishActions[0].stop();
            fish.orangeFishActions[0].stop();
            fish.yellowFishActions[0].stop();
            fish.blueFishActions[1].play();
            fish.orangeFishActions[1].play();
            fish.yellowFishActions[1].play();
            setFish(true);
          }
          if (fish.blueFishActions[1].time >= 3.8) {
            fishJump = 0;
          }
          // fishJump++;
        } else {
          if (fish.blueFishActions && fish.blueFishActions[1].time >= 3.8) {
            fish.blueFishActions[1].stop();
            fish.orangeFishActions[1].stop();
            fish.yellowFishActions[1].stop();
            fish.blueFishActions[0].play();
            fish.orangeFishActions[0].play();
            fish.yellowFishActions[0].play();
          }
        }

        // grow flower
        if (
          Math.abs(-2 - player.modelMesh.position.x) < 4 &&
          Math.abs(16 - player.modelMesh.position.z) < 3 &&
          !growDone
        ) {
          angle = Math.atan2(
            growFlower.modelMesh.position.x - player.modelMesh.position.x,
            growFlower.modelMesh.position.z - player.modelMesh.position.z
          );
          setQuest("꽃에 물을 주어보세요 !");

          // rotate model
          rotateQuarternion.setFromAxisAngle(rotateAngle, angle);
          if (!growFlowerZoneMode) {
            growFlowerZoneMode = true;

            camera.position.x = growFlowerCam.position.x;
            camera.position.y = growFlowerCam.position.y;
            camera.position.z = growFlowerCam.position.z;
          } else {
            growFlower.mixer.update(delta);

            // player.
            if (!growArrived) {
              gsap.to(player.modelMesh.position, {
                duration: 5,
                x: growFlower.modelMesh.position.x,
                y: growFlower.modelMesh.position.y,
                z: growFlower.modelMesh.position.z,
                ease: "none",
                onUpdate: () => {
                  console.log(player.actions[1].time);
                  console.log(1, growFlower.actions[0]);
                  console.log(2, growFlower.actions[1]);
                  console.log(3, growFlower.actions[2]);
                  console.log(4, growFlower.actions[3]);
                  console.log(5, growFlower.actions[4]);
                  console.log(6, growFlower.flowerActions[0]);
                  player.mixer.update(delta);
                  if (
                    player.modelMesh.position.x ===
                      growFlower.modelMesh.position.x &&
                    player.modelMesh.position.z ===
                      growFlower.modelMesh.position.z
                  ) {
                    if (player.actions[1].time >= 0.933)
                      player.actions[1].stop();

                    test2 = false;

                    player.modelMesh.quaternion.rotateTowards(
                      growFlower.modelMesh.quaternion,
                      0.06
                    );
                    setTimeout(() => {
                      scene.add(growFlower.modelMesh);
                      if (once2 === 0) {
                        scene.remove(player.modelMesh);
                      }
                      if (!pickOnce) {
                        growFlower.actions[1].play();
                        pickOnce = true;
                      }
                    }, 1000);
                  } else if (test2) {
                    player.modelMesh.quaternion.rotateTowards(
                      rotateQuarternion,
                      0.06
                    );
                    player.actions[1].play();
                  }
                },
              });
            }
            if (growFlower.actions[1].time >= 0.8999999) {
              growArrived = true;
              gsap.to(growFlower.modelMesh.position, {
                duration: 1.3,
                x: -1.5,
                y: 0,
                z: 16,
                onUpdate: () => {
                  growFlower.actions[1].stop();
                  growFlower.actions[2].play();
                },
              });
            }
            if (growFlower.actions[2].time >= 1.566) {
              growFlower.actions[3].play();
              growFlower.actions[2].stop();
            }
            if (growFlower.actions[3].time >= 4.766666889190674) {
              // growFlower.actions[3].stop();
              growFlower.flowerActions[0].play();

              growFlower.flowerMaterial.forEach((element) => {
                gsap.to(element.material.color, {
                  duration: 2,
                  r: 1,
                  g: 0.82,
                  b: 0.25,
                  ease: CustomEase.create(
                    "custom",
                    "M0,0 C0,0 0.652,0.018 0.824,0.158 0.982,0.286 1,1 1,1 "
                  ),
                });
              });
            }
            if (growFlower.flowerActions[0].time >= 6) {
              growFlower.actions[4].play();
              growFlower.actions[3].stop();
            }
            if (growFlower.actions[4].time >= 2.333) {
              player.actions[1].reset();
              player.modelMesh.position.x = growFlower.modelMesh.position.x;
              player.modelMesh.position.y = growFlower.modelMesh.position.y;
              player.modelMesh.position.z = growFlower.modelMesh.position.z;
              scene.add(player.modelMesh);
              growFlower.modelMesh.clear();
              setTimeout(() => {
                growDone = true;
                setInfoFlowerBool(true);
                setQuest("");
              }, 1000);
            }
          }
        } else {
          if (growFlowerZoneMode) {
            gsap.to(camera.position, {
              duration: 0.8,
              x: player.modelMesh.position.x,
              y: 7,
              z: player.modelMesh.position.z + 10,
              onComplete: function () {
                growFlowerZoneMode = false;
              },
            });
          }
        }

        // pull 묘목
        if (player.modelMesh && myomok.princeModelMesh && !myomokDone) {
          if (
            Math.abs(
              myomok.princeModelMesh.position.x - player.modelMesh.position.x
            ) < 5 &&
            Math.abs(
              myomok.princeModelMesh.position.z - player.modelMesh.position.z
            ) < 5
          ) {
            setQuest("스페이스바를 눌러서 바오밥 나무를 없애보세요");
            myomokMode = true;

            angle = Math.atan2(
              myomok.princeModelMesh.position.x - player.modelMesh.position.x,
              myomok.princeModelMesh.position.z - player.modelMesh.position.z
            );

            // rotate model
            rotateQuarternion.setFromAxisAngle(rotateAngle, angle);
            if (!myomokArrived) {
              gsap.to(player.modelMesh.position, {
                duration: 4,
                ease: "Power4.easeout",
                x: myomok.princeModelMesh.position.x,
                y: myomok.princeModelMesh.position.y,
                z: myomok.princeModelMesh.position.z,
                onUpdate: () => {
                  if (
                    player.modelMesh.position.x ===
                    myomok.princeModelMesh.position.x
                  ) {
                    test = false;
                    player.actions[1].stop();
                    player.modelMesh.quaternion.rotateTowards(
                      myomok.princeModelMesh.quaternion,
                      0.06
                    );
                    setTimeout(() => {
                      scene.add(myomok.princeModelMesh);
                      if (once === 0) {
                        scene.remove(player.modelMesh);
                      }
                      myomok.actions[0].play();

                      if (myomok.actions[0].time >= 0.6333333253860474) {
                        myomokArrived = true;
                      }
                    }, 1000);
                  } else if (test) {
                    player.mixer.update(delta);
                    player.modelMesh.quaternion.rotateTowards(
                      rotateQuarternion,
                      0.06
                    );
                    player.actions[1].play();
                  }
                },
                onComplete: () => {},
              });
            }

            if (keyController.keys["Space"] && myomokArrived) {
              setPullMode(1);
              myomok.actions[2].play();
              myomok.actions2[2].play();
              myomok.sweatMaterial1.opacity = 1;
              myomok.sweatMaterial2.opacity = 1;
              progressRef.current.value += 0.4;
            } else if (progressRef.current.value < 100) {
              myomok.sweatMaterial1.opacity = 0;
              myomok.sweatMaterial2.opacity = 0;
              myomok.actions[2].stop();
              myomok.actions2[2].stop();
            }

            if (progressRef.current.value >= 100) {
              myomok.sweatModelMesh.clear();
              myomok.actions[2].stop();
              myomok.actions2[2].stop();
              myomok.actions3[0].stop();

              myomok.actions[1].play();
              myomok.actions2[1].play();

              setPullMode(2);
              console.log(myomok.actions[1]);
              if (myomok.actions[1].time >= 1.6666666269302368) {
                if (once === 0) {
                  myomok.princeModelMesh.clear();
                  camera.position.x = 20;
                  camera.position.y = 7;
                  camera.position.z = 26;
                  scene.add(player.modelMesh);

                  once += 1;
                }

                gsap.to(myomokCam.position, {
                  duration: 0.5,
                  x: 20,
                  y: 7,
                  z: 26,
                  onComplete: function () {
                    myomokDone = true;
                    myomokMode = false;
                    myomok.treeModelMesh.clear();
                    setInfoBaoBool(true);
                    setQuest("");
                  },
                });
              }
            }
          }
        }
        // console.log(player.modelMesh.position);
        walkCheck();

        // walk
        if (
          player.moving &&
          !player.movingDone &&
          !flowerMode &&
          !myomokMode &&
          !growFlowerZoneMode &&
          buttonRef.current === true
        ) {
          playerRaycasting();
          if (player.mixer) player.mixer.update(delta);

          angle = Math.atan2(
            camera.position.x - player.modelMesh.position.x,
            camera.position.z - player.modelMesh.position.z
          );

          let directionOffset = walk();

          // rotate model
          rotateQuarternion.setFromAxisAngle(
            rotateAngle,
            angle + directionOffset
          );
          player.modelMesh.quaternion.rotateTowards(rotateQuarternion, 0.2);

          // calculate direction
          camera.getWorldDirection(walkDirection);
          walkDirection.y = 0;
          walkDirection.normalize();
          walkDirection.applyAxisAngle(rotateAngle, directionOffset);

          // move model & camera
          const moveX = walkDirection.x * player.speed * delta;
          const moveZ = walkDirection.z * player.speed * delta;
          player.modelMesh.position.x -= moveX;
          player.modelMesh.position.z -= moveZ;

          updateCameraTarget(moveX, moveZ);

          player.actions[2].stop();
          player.actions[1].play();

          if (
            Math.abs(font.textMesh.position.z - player.modelMesh.position.z) < 1
          ) {
            gsap.to(font.textMeshMaterial, {
              duration: 1,
              opacity: 0.8,
              ease: "Power3.easeOut",
              onUpdate: function () {
                font.textMesh.lookAt(
                  font.textMesh.position.x,
                  camera.position.y,
                  100
                );
              },
            });
          }

          if (
            Math.abs(
              picture.modelMesh.position.z - player.modelMesh.position.z
            ) > 4
          ) {
            gsap.to(picture.modelMesh.position, {
              duration: 1.5,
              y: 1.4,
              ease: "Power3.easeOut",
            });
          }

          if (
            Math.abs(
              font.textMeshSecond.position.z - player.modelMesh.position.z
            ) < 0.1
          ) {
            gsap.to(font.textMeshSecondMaterial, {
              duration: 1,
              opacity: 0.8,
              ease: "Power3.easeOut",
              onUpdate: function () {
                font.textMeshSecond.lookAt(
                  font.textMeshSecond.position.x,
                  camera.position.y,
                  100
                );
              },
            });
          }

          if (
            Math.abs(
              font.textMeshThird.position.z - player.modelMesh.position.z
            ) < 0.1
          ) {
            gsap.to(font.textMeshThirdMaterial, {
              duration: 1,
              opacity: 0.8,
              ease: "Power3.easeOut",
              onUpdate: function () {
                font.textMeshThird.lookAt(
                  font.textMeshThird.position.x,
                  camera.position.y,
                  100
                );
              },
            });
          }

          if (
            Math.abs(
              font.textMeshFourth.position.z - player.modelMesh.position.z
            ) < 0.1
          ) {
            gsap.to(font.textMeshFourthMaterial, {
              duration: 1,
              opacity: 0.8,
              ease: "Power3.easeOut",
              onUpdate: function () {
                font.textMeshFourth.lookAt(
                  font.textMeshFourth.position.x,
                  camera.position.y,
                  100
                );
              },
            });
          }

          if (
            Math.abs(
              font.textMeshFifth.position.z - player.modelMesh.position.z
            ) < 0.1
          ) {
            gsap.to(font.textMeshFifthMaterial, {
              duration: 1,
              opacity: 0.8,
              ease: "Power3.easeOut",
              onUpdate: function () {
                font.textMeshFifth.lookAt(
                  font.textMeshFifth.position.x,
                  camera.position.y,
                  100
                );
              },
            });
          }
        } else if (myomokMode) {
          player.actions[1].stop();
          player.actions[2].stop();
        } else if (growFlowerZoneMode) {
          player.actions[1].stop();
          player.actions[2].stop();
        } else {
          if (player.mixer) player.mixer.update(delta);

          // 서 있는 상태
          player.actions[1].stop();
          player.actions[2].play();

          // 뱀 위치 도달시
          if (
            Math.abs(spotMesh.position.x - player.modelMesh.position.x) < 1 &&
            Math.abs(spotMesh.position.z - player.modelMesh.position.z) < 1
          ) {
            setQuest("");
            if (!snake.visible) {
              // 들어갔을 때 터치 안되게 제어하기

              // new THREE.Vector3(9, -3, 18)

              // test
              const startOrientation = player.modelMesh.quaternion.clone();

              snake.visible = true;
              player.movingDone = true;
              // floor.actions[0].play();

              const tl = gsap.timeline();

              tl.to(player.modelMesh, {
                duration: 0.55,
                onUpdate: function () {
                  // player.modelMesh.lookAt(new THREE.Vector3(9, 0, 18));
                  player.modelMesh.quaternion
                    .copy(startOrientation)
                    .slerp(targetOrientation, this.progress());
                },
              })
                .to(camera.position, {
                  duration: 2,
                  x: 7 + 34,
                  y: 8,
                  z: 29 + 17,
                  onUpdate: function () {
                    // camera.quaternion
                    //   .copy(startCamOrientation)
                    //   .slerp(targetOrientation, this.progress());
                    camera.lookAt(
                      player.modelMesh.position.x,
                      player.modelMesh.position.y,
                      player.modelMesh.position.z - 4
                    );
                  },
                })
                .to(snake.snakeGroup.position, {
                  duration: 1,
                  y: 0,
                  ease: "Power3.easeOut",
                });

              setTimeout(() => {
                snake.snakeActions[0].play();
                snake.eleActions[0].play();
              }, 4500);

              setTimeout(() => {
                scene.add(crown.modelMesh);
                gsap.to(crown.modelMaterial, {
                  duration: 2,
                  opacity: 1,
                  onComplete: function () {
                    snake.touchable = true;
                  },
                });
                gsap.to(font.touchMaterial, { duration: 2, opacity: 1 });

                crown.crownBool = true;
              }, 8500);
            }
          }
        }
      }

      if (selected) {
        const tl2 = gsap.timeline();
        tl2.to(camera.position, {
          duration: 1,
          x: camera2.position.x,
          y: camera2.position.y,
          ease: "SlowMo.ease.config(0.7, 0.1, false)",
          onUpdate: function () {
            camera.quaternion
              .copy(startCamOrientation2)
              .slerp(targetOrientation2, this.progress());
          },
        });
        gsap.to(camera.position, {
          duration: 4,
          z: camera2.position.z,
          ease: "SlowMo.ease.config(0.7, 0.7, false)",
        });
        font.touchMesh.removeFromParent();
        crown.modelMesh.clear();
        player.modelMesh.clear();
        scene.add(letterSnake.modelMesh);
        letterSnake.actions[0].play();

        if (letterSnake.actions[0].time >= 6.9) {
          scene.add(letterSnake.snakeModelMesh);
          gsap.to(letterSnake.snakeModelMesh.position, {
            duration: 1,
            y: 0,
            ease: "Power3.easeOut",
            onComplete: function () {
              letterSnake.modelMesh.clear();
              letterSnake.snakeActions[0].play();
            },
          });
          // scene.add(letterSnake.snakeModelBiggerMesh);
          // letterSnake.snakeBiggerActions[0].play();
          // if (letterSnake.snakeBiggerActions[0].time >= 2) {
          // letterSnake.snakeModelBiggerMesh.clear();
          if (letterSnake.snakeActions[0].time >= 3) {
            letterSnake.snakeModelMesh.clear();
            scene.add(letterSnake.snakeModel2Mesh);
            letterSnake.snake2Actions[0].play();
            if (letterSnake.snake2Actions[0].time >= 7.4) {
              if (scene.children) {
                scene.clear();
              }
              scene.background = new THREE.Color("black");
              setTimeout(() => {
                // navigate("/snakeEnd", { replace: false });
                navigate("/princeRoad");
                // snakeEndRef.current = true;
                // setSnakeEndBool(true);
              }, 1000);
            }
          }
          // }
        }

        renderer.render(scene, camera);
      } else if (myomokMode) {
        myomokCam.lookAt(
          player.modelMesh.position.x,
          player.modelMesh.position.y + 1,
          player.modelMesh.position.z
        );
        renderer.render(scene, myomokCam);
      } else if (flowerZoneMode) {
        renderer.render(scene, flowerCam);
      } else if (growFlowerZoneMode) {
        renderer.render(scene, growFlowerCam);
      } else {
        renderer.render(scene, camera);
      }
    }

    function checkIntersects() {
      const intersects = raycaster.intersectObjects(meshes3);

      for (const item of intersects) {
        if (
          item.object.name === "snake" &&
          snake.touchable &&
          Math.abs(spotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
          Math.abs(spotMesh.position.z - player.modelMesh.position.z) < 1.5
        ) {
          selected = true;
          const temp = new THREE.Vector3(9.3, 0, 27);
          player.modelMesh.lookAt(temp);
        } else if (
          item.object.name === "bao" &&
          baoZoneMesh.position.x - player.modelMesh.position.x < 0.5 &&
          baoZoneMesh.position.z - player.modelMesh.position.z < 0.5
        ) {
          bao.actions[0].stop();
          bao.actions[1].play();
          setCoco(true);
          console.log(bao.actions[1]);
        }
        break;
      }
    }

    function checkIntersects2() {
      const intersects = playerRaycater.intersectObjects(meshes2);
      const intersects2 = playerRaycater.intersectObjects(meshes);
      // console.log(intersects2);
      if (intersects2.length > 0) {
        if (intersects.length > 0 && intersects[0].object.name === "water") {
          console.log(fish.blueFishActions[0].time);
          if (fishJump === 0) {
            fishJump = 1;
            question.modelMesh.clear();
          }
          console.log(fish.blueFishActions[1].time);
          if (intersects2[0].point.y > -0.5) {
            player.modelMesh.position.y = intersects2[0].point.y;
          } else {
            player.modelMesh.position.y = -0.5;
          }
        } else {
          fishJump = 0;
          // player.modelMesh.position.y = 0;
          player.modelMesh.position.y = intersects2[0].point.y;
        }
      }
    }

    function setSize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      myomokCam.aspect = window.innerWidth / window.innerHeight;
      flowerCam.aspect = window.innerWidth / window.innerHeight;
      growFlowerCam.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      myomokCam.updateProjectionMatrix();
      flowerCam.updateProjectionMatrix();
      growFlowerCam.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

      if (myomokMode) {
        renderer.render(scene, myomokCam);
      } else if (flowerZoneMode) {
        renderer.render(scene, flowerCam);
      } else if (growFlowerZoneMode) {
        renderer.render(scene, growFlowerCam);
      } else {
        renderer.render(scene, camera);
      }
    }

    // 이벤트
    window.addEventListener("resize", setSize);

    // 마우스 좌표를 three.js에 맞게 변환
    function calculateMousePosition(e) {
      mouse.x = (e.clientX / containerRef.current.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY / containerRef.current.clientHeight) * 2 - 1);
    }

    // 변환된 마우스 좌표를 이용해 래이캐스팅
    function raycasting() {
      raycaster.setFromCamera(mouse, camera);
      checkIntersects();
    }

    function playerRaycasting() {
      playerRaycater.set(
        new THREE.Vector3(
          player.modelMesh.position.x,
          4,
          player.modelMesh.position.z
        ),
        new THREE.Vector3(0, -1, 0)
      );
      checkIntersects2();
    }

    // 마우스 이벤트

    containerRef.current.addEventListener("mousedown", (e) => {
      isPressed = true;
      calculateMousePosition(e);
    });
    containerRef.current.addEventListener("mouseup", () => {
      isPressed = false;
    });

    containerRef.current.addEventListener("mousemove", (e) => {
      if (isPressed) {
        calculateMousePosition(e);
      }
    });

    // 터치 이벤트
    containerRef.current.addEventListener("touchstart", (e) => {
      isPressed = true;
      calculateMousePosition(e.touches[0]);
    });
    containerRef.current.addEventListener("touchend", () => {
      isPressed = false;
    });
    containerRef.current.addEventListener("touchmove", (e) => {
      if (isPressed) {
        calculateMousePosition(e.touches[0]);
      }
    });

    draw();
  }, []);

  useEffect(() => {
    if (infoRemove && infoRef.current) {
      infoRef.current.remove();
    }
  }, [infoRemove]);

  useEffect(() => {
    if (infoFlowerRemove && flowerInfoRef.current) {
      flowerInfoRef.current.remove();
    }
  }, [infoFlowerRemove]);

  useEffect(() => {
    if (infoBaoRemove && baoInfoRef.current) {
      baoInfoRef.current.remove();
    }
  }, [infoBaoRemove]);

  useEffect(() => {
    if (infoGlassFlowerRemove && glassInfoRef.current) {
      glassInfoRef.current.remove();
    }
  }, [infoGlassFlowerRemove]);

  useEffect(() => {
    if (loadBool && loadingRef.current) {
      loadingRef.current.remove();
    }
  }, [loadBool]);

  // pull mode

  useEffect(() => {
    if (pullMode === 1) {
      gsap.to(progressRef.current.style, {
        duration: 1,
        opacity: 1,
      });
    } else if (pullMode === 2) {
      gsap.to(progressRef.current.style, {
        duration: 1,
        opacity: 0,
      });
    }
  }, [pullMode]);

  return (
    <>
      {/* Loading Page */}
      <div>
        <div
          className="font-hand"
          style={{
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "#75c1e7",
            color: "black",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          ref={loadingRef}
        >
          <label
            style={{
              position: "absolute",
              bottom: 120,
              borderRadius: 10,
            }}
            className="text-xl mb-5"
          >
            착륙 준비중..
          </label>
          <progress
            id="progress2"
            style={{
              position: "absolute",
              bottom: 120,
              borderRadius: 10,
            }}
            value={loadingVal}
            max={100}
          ></progress>
          <video width={"100%"} height={"100%"} autoPlay="autoPlay">
            <source src={video} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* grow flower */}
      <div>
        <div
          className="font-hand"
          style={
            infoFlowerBool
              ? {
                  height: "100vh",
                  width: "100vw",
                  overflow: "hidden",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: "#00000080",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }
              : {
                  height: "100vh",
                  width: "100vw",
                  position: "absolute",
                  opacity: 0,
                  top: 0,
                  left: 0,
                  display: "none",
                }
          }
          ref={flowerInfoRef}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{ fontSize: "19px", textAlign: "center", lineHeight: 5 }}
            >
              <h3 className="text-2xl">
                장미는 물을 좋아했어. 물없이는 살 수 없었지..
              </h3>
            </div>
            <button
              style={{
                width: 150,
                height: 40,
                borderRadius: 40,
                backgroundColor: "#FFFFFFC4",
                color: "black",
                cursor: "pointer",
                marginTop: 30,
              }}
              onClick={() => {
                setInfoFlowerBool(false);
                setInfoFlowerRemove(true);
                setQuest(
                  "오른쪽으로 이동해 장미와의 또 다른 추억을 찾아보세요"
                );
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>

      {/* bao */}
      <div>
        <div
          className="font-hand"
          style={
            infoBaoBool
              ? {
                  height: "100vh",
                  width: "100vw",
                  overflow: "hidden",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: "#00000080",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }
              : {
                  height: "100vh",
                  width: "100vw",
                  position: "absolute",
                  opacity: 0,
                  top: 0,
                  left: 0,
                  display: "none",
                }
          }
          ref={baoInfoRef}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{ fontSize: "19px", textAlign: "center", lineHeight: 5 }}
            >
              <h3 className="text-2xl">
                바오밥나무가 자라면 장미가 위험해 다 크기 전에 뽑아줘야했지..
              </h3>
            </div>
            <button
              style={{
                width: 150,
                height: 40,
                borderRadius: 40,
                backgroundColor: "#FFFFFFC4",
                color: "black",
                cursor: "pointer",
                marginTop: 30,
              }}
              onClick={() => {
                setInfoBaoBool(false);
                setInfoBaoRemove(true);
                setQuest(
                  "오른쪽으로 이동해 장미와의 또 다른 추억을 찾아보세요"
                );
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>

      {/* flower glass */}
      <div>
        <div
          className="font-hand"
          style={
            infoGlassFlowerBool
              ? {
                  height: "100vh",
                  width: "100vw",
                  overflow: "hidden",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: "#00000080",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }
              : {
                  height: "100vh",
                  width: "100vw",
                  position: "absolute",
                  opacity: 0,
                  top: 0,
                  left: 0,
                  display: "none",
                }
          }
          ref={glassInfoRef}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{ fontSize: "19px", textAlign: "center", lineHeight: 5 }}
            >
              <h3 className="text-2xl whitespace-pre-wrap">
                {
                  "저녁이 되면 장미에게 유리관을 덮어줘야 했어\n 내가 사는 행성은 장미에게 너무 추웠거든"
                }
              </h3>
            </div>
            <button
              style={{
                width: 150,
                height: 40,
                borderRadius: 40,
                backgroundColor: "#FFFFFFC4",
                color: "black",
                cursor: "pointer",
                marginTop: 30,
              }}
              onClick={() => {
                setInfoGlassFlowerBool(false);
                setInfoGlassFlowerRemove(true);
                setQuest("보아뱀을 찾아보세요");
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            backgroundColor: "black",
            // position: "absolute",
            // top: 0,
            // left: 0,
          }}
          ref={containerRef}
        >
          <div
            id="proContainer"
            style={{
              width: 120,
              overflow: "hidden",
              position: "absolute",
              top: height / 2 + 50,
              left: width / 2 + 20,
            }}
          >
            <progress
              id="progress"
              ref={progressRef}
              style={{ opacity: 0 }}
              value={10}
              max="100"
            ></progress>
          </div>
          <div
            className="font-hand text-xl"
            style={{
              position: "absolute",
              width: 500,
              overflow: "hidden",
              left: width / 2 - 250,
              textAlign: "center",
              top: 100,
            }}
          >
            {quest}
          </div>
          <div></div>
          <div
            className="h-[64px] w-[44px] absolute top-6 right-6 bg-[url('/src/assets/images/exit.png')] bg-cover"
            onClick={() => {
              setModal(true);
            }}
          ></div>
          {modal && (
            <SaveModal
              setModal={setModal}
              taleBookName={"어린왕자"}
              status={"princeMain"}
            ></SaveModal>
          )}
        </div>
      </div>

      <div>
        <div
          className="font-hand"
          style={
            infoBool
              ? {
                  height: "100vh",
                  width: "100vw",
                  overflow: "hidden",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: "#00000080",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }
              : {
                  height: "100vh",
                  width: "100vw",
                  position: "absolute",
                  opacity: 0,
                  top: 0,
                  left: 0,
                }
          }
          ref={infoRef}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{ fontSize: "19px", textAlign: "center", lineHeight: 5 }}
            >
              <h3 className="text-3xl font-semibold">
                키보드를 이용하여 어린왕자를 움직여보세요!
              </h3>
              <p>행성을 돌아다니면서 장미와의 추억을 찾아주세요!</p>
            </div>
            <button
              style={{
                width: 200,
                height: 40,
                borderRadius: 40,
                backgroundColor: "#FFFFFFC4",
                color: "black",
                cursor: "pointer",
                marginTop: 30,
              }}
              onClick={() => {
                setInfoBool(false);
                setInfoRemove(true);
                buttonRef.current = !buttonRef.current;
              }}
            >
              시작하기
            </button>
          </div>
        </div>
      </div>

      <span>
        <iframe
          title="autoPlay"
          src={mySound}
          allow="autoplay"
          id="audio"
          style={{ display: "none" }}
        ></iframe>
        <audio id="player" autoplay loop>
          <source src={mySound} type="audio/mp3" />
        </audio>
      </span>
    </>
  );
}

export default Intro;
