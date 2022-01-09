function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                uniform mat4 u_Mat;
                void main() {
                    gl_Position = u_Mat * a_Position;
                }`;
    const FS = `void main() {
                    gl_FragColor = vec4(1, 0, 0, 1);
                }`;

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

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0.2, -0.2, -0.2, 0.2, -0.2]), gl.STATIC_DRAW);

    let data = new Matrix4();
    data.rotate(45, 0, 0, 1);
    data.translate(0.5, 0, 0);

    var mat4 = gl.getUniformLocation(program, 'u_Mat');
    gl.uniformMatrix4fv(mat4, false, data.elements);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}