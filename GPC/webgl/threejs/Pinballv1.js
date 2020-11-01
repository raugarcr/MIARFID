/**
 * Seminario GPC #4  Animación por simulación física.
 * Esferas en habitación cerrada con molinete central
 *
 * @requires three_r96.js, coordinates.js, orbitControls.js, cannon.js, tween.js, stats_r16.js
 * @author rvivo / http://personales.upv.es/rvivo
 * @date 2020
 */

// Globales convenidas por threejs
var renderer, scene, camera, cameraBola, esfera, camaraPrincipal, camaraMini;
var anguloInclinacion  = Math.PI/1.8;
// Control de camara
var cameraControls, foco;
// Monitor de recursos
var stats;
// Mundo fisico
var world, reloj, ceiling;
//helper
var helper;
// Objetos
const nesferas = 20;
var esferas = [];
var paleta1, paleta2;
var reposo1 = true;
var reposo2 = true;
var anguloPaleta1 = Math.PI/3;
var anguloPaleta2 = -Math.PI/3;
var puntuacion = 0;
var multPuntos = 1;
var bolasRestantes = 0;

var container = document.getElementById("container");

//Texturas
var foto = new THREE.ImageUtils.loadTexture( "images/metal_128.jpg" );
foto.magFilter = THREE.LinearFilter;
foto.minFilter = THREE.LinearFilter;
var metal = new THREE.MeshPhongMaterial( { ambient:0xFFFFFF,color:0xFFFFFF,specular:0xFFFFFF,  shininess:15,  map: foto } );
foto = new THREE.ImageUtils.loadTexture( "images/madera.jpg" );
foto.magFilter = THREE.LinearFilter;
foto.minFilter = THREE.LinearFilter;
var madera = new THREE.MeshPhongMaterial( { ambient:0xFFFFFF,color:0xFFFFFF,specular:0xF0F0F0,  shininess:1,  map: foto } );
foto = new THREE.ImageUtils.loadTexture( "images/metalRed.jpg" );
foto.magFilter = THREE.LinearFilter;
foto.minFilter = THREE.LinearFilter;
var metalRojo = new THREE.MeshPhongMaterial( { ambient:0xFFFFFF,color:0xFF5555,specular:0xFFFFFF,  shininess:10,  map: foto } );
foto = new THREE.ImageUtils.loadTexture( "images/ajedrez.jpg" );
foto.magFilter = THREE.LinearFilter;
foto.minFilter = THREE.LinearFilter;
foto.wrapS = foto.wrapT = THREE.MirroredRepeatWrapping;
var chess = new THREE.MeshLambertMaterial( { color:"white", map: foto } );

initPhysicWorld();
initVisualWorld();
setupGui();
helper = new CannonHelper(scene, world);
loadWorld();
render();


function setupGui()
{
	// Definicion de los controles
	effectController = {
    bolasIniciales:1,
    posicionZFoco:-10
	};

	// Creacion interfaz
	var gui = new dat.GUI();

	// Construccion del menu
	var h = gui.addFolder("Control Pinball");
	h.add(effectController, "bolasIniciales", 1, 5, 1).name("Nº de intentos");
	h.add(effectController, "posicionZFoco", -20, 20, 1).name("Posición Z foco");

}
/**
 * Construye una bola con cuerpo y vista
 */
function Esfera( radio, posicion, material ){
	var masa = 1;
	this.body = new CANNON.Body( {mass: masa, material: material} );
	this.body.addShape( new CANNON.Sphere( radio ) );
	this.body.position.copy( posicion );
	this.visual = new THREE.Mesh( new THREE.SphereGeometry( radio ),
		          metal );
  this.visual.receiveShadow = true;
  this.visual.castShadow = true;
	this.visual.position.copy( this.body.position );
  this.visual.castShadow = true;
}

