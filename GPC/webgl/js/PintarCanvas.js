/*
 SEMINARIO #1 GPC
 */

 function main(){
	 //recuperar canvas (el lienzo)
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
	 //Fijar el color de borrado del canvas
	 gl.clearColor(0.0,0.0,0.3,1.0);

	 //Se borra el canvas
	 gl.clear(gl.COLOR_BUFFER_BIT);

 }
