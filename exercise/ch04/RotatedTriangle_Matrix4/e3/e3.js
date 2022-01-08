function main() {
    const VS = `attribute vec4 a_Position;                
                uniform mat4 u_Mat;
                void main() {
                    gl_Position = u_Mat * a_Position;
                }`;
    const FS = `void main() {
                    gl_FragColor = vec4(1, 0, 0, 1);
                }`;
    var help = new Helper(VS, FS);
    var gl = help.gl;
    var program = help.program;
    help.createBuf('a_Position', new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]));
    var mat4 = new Matrix4();
    mat4.setRotate(5, 0, 0, 1);
    var u_Mat = gl.getUniformLocation(program, 'u_Mat');
    gl.uniformMatrix4fv(u_Mat, false, mat4.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}