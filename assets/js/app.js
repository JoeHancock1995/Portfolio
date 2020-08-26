// $(document).ready(function () {
// function showTime(){
//   var date = new Date();
//   var h = date.getHours(); // 0 - 23
//   var m = date.getMinutes(); // 0 - 59
//   var s = date.getSeconds(); // 0 - 59
//   var session = "AM";
  
//   if(h == 0){
//       h = 12;
//   }
  
//   if(h > 12){
//       h = h - 12;
//       session = "PM";
//   }
  
//   h = (h < 10) ? "0" + h : h;
//   m = (m < 10) ? "0" + m : m;
//   s = (s < 10) ? "0" + s : s;
  
//   var time = h + ":" + m + ":" + s + " " + session;
//   document.getElementById("MyClockDisplay").innerText = time;
//   document.getElementById("MyClockDisplay").textContent = time;
  
//   setTimeout(showTime, 1000);
  
// }

// showTime(); 


//       var scene = new THREE.Scene();
//       var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
//       const light = new THREE.DirectionalLight( 0xffffff, 5.0 );
    
   
//       light.position.set( 10, 10, 10 );
    
  
//       scene.add( light );
    
//       var renderer = new THREE.WebGLRenderer();
//       renderer = new THREE.WebGLRenderer( { antialias: true } );
//       renderer.setSize( window.innerWidth, window.innerHeight );
//       document.getElementById("myScene").appendChild( renderer.domElement );
    
//       var geometry = new THREE.BoxBufferGeometry( 3, 3, 3 );
//       var material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
//       var cube = new THREE.Mesh( geometry, material );
//       scene.add( cube );
      
//       camera.position.z = 10;
      
      
//       function animate() {
//         requestAnimationFrame( animate );
//         cube.rotation.x += 0.01;
//         cube.rotation.y += 0.01;
//         cube.rotation.z += 0.01;
//         renderer.render ( scene, camera );
//       }
//       function render() {
//     renderer.render( scene, camera );
//     }

//     function onWindowResize() {
//     // set the aspect ratio to match the new browser window aspect ratio
//     camera.aspect = container.clientWidth / container.clientHeight;
//     // update the camera's frustum
//     camera.updateProjectionMatrix();
//     // update the size of the renderer AND the canvas
//     renderer.setSize( container.clientWidth, container.clientHeight );
//     }
//     window.addEventListener( 'resize', onWindowResize );

//     animate();
    
// });

import * as THREE from '../build/three.module.js';

import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './jsm/postprocessing/ShaderPass.js';
import { BloomPass } from './jsm/postprocessing/BloomPass.js';
import { CopyShader } from './jsm/shaders/CopyShader.js';

var container;

var camera, scene, renderer;

var video, texture, material, mesh;

var composer;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 1;
var windowHalfY = window.innerHeight / 1;

var cube_count,

  meshes = [],
  materials = [],

  xgrid = 40,
  ygrid = 20;

var startButton = document.getElementById('startButton');
startButton.addEventListener('click', function () {

  init();
  animate();

}, false);

function init() {

  var overlay = document.getElementById('overlay');
  overlay.remove();

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 300;

  scene = new THREE.Scene();

  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0.5, 1, 1).normalize();
  scene.add(light);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // window.addEventListener( 'resize', function () {
  //   var width = window.innerWidth;
  //   var height = window.innerHeight;
  //   renderer.setSize( width, height );
  //   camera.aspect = width / height;
  //   camera.updateProjectionMatrix();
  // })

  video = document.getElementById('video');
  video.play();
  video.addEventListener('play', function () {
    this.currentTime = 3;
  }, false);

  texture = new THREE.VideoTexture(video);

  //

  var i, j, ux, uy, ox, oy,
    geometry,
    xsize, ysize;

  ux = 1 / xgrid;
  uy = 1 / ygrid;

  xsize = 200 / xgrid;
  ysize = 125 / ygrid;

  var parameters = { color: 0xffffff, map: texture };

  cube_count = 0;

  for (i = 0; i < xgrid; i++)
    for (j = 0; j < ygrid; j++) {

      ox = i;
      oy = j;

      geometry = new THREE.BoxBufferGeometry(xsize, ysize, xsize);

      change_uvs(geometry, ux, uy, ox, oy);

      materials[cube_count] = new THREE.MeshLambertMaterial(parameters);

      material = materials[cube_count];

      material.hue = i / xgrid;
      material.saturation = 1 - j / ygrid;

      material.color.setHSL(material.hue, material.saturation, 0.5);

      mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = (i - xgrid / 2) * xsize;
      mesh.position.y = (j - ygrid / 2) * ysize;
      mesh.position.z = 0;

      mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;

      scene.add(mesh);

      mesh.dx = 0.001 * (0.05 - Math.random());
      mesh.dy = 0.001 * (0.05 - Math.random());

      meshes[cube_count] = mesh;

      cube_count += 1;

    }

  renderer.autoClear = false;

  document.addEventListener('mousemove', onDocumentMouseMove, false);

  // postprocessing

  var renderModel = new RenderPass(scene, camera);
  var effectBloom = new BloomPass(1);
  var effectCopy = new ShaderPass(CopyShader);

  composer = new EffectComposer(renderer);

  composer.addPass(renderModel);
  composer.addPass(effectBloom);
  composer.addPass(effectCopy);

  //

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 1;
  windowHalfY = window.innerHeight / 1;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);

}

function change_uvs(geometry, unitx, unity, offsetx, offsety) {

  var uvs = geometry.attributes.uv.array;

  for (var i = 0; i < uvs.length; i += 2) {

    uvs[i] = (uvs[i] + offsetx) * unitx;
    uvs[i + 1] = (uvs[i + 1] + offsety) * unity;

  }

}


function onDocumentMouseMove(event) {

  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY) * 0.03;

}

//

function animate() {

  requestAnimationFrame(animate);

  render();

}

var h, counter = 1;

function render() {

  var time = Date.now() * 0.00005;

  camera.position.x += (mouseX - camera.position.x) * 0.0003;
  camera.position.y += (- mouseY - camera.position.y) * 0.0;

  camera.lookAt(scene.position);

  for (var i = 0; i < cube_count; i++) {

    material = materials[i];

    h = (360 * (material.hue + time) % 360) / 360;
    material.color.setHSL(h, material.saturation, 1);

  }

  if (counter % 1000 > 200) {

    for (var i = 0; i < cube_count; i++) {

      mesh = meshes[i];

      mesh.rotation.x += 50 * mesh.dx;
      mesh.rotation.y += 50 * mesh.dy;

      mesh.position.x -= 50 * mesh.dx;
      mesh.position.y += 50 * mesh.dy;
      mesh.position.z += 125 * mesh.dx;

    }

  }

  if (counter % 2000 === 0) {

    for (var i = 0; i < cube_count; i++) {

      mesh = meshes[i];

      mesh.dx *= - 1;
      mesh.dy *= - 1;

    }

  }

  counter++;

  renderer.clear();
  composer.render();

}

