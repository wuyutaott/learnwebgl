function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

    /**   v6----- v5
     *   /|      /|
     *  v1------v0|
     *  | |     | |
     *  | |v7---|-|v4
     *  |/      |/
     *  v2------v3
     */
    var data1 = new Float32Array([
        //  1,  1,  1,  // v0
        // -1,  1,  1,  // v1
        // -1, -1,  1,  // v2
        //  1, -1,  1,  // v3
        //  1, -1, -1,  // v4
        //  1,  1, -1,  // v5
        // -1,  1, -1,  // v6
        // -1, -1, -1,  // v7

        // front
         1,  1,  1,  // v0-0
        -1,  1,  1,  // v1-1
        -1, -1,  1,  // v2-2
         1, -1,  1,  // v3-3
        // top
         1,  1,  1,  // v0-4
         1,  1, -1,  // v5-5
        -1,  1, -1,  // v6-6
        -1,  1,  1,  // v1-7
        // tight
         1,  1,  1,  // v0-8
         1, -1,  1,  // v3-9
         1, -1, -1,  // v4-10
         1,  1, -1,  // v5-11
        // left
        -1,  1,  1,  // v1-12
        -1,  1, -1,  // v6-13
        -1, -1, -1,  // v7-14
        -1, -1,  1,  // v2-15
        // down
        -1, -1,  1,  // v2-16
        -1, -1, -1,  // v7-17
         1, -1, -1,  // v4-18
         1, -1,  1,  // v3-19
        // back
         1, -1, -1,  // v4-20
        -1, -1, -1,  // v7-21
        -1,  1, -1,  // v6-22
         1,  1, -1,  // v5-23
    ])
    var data2 = new Float32Array([
        // front
         1,  0,  0,
         1,  0,  0,
         1,  0,  0,
         1,  0,  0,
        // top
         0,  1,  0,
         0,  1,  0,
         0,  1,  0,
         0,  1,  0,
        // right
         0,  0,  1,
         0,  0,  1,
         0,  0,  1,
         0,  0,  1,
        // left
         1,  1,  0,
         1,  1,  0,
         1,  1,  0,
         1,  1,  0,
        // down
         1,  0,  1,
         1,  0,  1,
         1,  0,  1,
         1,  0,  1,
        // back
         0,  1,  1,
         0,  1,  1,
         0,  1,  1,
         0,  1,  1,
    ])
    var data3 = new Uint8Array([
        0,  1,  2,  0,  2,  3,
        4,  5,  6,  4,  6,  7,
        8,  9, 10,  8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23,
    ])

    const B = Float32Array.BYTES_PER_ELEMENT;

    var buf1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf1);
    gl.bufferData(gl.ARRAY_BUFFER, data1, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    var buf2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf2);
    gl.bufferData(gl.ARRAY_BUFFER, data2, gl.STATIC_DRAW);
    var a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    var buf3 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf3);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data3, gl.STATIC_DRAW);
    
    var mvpMatrix = new Matrix4;
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 10, 0, 0, 0, 0, 1, 0);
    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.drawElements(gl.TRIANGLES, data3.length, gl.UNSIGNED_BYTE, 0);
}