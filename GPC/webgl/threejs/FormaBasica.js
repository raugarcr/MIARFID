/*
Seminario GPC #2. Forma basica.
Dibujar formas basicas y un modelo importado
Muestra el bucle tipico de inicializacion, escena y renderer
Autor: Raúl García Crespo
*/

//Variables de consenso
//Motor, escena y la camara
var renderer, scene, camera;

//Otras variables globales
var esferaCubo, angulo = 0;

//Acciones
init();
loadScene();
render();

function init() {
	//Configurar el motor de render y el canvas
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color(0x0000AA));
	document.getElementById("container").appendChild(renderer.domElement);

	//Escena
	scene = new THREE.Scene();

	//Camara
	var ar = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera(50, ar, 0.1, 100);
	scene.add(camera);
	camera.position.set(0.5, 3, 9);
	camera.lookAt(new THREE.Vector3(0,2,0));
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
	scene.add(new THREE.AxisHelper(3));
	scene.add(esferaCubo);



}

function update(){
	//Variación de la escena entre frames
	angulo += Math.PI/100;
	esferaCubo.rotation.y = angulo;
}

function render(){
	//Construir el frame y mostrarlo
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}
