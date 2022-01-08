var Helper = function(vs, fs) {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, vs);
    gl.compileShader(vshader);

    var p1 = gl.getShaderParameter(vshader, gl.COMPILE_STATUS);
    if (!p1) {
        var err = gl.getShaderInfoLog(vshader);
        console.log(err);
    }

    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fs);
    gl.compileShader(fshader);

    var p2 = gl.getShaderParameter(fshader, gl.COMPILE_STATUS);
    if (!p2) {
        var err = gl.getShaderInfoLog(fshader);
        console.log(err);
    }

    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    var p3 = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!p3) {
        var err = gl.getProgramInfoLog(program);
        console.log(err);
    }

    this.gl = gl;
    this.program = program;
}

Helper.prototype.createBuf = function(name, data) {
    gl = this.gl;
    program = this.program;

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    var a_name = gl.getAttribLocation(program, name);
    gl.vertexAttribPointer(a_name, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_name);    
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
}