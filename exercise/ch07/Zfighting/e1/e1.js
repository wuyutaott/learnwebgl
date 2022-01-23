function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                attribute vec4 a_Color;
                varying vec4 v_Color;
                uniform mat4 u_ProjMatrix;
                uniform mat4 u_LookMatrix;
                uniform mat4 u_ModelMatrix;
                void main() {
                    gl_Position = u_ProjMatrix * u_LookMatrix * u_ModelMatrix * a_Position;
                    v_Color = a_Color;
                }`
    const FS = `precision mediump float;
                varying vec4 v_Color;
                void main() {
                    gl_FragColor = v_Color;
                }`
    var vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, VS);
    gl.compileShader(vshader);
    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, FS);
    gl.compileShader(fshader);
    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const B = Float32Array.BYTES_PER_ELEMENT;
    const data = new Float32Array([
        // Vertex coordinates and color
     0.0,  2.5,  -5.0,  0.4,  1.0,  0.4, // The green triangle
     -2.5, -2.5,  -5.0,  0.4,  1.0,  0.4,
      2.5, -2.5,  -5.0,  1.0,  0.4,  0.4, 
 
      0.0,  3.0,  -5.0,  1.0,  0.4,  0.4, // The yellow triagle
     -3.0, -3.0,  -5.0,  1.0,  1.0,  0.4,
      3.0, -3.0,  -5.0,  1.0,  1.0,  0.4, 
    ])
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6*B, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6*B, 3*B);
    gl.enableVertexAttribArray(a_Color);

    var u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    var u_LookMatrix = gl.getUniformLocation(program, 'u_LookMatrix');
    var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');

    var projMatrix = new Matrix4();
    projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);

    var lookMatrix = new Matrix4();
    lookMatrix.setLookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0);

    var modelMatrix = new Matrix4();
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_LookMatrix, false, lookMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.polygonOffset(1, 1);
    gl.drawArrays(gl.TRIANGLES, 3, 3);
}