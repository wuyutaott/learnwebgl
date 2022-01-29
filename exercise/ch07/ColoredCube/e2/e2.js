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

    if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
        var err = gl.getShaderInfoLog(vshader);
        console.log(err);
    }

    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, FS);
    gl.compileShader(fshader);

    if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
        var err = gl.getShaderInfoLog(fshader);
        console.log(err);
    }

    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const B = Float32Array.BYTES_PER_ELEMENT;

    /**   
     *  Cube
     *    v6----- v5
     *   /|      /|
     *  v1------v0|
     *  | |     | |
     *  | |v7---|-|v4
     *  |/      |/
     *  v2------v3
     */
    const data1 = new Float32Array([
         1,  1,  1,     // 0, font:0
        -1,  1,  1,     // 1, font:1
        -1, -1,  1,     // 2, font:2
         1, -1,  1,     // 3, font:3
         1,  1,  1,     // 4, top:0
         1,  1, -1,     // 5, top:5
        -1,  1, -1,     // 6, top:6
        -1,  1,  1,     // 7, top:1
         1,  1,  1,     // 8, right:0
         1, -1,  1,     // 9, right:3
         1, -1, -1,     // 10, right:4
         1,  1, -1,     // 11, right:5
        -1,  1,  1,     // 12, left:1
        -1,  1, -1,     // 13, left:6
        -1, -1, -1,     // 14, left:7
        -1, -1,  1,     // 15, left:2
        -1, -1,  1,     // 16, down:2
        -1, -1, -1,     // 17, down:7
         1, -1, -1,     // 18, down:4
         1, -1,  1,     // 19, down:3
        -1, -1, -1,     // 20, back:7
        -1,  1, -1,     // 21, back:6
         1,  1, -1,     // 22, back:5
         1, -1, -1,     // 23, back:4
    ]);
    var buf1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf1);
    gl.bufferData(gl.ARRAY_BUFFER, data1, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    const data2 = new Float32Array([
        1,  0,  0,     // font
        1,  0,  0,     // font
        1,  0,  0,     // font
        1,  0,  0,     // font
        0,  1,  0,     // top
        0,  1,  0,     // top
        0,  1,  0,     // top
        0,  1,  0,     // top
        0,  0,  1,     // right
        0,  0,  1,     // right
        0,  0,  1,     // right
        0,  0,  1,     // right
        1,  1,  0,     // left
        1,  1,  0,     // left
        1,  1,  0,     // left
        1,  1,  0,     // left
        1,  0,  1,     // down
        1,  0,  1,     // down
        1,  0,  1,     // down
        1,  0,  1,     // down
        0,  1,  1,     // back
        0,  1,  1,     // back
        0,  1,  1,     // back
        0,  1,  1,     // back
    ]);
    var buf2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf2);
    gl.bufferData(gl.ARRAY_BUFFER, data2, gl.STATIC_DRAW);
    var a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    const data3 = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23,
    ]);
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