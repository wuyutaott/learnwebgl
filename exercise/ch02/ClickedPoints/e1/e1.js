function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `void main() {
                    gl_Position = vec4(0, 0, 0, 1);
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

    gl.drawArrays(gl.POINTS, 0, 1);

    canvas.onmousedown = (ev) => {
        var rect = canvas.getBoundingClientRect();        
        var clickX = ev.clientX - rect.left;
        var clickY = ev.clientY - rect.top;
        console.log(clickX, clickY);
    };
}