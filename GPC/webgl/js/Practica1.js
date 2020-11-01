/*
Seminario #1 Pintar puntos en pantalla que el usuario va clickando
*/
var bufferColores;
var bufferVertices;
//	SHADER VERTICES
var VSHADER_SOURCE =
'attribute vec4 posicion;		\n' +
'attribute vec3 vertexColor;		\n' +
'varying highp vec4 vColor;		\n' +
'void main(){					  		\n' +
'	gl_Position = posicion;		\n' +
'	gl_PointSize = 10.0;			\n' +
'	vColor = vec4(vertexColor, 1.0);		\n' +
'}													\n';

//	SHADER FRAGMENTOS
var FSHADER_SOURCE =
'varying highp vec4 vColor;		\n' +
'void main(){					  		\n' +
'	gl_FragColor = vColor;		\n' +
'}													\n';

function main(){
	//Recuperar el canvas
	var canvas = document.getElementById("canvas");
	if(!canvas){
		console.log("Fallo la carga del canvas");
		return;
	}

	//recuperar el contexto de render (caja de pinturas)
	var gl = getWebGLContext(canvas);
	if (!gl) {
	 console.log("Fallo la carga del contexto de render");
	 return;
	}

	//Cargar, Compilar y Montar los Shaders en un 'program'
	if (!initShaders(gl, VSHADER_SOURCE,FSHADER_SOURCE)) {
		console.log("Fallo la carga de los shaders");
		return;
	}

	//Fijar el color de borrado del canvas
	gl.clearColor(0.0,0.0,0.3,1.0);

	//Se borra el canvas
	gl.clear(gl.COLOR_BUFFER_BIT);

	//Localiza el atributo en el shader de vertices
	var coordenadas = gl.getAttribLocation(gl.program, 'posicion');

	//Crear El buffer para coordenadas, lo activa y lo enlaza a las coordenadas
	bufferVertices = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
	gl.enableVertexAttribArray(coordenadas);
	gl.vertexAttribPointer(coordenadas, 3, gl.FLOAT, false, 0, 0);



	//Localiza el atributo en el shader de vertices
	var color = gl.getAttribLocation(gl.program, 'vertexColor');

	//Crear El buffer para coordenadas, lo activa y lo enlaza a las coordenadas
	bufferColores = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferColores);
	gl.enableVertexAttribArray(color);
	gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);


	//Registro el evento
	canvas.onmousedown = function(evento){
		click(evento,gl,canvas);
	};
}

var clicks = []; //array de puntos
var coloresPunto = [];
var aux = true;
function click(evento, gl, canvas, coordenadas)
{
	//Procesar la coordenada del click
	var x = evento.clientX;
	var y = evento.clientY;
	var rect = evento.target.getBoundingClientRect();

	//Conversion de coordenadas
	x = ((x - rect.left) - canvas.width/2) * 2/canvas.width;
	y = (canvas.height/2 - (y - rect.top)) * 2/canvas.height;

	//Guardar el puntos
	clicks.push(x); clicks.push(y); clicks.push(0.0);
	var puntos = new Float32Array(clicks);

	//Borrar el canvas
	gl.clear(gl.COLOR_BUFFER_BIT);

	/*
	//Inserta las coordenadas de los puntos como atributos y los dibuja uno a uno
	for (var i = 0; i < puntos.length; i+= 2) {
		gl.vertexAttrib3f(coordenadas,puntos[i], puntos[i+1], 0.0);
		gl.drawArrays(gl.POINTS, 0, 1);
	}
	*/
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
	gl.bufferData(gl.ARRAY_BUFFER, puntos, gl.STATIC_DRAW);

	var colorX = Math.sqrt(x * x + y * y)


	coloresPunto.push(1 - colorX); coloresPunto.push(0.0); coloresPunto.push(0.0);
	var arraycolores = new Float32Array(coloresPunto);
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferColores);
	gl.bufferData(gl.ARRAY_BUFFER, arraycolores, gl.STATIC_DRAW);

	gl.drawArrays(gl.POINTS, 0, puntos.length/3);
	gl.drawArrays(gl.LINE_STRIP, 0, puntos.length/3);




}
