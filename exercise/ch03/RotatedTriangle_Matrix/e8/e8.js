function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                uniform mat4 u_Mat1;
                uniform mat4 u_Mat2;
                void main() {
                    gl_Position = u_Mat2 * u_Mat1 * a_Position;
                }`;
    const FS = `void main() {
                    gl_FragColor = vec4(1, 0, 0, 1);
                }`;
    let vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, VS);
    gl.compileShader(vshader);
    let fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, FS);
    gl.compileShader(fshader);
    let program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    let buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    let a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0.2, -0.2, -0.2, 0.2, -0.2]), gl.STATIC_DRAW);

    var b = 45 * Math.PI / 180;
    var S = Math.sin(b);
    var C = Math.cos(b);

    let u_Mat1 = gl.getUniformLocation(program, 'u_Mat1');
    let data1 = new Float32Array([
        C, S, 0, 0,
       -S, C, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,

        // 1, 0, 0, 0,
        // 0, 1, 0, 0,
        // 0, 0, 1, 0,
        // 0.5, 0, 0, 1,
    ]);
    gl.uniformMatrix4fv(u_Mat1, false, data1);

    let u_Mat2 = gl.getUniformLocation(program, 'u_Mat2');
    let data2 = new Float32Array([
    //     C, S, 0, 0,
    //    -S, C, 0, 0,
    //     0, 0, 1, 0,
    //     0, 0, 0, 1,

        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0.5, 0, 0, 1,
    ]);
    gl.uniformMatrix4fv(u_Mat2, false, data2);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}