(function() {
  var scene, camera, renderer;
  var geometry, material, mesh;

  init();
  animate();

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 200;
    camera.position.z = 100;

    // floor
    var geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));
    for (var i = 0, l = geometry.faces.length; i < l; i ++) {
      var face = geometry.faces[i];
      face.vertexColors[ 0 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      face.vertexColors[ 1 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
      face.vertexColors[ 2 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    }
    material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
})();
