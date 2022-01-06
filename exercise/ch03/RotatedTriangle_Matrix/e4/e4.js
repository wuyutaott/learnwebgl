function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                uniform mat4 u_Translation;
                void main() {
                    gl_Position = u_Translation * a_Position;
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

    let data = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    let angle = 5;
    let b = angle * Math.PI / 180;
    let S = Math.sin(b);
    let C = Math.cos(b);
    let u_Translation = gl.getUniformLocation(program, 'u_Translation');
    gl.uniformMatrix4fv(u_Translation, false, new Float32Array([
        C, S, 0, 0,
       -S, C, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]));

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}