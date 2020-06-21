$(document).ready(function () {
function showTime(){
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var s = date.getSeconds(); // 0 - 59
  var session = "AM";
  
  if(h == 0){
      h = 12;
  }
  
  if(h > 12){
      h = h - 12;
      session = "PM";
  }
  
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;
  
  var time = h + ":" + m + ":" + s + " " + session;
  document.getElementById("MyClockDisplay").innerText = time;
  document.getElementById("MyClockDisplay").textContent = time;
  
  setTimeout(showTime, 1000);
  
}

showTime(); 


      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
      const light = new THREE.DirectionalLight( 0xffffff, 5.0 );
    
   
      light.position.set( 10, 10, 10 );
    
  
      scene.add( light );
    
      var renderer = new THREE.WebGLRenderer();
      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.getElementById("myScene").appendChild( renderer.domElement );
    
      var geometry = new THREE.BoxBufferGeometry( 3, 3, 3 );
      var material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
      var cube = new THREE.Mesh( geometry, material );
      scene.add( cube );
      
      camera.position.z = 10;
      
      
      function animate() {
        requestAnimationFrame( animate );
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;
        renderer.render ( scene, camera );
      }
      function render() {
    renderer.render( scene, camera );
    }

    function onWindowResize() {
    // set the aspect ratio to match the new browser window aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;
    // update the camera's frustum
    camera.updateProjectionMatrix();
    // update the size of the renderer AND the canvas
    renderer.setSize( container.clientWidth, container.clientHeight );
    }
    window.addEventListener( 'resize', onWindowResize );

    animate();
    
});