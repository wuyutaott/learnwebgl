function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
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
    var p1 = gl.getShaderParameter(vshader, gl.COMPILE_STATUS);
    if (!p1) {
        var err = gl.getShaderInfoLog(vshader);
        console.log(err);
        return;
    }
    else {
        console.log('顶点shader编译通过');
    }

    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, FS);
    gl.compileShader(fshader);
    var p2 = gl.getShaderParameter(fshader, gl.COMPILE_STATUS);
    if (!p2) {
        var err = gl.getShaderInfoLog(fshader);
        console.log(err);
        return;
    }
    else {
        console.log('片元shader编译通过');
    }

    var program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);    
    gl.linkProgram(program); 
    gl.useProgram(program);
    
    let p3 = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!p3) {
        var err = gl.getProgramInfoLog(program);
        console.log(err);
    }
    else {
        console.log('Program Ready!');
    }
    
    gl.drawArrays(gl.POINTS, 0, 1);
}