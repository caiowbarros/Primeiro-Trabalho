class Scene {
    constructor(gl, program) {
        this.VAO;
        this.VBO;
        this.IBO;
        this.program = program;
        this.gl = gl;
    }

    initBuffer() {
        var gl = this.gl;
        // VAO
        this.VAO = gl.createVertexArray();
        gl.bindVertexArray(this.VAO);

        // VBO
        this.VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.program.aVertexPosition);
        gl.vertexAttribPointer(this.program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        
        // IBO
        this.IBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        // Clean
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    draw(type) {
        var gl = this.gl;
        gl.bindVertexArray(this.VAO);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        switch (type) {
            case "rectangle":
                gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
            case "point":
                gl.drawElements(gl.POINTS, this.indices.length, gl.UNSIGNED_SHORT, 0);
            case "triangle":
                gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
            default:
                break;
        }  

        gl.bindVertexArray(null);
    }

    clear() {
        var gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

}

class Point extends Scene {
    constructor(gl, program) {
        super(gl, program);

        this.vertices = [0, 0, 0];
        this.indices = [0];
    } 
}

class Rectangle extends Scene {
    constructor(gl, program, x, y) {
        super(gl, program);

        this.vertices = [
            x-0.5, y+0.5, 0,
            x-0.5, y-0.5, 0,
            x+0.5, y-0.5, 0,
            x+0.5, y+0.5, 0
        ];
        this.indices = [0, 1, 2, 0, 2, 3];
    }
}

class Triangle extends Scene {
    constructor(gl, program) {
        super(gl, program);

        this.vertices = [
            -0.5,  0.5, 0,
            -0.5, -0.5, 0,
             0.5, -0.5, 0
        ];
        this.indices = [0, 1, 2];
    }
}