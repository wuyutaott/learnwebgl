function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;                
                uniform mat4 u_LookMatrix;
                uniform mat4 u_ModelMatrix;
                attribute vec4 a_Color;
                varying vec4 v_Color;
                void main() {
                    gl_Position = u_LookMatrix * u_ModelMatrix * a_Position;
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
        0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
        -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
         0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 
       
         0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
        -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
         0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 
    
         0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
        -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
         0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
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

    var lookMatrix = new Matrix4();
    lookMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
    var u_LookMatrix = gl.getUniformLocation(program, 'u_LookMatrix');
    gl.uniformMatrix4fv(u_LookMatrix, false, lookMatrix.elements);

    var modelMatrix = new Matrix4();
    modelMatrix.setRotate(-10, 0, 0, 1);
    var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, 9);
}