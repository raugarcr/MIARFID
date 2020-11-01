/*
Seminario GPC #3. Camara.
Manejar diferentes camaras, marcos y picking
Autor: Raúl García Crespo
*/

//Variables de consenso
//Motor, escena y la camara
var renderer, scene, camera;

//Otras variables globales
var esferaCubo, angulo = 0;
var l = b = -4;
var r = t = -l;
var cameraControls;
var alzado, planta , perfil;
//Acciones
init();
loadScene();
render();

function setCameras(ar) {
	//Construye las camaras planta, alzado , perfil y perspectiva
	var origen = new THREE.Vector3(0,0,0);
	if (ar > 1) {
		var camaraOrtografica = new THREE.OrthographicCamera(l*ar,r*ar,t,b,-20,20);
	} else {
		var camaraOrtografica = new THREE.OrthographicCamera(l,r,t/ar,b/ar,-20,20);
	}

	//Camaras Ortograficas
	alzado = camaraOrtografica.clone();
	alzado.position.set(0,0,4);
	alzado.lookAt(origen);
	perfil = camaraOrtografica.clone();
	perfil.position.set(4,0,0);
	perfil.lookAt(origen);
	planta = camaraOrtografica.clone();
	planta.position.set(0,4,0);
	planta.lookAt(origen);
	planta.up = new THREE.Vector3(0,0,-1);

	//Camara perspectiva
	var camaraPerspectiva = new THREE.PerspectiveCamera(50, ar, 0.1, 50);
	camaraPerspectiva.position.set(1,2,10);
	camaraPerspectiva.lookAt(origen);

	camera = camaraPerspectiva.clone();

	scene.add(alzado);
	scene.add(planta);
	scene.add(perfil);
	scene.add(camera);
}

function init() {
	//Configurar el motor de render y el canvas
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color(0x0000AA));
	renderer.autoClear = false;

	document.getElementById("container").appendChild(renderer.domElement);

	//Escena
	scene = new THREE.Scene();

	//Camara
	var ar = window.innerWidth/window.innerHeight;
	/*
	camera = new THREE.PerspectiveCamera(50, ar, 0.1, 100);
	//camera = new THREE.OrthographicCamera(l,r,t,b,-20,20)
	scene.add(camera);
	camera.position.set(0.5, 3, 9);
	camera.lookAt(new THREE.Vector3(0,0,0));
	*/
	setCameras(ar);
	//Controlador de camara
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);
	cameraControls.noKeys= true;

	//CAptura de eventos
	window.addEventListener("resize", updateAspectRatio);
	renderer.domElement.addEventListener("dblclick", rotate);
}

function loadScene(){
	//construir el grafo de Escena

	//MAteriales
	var material = new THREE.MeshBasicMaterial({color:'yellow', wireframe:true});

	//Geometrias
	var geocubo = new THREE.BoxGeometry(2,2,2);
	var geosfera = new THREE.SphereGeometry(1,30, 30);


	//Objetos
	var cubo = new THREE.Mesh(geocubo, material);
	//Orden por defecto de las tranformaciones: 1º escalado, 2º rotacion  y 3º traslacion. Escrito TRS en notación
	cubo.rotation.y = Math.PI/4;
	cubo.position.x = -1;
	var esfera = new THREE.Mesh(geosfera, material);
	esfera.position.x = 1;

	//Objeto Contenedor
	esferaCubo = new THREE.Object3D();
	esferaCubo.position.y=0.5;
	esferaCubo.rotation.y=angulo;

	///Modelo Externo
	//Modelos en clara.io o sketchlab
	var loader = new THREE.ObjectLoader();
	loader.load('models/soldado/soldado.json',
		function(obj){
			obj.position.set(0,1,0);
			cubo.add(obj);
		}
	);

	//Organización de la Escena
	esferaCubo.add(cubo);
	esferaCubo.add(esfera);
	//scene.add(new THREE.AxisHelper(3));
	scene.add(esferaCubo);



}

function rotate(event) {
	//Gira el objecto senyalado 45 grados
	var x = event.clientX;
	var y = event.clientY;

	var derecha = false;
	var abajo = false;
	var cam = null;

	//Cudrante para la x,y?
	if(x>window.innerWidth/2){
		x -= window.innerWidth/2;
		derecha = true;
	}
	if (y>window.innerHeight/2) {
		y -= window.innerHeight/2;
		abajo = true;
	}

	if (derecha) {
		if (abajo) {cam = camera;}
		else {cam = perfil;}
	}else {
		if (abajo) {cam = planta;}
		else {cam = alzado;	}
	}

	//TRanformacion a cuadrado de 2 x 2
	x = (2*x/window.innerWidth) * 2 - 1;
	y = -(2*y/window.innerHeight) * 2 + 1;

	var rayo = new THREE.Raycaster();
	rayo.setFromCamera(new THREE.Vector2(x,y), cam);
	var interseccion = rayo.intersectObjects(scene.children, true);
	if(interseccion.length > 0){
		interseccion[0].object.rotation.y += Math.PI/4;
	}

}

function updateAspectRatio(){
	//Renueva la relación de aspecto de la camara

	//Ajustamos el tamaño del canvas
	renderer.setSize(window.innerWidth, window.innerHeight);

	//Razón de aspecto
	var ar = window.innerWidth/window.innerHeight;

	/*Camara Ortografica
	if(ar > 1){
		camera.left = -4*ar;
		camera.right = 4*ar;
		camera.botton= -4;
		camera.top = 4;
	} else {
		camera.top = 4/ar;
		camera.bottom = -4/ar;
		camera.left= -4;
		camera.right = 4;
	}
	*/
	//Camara PerspectiveCamera
	camera.aspect= ar;
	camera.updateProjectionMatrix();
}


function update(){
	//Variación de la escena entre frames

}

function render(){
	//Construir el frame y mostrarlo
	requestAnimationFrame(render);
	update();

	renderer.clear();
	//Para cada render indicar el viewport
	renderer.setViewport(window.innerWidth/2, 0,
												window.innerWidth/2, window.innerHeight/2);
	renderer.render(scene, perfil);
	renderer.setViewport(0, 0,
												window.innerWidth/2, window.innerHeight/2);
	renderer.render(scene, alzado);
	renderer.setViewport(0, window.innerHeight/2,
												window.innerWidth/2, window.innerHeight/2);
	renderer.render(scene, planta);
	renderer.setViewport(window.innerWidth/2, window.innerHeight/2,
												window.innerWidth/2, window.innerHeight/2);
	renderer.render(scene, camera);
}
