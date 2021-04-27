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

    this.rectangleCreationMouseMove = function rectangleCreationMouseMove(event) {
      /*
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      var width = properties.lineWidth;
      var index = shapeList.size - 1;
      var rectangle = shapeList.list[index];
      rectangle.x1 = x;
      rectangle.y1 = y;

      render(canvas, shapeList);
      */
    }

    this.rectangleCreationMouseClick = function rectangleCreationMouseClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      // var color = getColor(properties.foregroundColor);
      // var borderColor = getColor(properties.borderColor);

      // var width = properties.lineWidth;

      // var id = shapeList.size;
      // var rectangle = new Rectangle(id, PrimitiveType.RECTANGLE, color, borderColor, x, y, x, y, width);
      var rectangle = new Rectangle(gl, program, x, y);
      // shapeList.push(rectangle);

      //removeAllListeners(canvas, interaction);
      //interaction.eventListeners.click = listeners.rectangleCloseMouseClick;
      //interaction.eventListeners.move = listeners.rectangleCreationMouseMove;
      //interaction.eventListeners.mouseup = listeners.mouseUp;
      //interaction.eventListeners.mousedown = listeners.mouseDown;
      //interaction.eventListeners.dblClick = undefined;
      //addAllListeners(canvas, interaction);
        
      rectangle.initBuffer();
      rectangle.draw(primitiveType);
      
    }

    this.rectangleCloseMouseClick = function rectangleCloseMouseClick(event) {
      /*
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      var index = shapeList.size - 1;
      var rectangle = shapeList.list[index];
      rectangle.x1 = x;
      rectangle.y1 = y;

      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.rectangleCloseMouseClick;
      interaction.eventListeners.move = listeners.rectangleCreationMouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = undefined;
      addAllListeners(canvas, interaction);
      */
    }

    this.triangleCreationMouseMove = function triangleCreationMouseMove(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      var width = properties.lineWidth;
      var index = shapeList.size - 1;
      var rectangle = shapeList.list[index];
      triangle.x1 = x;
      triangle.y1 = y;

      render(canvas, shapeList);
    }

    this.triangleCreationMouseClick = function triangleCreationMouseClick(event) {
      /*
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      var color = getColor(properties.foregroundColor);
      var borderColor = getColor(properties.borderColor);

      var width = properties.lineWidth;

      var id = shapeList.size;
      var triangle = new Triangle(id, PrimitiveType.TRIANGLE, color, borderColor, x, y, x, y, width);
      shapeList.push(triangle);

      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.rectangleCloseMouseClick;
      interaction.eventListeners.move = listeners.rectangleCreationMouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = undefined;

      addAllListeners(canvas, interaction);
      */

      var triangle = new Triangle(gl, program);
      triangle.initBuffer();
      triangle.draw(primitiveType);
    }
    
    this.triangleCloseMouseClick = function triangleCloseMouseClick(event) {
      var offsetLeft = canvas.offsetLeft;
      var offsetTop = canvas.offsetTop;

      var x = event.pageX - offsetLeft,
          y = event.pageY - offsetTop;

      var index = shapeList.size - 1;
      var triangle = shapeList.list[index];
      triangle.x1 = x;
      triangle.y1 = y;

      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.rectangleCloseMouseClick;
      interaction.eventListeners.move = listeners.rectangleCreationMouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = undefined;

      addAllListeners(canvas, interaction);
    }

  }