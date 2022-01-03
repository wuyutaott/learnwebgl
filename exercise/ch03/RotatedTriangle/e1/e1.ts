function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                uniform float u_SinB;
                uniform float u_CosB;
                void main() {
                    gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
                    gl_Position.y = a_Position.y * u_CosB + a_Position.x * u_SinB;
                    gl_Position.z = 0;
                    gl_Position.w = 1;
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

    let buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    let a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    let data = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    /*
    x1 = r * cos(a);
    y1 = r * sin(a);
    x2 = r * cos(a + b); => r * (cos(a)*cos(b)-sin(a)*sin(b)) => x1*cos(b)-y1*sin(b)
    y2 = r * sin(a + b); => r * (sin(a)*cos(b)+cos(a)*sin(b)) => y1*cos(b)+x1*sin(b)
    */

    let radian = Math.PI * 90 / 180;
    let sinb = Math.sin(radian);
    let cosb = Math.cos(radian);
    let u_SinB = gl.getUniformLocation(program, 'u_SinB');
    gl.uniform1f(u_SinB, sinb);
    let u_CosB = gl.getUniformLocation(program, 'u_CosB');
    gl.uniform1f(u_CosB, cosb);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}