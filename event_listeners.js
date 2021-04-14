function getColor(color){
    var r = color[0];
    var g = color[1];
    var b = color[2];
    var color = new Color (r,g,b, 255);
    return color;
}

function selectShape(x,y){
    var i;
    var selectedShape = undefined;
    var currentSelected = shapeList.selectedShape;

    for (i=shapeList.size-1;i>=0;i--){
        let shape = shapeList.list[i];
        if (shape.isInside(x,y)) {
            if (currentSelected != shape){
                selectedShape = shape;
            }
            
            break;
        }
    }
    return selectedShape;
}

function removeAllListeners(canvas,interaction){
    canvas.removeEventListener('click',interaction.eventListeners.click);
    canvas.removeEventListener('mousemove',interaction.eventListeners.move);
    canvas.removeEventListener('dblclick',interaction.eventListeners.dblclick);
    canvas.removeEventListener('mouseup',interaction.eventListeners.mouseup);
    canvas.removeEventListener('mousedown',interaction.eventListeners.mousedown);
}

function addAllListeners(canvas,interaction){
    canvas.addEventListener('click', interaction.eventListeners.click, false);
    canvas.addEventListener('mousemove',interaction.eventListeners.move,false);
    canvas.addEventListener('dblclick',interaction.eventListeners.dblclick,false);
    canvas.addEventListener('mouseup',interaction.eventListeners.mouseup,false);
    canvas.addEventListener('mousedown',interaction.eventListeners.mousedown,false);
}

