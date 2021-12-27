function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                void main() {
                    gl_Position = a_Position;
                    gl_PointSize = 5.0;
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

    var a_Position = gl.getAttribLocation(program, 'a_Position');

    var points = [];
    canvas.onmousedown = (ev) => {
        var rect = canvas.getBoundingClientRect();        
        var clickX = ev.clientX - rect.left;
        var clickY = ev.clientY - rect.top;
        var xx = (clickX - rect.width / 2) / (rect.width / 2);
        var yy = (rect.height / 2 - clickY) / (rect.height / 2);   
        points.push(xx);
        points.push(yy);     
        console.log(points);

        gl.clear(gl.COLOR_BUFFER_BIT);
        for (var i = 0; i < points.length; i += 2) {
            var x = points[i];
            var y = points[i+1];
            gl.vertexAttrib3f(a_Position, x, y, 0);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    };
}