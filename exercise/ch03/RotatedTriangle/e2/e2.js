function main() {
    var canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);
    var gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var VS = "attribute vec4 a_Position;\n                uniform float u_SinB;\n                uniform float u_CosB;\n                void main() {\n                    gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n                    gl_Position.y = a_Position.y * u_CosB + a_Position.x * u_SinB;\n                    gl_Position.z = a_Position.z;\n                    gl_Position.w = 1.0;\n                }";
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
    var data = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    /*
    x1 = r * cos(a);
    y1 = r * sin(a);
    x2 = r * cos(a + b) => r * (cos(a)cos(b)-sin(a)sin(b)) => x1*cos(b)-y1*sin(b)
    y2 = r * sin(a + b) => r * (sin(a)cos(b)+cos(a)sin(b)) => y1*cos(b)+x1*sin(b)
    */
    var angle = 5;
    var radian = Math.PI * angle / 180;
    var sinb = Math.sin(radian);
    var cosb = Math.cos(radian);
    var u_SinB = gl.getUniformLocation(program, 'u_SinB');
    var u_CosB = gl.getUniformLocation(program, 'u_CosB');
    gl.uniform1f(u_SinB, sinb);
    gl.uniform1f(u_CosB, cosb);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
