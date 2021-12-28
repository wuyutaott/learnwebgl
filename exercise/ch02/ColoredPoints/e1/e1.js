function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');

    const VS = `attribute vec4 a_Position;
                void main() {
                    gl_Position = a_Position;
                    gl_PointSize = 10.0;
                }`;
    const FS = `precision mediump float;
                uniform vec4 u_FragColor;
                void main() {
                    gl_FragColor = u_FragColor;
                }`;

    var vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, VS);
    gl.compileShader(vshader);

    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, FS);
    gl.compileShader(fshader);

    var sp = gl.getShaderParameter(fshader, gl.COMPILE_STATUS);
    if (!sp) {
        var err = gl.getShaderInfoLog(fshader);
        console.log(err);
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);    

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');

    var points = [];
    canvas.onmousedown = (ev) => {
        var rect = canvas.getBoundingClientRect();
        var cx = ev.clientX - rect.left;
        var cy = ev.clientY - rect.top;
        var x = (cx - rect.width / 2) / (rect.width / 2);
        var y = (rect.height / 2 - cy) / (rect.height / 2);
        points.push([x, y]);

        gl.clear(gl.COLOR_BUFFER_BIT);

        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            if (p[0] < 0 && p[1] < 0) {
                gl.uniform4f(u_FragColor, 0, 1, 0, 1);
            }
            else if (p[0] >= 0 && p[1] >= 0) {
                gl.uniform4f(u_FragColor, 1, 0, 0, 1);
            }
            else if (p[0] < 0 && p[1] >= 0) {
                gl.uniform4f(u_FragColor, 0, 0, 1, 1);
            }
            else {
                gl.uniform4f(u_FragColor, 0.5, 0.5, 0.5, 1);
            }

            gl.vertexAttrib3f(a_Position, p[0], p[1], 0);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
}