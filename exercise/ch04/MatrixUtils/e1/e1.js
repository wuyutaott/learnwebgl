function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                uniform mat4 u_Mat;                
                void main() {
                    gl_Position = u_Mat * a_Position;
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0.2, -0.2, -0.2, 0.2, -0.2]), gl.STATIC_DRAW);

    let u_Mat = gl.getUniformLocation(program, 'u_Mat');

    // 移动
    let m1 = new Matrix4();
    m1.translate(0.5, 0, 0);
    print(m1.elements);
    
    // 旋转
    let m2 = new Matrix4();
    m2.rotate(45, 0, 0, 1);
    print(m2.elements);
    
    m2.concat(m1);
    print(m2.elements);    

    gl.uniformMatrix4fv(u_Mat, false, m2.elements);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function getIdentity() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]);
}

function translate(m, x, y, z) {
    // 1, 0, 0, 0,     a, b, c, d,
    // 0, 1, 0, 0,     e, f, g, h,
    // 0, 0, 1, 0,     i, j, k, l,
    // x, y, z, 1,     m, n, o, p,

    m[12] += m[0] * x + m[4] * y + m[8] * z;
    m[13] += m[1] * x + m[5] * y + m[9] * z;
    m[14] += m[2] * x + m[6] * y + m[10] * z;
    m[15] += m[3] * x + m[7] * y + m[11] * z;
}

function scale(m, x, y, z) {
    // x, 0, 0, 0,     a, b, c, d,
    // 0, y, 0, 0,     e, f, g, h,
    // 0, 0, z, 0,     i, j, k, l,
    // 0, 0, 0, 1,     m, n, o, p,

    m[0] *= x;  m[1] *= x;  m[2] *= x;  m[3] *= x;
    m[4] *= y;  m[5] *= y;  m[6] *= y;  m[7] *= y;
    m[8] *= z;  m[9] *= z;  m[10]*= z;  m[11]*= z;
}

function print(m) {
    console.log(`
    ${m[0]},    ${m[1]},    ${m[2]},    ${m[3]},
    ${m[4]},    ${m[5]},    ${m[6]},    ${m[7]},
    ${m[8]},    ${m[9]},    ${m[10]},    ${m[11]},
    ${m[12]},    ${m[13]},    ${m[14]},    ${m[15]},
    `);
}