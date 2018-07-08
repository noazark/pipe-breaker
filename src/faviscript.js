// example
var centerX = this.width / 2;
var centerY = this.height / 2;
var pad = width >= 48 ? Math.round(this.width * 0.10) : 0;
var radius = (this.width - pad * 2) / 2;
var innerRadius = radius * .5;
var padWidth = this.width * .05

function randomLevel(pads=10, min=5, max=15) {
  return (new Array(pads))
    .fill(0)
    .map(() => Math.ceil(Math.random() * max) + min)
}

var levels = [
  [{width:3, color: '#333'}, {width:8, color: '#efefef'}, {width:3, color: '#efefef'}, {width:2, color: '#333'}],
  [{width:4, color: '#efefef'}, {width:4, color: '#333'}, {width:3, color: '#efefef'}, {width:1.5, color: '#333'}, {width: 4, color: '#333'}],
  [{width:2, color: '#efefef'}, {width:4, color: '#efefef'}, {width:3, color: '#efefef'}, {width:3, color: '#efefef'}, {width: 2, color: '#efefef'}],
  [{width:3, color: '#efefef'}, {width:2, color: '#efefef'}, {width:4, color: '#efefef'}, {width:2, color: '#efefef'}, {width: 4, color: '#efefef'}],
  [{width:3, color: '#efefef'}, {width:2, color: '#efefef'}, {width:2, color: '#efefef'}, {width:4, color: '#efefef'}, {width: 2, color: '#efefef'}]
]

console.log(levels);

this.fillStyle = 'white';
this.fillRect(0,0,this.width,this.height);

drawShell(this, centerX, centerY, innerRadius, 2);
this.fillStyle = '#DB4A4A';
this.fill();

levels.forEach((level, l) => {
    const ir = innerRadius + padWidth + (2 * padWidth * l)
    level.forEach((pad, i) => {
        drawPad(this, centerX, centerY, ir, padWidth, findStartPos(level, i), findEndPos(level, i));
        this.fillStyle = pad.color;
        this.fill();
    })
})

function drawShell(ctx, x, y, radius, scale) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, scale * Math.PI, false);
    ctx.closePath();
}

function drawPad(ctx, x, y, innerRadius, padWidth, start, end) {
    const outerRadius = innerRadius + padWidth

    const _paddingInner = 1 - (4 * Math.PI * innerRadius - padWidth) / (4 * Math.PI * innerRadius)
    const _paddingOuter = 1 - (4 * Math.PI * outerRadius - padWidth) / (4 * Math.PI * outerRadius)

    ctx.beginPath();
    ctx.arc(x, y, innerRadius, (end - _paddingInner) * 2 * Math.PI, (start + _paddingOuter) * 2 * Math.PI, true);
    ctx.arc(x, y, outerRadius, (start + _paddingOuter) * 2 * Math.PI, (end - _paddingInner) * 2* Math.PI, false);
    ctx.closePath();
}

function sum(arr) {
  return arr.reduce((agg, p) => agg + p.width, 0)
}

function findStartPos(level, i) {
  return sum(level.slice(0, i)) / sum(level)
}

function findEndPos(level, i) {
  return sum(level.slice(0, i + 1)) / sum(level)
}
