function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                void main() {
                    gl_Position = a_Position;
                }`
    const FS = `precision mediump float;
                uniform float u_Width;
                uniform float u_Height;
                void main() {
                    gl_FragColor = vec4(gl_FragCoord.x / u_Width, 0, gl_FragCoord.y / u_Height, 1);
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

    var data = new Float32Array([
        0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    var u_Width = gl.getUniformLocation(program, 'u_Width');
    gl.uniform1f(u_Width, gl.drawingBufferWidth);
    var u_Height = gl.getUniformLocation(program, 'u_Height');
    gl.uniform1f(u_Height, gl.drawingBufferHeight);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}