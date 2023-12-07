let charts = [];

function mapValue(x, in_min, in_max, out_min, out_max)
{
	return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function objLength(obj){
    let i = 0;

    for (let key of Object.keys(obj))
        i++;
    return (i)
}

function drawVerticalChart(canvas, data){
    let ctx = canvas.getContext("2d");
    let blockWidth = (canvas.width / objLength(data.values)) - (objLength(data.values) * 3);
    let mappedVal = 0;
    let xPos = 30;
    let i = 0;

    for (let step = 0; step <= data.maxValue; step+=data.maxValue/4)
    {
        //drawing scale number on the left
        ctx.font = "10px Arial";
        let x  = mapValue(step, 0, data.maxValue, 0, canvas.clientHeight) + 10
        if (step > 0)
            x -= 30; 
        ctx.fillText(`${data.maxValue - step}`, 0, x);
    }
    for (key of Object.keys(data.values))
    {
        mappedVal = mapValue(data.values[key], 0, data.maxValue, 0, canvas.clientHeight - 30);
        if (i == data.colors.length)
            i = 0;

        //drawing inner rect
        ctx.fillStyle = data.colors[i++];
        ctx.fillRect(xPos, canvas.clientHeight - mappedVal - 30, blockWidth, mappedVal);

        //drawing border
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff"
        ctx.strokeRect(xPos, canvas.clientHeight - mappedVal - 30, blockWidth, mappedVal)

        //drwaing label for values
        ctx.font = "20px Arial";
        ctx.save();
        ctx.translate(xPos + 20, canvas.height - 15);
        ctx.rotate(Math.PI / 8);
        ctx.textAlign = 'center';
        ctx.fillText(key, 0, 15 / 2);
        ctx.restore();

        //setting x for next block to draw
        xPos += blockWidth + 5;
    }
}

function drawHorizontalChart(canvas, data)
{
    let ctx = canvas.getContext("2d");
    let blockHeigth = (canvas.height / objLength(data.values)) - (objLength(data.values) * 3);
    let mappedVal = 0;
    let yPos = 30;
    let i = 0;

    for (let step = 0; step <= data.maxValue; step+=data.maxValue/4)
    {
        ctx.font = "10px Arial";
        let x  = mapValue(step, 0, data.maxValue, 0, canvas.clientWidth) + 10
        if (step > 0)
            x -= 30; 

        //drawing rotate label for values on the left
        ctx.save();
        ctx.translate(x, canvas.height - 20);
        ctx.rotate(Math.PI / 8);
        ctx.textAlign = 'center';
        ctx.fillText(step, 0, 15 / 2);
        ctx.restore();
    }

    for (key of Object.keys(data.values))
    {
        mappedVal = mapValue(data.values[key], 0, data.maxValue, 0, canvas.clientWidth - 30);
        if (i == data.colors.length)
            i = 0;
        //drawing inner rect value
        ctx.fillStyle = data.colors[i++];
        ctx.fillRect(30, yPos, mappedVal, blockHeigth);
        
        //drwaing rectangle border
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff"
        ctx.strokeRect(30, yPos, mappedVal, blockHeigth)
        ctx.font = "20px Arial";

        //drawing scale for values at the bottom
        ctx.save();
        ctx.translate(10, yPos);
        ctx.rotate(Math.PI / 2);
        ctx.textAlign = 'left';
        ctx.fillText(key, 0, 15 / 2);
        ctx.restore();

        //preparing y for next rectagle
        yPos += blockHeigth + 5;
    }
}

function drawPieChart(canvas, data)
{
    let ctx = canvas.getContext("2d");
    let angle = 0;
    let newValue = 0;
    let center = {x: canvas.clientWidth / 2, y: canvas.clientHeight / 2};
    let centerOffset = center.x / 3;
    let radius = (canvas.clientWidth - center.x - centerOffset) < (canvas.clientHeight - center.y) ? (canvas.clientWidth - center.x - centerOffset) - 10 : (canvas.clientHeight - center.y) - 10;
    let i = 0;
    let step = 0;
    
    //defining maxValue as the SUM of all the value contained in data.values
    data.maxValue = 0;
    for (key of Object.keys(data.values))
        data.maxValue += data.values[key];

    //drawing rect as color reference and label for relative value on the left
    for (key of Object.keys(data.values))
    {
        ctx.font = "20px Arial";
        if (i == data.colors.length)
            i = 1;
        ctx.fillStyle = data.colors[i++];
        if (step > 0)
        {
            ctx.fillRect(0, step, 20, 10);
            ctx.fillText(key, 0, step + 30);
        }
        else
        {
            ctx.fillRect(0, step, 20, 10);
            ctx.fillText(key, 0, step + 30);
        }
        step += canvas.clientHeight / objLength(data.values);
    }
    i = 0; 

    //actual drawing of the circle slice
    for (key of Object.keys(data.values))
    {
        ctx.fillStyle = data.colors[i++];
        if (i == data.colors.length)
            i = 1;
        newValue = mapValue(data.values[key], 0, data.maxValue, 0, 100);
        ctx.beginPath();
        ctx.moveTo(center.x + centerOffset,center.y);

        //drawing the relative portion of the circle calculating the end angle as data.values[i] / radius plus the starting angle
        ctx.arc((center.x + centerOffset), center.y, radius, angle, (angle - 0.01) + mapValue(newValue, 0, 100, 0, Math.PI * 2 * radius) / radius);
        ctx.moveTo(center.x + centerOffset, center.y);
        ctx.fill()

        //draw the separator for each value
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ffffff"
        ctx.stroke();

        //preparing angle for next value to draw
        angle += mapValue(newValue, 0, 100, 0, Math.PI * 2 * center.y) / center.y;
    }
}

function drawDonutChart(canvas, data)
{
    let ctx = canvas.getContext("2d");
    let angle = 0;
    let newValue = 0;
    let center = {x: canvas.clientWidth / 2, y: canvas.clientHeight / 2};
    let centerOffset = center.x / 3;
    let radius = (canvas.clientWidth - center.x - centerOffset) < (canvas.clientHeight - center.y) ? (canvas.clientWidth - center.x - centerOffset) - 10: (canvas.clientHeight - center.y) - 10;
    let i = 0;
    let step = 0;
    
    //defining maxValue as the SUM of all the value contained in data.values
    data.maxValue = 0;
    for (key of Object.keys(data.values))
        data.maxValue += data.values[key];

    //drawing rect as color reference and label for relative value on the left
    for (key of Object.keys(data.values))
    {
        ctx.font = "20px Arial";
        if (i == data.colors.length)
            i = 1;
        ctx.fillStyle = data.colors[i++];
        if (step > 0)
        {
            ctx.fillRect(0, step, 20, 10);
            ctx.fillText(key, 0, step + 30);
        }
        else
        {
            ctx.fillRect(0, step, 20, 10);
            ctx.fillText(key, 0, step + 30);
        }
        console.log(step, canvas.clientHeight / objLength(data.values))
        step += canvas.clientHeight / objLength(data.values);
    }
    i = 0; 

    //actual drawing of the circle slice
    for (key of Object.keys(data.values))
    {
        ctx.fillStyle = data.colors[i++];
        if (i == data.colors.length)
            i = 1;
        newValue = mapValue(data.values[key], 0, data.maxValue, 0, 100);
        ctx.beginPath();
        ctx.moveTo(center.x + centerOffset,center.y);
        
        //drawing the relative portion of the circle calculating the end angle as data.values[i] / radius plus the starting angle
        ctx.arc((center.x + centerOffset), center.y, radius, angle, (angle - 0.01) + mapValue(newValue, 0, 100, 0, Math.PI * 2 * radius) / radius);
        ctx.fill()
        
        //draw the separator for each value
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 4
        ctx.stroke()
        angle += mapValue(newValue, 0, 100, 0, Math.PI * 2 * center.y) / center.y;
    }

    //drawing inner circle filled
    ctx.beginPath();
    ctx.moveTo(center.x + centerOffset,center.y);
    ctx.fillStyle = getComputedStyle(canvas).backgroundColor;
    ctx.arc((center.x + centerOffset), center.y, radius / 2, 0, 2 * Math.PI);

    //drawing border for inner circle
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#ffffff"
    ctx.stroke();
    ctx.fill();
}

window.addEventListener("resize", ()=>{
    //loop trough all the registered charts and if resize events is triggered the chart size id changed accordingly
    for (let i = 0; i < charts.length; i++)
        drawChart(charts[i].canv, charts[i].obj)
})

function drawChart(canvas, data, toPush)
{
    //sett the canvas size as the same as the parent object
    canvas.width = canvas.parentNode.clientWidth;
    canvas.height = canvas.parentNode.clientHeight;

    //check if item need to be pushed to charts list
    if (toPush != undefined)
        charts.push({canv: canvas, obj: data});

    //identify charts type and call the relative function
    if (data.type == "vertical")
        drawVerticalChart(canvas, data);
    else if (data.type == "horizontal")
        drawHorizontalChart(canvas, data);
    else if (data.type == "pie")
        drawPieChart(canvas, data);
    else if (data.type == "donut")
        drawDonutChart(canvas, data);
}

//--------------------------------
//selecting and defining charts...
//--------------------------------

//STEP 1: select your canvas like <document.querySelector(".canvas")>
//STEP 2: create info
//STEP 1: create info obj defining:
//          -type
//          -values as {label: value, ...}
//          -colors as ["colors", ...]
//          -maxValue
//STEP 3: call drawChart(selectedCanvas, createdObject, true) true will set a listener fot resize event on this canvas (undefined will not set it)

//--------------------------------
//EXAMPLE
//--------------------------------


// let canvas = document.querySelector(".chart")

// let data = {
//     type: "vertical",
//     values: {
//         val1: 200,
//         val3: 80,
//         val4: 50,
//         val5: 100,
//         val6: 300,
//         val7: 250,
//     },
//     colors: ["#9D44B5", "#B5446E", "#525252", "#BADEFC", "#0AFFED"],
//     maxValue: 400
// }

// drawChart(canvas, data, true)
