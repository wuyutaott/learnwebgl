function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.getElementsByTagName('body')[0].appendChild(canvas);   

    const gl = canvas.getContext('webgl');
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                attribute vec4 a_Color;
                varying vec4 v_Color;
                uniform mat4 u_MvpMatrix;
                void main() {
                    gl_Position = u_MvpMatrix * a_Position;
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

    /**
     *  cube
     *    v6----- v5
     *   /|      /| 
     *  v1------v0|
     *  | |     | |
     *  | |v7---|-|v4
     *  |/      |/
     *  v2------v3
     */
    const data1 = new Float32Array([
         1,  1,  1,     1,  1,  1,  // v1
        -1,  1,  1,     1,  0,  0,  // v2
        -1, -1,  1,     0,  1,  0,  // v3
         1, -1,  1,     0,  0,  1,  // v4
         1, -1, -1,     1,  1,  0,  // v5
         1,  1, -1,     1,  0,  1,  // v6
        -1,  1, -1,     0,  1,  1,  // v7
        -1, -1, -1,     1,  1,  1,  // v8
    ])
    var buf1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf1);
    gl.bufferData(gl.ARRAY_BUFFER, data1, gl.STATIC_DRAW);
    
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6*B, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6*B, 3*B);
    gl.enableVertexAttribArray(a_Color);

    const data2 = new Uint8Array([        
        0, 1, 2, 0, 2, 3,   // front        
        0, 5, 6, 0, 6, 1,   // top        
        0, 3, 4, 0, 4, 5,   // right
        1, 6, 7, 1, 7, 2,   // left
        2, 7, 4, 2, 4, 3,   // down
        7, 6, 5, 7, 5, 4,   // back  
    ])
    var buf2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data2, gl.STATIC_DRAW);

    var mvpMatrix = new Matrix4;
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.drawElements(gl.TRIANGLES, data2.length, gl.UNSIGNED_BYTE, 0);
}