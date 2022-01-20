function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                attribute vec4 a_Color;
                varying vec4 v_Color;
                uniform mat4 u_ModelViewMatrix;
                uniform mat4 u_ProjMatrix;
                void main() {
                    gl_Position = u_ProjMatrix * u_ModelViewMatrix * a_Position;
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

    var u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    var projMatrix = new Matrix4();
    projMatrix.setOrtho(-0.3, 0.3, -1.0, 1.0, 0.0, 0.5);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    var eyeX = 0, eyeY = 0, eyeZ = 0.2;
    var mat = new Matrix4;
    mat.setLookAt(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0);
    var u_ModelViewMatrix = gl.getUniformLocation(program, 'u_ModelViewMatrix');
    gl.uniformMatrix4fv(u_ModelViewMatrix, false, mat.elements);

    draw(gl);

    document.onkeydown = (ev) => {        
        switch (ev.code) {
            case 'ArrowLeft':
                eyeX -= 0.01;
                break;
            case 'ArrowRight':
                eyeX += 0.01;
                break;
        }

        mat.setLookAt(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0);        
        gl.uniformMatrix4fv(u_ModelViewMatrix, false, mat.elements);
        draw(gl);
    }
}

function draw(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
}