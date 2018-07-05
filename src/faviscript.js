// example
var centerX = this.width / 2;
var centerY = this.height / 2;
var pad = width >= 48 ? Math.round(this.width * 0.10) : 0;
var radius = (this.width - pad * 2) / 2;
var innerRadius = radius * (width >= 128 ? 0.9 : 1);


this.fillStyle = '#fff';

this.rect(0, 0, this.width, this.height)
this.fill();

this.fillStyle = '#000';
this.strokeStyle = '#fff';

drawShell(this, centerX, centerY, this.width / 2, .2, 1.2);
this.fill();
this.stroke();

drawShell(this, centerX, centerY, this.width / 2, .3, 1.8);
this.fill();
this.stroke();

drawShell(this, centerX, centerY, this.width / 2, .3, 1.8);
this.fill();
this.stroke();

drawShell(this, centerX, centerY, this.width / 2, 1, 3.7);
this.fill();
this.stroke();

drawShell(this, centerX, centerY, this.width / 3, 2);
this.fillStyle = '#FFF';
this.fill();

this.fillStyle = '#000';
this.strokeStyle = '#fff';

drawShell(this, centerX, centerY, this.width / 3 - .5, .3, 2);
this.fill();
this.stroke();

drawShell(this, centerX, centerY, this.width / 3 - .5, 1.1, 2.9);
this.fill();
this.stroke();

drawShell(this, centerX, centerY, this.width / 3 - .5, .5, 5);
this.fill();
this.stroke();

drawShell(this, centerX, centerY, this.width / 6, 2);
this.fillStyle = '#FFF';
this.fill();

drawShell(this, centerX, centerY, this.width / 6 - 1, 2);
this.fillStyle = '#FF0000';
this.fill();

function drawShell(ctx, x, y, radius, scale, offset=0) {
    ctx.beginPath();
    ctx.arc(x, y, radius, offset, scale * Math.PI + offset, false);
    ctx.lineTo(x, y);
    ctx.closePath();
}