function Paleta1(posicion,material ){
  var masa = 0;
  this.body = new CANNON.Body( {mass: masa, material: material} );
  this.body.addShape( new CANNON.Box(new CANNON.Vec3(0.5,1,3.5)));
  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  var angulo = Math.PI/2 - anguloInclinacion;
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), angulo);
  quatY.setFromAxisAngle(new CANNON.Vec3(0,1,0), anguloPaleta1);
  var quaternion = quatX.mult(quatY);
  this.body.quaternion.copy(quaternion);
  this.body.angularVelocity.set(0,0,5);
  this.body.angularDamping = 0.1;
  this.body.position.copy( posicion);
  this.visual = new THREE.Mesh( new THREE.BoxGeometry( 1,2,7 ),
		          metal );
  this.visual.receiveShadow = true;
  this.visual.castShadow = true;

  this.visual.quaternion.copy(quaternion);
	this.visual.position.copy(posicion);
}

function Paleta2(posicion,material ){
  var masa = 0;
  this.body = new CANNON.Body( {mass: masa, material: material} );
  this.body.addShape( new CANNON.Box(new CANNON.Vec3(0.5,1,3.5)));
  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  var angulo = Math.PI/2 - anguloInclinacion;
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), angulo);
  quatY.setFromAxisAngle(new CANNON.Vec3(0,1,0), anguloPaleta1);
  var quaternion = quatX.mult(quatY);
  this.body.quaternion.copy(quaternion);
  this.body.angularVelocity.set(0,0,-5);
  this.body.angularDamping = -0.1;
  this.body.position.copy( posicion);
  this.visual = new THREE.Mesh( new THREE.BoxGeometry( 1,2,7 ),
		          metal );
  this.visual.receiveShadow = true;
  this.visual.castShadow = true;
  this.visual.quaternion.copy(quaternion);
	this.visual.position.copy(posicion);
}

function Caja(posicion, material){
  var masa = 0;
  this.body = new CANNON.Body( {mass: masa, material: material} );
  this.body.addShape( new CANNON.Box(new CANNON.Vec3( 4, 1, 4)));
  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  var angulo = Math.PI/2 - anguloInclinacion;
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), angulo);
  quatY.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI/4);
  var quaternion = quatX.mult(quatY);
  this.body.quaternion.copy(quaternion);
  this.body.position.copy(posicion);

  this.visual = new THREE.Mesh( new THREE.BoxGeometry(8,3.25,8),
		          madera );
  this.visual.receiveShadow = true;
  this.visual.castShadow = true;
  this.visual.quaternion.copy(quaternion);
	this.visual.position.copy(posicion);
}

function Seta(posicion, material){
  var masa = 0;
  this.body = new CANNON.Body( {mass: masa, material: material} );
  this.body.addShape( new CANNON.Cylinder(1,1,2,20));
  var quatX = new CANNON.Quaternion();
  var quatX2 = new CANNON.Quaternion();
  var angulo = Math.PI/2 - anguloInclinacion;
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), angulo);
  quatX2.setFromAxisAngle(new CANNON.Vec3(1,0,0), Math.PI/2);
  var quaternion = quatX.mult(quatX2);
  this.body.quaternion.copy(quaternion);
  this.body.position.copy( posicion);
  this.visual = new THREE.Mesh( new THREE.CylinderGeometry( 1,1,2,20 ),
		          metalRojo );
  this.visual.receiveShadow = true;
  this.visual.castShadow = true;
  this.visual.quaternion.copy(quatX);
	this.visual.position.copy(posicion);
}

function Rebote(posicion, material, anguloRebote, textura){
  var masa = 0;
  this.body = new CANNON.Body( {mass: masa, material: material} );
  this.body.addShape( new CANNON.Box(new CANNON.Vec3( 3, 1, 0.5)));
  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  var angulo = Math.PI/2 - anguloInclinacion;
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), angulo);
  quatY.setFromAxisAngle(new CANNON.Vec3(0,1,0),  anguloRebote);
  var quaternion = quatX.mult(quatY);
  this.body.quaternion.copy(quaternion);
  this.body.position.copy(posicion);

  this.visual = new THREE.Mesh( new THREE.BoxGeometry(6,2,1),
              textura );
  this.visual.receiveShadow = true;
  this.visual.castShadow = true;
  this.visual.quaternion.copy(quaternion);
  this.visual.position.copy(posicion);
}
/**
 * Inicializa el mundo fisico con un
 * suelo y cuatro paredes de altura infinita
 */
