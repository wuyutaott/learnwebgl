function main() {
    const FS = `attribute vec4 a_Position;
                uniform mat4 u_Translation;
                void main() {
                    gl_Position = u_Translation * a_Position;
                }`;
    const VS = `void main() {
                    gl_FragColor = vec4(1, 0, 0, 1);
                }`;
    var help = new Helper(FS, VS);
    help.createBuf('a_Position', new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]));
    var gl = help.gl;
    var program = help.program;

    var mat4 = new Matrix4();
    mat4.setRotate(5, 0, 0, 1);
    var u_Translation = gl.getUniformLocation(program, 'u_Translation');
    gl.uniformMatrix4fv(u_Translation, false, mat4.elements);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}