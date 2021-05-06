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

    clear() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        this.shapeList = [];
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
    constructor(id, gl, program, x, y) {
        super(gl, program);

        this.id = id;
        this.x = x;
        this.y = y;
        this.vertices = [];
        this.indices = [0];
        this.primitiveType = 'point';
    }

    transformToClipSpace() {
        this.x = this.x / 1200 * 2 - 1;
        this.y = this.y / 600 * -2 + 1;
    }

    setVertices() {
        this.transformToClipSpace();
        this.vertices = [x, y, 0];
    }
}

class Rectangle extends Shape {
    constructor(id, gl, program, x1, y1, x2, y2) {
        super(gl, program);

        this.id = id;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.vertices = [];
        this.indices = [0, 1, 2, 0, 2, 3];
        this.primitiveType = 'rectangle';
    }

    transformToClipSpace() {
        this.x1 = this.x1 / 1200 * 2 - 1;
        this.y1 = this.y1 / 600 * -2 + 1;
        this.x2 = this.x2 / 1200 * 2 - 1;
        this.y2 = this.y2 / 600 * -2 + 1;
    }

    setVertices() {
        this.transformToClipSpace();
        this.vertices = [
            this.x1, this.y1, 0,
            this.x1, this.y2, 0,
            this.x2, this.y2, 0,
            this.x2, this.y1, 0
        ];
    }
}

class Triangle extends Shape {
    constructor(id, gl, program, x1, y1, x2, y2, x3, y3) {
        super(gl, program);

        this.id = id;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.vertices = [];
        this.indices = [0, 1, 2];
        this.primitiveType = 'triangle';
    }

    transformToClipSpace() {
        this.x1 = this.x1 / 1200 * 2 - 1;
        this.y1 = this.y1 / 600 * -2 + 1;
        this.x2 = this.x2 / 1200 * 2 - 1;
        this.y2 = this.y2 / 600 * -2 + 1;
        this.x3 = this.x3 / 1200 * 2 - 1;
        this.y3 = this.y3 / 600 * -2 + 1;
    }

    setVertices() {
        this.transformToClipSpace();
        this.vertices = [
            this.x1, this.y1, 0,
            this.x2, this.y2, 0,
            this.x3, this.y3, 0
        ];
    }
}

class Polygon extends Shape {
    constructor(id, gl, program, x, y) {
        super(gl, program);

        this.vertices = [];
        this.addVertex(x, y);
        this.indices = [];
        this.primitiveType = 'triangle';
    }

    addVertex(x, y) {
        this.vertices.push(x / 1200 * 2 - 1);
        this.vertices.push(y / 600 * - 2 + 1);
        this.vertices.push(0);
    }

    setIndices() {
        var contador = 0;
        for (var i=0; i < this.vertices.length/3; i++) {
            this.indices.push(i);
            contador++;
            if (contador == 3) {
                i--;
                contador = 0;
            }
        }
    }
}