function initPhysicWorld()
{
	// Mundo
  	world = new CANNON.World();
   	world.gravity.set(0,-9.8,0);
   	///world.broadphase = new CANNON.NaiveBroadphase();
   	world.solver.iterations = 10;

   	// Material y comportamiento
    var groundMaterial = new CANNON.Material("groundMaterial");
    var materialEsfera = new CANNON.Material("sphereMaterial");
    var materialPaleta = new CANNON.Material("paletaMaterial");
    var materialSeta = new CANNON.Material("setaMaterial");
    var materialTecho = new CANNON.Material("techoMaterial");
    world.addMaterial( materialEsfera );
    world.addMaterial( groundMaterial );
    world.addMaterial( materialPaleta );
    world.addMaterial( materialSeta );
    world.addMaterial( materialTecho );
    // -existe un defaultContactMaterial con valores de restitucion y friccion por defecto
    // -en caso que el material tenga su friccion y restitucion positivas, estas prevalecen
    var sphereGroundContactMaterial = new CANNON.ContactMaterial(groundMaterial,materialEsfera,
    										    				{ friction: 0.3,
    										      				  restitution: 0.7 });
    world.addContactMaterial(sphereGroundContactMaterial);

    var paletaSphereContactMaterial = new CANNON.ContactMaterial(materialPaleta,materialEsfera,
    										    				{ friction: 0.1,
    										      				  restitution: 0.2 });
    world.addContactMaterial(paletaSphereContactMaterial);

    var esferaSetaContactMaterial = new CANNON.ContactMaterial(materialSeta,materialEsfera,
    										    				{ friction: 0,
    										      				  restitution: -1.3 });
    world.addContactMaterial(esferaSetaContactMaterial);

    var esferaTechoContactMaterial = new CANNON.ContactMaterial(materialTecho,materialEsfera,
    										    				{ friction: 0,
    										      				  restitution: 0.1 });
    world.addContactMaterial(esferaTechoContactMaterial);



    // Suelo
    var groundShape = new CANNON.Plane();
    var ground = new CANNON.Body({ mass: 0, material: groundMaterial });
    ground.addShape(groundShape);
    ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/1.8);
    world.addBody(ground);

    var ceilingShape = new CANNON.Plane();
    ceiling = new CANNON.Body({ mass: 0, material: materialTecho });
    ceiling.addShape(ceilingShape);
    var quatX = new CANNON.Quaternion();
    var quatY = new CANNON.Quaternion();
    quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), anguloInclinacion);
    quatY.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI);
    var quaternion = quatY.mult(quatX);
    ceiling.quaternion.copy(quaternion);
    positionCeiling = new CANNON.Vec3( 0, 1.2, 0);
    ceiling.position.copy(positionCeiling);
    world.addBody(ceiling);

    // Paredes
    var backWall = new CANNON.Body( {mass:0, material:groundMaterial} );
    backWall.addShape( new CANNON.Plane() );
    backWall.position.z = -15;
    world.addBody( backWall );
    backWall.addEventListener("collide",function(e){
      posicionBola =  new CANNON.Vec3( -9, 1, 5 );
      bolasRestantes = bolasRestantes - 1;
      if (bolasRestantes == -1) {
        scene.remove(cameraBola);
        scene.remove(esfera.visual);
        world.remove(esfera.body);
        document.getElementById("final").style.display = "block";
      } else {
        document.getElementById("infoBolas").innerHTML = "Bolas restantes: " + bolasRestantes;
        scene.remove(cameraBola);
        scene.remove(esfera.visual);
        world.remove(esfera.body);
        esfera = new Esfera( 1/2, new CANNON.Vec3( -9, 0.5, 5 ), materialEsfera );
      	world.addBody( esfera.body );
      	scene.add( esfera.visual );
        scene.add(cameraBola);
      }
    });
    var frontWall = new CANNON.Body( {mass:0, material:groundMaterial} );
    frontWall.addShape( new CANNON.Plane() );
    frontWall.quaternion.setFromEuler(0,Math.PI,0,'XYZ');
    frontWall.position.z = 19.5;
    world.addBody( frontWall );
    var leftWall = new CANNON.Body( {mass:0, material:groundMaterial} );
    leftWall.addShape( new CANNON.Plane() );
    leftWall.position.x = -10;
    leftWall.quaternion.setFromEuler(0,Math.PI/2,0,'XYZ');
    world.addBody( leftWall );
    var rightWall = new CANNON.Body( {mass:0, material:groundMaterial} );
    rightWall.addShape( new CANNON.Plane() );
    rightWall.position.x = 10;
    rightWall.quaternion.setFromEuler(0,-Math.PI/2,0,'XYZ');
    world.addBody( rightWall );
}

