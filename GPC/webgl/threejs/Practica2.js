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
var robot, angulo = 0;

//Acciones
init();
loadScene();
render();

function init() {
	//Configurar el motor de render y el canvas
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color(0xFFFFFF));
	document.getElementById("container").appendChild(renderer.domElement);

	//Escena
	scene = new THREE.Scene();

	//Camara
	var ar = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera(50, ar, 0.1, 10000);
	scene.add(camera);
	camera.position.set(300, 300, 150);
	camera.lookAt(new THREE.Vector3(0,100,0));
}

function loadScene(){
	//construir el grafo de Escena

	//MAteriales
	var material = new THREE.MeshBasicMaterial({color:'red', wireframe:true});
	var materialPlano = new THREE.MeshBasicMaterial({color:'black', wireframe:true});
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
	//Objetos
	var plano = new THREE.Mesh(geoplano, materialPlano)
	plano.rotateX(Math.PI / 2);

	var base = new THREE.Mesh(geoBase, material);
	base.position.y = 1;

	var eje = new THREE.Mesh(geoEje, material);
	eje.position.y = 60;

	var rotula = new THREE.Mesh(geoRotula, material);
	rotula.position.y = 120;

	var esparrago = new THREE.Mesh(geoEsparrago, material);
	esparrago.rotateZ(Math.PI / 2)

	var disco = new THREE.Mesh(geoDisco, material);
	disco.position.y = -40;

	var nervio1 = new THREE.Mesh(geoNervio, material);
	nervio1.position.x = 10;
	nervio1.position.z = 10;

	var nervio2 = new THREE.Mesh(geoNervio, material);
	nervio2.position.x = -10;
	nervio2.position.z = 10;

	var nervio3 = new THREE.Mesh(geoNervio, material);
	nervio3.position.x = 10;
	nervio3.position.z = -10;

	var nervio4 = new THREE.Mesh(geoNervio, material);
	nervio4.position.x = -10;
	nervio4.position.z = -10;

	var mano =  new THREE.Mesh(geoMano, material);
	mano.position.y = 40;
	mano.rotateX(Math.PI/2);
	mano.rotateZ(Math.PI/2);


	pinza1 = new THREE.Mesh(geoPinza, material);
	pinza1.position.y = 20;
	pinza1.position.x = 15;
	pinza1.position.z = -10;
	pinza1.rotateX(Math.PI/2);

	pinza2 = new THREE.Mesh(geoPinza, material);
	pinza2.position.y = -20;
	pinza2.position.x = 15;
	pinza2.position.z = 10;
	pinza2.rotateX(-Math.PI/2);

	robot = new THREE.Object3D();

	var brazo = new THREE.Object3D();

	var antebrazo = new THREE.Object3D();
	antebrazo.position.y = 160;

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

}

function update(){
	//Variación de la escena entre frames
	angulo += Math.PI/100;
	robot.rotation.y = angulo;
}

function render(){
	//Construir el frame y mostrarlo
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}
