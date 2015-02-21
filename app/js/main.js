(function() {
  var clock;
  var scene, camera, renderer;
  var geometry, material, mesh;
  var havePointerLock = checkForPointerLock();
  var controls, controlsEnabled;
  var moveForward,
      moveBackward,
      moveLeft,
      moveRight,
      canJump;
  var velocity = new THREE.Vector3();

  init();
  animate();

  function init() {
    initControls();
    initPointerLock();

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 10;

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    // floor
    scene.add(createFloor());

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xb2e1f2);
    document.body.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    updateControls();
    renderer.render(scene, camera);
  }

  function createFloor() {
    geometry = new THREE.PlaneGeometry(2000, 2000, 5, 5);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));
    var texture = THREE.ImageUtils.loadTexture('textures/desert.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(64, 64);
    material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
    return new THREE.Mesh(geometry, material);
  }

  function checkForPointerLock() {
    return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
  }
  
  function initPointerLock() {
    var element = document.body;
    if (havePointerLock) {
      var pointerlockchange = function (event) {
        if (document.pointerLockElement === element || 
            document.mozPointerLockElement === element || 
            document.webkitPointerLockElement === element) {
          controlsEnabled = true;
          controls.enabled = true;
        } else {
          controls.enabled = false;
        }
      };

      var pointerlockerror = function (event) {
        element.innerHTML = 'PointerLock Error';
      };

      document.addEventListener('pointerlockchange', pointerlockchange, false);
      document.addEventListener('mozpointerlockchange', pointerlockchange, false);
      document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

      document.addEventListener('pointerlockerror', pointerlockerror, false);
      document.addEventListener('mozpointerlockerror', pointerlockerror, false);
      document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

      var requestPointerLock = function(event) {
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
      };

      element.addEventListener('click', requestPointerLock, false);
    } else {
      element.innerHTML = 'Bad browser; No pointer lock';
    }
  }
  
  function onKeyDown(e) {
    switch (e.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;
      case 37: // left
      case 65: // a
        moveLeft = true; 
        break;
      case 40: // down
      case 83: // s
        moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        moveRight = true;
        break;
      case 32: // space
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  }

  function onKeyUp(e) {
    switch(e.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;
      case 37: // left
      case 65: // a
        moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  }

  function initControls() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
  }

  function updateControls() {
    if (controlsEnabled) {
      var delta = clock.getDelta();

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.y -= 9.8 * 100.0 * delta;

      if (moveForward) velocity.z -= 400.0 * delta;
      if (moveBackward) velocity.z += 400.0 * delta;

      if (moveLeft) velocity.x -= 400.0 * delta;
      if (moveRight) velocity.x += 400.0 * delta;

      controls.getObject().translateX(velocity.x * delta);
      controls.getObject().translateY(velocity.y * delta);
      controls.getObject().translateZ(velocity.z * delta);

      if (controls.getObject().position.y < 10) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
        canJump = true;
      }
    }
  }
})();