function create_listeners(){

    //this here refers to the canvas because the callbacks (listeners) are binded to the canvas object
    //in calling time

    
    this.mouseUp = function mouseUp(event){
        this.down = false; 
    }

    this.mouseDown = function mouseDown(event){
        this.down = true;
    }          


    this.mouseMove = function mouseMove(event){
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;
        var color = [255,255,255];
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop; 

        var i;
        for (i=0;i<shapeList.size;i++){
            if (shapeList.list[i].isInside(x,y)) {
                color = [shapeList.list[i].color.r,shapeList.list[i].color.g,shapeList.list[i].color.b];
                
                break;
            }
        }
        // event.pageX is the x coordinate of the cursor
        // event.pageY is the y coordinate of the cursor
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop; 

        info.position = 'Position: (' + x.toString() + ',' + y.toString() + ')';
        info.color = color;

        //cursor_pos.innerHTML = 'Position: (' + x.toString() + ',' + y.toString() + ')';
        //color_box.style.backgroundColor = color;
    }   

    //TranslationMouseUp
    this.translationMouseUp = function translationMouseUp(event){
        this.down = false; 
        shapeList.selectedShape = undefined;
    }

    //TranslationMouseDown
    this.translationMouseDown = function translationMouseDown(event){
        this.down = true;
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop; 

        
        this.prev_x = x;
        this.prev_y = y;


        shapeList.selectedShape = selectShape(x,y);

    }    


    //TranslationMouseMove
    this.translationMouseMove = function translationMouseMove(event){

        if (shapeList.selectedShape === undefined){
            return;
        }
        if (this.down){
            var offsetLeft = canvas.offsetLeft;
            var offsetTop = canvas.offsetTop;
            var color = 'white';

            var x = event.pageX - offsetLeft,
                y = event.pageY - offsetTop;  

            var d_x = x-this.prev_x;
            var d_y = y-this.prev_y;

            this.prev_x = x;
            this.prev_y = y;

            shapeList.selectedShape.translate(d_x,d_y);

            render(canvas,shapeList);

        }
    }  

    //pickMouseClick
    this.pickMouseClick = function pickMouseClick(event) {

        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;
        var currentSelected = shapeList.selectedShape;
        

        // event.pageX is the x coordinate of the cursor
        // event.pageY is the y coordinate of the cursor
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop; 

        this.prev_x = x;
        this.prev_y = y;
        
        shapeList.selectedShape = selectShape(x,y);

        render(canvas,shapeList);
    }


    //FreeDrawingCreationMouseClick
    this.freeDrawingCreationMouseClick = function freeDrawingCreationMouseClick(event){
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;
        var x = event.pageX - offsetLeft;
        var y = event.pageY - offsetTop; 
        this.prev_x = x;
        this.prev_y = y;
        return;
    }

    //FreeDrawingCreationMouseMove
    this.freeDrawingCreationMouseMove = function freeDrawingCreationMouseMove(event) {
        if (this.down){
            var offsetLeft = canvas.offsetLeft;
            var offsetTop = canvas.offsetTop;
    
            // event.pageX is the x coordinate of the cursor
            // event.pageY is the y coordinate of the cursor
            var x = event.pageX - offsetLeft,
                y = event.pageY - offsetTop; 
    
            var color = getColor(properties.foregroundColor);
            var borderColor = getColor(properties.borderColor);

            var id = shapeList.size;
            //var point = new Point(id,PrimitiveType.POINT,color,x,y,properties.pointSize);
            //shapeList.push(point);

            var circle = new Circle(id,PrimitiveType.CIRCLE,color,color,x,y,properties.pointSize);
            shapeList.push(circle);
            render(canvas,shapeList);
        }
    }

    //PointCreationMouseClick
    this.pointCreationMouseClick = function pointCreationMouseClick(event) {
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;

        // event.pageX is the x coordinate of the cursor
        // event.pageY is the y coordinate of the cursor
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop; 

        var color = getColor(properties.foregroundColor);
        var borderColor = getColor(properties.borderColor);

        var id = shapeList.size;
        var point = new Point(id,PrimitiveType.POINT,color,borderColor,x,y,properties.pointSize);
        shapeList.push(point);
        render(canvas,shapeList);

    }

    //LineSegmentCreationMouseMove
    this.lineSegmentCreationMouseMove = function lineSegmentCreationMouseMove(event){
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;

        // event.pageX is the x coordinate of the cursor
        // event.pageY is the y coordinate of the cursor
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop; 

        var width = properties.lineWidth;
        var index = shapeList.size-1;    
        var lineSegment = shapeList.list[index];
        lineSegment.x1 = x;
        lineSegment.y1 = y;

        render(canvas,shapeList);
        
    }

    //LineSegmentCreationMouseClick
    this.lineSegmentCreationMouseClick = function lineSegmentCreationMouseClick(event) {
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;

        // event.pageX is the x coordinate of the cursor
        // event.pageY is the y coordinate of the cursor
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop; 
        
        var color = getColor(properties.foregroundColor);
        var borderColor = getColor(properties.borderColor);
        var width = properties.lineWidth;

        var id = shapeList.size;
        var lineSegment = new LineSegment(id,PrimitiveType.LINE,color,borderColor,x,y,x,y,width);
        shapeList.push(lineSegment);

        removeAllListeners(canvas,interaction);
        interaction.eventListeners.click = listeners.lineSegmentCloseMouseClick;
        interaction.eventListeners.move = listeners.lineSegmentCreationMouseMove;
        interaction.eventListeners.mouseup = listeners.mouseUp;
        interaction.eventListeners.mousedown = listeners.mouseDown;
        interaction.eventListeners.dblClick = undefined;
        addAllListeners(canvas,interaction);


    }

    //LineSegmentCloseMouseClick
    this.lineSegmentCloseMouseClick = function lineSegmentCloseMouseClick(event) {
            var offsetLeft = canvas.offsetLeft;
            var offsetTop = canvas.offsetTop;

            // event.pageX is the x coordinate of the cursor
            // event.pageY is the y coordinate of the cursor
            var x = event.pageX - offsetLeft,
                y = event.pageY - offsetTop; 

            var index = shapeList.size-1;    
            var lineSegment = shapeList.list[index];
            lineSegment.x1 = x;
            lineSegment.y1 = y;

            removeAllListeners(canvas,interaction);
            interaction.eventListeners.click = listeners.lineSegmentCreationMouseClick;        
            interaction.eventListeners.move = listeners.mouseMove;
            interaction.eventListeners.mouseup = listeners.mouseUp;
            interaction.eventListeners.mousedown = listeners.mouseDown;
            interaction.eventListeners.dblClick = undefined;
            
            addAllListeners(canvas,interaction);


    
            render(canvas,shapeList);
    }

    //RectangleCreationMouseMove
    this.rectangleCreationMouseMove = function rectangleCreationMouseMove(event){
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;

        // event.pageX is the x coordinate of the cursor
        // event.pageY is the y coordinate of the cursor
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop; 
        
        var width = properties.lineWidth;
        var index = shapeList.size-1;    
        var rectangle = shapeList.list[index];
        rectangle.x1 = x;
        rectangle.y1 = y;

        render(canvas,shapeList);
        
    }

    //RectangleCreationMouseClick
    this.rectangleCreationMouseClick = function rectangleCreationMouseClick(event) {
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;

        // event.pageX is the x coordinate of the cursor
        // event.pageY is the y coordinate of the cursor
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop; 

        var color = getColor(properties.foregroundColor);
        var borderColor = getColor(properties.borderColor);

        var width = properties.lineWidth;

        var id = shapeList.size;
        var rectangle = new Rectangle(id,PrimitiveType.RECTANGLE,color,borderColor,x,y,x,y,width);
        shapeList.push(rectangle);

        removeAllListeners(canvas,interaction);
        interaction.eventListeners.click = listeners.rectangleCloseMouseClick;
        interaction.eventListeners.move = listeners.rectangleCreationMouseMove;
        interaction.eventListeners.mouseup = listeners.mouseUp;
        interaction.eventListeners.mousedown = listeners.mouseDown;
        interaction.eventListeners.dblClick = undefined;

        addAllListeners(canvas,interaction);


    }

    ///RectangleCloseMouseClick
    this.rectangleCloseMouseClick = function rectangleCloseMouseClick(event) {
            var offsetLeft = canvas.offsetLeft;
            var offsetTop = canvas.offsetTop;

            // event.pageX is the x coordinate of the cursor
            // event.pageY is the y coordinate of the cursor
            var x = event.pageX - offsetLeft,
                y = event.pageY - offsetTop; 

            var index = shapeList.size-1;    
            var rectangle = shapeList.list[index];
            rectangle.x1 = x;
            rectangle.y1 = y;

            removeAllListeners(canvas,interaction);
            interaction.eventListeners.click = listeners.rectangleCreationMouseClick;        
            interaction.eventListeners.move = listeners.mouseMove;
            interaction.eventListeners.mouseup = listeners.mouseUp;
            interaction.eventListeners.mousedown = listeners.mouseDown;
            interaction.eventListeners.dblClick = undefined;            
            addAllListeners(canvas,interaction);

            render(canvas,shapeList);
    }


    //CircleDefineRadiusMouseMove
    this.circleDefineRadiusMouseMove = function circleDefineRadiusMouseMove(event){
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;

        // event.pageX is the x coordinate of the cursor
        // event.pageY is the y coordinate of the cursor
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop;

        var index = shapeList.size;
        var circle = shapeList.list[index-1];
        circle.radius = Math.sqrt((x-circle.cx)*(x-circle.cx)+(y-circle.cy)*(y-circle.cy));

        render(canvas,shapeList);
        
    }

    //CircleCreationMouseClick
    this.circleCreationMouseClick = function circleCreationMouseClick(event) {
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;

        // event.pageX is the x coordinate of the cursor
        // event.pageY is the y coordinate of the cursor
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop; 


        var color = getColor(properties.foregroundColor);
        var borderColor = getColor(properties.borderColor);

        var id = shapeList.size;
        var circle = new Circle(id,PrimitiveType.CIRCLE,color,borderColor,x,y,0.0);
        shapeList.push(circle);


        removeAllListeners(canvas,interaction);
        interaction.eventListeners.click = listeners.circleCloseMouseClick;
        interaction.eventListeners.move = listeners.circleDefineRadiusMouseMove;
        interaction.eventListeners.mouseup = listeners.mouseUp;
        interaction.eventListeners.mousedown = listeners.mouseDown;
        interaction.eventListeners.dblClick = undefined;        
        addAllListeners(canvas,interaction);


    }

    //CircleCloseMouseClick
    this.circleCloseMouseClick = function circleCloseMouseClick(event) {
            var offsetLeft = canvas.offsetLeft;
            var offsetTop = canvas.offsetTop;

            // event.pageX is the x coordinate of the cursor
            // event.pageY is the y coordinate of the cursor
            var x = event.pageX - offsetLeft,
                y = event.pageY - offsetTop; 

            removeAllListeners(canvas,interaction);
            interaction.eventListeners.click = listeners.circleCreationMouseClick;        
            interaction.eventListeners.move = listeners.mouseMove;
            interaction.eventListeners.mouseup = listeners.mouseUp;
            interaction.eventListeners.mousedown = listeners.mouseDown;
            interaction.eventListeners.dblClick = undefined;            
            addAllListeners(canvas,interaction);


            render(canvas,shapeList);
    }

    //PolygonAddVertexMouseMove
    this.polygonAddVertexMouseMove = function polygonAddVertexMouseMove(event){
        var offsetLeft = canvas.offsetLeft;
            var offsetTop = canvas.offsetTop;

            // event.pageX is the x coordinate of the cursor
            // event.pageY is the y coordinate of the cursor
            var x = event.pageX - offsetLeft,
                y = event.pageY - offsetTop; 

            var index = shapeList.size-1;    
            var polygon = shapeList.list[index];

            var vertexIndex = polygon.numVertices-1;
            var vertex = polygon.list[vertexIndex];
            vertex.x = x;
            vertex.y = y;
    
            render(canvas,shapeList);

    }

    //PolygonCreationMouseClick
    this.polygonCreationMouseClick = function polygonCreationMouseClick(event) {
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;
        var firstMove = true;

        // event.pageX is the x coordinate of the cursor
        // event.pageY is the y coordinate of the cursor
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop; 


        var color = getColor(properties.foregroundColor);
        var borderColor = getColor(properties.borderColor);

        var width = properties.lineWidth;

        var id = shapeList.size;
        var polygon = new Polygon(id,PrimitiveType.POLYGON,color,borderColor);
        polygon.push(new Vertex(polygon.numVertices,x,y));
        polygon.push(new Vertex(polygon.numVertices,x,y));
        shapeList.push(polygon);


        removeAllListeners(canvas,interaction);
        interaction.eventListeners.click = listeners.polygonAddVertexMouseClick;
        interaction.eventListeners.move = listeners.polygonAddVertexMouseMove;
        interaction.eventListeners.mouseup = listeners.mouseUp;
        interaction.eventListeners.mousedown = listeners.mouseDown;
        interaction.eventListeners.dblclick = listeners.polygonCloseMouseDoubleClick;
        addAllListeners(canvas,interaction);



    }

    //polygonCloseMouseDoubleClick
    this.polygonCloseMouseDoubleClick = function polygonCloseMouseDoubleClick(event) {
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;

        // event.pageX is the x coordinate of the cursor
        // event.pageY is the y coordinate of the cursor
        var x = event.pageX - offsetLeft,
            y = event.pageY - offsetTop;       
            
        var index = shapeList.size-1;    
        var polygon = shapeList.list[index];
            
            
        polygon.verticesList.pop();
        
        removeAllListeners(canvas,interaction);
        interaction.eventListeners.click = listeners.polygonCreationMouseClick;
        interaction.eventListeners.move = listeners.mouseMove;
        interaction.eventListeners.mouseup = listeners.mouseUp;
        interaction.eventListeners.mousedown = listeners.mouseDown;
        interaction.eventListeners.dblClick = undefined;
        addAllListeners(canvas,interaction);


    }
    

    //PolygonAddVertexMouseClick
    this.polygonAddVertexMouseClick = function polygonAddVertexMouseClick(event) {
            var offsetLeft = canvas.offsetLeft;
            var offsetTop = canvas.offsetTop;

            // event.pageX is the x coordinate of the cursor
            // event.pageY is the y coordinate of the cursor
            var x = event.pageX - offsetLeft,
                y = event.pageY - offsetTop; 

            var index = shapeList.size-1;    
            var polygon = shapeList.list[index];
            
            
            var lastAddedVertex = polygon.verticesList[polygon.size-2];
            var newVertex = polygon.verticesList[polygon.size-1];

            if ((Math.abs(lastAddedVertex.x-newVertex.x)>2) ||
                (Math.abs(lastAddedVertex.y-newVertex.y)>2)){
            
                var newVertex = new Vertex(polygon.numVertices,x,y);
                polygon.push(newVertex);

            }

                              
            render(canvas,shapeList);
    }
}    