/**
 * Inicializa la escena visual
 */
function initVisualWorld()
{
	// Inicializar el motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( container.offsetWidth, container.offsetHeight);
	renderer.setClearColor( new THREE.Color(0x404040) );
	document.getElementById( 'container' ).appendChild( renderer.domElement );
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;

	// Crear el grafo de escena
	scene = new THREE.Scene();

	// Reloj
	reloj = new THREE.Clock();
	reloj.start();

	// Crear y situar la camara
	var aspectRatio = container.offsetWidth /container.offsetHeight;
	camera = new THREE.PerspectiveCamera( 75, aspectRatio , 0.1, 100 );
	camera.position.set( 0,15,-15 );
	camera.lookAt( new THREE.Vector3( 0,0,0 ) );
  camaraPrincipal = camera;
	// Control de camara
	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
	cameraControls.target.set(0,0,0);

  cameraControls.enableKeys = false;
  cameraControls.enablePan = false;

  // Camara esfera
	cameraBola = new THREE.PerspectiveCamera( 75, aspectRatio , 0.5, 200);
	cameraBola.position.set( 0,0,0 );
	cameraBola.lookAt( new THREE.Vector3( 0,0,-10 ) );
  camaraMini = cameraBola;
	// STATS --> stats.update() en update()
	stats = new Stats();
	stats.showPanel(0);	// FPS inicialmente. Picar para cambiar panel.
	document.getElementById( 'container' ).appendChild( stats.domElement );

  foco = new THREE.SpotLight('white', 1);
	foco.position.set(0, 20, -10);
	foco.target.position.set(0, 0, 0);
	foco.angle = Math.PI / 3;
	foco.penumbra = 0.2;

	foco.shadow.camera.near = 1;
	foco.shadow.camera.far = 2000;
	foco.shadow.camera.fov = 2000;
	foco.shadow.mapSize.width = 5000;
	foco.shadow.mapSize.height = 5000;
	foco.castShadow = true;
	scene.add(foco);

  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );

	// Callbacks
	window.addEventListener('resize', updateAspectRatio );

  var paredes = ["images/Yokohama3/posx.jpg", "images/Yokohama3/negx.jpg", "images/Yokohama3/posy.jpg","images/Yokohama3/negy.jpg", "images/Yokohama3/posz.jpg", "images/Yokohama3/negz.jpg"];
  var foto = new THREE.ImageUtils.loadTexture( "images/estrellas.png" );
  var mapaEntorno = new THREE.CubeTextureLoader().load(paredes);
  scene.background = mapaEntorno;
  /*
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

  var room = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), matParedes);
  scene.add(room);
  */
}

/**
 * Carga los objetos es el mundo físico y visual
 */
