function main() {
    var canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);
    var gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var VS = "attribute vec4 a_Position;\n                void main() {\n                    gl_Position = a_Position;\n                    gl_PointSize = 5.0;\n                }";
    var FS = "void main() {\n                    gl_FragColor = vec4(1, 0, 0, 1);\n                }";
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
    var points = [];
    canvas.onmousedown = function (ev) {
        var rect = canvas.getBoundingClientRect();
        var x = ((ev.clientX - rect.x) - rect.width / 2) / (rect.width / 2);
        var y = (rect.height / 2 - (ev.clientY - rect.y)) / (rect.height / 2);
        points.push(x);
        points.push(y);
        draw(points, gl);
    };
}
function draw(points, gl) {
    var buf = new Float32Array(points);
    gl.bufferData(gl.ARRAY_BUFFER, buf, gl.STATIC_DRAW);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
}
