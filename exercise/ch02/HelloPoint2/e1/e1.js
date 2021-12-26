function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 aPosition;
                void main() {
                    gl_Position = aPosition;
                    gl_PointSize = 10.0;
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

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.vertexAttrib3f(aPosition, 0.5, 0.5, 0);
    gl.drawArrays(gl.POINTS, 0, 1);

    gl.vertexAttrib3f(aPosition, 0, 0, 0);
    gl.drawArrays(gl.POINTS, 0, 1);

    gl.vertexAttrib3f(aPosition, -0.5, -0.5, 0);
    gl.drawArrays(gl.POINTS, 0, 1);
}