function removeAllListeners(canvas, interaction) {
    canvas.removeEventListener('click', interaction.eventListeners.click);
    canvas.removeEventListener('mousemove', interaction.eventListeners.move);
    canvas.removeEventListener('dblclick', interaction.eventListeners.dblclick);
    canvas.removeEventListener('mouseup', interaction.eventListeners.mouseup);
    canvas.removeEventListener('mousedown', interaction.eventListeners.mousedown);
  }

  function addAllListeners(canvas, interaction) {
    canvas.addEventListener('click', interaction.eventListeners.click, false);
    canvas.addEventListener('mousemove', interaction.eventListeners.move, false);
    canvas.addEventListener('dblclick', interaction.eventListeners.dblclick, false);
    canvas.addEventListener('mouseup', interaction.eventListeners.mouseup, false);
    canvas.addEventListener('mousedown', interaction.eventListeners.mousedown, false);
  }

  function create_listeners() {
    
    this.mouseUp = function mouseUp(event) {
      this.down = false;
    }

    this.mouseDown = function mouseDown(event) {
      this.down = true;
    }

    this.mouseMove = function mouseMove(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;
      var color = [255, 255, 255];
      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;
      /*var i;
      for (i = 0; i < shapeList.size; i++) {
        if (shapeList.list[i].isInside(x, y)) {
          color = [shapeList.list[i].color.r, shapeList.list[i].color.g, shapeList.list[i].color.b];
          break;
        }
      }*/
      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;
      info.position = 'Position: (' + x.toString() + ',' + y.toString() + ')';
      info.color = color;
    }

    this.translationMouseUp = function translationMouseUp(event) {
      this.down = false;
      shapeList.selectedShape = undefined;
    }

    this.translationMouseDown = function translationMouseDown(event) {
      this.down = true;
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;
      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;
      this.prev_x = x;
      this.prev_y = y;
      shapeList.selectedShape = selectedShape(x, y);
    }

    this.translationMouseMove = function translationMouseMove(event) {
      if (shapeList.selectedShape === undefined) {
        return;
      }
      if (this.down) {
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;
        var color = 'white';
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop;
        var d_x = x - this.prev_x;
        var d_y = y - this.prev_y;
        this.prev_x = x;
        this.prev_y = y;
        shapeList.selectedShape.translate(d_x, d_y);

        render(canvas, shapeList);
      }
    }

    this.pickMouseClick = function pickMouseClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;
      var currentSelected = shapeList.selectedShape;
      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;
      this.prev_x = x;
      this.prev_y = y;
      shapeList.selectedShape = selectShape(x, y);
      render(canvas, shapeList);
    }

    this.pointCreationMouseClick = function pointCreationMouseClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;
      
      // var color = getColor(properties.foregroundColor);
      // var borderColor = getColor(properties.borderColor);

      var id = scene.shapeList.lenght;
      var point = new Point(id, gl, program, x, y);
      scene.push(point);

      scene.render();
    }

    this.rectangleCreationMouseClick = function rectangleCreationMouseClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      // var color = getColor(properties.foregroundColor);
      // var borderColor = getColor(properties.borderColor);
      // var width = properties.lineWidth;

      var id = scene.shapeList.length;
      var rectangle = new Rectangle(id, gl, program, x, y, x, y);
      scene.push(rectangle);

      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.rectangleCloseMouseClick;
      interaction.eventListeners.move = listeners.mouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = undefined;
      addAllListeners(canvas, interaction);
    }

    this.rectangleCloseMouseClick = function rectangleCloseMouseClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      var index = scene.shapeList.length - 1;
      var rectangle = scene.shapeList[index];
      rectangle.x2 = x;
      rectangle.y2 = y;
      rectangle.setVertices();

      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.mouseClick;
      interaction.eventListeners.move = listeners.mouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = undefined;
      addAllListeners(canvas, interaction);

      scene.render();
    }

    this.triangleCreationMouseClick = function triangleCreationMouseClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      // var color = getColor(properties.foregroundColor);
      // var borderColor = getColor(properties.borderColor);
      // var width = properties.lineWidth;

      var id = scene.shapeList.length;
      var triangle = new Triangle(id, gl, program, x, y, x, y, x, y);
      scene.push(triangle);

      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.triangleAddVertexMouseClick;
      interaction.eventListeners.move = listeners.mouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = undefined;
      addAllListeners(canvas, interaction);
    }

    this.triangleAddVertexMouseClick = function triangleAddVertexMouseClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      var index = scene.shapeList.length - 1;
      var triangle = scene.shapeList[index];
      triangle.x2 = x;
      triangle.y2 = y;

      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.triangleCloseMouseClick;
      interaction.eventListeners.move = listeners.mouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = undefined;
      addAllListeners(canvas, interaction);
    }
    
    this.triangleCloseMouseClick = function triangleCloseMouseClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      var index = scene.shapeList.length - 1;
      var triangle = scene.shapeList[index];
      triangle.x3 = x;
      triangle.y3 = y;
      triangle.setVertices();

      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.mouseClick;
      interaction.eventListeners.move = listeners.mouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = undefined;
      addAllListeners(canvas, interaction);

      scene.render();
    }

    this.polygonCreationMouseClick = function polygonCreationMouseClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      // var color = getColor(properties.foregroundColor);
      // var borderColor = getColor(properties.borderColor);
      // var width = properties.lineWidth;

      var id = scene.shapeList.length;
      var polygon = new Polygon(id, gl, program, x, y);
      scene.push(polygon);

      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.polygonAddVertexMouseClick;
      interaction.eventListeners.move = listeners.mouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = listeners.polygonCloseMouseDoubleClick;
      addAllListeners(canvas, interaction);
    }

    this.polygonAddVertexMouseClick = function polygonAddVertexMouseClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      var index = scene.shapeList.length - 1;
      var polygon = scene.shapeList[index];
      polygon.addVertex(x, y);
      polygon.setIndices();

      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.polygonAddVertexMouseClick;
      interaction.eventListeners.move = listeners.mouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = listeners.polygonCloseMouseDoubleClick;
      addAllListeners(canvas, interaction);
      
      scene.render();
    }

    this.polygonCloseMouseDoubleClick = function polygonCloseMouseDoubleClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      var index = scene.shapeList.length - 1;
      var polygon = scene.shapeList[index];
      polygon.addVertex(x, y);
      polygon.setVertices();

      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.mouseClick;
      interaction.eventListeners.move = listeners.mouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = undefined;
      addAllListeners(canvas, interaction);

      scene.render();
    }

  }