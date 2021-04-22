function createGUI(info, tools, file, properties, interaction, canvas) {
    var gui = new dat.GUI();

    var infoFolder = gui.addFolder('Info');
    infoFolder.addColor(info, 'color').listen();
    infoFolder.add(info, 'position').listen();

    var toolsFolder = gui.addFolder('Tools');
    toolsFolder.add(tools, 'draw');
    toolsFolder.add(tools, 'delete');
    toolsFolder.add(tools, 'clear');
    toolsFolder.add(tools, 'pick');
    toolsFolder.add(tools, 'move');

    var fileFolder = gui.addFolder('FileTools');
    fileFolder.add(file, 'save');
    fileFolder.add(file, 'load');

    var propertiesFolder = gui.addFolder('Properties');
    var colorController = propertiesFolder.addColor(properties, 'foregroundColor');
    var borderColorController = propertiesFolder.addColor(properties, 'borderColor');
    var pointSizeController = propertiesFolder.add(properties, 'pointSize', 1, 100);
    var lineWidthController = propertiesFolder.add(properties, 'lineWidth', 1, 50);
    var primitiveController = propertiesFolder.add(properties, 'primitiveType', ['point', 'rectangle', 'triangle']);

    primitiveController.onChange(
      function(value) {
        removeAllListeners(canvas, interaction);

        if (value == 'point') {
          primitiveType = "point";
        } else if (value == 'rectangle') {
          primitiveType = "rectangle";
        } else if (value == 'triangle') {
          primitiveType = "triangle";
        }

        addAllListeners(canvas, interaction);
      }
    );

    colorController.onChange(
      function(value) {
        properties.color = value;
        // var shape = shapeList.selectedShape;
        var shape = primitiveType;
        if (shape == undefined) {
          return;
        }
        var color = getColor(properties.foregroundColor);
        // shape.color = color;
        // render(canvas, shapeList);
      }
    );

    borderColorController.onChange(
      function(value) {
        properties.borderColor = value;
        // var shape = shapeList.selectedShape;
        var shape = primitiveType;
        if (shape == undefined) {
          return;
        }
        var color = getColor(properties.borderColor);
        // shape.borderColor = color;
        // render(canvas, shapeList);
      }
    );

    infoFolder.open();
    propertiesFolder.open();
    toolsFolder.open();
    fileFolder.open();

    return gui;
  }
  
  function Info() {
    this.color = [0, 0, 0];
    this.position = "Position (0, 0)";
  }
  
  function FileTools() {
    this.save = function() {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([JSON.stringify(shapeList, null, 2)], {type: "text/plain"})
      );
      a.setAttribute("download", "data.txt");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    this.load = function() {
      fetch('/SimpleDrawing/data.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(json => {
        shapeList.load(json);
        render(canvas, shapeList);
      })
      .catch(function() {
        this.dataError = true;
      })
    }
  }

  function Tools() {
    
    this.draw = function() {
      interaction.mode = InteractionMode.DRAW;
      var canvas = document.getElementById("canvas");
      removeAllListeners(canvas, interaction);

      switch (primitiveType) {
        case "point":
          interaction.eventListeners.click = listeners.pointCreationMouseClick;
          interaction.eventListeners.move = listeners.mouseMove;
          break;
        case "rectangle":
          interaction.eventListeners.click = listeners.rectangleCreationMouseClick;
          //interaction.eventListeners.move = listeners.mouseMove;
          break;
        case "triangle":
          interaction.eventListeners.click = listeners.triangleCreationMouseClick;
          //interaction.eventListeners.move = listeners.mouseMove;
          break;
      }

      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = undefined;
      addAllListeners(canvas, interaction);
    };

    this.clear = function() {
        /*
        shapeList.list.length = 0;
        render(canvas, shapeList);
        */
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);       
    }

    this.delete = function() {
      shapeList.delete(shapeList.selectedShape);
      render(canvas, shapeList);
    }

    this.pick = function() {
      interaction.mode = InteractionMode.PICK;
      var canvas = document.getElementById("canvas");
      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = listeners.pickMouseClick;
      interaction.eventListeners.move = listeners.mouseMove;
      interaction.eventListeners.mouseup = listeners.mouseUp;
      interaction.eventListeners.mousedown = listeners.mouseDown;
      interaction.eventListeners.dblClick = undefined;
      addAllListeners(canvas, interaction);
    }

    this.move = function() {
      interaction.mode = InteractionMode.TRANSLATE;
      var canvas = document.getElementById("canvas");
      removeAllListeners(canvas, interaction);
      interaction.eventListeners.click = undefined;
      interaction.eventListeners.move = listeners.translationMouseMove;
      interaction.eventListeners.mouseup = listeners.translationMouseUp;
      interaction.eventListeners.mousedown = listeners.translationMouseDown;
      interaction.eventListeners.dblClick = undefined;
      addAllListeners(canvas, interaction);
    }

  }

  function Properties() {
    this.foregroundColor = [0, 0, 0];
    this.borderColor = [0, 0, 0];
    this.pointSize = 8;
    this.lineWidth = 2;
    this.primitiveType = 'point';
  }