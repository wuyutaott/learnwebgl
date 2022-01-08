function main() {
    const VS = `attribute vec4 a_Position;
                uniform mat4 u_ObjMatrix;
                void main() {
                    gl_Position = u_ObjMatrix * a_Position;
                }`;
    const FS = `void main() {
                    gl_FragColor = vec4(1, 0, 0, 1);
                }`;
    var help = new Helper(VS, FS);
    var gl = help.gl;
    var program = help.program;

    help.createBuf('a_Position', new Float32Array([0, 0.2, -0.2, -0.2, 0.2, -0.2]));

    var mat4 = new Matrix4();
    mat4.setRotate(45, 0, 0, 1);
    mat4.translate(0.5, 0, 0);

    var u_ObjMatrix = gl.getUniformLocation(program, 'u_ObjMatrix');
    gl.uniformMatrix4fv(u_ObjMatrix, false, mat4.elements);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}