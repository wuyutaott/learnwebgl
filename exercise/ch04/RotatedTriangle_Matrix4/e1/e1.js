function main() {
    var helper = new Helper();
    helper.init();
    const VS = `attribute vec4 a_Position;
                uniform mat4 u_Translation;
                void main() {
                    gl_Position = u_Translation * a_Position;
                }`;
    const FS = `void main() {
                    gl_FragColor = vec4(1, 0, 0, 1);
                }`;
    helper.createShader(VS, FS);

    var gl = helper.gl;
    var program = helper.program;

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    var data = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var mat4 = new Matrix4();
    mat4.setRotate(5, 0, 0, 1);

    var u_Translation = gl.getUniformLocation(program, 'u_Translation');
    gl.uniformMatrix4fv(u_Translation, false, mat4.elements);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}