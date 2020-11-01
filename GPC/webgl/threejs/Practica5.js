/*
Practica 5
Autor: Raúl García Crespo
*/

//Variables de consenso
//Motor, escena y la camara
var renderer, scene, camera, cenital;
var l = b = -200;
var r = t = -l;

//Otras variables globales
var robot, base, brazo, antebrazo, mano, pinza1, pinza2, angulo = 0;

// Global GUI
var effectController;

//Acciones
init();
setupGui();
loadScene();
render();

function init() {
	//Configurar el motor de render y el canvas
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color(0xFFFFFF));
	document.getElementById("container").appendChild(renderer.domElement);
	renderer.autoClear = false;
	renderer.shadowMap.enabled = true;

	//Escena
	scene = new THREE.Scene();

	//Camara
	var ar = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera(50, ar, 0.1, 10000);
	camera.position.set(0, 400, 150);
	camera.lookAt(new THREE.Vector3(0,100,0));
	scene.add(camera);

	//Camara cenital
	var origen = new THREE.Vector3(0,0,0);
	var camaraCenital = new THREE.OrthographicCamera(l,r,t,b,-200,200);
	cenital = camaraCenital.clone();
	cenital.position.set(0,100,0);
	cenital.lookAt(origen);

	//Controlador de camara
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);
	cameraControls.enableKeys= false;

	foco = new THREE.SpotLight('white', 1);
	foco.position.set(300, 600, -800);
	foco.target.position.set(0, 0, 0);
	foco.angle = Math.PI / 7;
	foco.penumbra = 0.2;

	foco.shadow.camera.near = 30;
	foco.shadow.camera.far = 2000;
	foco.shadow.camera.fov = 2000;
	foco.shadow.mapSize.width = 1000;
	foco.shadow.mapSize.height = 1000;
	foco.castShadow = true;
	scene.add(foco);

	var luzPuntual = new THREE.PointLight(0xFFFFFF,0.5);
	luzPuntual.position.set( 150, 100, 150 );
	scene.add( luzPuntual );

  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );

	window.addEventListener("resize", updateAspectRatio);


}

function updateAspectRatio(){
	//Renueva la relación de aspecto de la camara

	//Ajustamos el tamaño del canvas
	renderer.setSize(window.innerWidth, window.innerHeight);

	//Razón de aspecto
	var ar = window.innerWidth/window.innerHeight;

	//Camara PerspectiveCamera
	camera.aspect= ar;
	camera.updateProjectionMatrix();
}

function setupGui()
{
	// Definicion de los controles
	effectController = {
		giroBase: 0,
		giroBrazo: 0,
		giroAntebrazoY: 0,
		giroAntebrazoZ: 0,
		giroPinza: 0,
		separacionPinza: 15,
	};

	// Creacion interfaz
	var gui = new dat.GUI();

	// Construccion del menu
	var h = gui.addFolder("Control Robot");
	h.add(effectController, "giroBase", -180, 180, 5).name("Giro Base");
	h.add(effectController, "giroBrazo", -45, 45, 1).name("Giro Brazo");
	h.add(effectController, "giroAntebrazoY", -180, 180, 5).name("Giro Antebrazo Y");
	h.add(effectController, "giroAntebrazoZ", -90, 90, 5).name("Giro Antebrazo Z");
	h.add(effectController, "giroPinza", -40, 220, 5).name("Giro Pinza");
	h.add(effectController, "separacionPinza", 0, 15, 1).name("Separacion Pinza");

}

