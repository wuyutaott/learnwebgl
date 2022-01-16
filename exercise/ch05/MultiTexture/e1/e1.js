function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
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
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4*B, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4*B, 2*B);
    gl.enableVertexAttribArray(a_TexCoord);

    var u_Sampler1 = gl.getUniformLocation(program, 'u_Sampler1');
    gl.uniform1i(u_Sampler1, 1);

    var u_Sampler2 = gl.getUniformLocation(program, 'u_Sampler2');
    gl.uniform1i(u_Sampler2, 2);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    var imgLoad = (img, texture) => {
        gl.activeTexture(texture);
        

        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    var img1 = new Image();
    img1.onload = () => {        
        imgLoad(img1, gl.TEXTURE1);
    }
    img1.src = 'sky.jpg';

    var img2 = new Image();
    img2.onload = () => {
        imgLoad(img2, gl.TEXTURE2);
    }
    img2.src = 'circle.gif';
}