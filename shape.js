class Scene {
    constructor() {
        this.shapeList = [];
    }

    push(shape) {
        this.shapeList.push(shape);
    }
    
    render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        for (var i=0; i<this.shapeList.length; i++) {
            this.shapeList[i].initBuffer();
            this.shapeList[i].draw(this.shapeList[i].primitiveType);
        }
    }
}

class Shape {
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
            case 'point':
                gl.drawElements(gl.POINTS, this.indices.length, gl.UNSIGNED_SHORT, 0);
            case 'rectangle':
                gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
                //gl.drawArrays(gl.TRIANGLES, this.vertices[0], this.vertices.length);
            case 'triangle':
                gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
                //gl.drawArrays(gl.TRIANGLES, this.vertices[0], this.vertices.length);
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

class Point extends Shape {
    constructor(id, gl, program) {
        super(gl, program);

        this.id = id;
        this.vertices = [0, 0, 0];
        this.indices = [0];
        this.primitiveType = 'point';
    } 
}

class Rectangle extends Shape {
    constructor(id, gl, program, x, y) {
        super(gl, program);

        this.id = id;
        /*this.vertices = [
            -0.5,  0.5, 0,
            -0.5, -0.5, 0,
             0.5, -0.5, 0,
             0.5,  0.5, 0
        ];*/
        this.vertices = [
            x, y,
            -0.5, -0.5,
             0.5, -0.5,
             0.5,  0.5
        ];
        this.indices = [0, 1, 2, 0, 2, 3];
        this.primitiveType = 'rectangle';
    }
}

class Triangle extends Shape {
    constructor(id, gl, program) {
        super(gl, program);

        this.id = id;
        /*this.vertices = [
            -0.25,  0.25, 0,
            -0.25, -0.25, 0,
             0.25, -0.25, 0
        ];*/
        this.vertices = [
                0, 0.5, 0,
              0.5, 0,   0,
             -0.5, 0,   0
        ];
        this.indices = [0, 1, 2];
        this.primitiveType = 'triangle';
    }
}