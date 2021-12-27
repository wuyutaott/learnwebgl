function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');

    const VS = `attribute vec4 a_Position;
                attribute float a_PointSize;
                void main() {
                    gl_Position = a_Position;
                    gl_PointSize = a_PointSize;
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

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 修改点的位置
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0);

    // 修改点的大小
    var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 20);

    gl.drawArrays(gl.POINTS, 0, 1);
}