function loadScene(){
	//construir el grafo de Escena

	var paredes = ["images/posx.jpg", "images/negx.jpg", "images/posy.jpg","images/negy.jpg", "images/posz.jpg", "images/negz.jpg"];

  var mapaEntorno = new THREE.CubeTextureLoader().load(paredes);
  var shader = THREE.ShaderLib.cube;
  shader.uniforms.tCube.value = mapaEntorno;

  var matParedes = new THREE.ShaderMaterial(
      {
          fragmentShader: shader.fragmentShader,
          vertexShader: shader.vertexShader,
          uniforms: shader.uniforms,
          depthWrite: false,
          side: THREE.BackSide
      }
  );

  var room = new THREE.Mesh(new THREE.BoxGeometry(2000, 2000, 2000), matParedes);
  scene.add(room);

	//texturas
	var texturaSuelo = new THREE.TextureLoader().load('images/pisometalico_1024.jpg');
	texturaSuelo.magFilter = THREE.LinearFilter;
	texturaSuelo.minFilter = THREE.LinearFilter;
	texturaSuelo.repeat.set(2,2);
	texturaSuelo.wrapS = texturaSuelo.wrapT = THREE.MirroredRepeatWrapping;
	var materialRotula = new THREE.MeshPhongMaterial({ color:'white',specular:'white', shininess: 50, envMap: mapaEntorno });
	var texturaMetal = new THREE.TextureLoader().load('images/metal_128.jpg');
	var texturaGold = new THREE.TextureLoader().load('images/gold.jpg');

	//MAteriales
	var materialGold = new THREE.MeshPhongMaterial({color:'white',
		                                                 specular:'white',
		                                                 shininess: 50,
		                                                 map:texturaGold });
	var materialMetal = new THREE.MeshLambertMaterial({color:'white', map: texturaMetal});
	var materialPlano = new THREE.MeshLambertMaterial({color:'white', map: texturaSuelo});

	//Geometrias
	var geoplano = new THREE.PlaneGeometry( 1000, 1000, 20, 20 );
	var geoBase = new THREE.CylinderGeometry( 50, 50, 15, 32 );
	var geoEje =  new THREE.BoxGeometry( 18, 120, 12);
	var geoRotula = new THREE.SphereGeometry(20, 15);
	var geoEsparrago = new THREE.CylinderGeometry( 20, 20, 18, 32 );
	var geoNervio = new THREE.BoxGeometry( 4, 80, 4);
	var geoDisco = new THREE.CylinderGeometry( 22, 22, 6, 32 );
	var geoMano = new THREE.CylinderGeometry( 15, 15, 40, 32 );
	var geoPinza = new THREE.Geometry();
	geoPinza.vertices.push(
		new THREE.Vector3(0 , 0, 0),
		new THREE.Vector3(0 , 20, 0),
		new THREE.Vector3(-19 , 20, 0),
		new THREE.Vector3(-19 , 0, 0),
		new THREE.Vector3(0 , 0, 4),
		new THREE.Vector3(0 , 20, 4),
		new THREE.Vector3(-19 , 20, 4),
		new THREE.Vector3(-19 , 0, 4),
		new THREE.Vector3(19 , 5, 4),
		new THREE.Vector3(19 , 15, 4),
		new THREE.Vector3(19 , 5, 2),
		new THREE.Vector3(19 , 15, 2),
	)

	geoPinza.faces.push(
		new THREE.Face3(0,2,1),
		new THREE.Face3(0,3,2),
		new THREE.Face3(2,5,1),
		new THREE.Face3(2,6,5),
		new THREE.Face3(3,7,6),
		new THREE.Face3(3,6,2),
		new THREE.Face3(4,5,6),
		new THREE.Face3(4,6,7),
		new THREE.Face3(4,3,0),
		new THREE.Face3(4,7,3),
		new THREE.Face3(5,8,9),
		new THREE.Face3(5,4,8),
		new THREE.Face3(5,9,1),
		new THREE.Face3(1,9,11),
		new THREE.Face3(10,0,1),
		new THREE.Face3(10,1,11),
		new THREE.Face3(8,0,10),
		new THREE.Face3(8,4,0),
		new THREE.Face3(9,10,11),
		new THREE.Face3(9,8,10),
	)
	geoPinza.computeFaceNormals();
	//Objetos
	var plano = new THREE.Mesh(geoplano, materialPlano)
	plano.rotateX(-Math.PI / 2);
	plano.receiveShadow = true;

	base = new THREE.Mesh(geoBase, materialMetal);
	base.position.y = 1;
	base.castShadow = true;
	base.receiveShadow = true;

	var eje = new THREE.Mesh(geoEje, materialMetal);
	eje.position.y = 60;
	eje.castShadow = true;
	eje.receiveShadow = true;

	var rotula = new THREE.Mesh(geoRotula, materialRotula);
	rotula.position.y = 120;
	rotula.castShadow = true;
	rotula.receiveShadow = true;

	var esparrago = new THREE.Mesh(geoEsparrago, materialMetal);
	esparrago.rotateZ(Math.PI / 2)
	esparrago.castShadow = true;
	esparrago.receiveShadow = true;

	var disco = new THREE.Mesh(geoDisco, materialGold);
	disco.position.y = -0;
	disco.castShadow = true;
	disco.receiveShadow = true;

	var nervio1 = new THREE.Mesh(geoNervio, materialGold);
	nervio1.position.x = 10;
	nervio1.position.y = 40;
	nervio1.position.z = 10;
	nervio1.castShadow = true;
	nervio1.receiveShadow = true;

	var nervio2 = new THREE.Mesh(geoNervio, materialGold);
	nervio2.position.x = -10;
	nervio2.position.y = 40;
	nervio2.position.z = 10;
	nervio2.castShadow = true;
	nervio2.receiveShadow = true;

	var nervio3 = new THREE.Mesh(geoNervio, materialGold);
	nervio3.position.x = 10;
	nervio3.position.y = 40;
	nervio3.position.z = -10;
	nervio3.castShadow = true;
	nervio3.receiveShadow = true;

	var nervio4 = new THREE.Mesh(geoNervio, materialGold);
	nervio4.position.x = -10;
	nervio4.position.y = 40;
	nervio4.position.z = -10;
	nervio4.castShadow = true;
	nervio4.receiveShadow = true;

	mano =  new THREE.Mesh(geoMano, materialGold);
	mano.position.y = 80;
	mano.rotateY(Math.PI/2);
	mano.rotateX(Math.PI/2);
	mano.rotateZ(Math.PI/2);
	mano.castShadow = true;
	mano.receiveShadow = true;


	pinza1 = new THREE.Mesh(geoPinza, materialMetal);
	pinza1.position.y = -20;
	pinza1.position.x = 15;
	pinza1.position.z = -10;
	pinza1.rotateX(Math.PI/2);
	pinza1.castShadow = true;
	pinza1.receiveShadow = true;

	pinza2 = new THREE.Mesh(geoPinza, materialMetal);
	pinza2.position.y = 20;
	pinza2.position.x = 15;
	pinza2.position.z = 10;
	pinza2.rotateX(-Math.PI/2);
	pinza2.castShadow = true;
	pinza2.receiveShadow = true;

	robot = new THREE.Object3D();

	brazo = new THREE.Object3D();

	antebrazo = new THREE.Object3D();
	antebrazo.position.y = 120;

	//Organización de la Escena
	brazo.add(antebrazo);
	base.add(brazo);
	robot.add(base);
	scene.add(plano);
	scene.add(robot)
	brazo.add(eje);
	brazo.add(rotula);
	brazo.add(esparrago);
	antebrazo.add(nervio1);
	antebrazo.add(nervio2);
	antebrazo.add(nervio3);
	antebrazo.add(nervio4);
	antebrazo.add(disco);
	antebrazo.add(mano);
	mano.add(pinza1);
	mano.add(pinza2);
	scene.add(cenital);




	var keyboard = new THREEx.KeyboardState(renderer.domElement);

	renderer.domElement.setAttribute("tabIndex", "0");
  renderer.domElement.focus();
  keyboard.domElement.addEventListener('keydown', function (event) {
      if (keyboard.eventMatches(event, 'left')) {
          robot.position.x -= 10;
      }
      if (keyboard.eventMatches(event, 'right')) {
          robot.position.x += 10;
      }
      if (keyboard.eventMatches(event, 'up')) {
          robot.position.z -= 10;
      }
      if (keyboard.eventMatches(event, 'down')) {
          robot.position.z += 10;
      }
  })

}

function update(){
	//Variación de la escena entre frames
	//angulo += Math.PI/100;
	//robot.rotation.y = angulo;
	base.rotation.y = (effectController.giroBase * Math.PI)/180;
	brazo.rotation.x = (effectController.giroBrazo * Math.PI)/180;
	antebrazo.rotation.y = (effectController.giroAntebrazoY * Math.PI)/180;
	antebrazo.rotation.z = (effectController.giroAntebrazoZ * Math.PI)/180;
	mano.rotation.y =  (effectController.giroPinza * Math.PI)/180;
	pinza2.position.y = -4 -effectController.separacionPinza;
	pinza1.position.y = 4 + effectController.separacionPinza;
	renderer.domElement.focus();
}

function render(){
	//Construir el frame y mostrarlo
	requestAnimationFrame(render);
	update();
	renderer.clear();
	//Para cada render indicar el viewport
	if(window.innerWidth < window.innerHeight){
		renderer.setViewport(0, 0, window.innerWidth/4, window.innerWidth/4);
		renderer.render(scene, cenital);
	} else {
		renderer.setViewport(0, 0, window.innerHeight/4, window.innerHeight/4);
		renderer.render(scene, cenital);
	}

	renderer.setViewport(0, 0,
												window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}
