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
                attribute vec4 a_Color;
                varying vec4 v_Color;
                void main() {
                    gl_Position = a_Position;
                    gl_PointSize = a_PointSize;
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

    var data = new Float32Array([
        0, 0.5, 2, 1, 0, 0,
        -0.5, -0.5, 4, 0, 1, 0,
        0.5, -0.5, 8, 0, 0, 1,
    ]);
    var B = data.BYTES_PER_ELEMENT;

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 6 * B, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 6 * B, 2 * B);
    gl.enableVertexAttribArray(a_PointSize);

    var a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * B, 3 * B);
    gl.enableVertexAttribArray(a_Color);

    gl.drawArrays(gl.POINTS, 0, 3);
}