function loadWorld()
{

	for( i=0; i<world.materials.length; i++){
		if( world.materials[i].name === "paletaMaterial" ) materialPaleta = world.materials[i];
	}

  paleta1 = new Paleta1(new CANNON.Vec3( 5, -1, -8),materialPaleta);
  world.addBody( paleta1.body );
	scene.add( paleta1.visual );
  paleta1.body.addEventListener("collide",function(e){
    multPuntos = 1;
    document.getElementById("infoMult").innerHTML = "Multiplicador: " + multPuntos;
        });
  paleta2 = new Paleta2(new CANNON.Vec3( -5, -1, -8),materialPaleta);
  world.addBody( paleta2.body );
	scene.add( paleta2.visual );
  paleta2.body.addEventListener("collide",function(e){
    multPuntos = 1;
    document.getElementById("infoMult").innerHTML = "Multiplicador: " + multPuntos;
  });


  var materialSeta;
	for( i=0; i<world.materials.length; i++){
		if( world.materials[i].name === "setaMaterial" ) materialSeta = world.materials[i];
	}

  var setaPositions = [new CANNON.Vec3( 4, 1, 4), new CANNON.Vec3( -4, 1, 4), new CANNON.Vec3( 4, 2.5, 12), new CANNON.Vec3( -4, 2.5, 12), new CANNON.Vec3( 0, 2, 8)];

  for(i = 0;i< setaPositions.length;i++){
    var seta = new Seta(setaPositions[i],materialSeta);
    world.addBody( seta.body );
  	scene.add( seta.visual );
    seta.body.addEventListener("collide",function(e){
      puntuacion =  puntuacion + 20 * multPuntos;
      document.getElementById("infoPuntos").innerHTML = "Putuacion: " + puntuacion;
      multPuntos = multPuntos + 1;
      document.getElementById("infoMult").innerHTML = "Multiplicador: " + multPuntos;
          });
  }

  var caja1 = new Caja(new CANNON.Vec3( 10, -1, -7.5), materialPaleta);
  world.addBody( caja1.body );
	scene.add( caja1.visual );

  var caja2 = new Caja(new CANNON.Vec3( -10, -1, -7.5), materialPaleta);
  world.addBody( caja2.body );
	scene.add( caja2.visual );

  var rebote = new Rebote(new CANNON.Vec3( -5.5, 0, -2.5), materialSeta,  Math.PI/4, metal);
  world.addBody( rebote.body );
	scene.add( rebote.visual );
  var freno = new Rebote(new CANNON.Vec3( -6.25, 0, -3.20), undefined,  Math.PI/4, madera);
  world.addBody( freno.body );
	scene.add( freno.visual );

  var rebote2 = new Rebote(new CANNON.Vec3( 5.5, 0, -2.5), materialSeta,  -Math.PI/4,metal);
  world.addBody( rebote2.body );
	scene.add( rebote2.visual );
  var freno2= new Rebote(new CANNON.Vec3( 6.25, 0, -3.20), undefined,  -Math.PI/4,madera);
  world.addBody( freno2.body );
	scene.add( freno2.visual );

  var loader = new THREE.FontLoader();

  loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

  	var textoGeometry = new THREE.TextGeometry( 'Pinball 3D', {
  		font: font,
  		size: 2,
  		height: 1,
  		curveSegments: 10,
  		bevelEnabled: true,
  		bevelThickness: 0.25,
  		bevelSize: 0.1,
  		bevelOffset: 0,
  		bevelSegments: 10
  	 } );
     var texto3d = new THREE.Mesh( textoGeometry,
               metalRojo );
    texto3d.position.x = -5;
    texto3d.position.y = 1;
    texto3d.position.z = -0.5;
    texto3d.receiveShadow = true;
    texto3d.castShadow = true;
    var ejeTexto = new THREE.Object3D();
    ejeTexto.add(texto3d);
    ejeTexto.position.set(0,8,13);
    scene.add(ejeTexto);
    var tween = new TWEEN.Tween(ejeTexto.rotation).to({ y: -(360 * Math.PI / 180)}, 5000);
    tween.repeat(Infinity)

    tween.start();
   } );


  paredDerecha = new THREE.Mesh( new THREE.BoxGeometry(1,35.5,3),
		          madera );
              scene.add(paredDerecha);
  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), -anguloInclinacion);
  paredDerecha.receiveShadow = true;
  paredDerecha.castShadow = true;
  paredDerecha.quaternion.copy(quatX);
  paredDerecha.position.set(-10.5,1,2.5);

  paredIzquierda = new THREE.Mesh( new THREE.BoxGeometry(1,35.5,3),
		          madera );
              scene.add(paredIzquierda);
  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), -anguloInclinacion);
  paredIzquierda.quaternion.copy(quatX);
  paredIzquierda.position.set(10.5,1,2.5);
  paredIzquierda.receiveShadow = true;
  paredIzquierda.castShadow = true;

  paredAtras = new THREE.Mesh( new THREE.BoxGeometry(22,1,3),
		          madera );
              scene.add(paredAtras);
  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), -anguloInclinacion);
  paredAtras.quaternion.copy(quatX);
  paredAtras.position.set(0,4,20);
  paredAtras.receiveShadow = true;
  paredAtras.castShadow = true;

  panel = new THREE.Mesh( new THREE.BoxGeometry(22,1,11),
		          madera );
              scene.add(panel);
  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), -anguloInclinacion);
  panel.quaternion.copy(quatX);
  panel.position.set(0,8,20);
  panel.receiveShadow = true;
  panel.castShadow = true;

  paredFrente = new THREE.Mesh( new THREE.BoxGeometry(22,1,3),
		          madera );
              scene.add(paredFrente);
  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), -anguloInclinacion);
  paredFrente.quaternion.copy(quatX);
  paredFrente.position.set(0,-2,-15.5);
  paredFrente.receiveShadow = true;
  paredFrente.castShadow = true;

  panelInf = new THREE.Mesh( new THREE.BoxGeometry(21,36,1),
		          madera );
              scene.add(panelInf);
  panelInf.rotateX(-Math.PI/1.8);
  panelInf.position.set(0,-0.75,2.5);

  var plano = new THREE.Mesh(new THREE.BoxGeometry( 20, 35, 1), chess);
  plano.rotateX(-Math.PI/1.8);
  plano.position.z = 2.5;
  plano.position.y = -0.2;
  plano.receiveShadow = true;
  plano.castShadow = true;
  scene.add(plano);

  pata = new THREE.Mesh( new THREE.BoxGeometry(1,1,11),
		          madera );
              scene.add(pata);
  var quatX = new CANNON.Quaternion();
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), -anguloInclinacion);
  pata.quaternion.copy(quatX);
  pata.position.set(10.5,-7,-14.5);
  pata.receiveShadow = true;
  pata.castShadow = true;
  scene.add(pata);

  pata = new THREE.Mesh( new THREE.BoxGeometry(1,1,11),
              madera );
              scene.add(pata);
  var quatX = new CANNON.Quaternion();
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), -anguloInclinacion);
  pata.quaternion.copy(quatX);
  pata.position.set(-10.5,-7,-14.5);
  pata.receiveShadow = true;
  pata.castShadow = true;
  scene.add(pata);

  pata = new THREE.Mesh( new THREE.BoxGeometry(1,1,11),
              madera );
              scene.add(pata);
  var quatX = new CANNON.Quaternion();
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), -anguloInclinacion);
  pata.quaternion.copy(quatX);
  pata.position.set(-10.5,-3, 19.5);
  pata.receiveShadow = true;
  pata.castShadow = true;
  scene.add(pata);

  pata = new THREE.Mesh( new THREE.BoxGeometry(1,1,11),
              madera );
              scene.add(pata);
  var quatX = new CANNON.Quaternion();
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), -anguloInclinacion);
  pata.quaternion.copy(quatX);
  pata.position.set(10.5,-3, 19.5);
  pata.receiveShadow = true;
  pata.castShadow = true;
  scene.add(pata);

  var keyboard = new THREEx.KeyboardState(renderer.domElement);

	renderer.domElement.setAttribute("tabIndex", "0");
  renderer.domElement.focus();
  keyboard.domElement.addEventListener('keydown', function (event) {
      if (keyboard.eventMatches(event, 'a')) {
        if(anguloPaleta1 < Math.PI/2){
          paleta1.body.angularVelocity.set(0,5,0);
          paleta1.body.angularDamping = 0.1;
          anguloPaleta1 += Math.PI/10;
          reposo1 = false;
        }

      }
      if (keyboard.eventMatches(event, 'd')) {
        if(anguloPaleta2 > -Math.PI/2){
          paleta2.body.angularVelocity.set(0,-5,0);
          paleta2.body.angularDamping = -0.1;
          anguloPaleta2 -= Math.PI/10;
          reposo2 = false;
        }

      }
      if (keyboard.eventMatches(event, 'c')) {
        var camaraAux = camaraPrincipal;
        camaraPrincipal = camaraMini;
        camaraMini = camaraAux;

      }
      if (keyboard.eventMatches(event, 'r')) {
        puntuacion =  0;
        document.getElementById("infoPuntos").innerHTML = "Putuacion: " + puntuacion;
        multPuntos = 1;
        document.getElementById("infoMult").innerHTML = "Multiplicador: " + multPuntos;
        bolasRestantes = effectController.bolasIniciales - 1;
        document.getElementById("infoBolas").innerHTML = "Bolas restantes: " + bolasRestantes;
        document.getElementById("final").style.display = "none";
        // Genera las esferas
      	var materialEsfera;
      	for( i=0; i<world.materials.length; i++){
      		if( world.materials[i].name === "sphereMaterial" ) materialEsfera = world.materials[i];
      	}
        if(esfera != undefined){
          scene.remove(esfera.visual);
          world.remove(esfera.body);
        }

      	esfera = new Esfera( 1/2, new CANNON.Vec3( -9, 0.5, 5 ), materialEsfera );
      	world.addBody( esfera.body );
      	scene.add( esfera.visual );


      }
  })
  keyboard.domElement.addEventListener('keyup', function (event) {
      if (keyboard.eventMatches(event, 'a')) {
        reposo1 = true;
      }
      if (keyboard.eventMatches(event, 'd')) {
        reposo2 = true;
      }
  })
}

