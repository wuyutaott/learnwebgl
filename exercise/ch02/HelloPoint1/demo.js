function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `void main() {
                    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
                    gl_PointSize = 10.0;
                }`;

    const FS = `void main() {
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                }`;
    
    var program = gl.createProgram();
    
    var vshader = gl.createShader(gl.VERTEX_SHADER);        
    gl.shaderSource(vshader, VS);        
    gl.compileShader(vshader);    
    gl.attachShader(program, vshader);    

    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, FS);
    gl.compileShader(fshader);
    gl.attachShader(program, fshader);
    
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.drawArrays(gl.POINTS, 0, 1);
}