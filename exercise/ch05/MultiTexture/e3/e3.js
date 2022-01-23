function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const VS = `attribute vec4 a_Position;
                attribute vec2 a_TexCoord;
                varying vec2 v_TexCoord;
                void main() {
                    gl_Position = a_Position;
                    v_TexCoord = a_TexCoord;
                }`
    const FS = `precision mediump float;
                varying vec2 v_TexCoord;
                uniform sampler2D u_Sampler1;
                uniform sampler2D u_Sampler2;
                void main() {
                    vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
                    vec4 color2 = texture2D(u_Sampler2, v_TexCoord);
                    gl_FragColor = color1 * color2;
                }`
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

    const B = Float32Array.BYTES_PER_ELEMENT;
    const data = new Float32Array([
        -0.5, 0.5, 0, 1,
        -0.5, -0.5, 0, 0,
        0.5, 0.5, 1, 1,
        0.5, -0.5, 1, 0,
    ])
    let buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4*B, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4*B, 2*B);
    gl.enableVertexAttribArray(a_TexCoord);

    let u_Sampler1 = gl.getUniformLocation(program, 'u_Sampler1');
    gl.uniform1i(u_Sampler1, 1);

    let u_Sampler2 = gl.getUniformLocation(program, 'u_Sampler2');
    gl.uniform1i(u_Sampler2, 2);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    let img1 = new Image;
    let img2 = new Image;
    let count = 0;
    img1.onload = () => {
        count++;
        this.onImgLoad(gl, count, gl.TEXTURE1, img1);
    }
    img2.onload = () => {
        count++;
        this.onImgLoad(gl, count, gl.TEXTURE2, img2);
    }
    img1.src = 'sky.jpg';
    img2.src = 'circle.gif'
}

function onImgLoad(gl, count, tex_unit_id, img) {
    count++;
    gl.activeTexture(tex_unit_id);
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    if (count >= 2) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}