/**
 * Isotropía frente a redimension del canvas
 */
function updateAspectRatio()
{
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	camera.aspect = container.offsetWidth/container.offsetHeight;
	camera.updateProjectionMatrix();
}

/**
 * Actualizacion segun pasa el tiempo
 */
function update()
{
	var segundos = reloj.getDelta();	// tiempo en segundos que ha pasado
  console.log(segundos);
	world.step( segundos/1 );				// recalcula el mundo tras ese tiempo
  helper.update();

  foco.position.z = effectController.posicionZFoco;

  if(esfera != undefined){
    var maxVelocity = 10;
    if(esfera.body.velocity.x > maxVelocity){
      esfera.body.velocity.x = maxVelocity;
    }
    if(esfera.body.velocity.y > maxVelocity){
      esfera.body.velocity.y = maxVelocity;
    }
    if(esfera.body.velocity.z > maxVelocity){
      esfera.body.velocity.z = maxVelocity;
    }
    esfera.visual.position.copy( esfera.body.position );
		esfera.visual.quaternion.copy( esfera.body.quaternion );
    cameraBola.position.copy(esfera.visual.position);
  }

  if(reposo1){
      anguloPaleta1 = Math.PI/3;
      //paleta1.body.angularVelocity.set(0,1,0);
      //paleta1.body.angularDamping = 0.1;
  }

  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  var angulo = Math.PI/2 - anguloInclinacion;
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), angulo);
  quatY.setFromAxisAngle(new CANNON.Vec3(0,1,0), anguloPaleta1);
  var quaternion = quatX.mult(quatY);
  paleta1.body.quaternion.copy(quaternion);
  paleta1.visual.quaternion.copy(quaternion);

  if(reposo2){
      anguloPaleta2 = -Math.PI/3;
      //paleta2.body.angularVelocity.set(0,-1,0);
      //paleta2.body.angularDamping = -0.1;
  }

  var quatX = new CANNON.Quaternion();
  var quatY = new CANNON.Quaternion();
  var angulo = Math.PI/2 - anguloInclinacion;
  quatX.setFromAxisAngle(new CANNON.Vec3(1,0,0), angulo);
  quatY.setFromAxisAngle(new CANNON.Vec3(0,1,0), anguloPaleta2);
  var quaternion = quatX.mult(quatY);

  paleta2.body.quaternion.copy(quaternion);
  paleta2.visual.quaternion.copy(quaternion);


	// Actualiza el monitor
	stats.update();

  //Devolver focus
  renderer.domElement.focus();

	// Actualiza el movimeinto del molinete
	TWEEN.update();
}

/**
 * Update & render
 */
function render()
{
	requestAnimationFrame( render );
	update();

  //Para cada render indicar el viewport
	if(container.offsetWidth < container.offsetHeight){
		renderer.setViewport(0, 0, container.offsetWidth/4, container.offsetWidth/4);
		renderer.render(scene, camaraMini);
	} else {
		renderer.setViewport(0, 0, container.offsetHeight/4, container.offsetHeight/4);
		renderer.render(scene, camaraMini);
	}

	renderer.setViewport(0, 0,
												container.offsetWidth, container.offsetHeight);
	renderer.render(scene, camaraPrincipal);
}
