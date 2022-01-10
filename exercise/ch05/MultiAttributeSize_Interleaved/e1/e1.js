function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                attribute float a_PointSize;
                void main() {
                    gl_Position = a_Position;
                    gl_PointSize = a_PointSize;
                }`
    const FS = `void main() {
                    gl_FragColor = vec4(1, 0, 0, 1);
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

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    var data = new Float32Array([
        0, 0.5, 2,
        -0.5, -0.5, 4,
        0.5, -0.5, 8
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var B = data.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 3 * B, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 3 * B, 2 * B);
    gl.enableVertexAttribArray(a_PointSize);

    gl.drawArrays(gl.POINTS, 0, 3);
}