(function() {
  var scene, camera, renderer;
  var geometry, material, mesh;

  init();
  animate();

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 10;
    camera.position.z = 100;

    // floor
    geometry = new THREE.PlaneGeometry(2000, 2000, 5, 5);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));
    var texture = THREE.ImageUtils.loadTexture('textures/desert.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(512, 512);
    material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xb2e1f2);
    document.body.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
})();
