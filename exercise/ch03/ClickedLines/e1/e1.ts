function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
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

    let vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, VS);
    gl.compileShader(vshader);

    let fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, FS);
    gl.compileShader(fshader);

    let program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    let points = [];
    canvas.onmousedown = (ev: MouseEvent) => {
        let rect = canvas.getBoundingClientRect();        
        let cx = ev.clientX - rect.x;
        let cy = ev.clientY - rect.y;
        let x = (cx - rect.width / 2) / (rect.width / 2);
        let y = (rect.height / 2 - cy) / (rect.height / 2);
        points.push(x);
        points.push(y);
        draw(points, gl, program);        
    };  
}

function draw(points: number[], gl: WebGLRenderingContext, program: WebGLProgram) {    
    gl.clear(gl.COLOR_BUFFER_BIT);

    let data = new Float32Array(points);
    let buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    let a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);    
}