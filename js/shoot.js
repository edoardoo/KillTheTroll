
(function() {
//define the animation refresh (frame rendering) with built-in browser timing
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||function(f){window.setTimeout(f,40/60)}
})();

//define some variables: canvas, context, img to put inside the context and an array of bouncing objects
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var img = new Image();
//IMPORTANT: Wait for the picture to be loaded!
img.onload = function(){

        beginAnimation();
};
//yes, the src goes after
img.src = 'img/winnie.png';

//how many bouncing objects?
var particle_count = 2;  
var particles = [];
var particle;
var W = 0;
var H = 0;

updateCoordinates();

var img_width = 123;
var killingspree = 0;
var points = 0;
var deltaShot = 50;

var img_height = 150;
var song = document.getElementsByTagName('audio')[0];

function updateCoordinates(){
	W = canvas.width = window.innerWidth;
	H = canvas.height = window.innerHeight;
}


function playPause() {

	song.currentTime = 0;
    song.play();
}
function relMouseCoords(event){

    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}

HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

$(window).resize(function(){
	updateCoordinates();
})

window.onclick = function(event){

	//TODO: Got to split this code, tooooooo much all together...
	coords = canvas.relMouseCoords(event);

	canvasX = coords.x;
	canvasY = coords.y;
	var killedInLoop = 0;

	particles.forEach(function(particle) {
		//Check if the click is inside troll area
		if( (particle.x > canvasX - ((img_width/2)+deltaShot) && particle.x < canvasX + ((img_width/2)+deltaShot)) 
			&& (particle.y > canvasY - ((img_height/2)+deltaShot) && particle.y < canvasY +((img_height/2)+deltaShot) ) && particle.dead == false && killedInLoop == 0){


			particle.dead = true;
			killingspree ++;

			//start the  blood animations
			var splattern = document.createElement("div");
			document.body.appendChild(splattern);

			var explosion = document.createElement('div');
			splattern.appendChild(explosion);
			$(splattern).addClass('splattern');



			$(splattern).css('top',canvasY-85).css('left',canvasX-150);
			$(splattern).css('-webkit-transform', 'rotateZ('+Math.round(Math.random()*(180-0)+0)+'deg)');

			var bloodExplosion = 'explosion'+Math.round(Math.random()*(2-0)+0);

			if( bloodExplosion == 'explosion0'){

				explosion.className += 'explosion0'

			}else{
				explosion.className += 'explosionGeneral';
				$('.explosionGeneral').css('background', 'url("img/blood/explosions/'+bloodExplosion+'.png")');
			}
			
			$(explosion).bind('oanimationend  webkitAnimationEnd animationend mozAnimationEnd', function(event) { 
				//this prevent the  child ending animation to fail the callback ending in the parent div
				event.stopPropagation()
			   
				explosion.parentNode.removeChild(explosion);
			   

			});
			$(splattern).bind('oanimationend  webkitAnimationEnd animationend mozAnimationEnd', function() {
			   		splattern.parentNode.removeChild(splattern);
			   });


			
			points += 5;
			$("#points").html(points);

			if ( killingspree == 7){
				$("#modalBox").html('WOOO! KILLING SPREE! </br> +10  ')


				$("#modalBox").css('opacity','1');
				setTimeout(function(){
					$("#modalBox").css('opacity','0')
				}, 1000);
					points += 10;
					$("#points").html(points);

			}else if(killingspree == 14){
				$("#modalBox").html('GOD MODE! WOAH! </br> +20 ');
				$("#modalBox").css('opacity','1');
				setTimeout(function(){
					$("#modalBox").css('opacity','0')
				}, 1000);
					points += 20;
					$("#points").html(points);

			}

			killedInLoop = 1;
		}
	});
	if(killedInLoop == 0){

				killingspree=0;	


	}


	playPause(); //let's play some dirty sound 
	
		// explosion.parentNode.removeChild(explosion);
	


};

function Particle() {

	//define properties of a bouncing object, such as where it start, how fast it goes

	var W = canvas.width = window.innerWidth;
	var H = canvas.height = window.innerHeight;
	this.radius = 20;
	this.x = parseInt(Math.random() * W);
	this.y = H;
	this.dead = false;

	//Uncomment for coloured particles: 

	// this.color = 'rgb(' +
	// parseInt(Math.random() * 255) + ',' +
	// parseInt(Math.random() * 255) + ',' +
	// parseInt(Math.random() * 255) + ')';

	//end coloured particles

	if (this.x > W/2 ){

		this.vx = Math.random() * (-15 - -5) + -5;

	}else{

		this.vx = Math.random() * (15 - 5) + 5;

	}


	this.vy = Math.random() * (-25 - -20) + -2;
	// var rotating = parseInt(Math.random() * 10 );
	var rotating = 2;

		//DEVELOPING ROTATION

		 // if (rotating == 5){
		 // 	this.rotate = 'left';
		 // }else if(rotating == 6){
		 // 	this.rotate = 'right';
		 // }
	this.translateX =0;

	//we will call this function to actually draw the bouncing object at EVERY FRAME

	this.draw = function() {
		// Bouncing pictures were not bouncing because there were no this.x this.y . Shame on me. 
	 	ctx.drawImage(img,this.x,this.y);

	};

}

function renderFrame() {

	//RENDER THE PARTICLEEEEEEES!

	requestAnimationFrame(renderFrame);

	// Clearing screen to prevent trails
	ctx.clearRect(0,0, W, H);


	particles.forEach(function(particle) {

		// The bouncing objects simply go upwards
		// It MUST come down, so lets apply gravity
		particle.vy += 0.6;

		// Adding velocity to x and y axis
		particle.x += particle.vx;
		particle.y += particle.vy;

		// We're almost done! All we need to do now
		// is to reposition the bouncing objects as soon
		// as they move off the canvas.
		// We'll also need to re-set the velocities

		if (
			// off the right side
			particle.x + particle.radius > W ||
			// off the left side
			particle.x - particle.radius < 0 ||
			// off the bottom
			particle.y + particle.radius > H
			) {

				// If any of the above conditions are met
				// then we need to re-position the bouncing objects
				// on the base :)


				// If we do not re-set the velocities then
				// the bouncing objects will stick to base :D

				// Velocity X
				particle.dead = false;
				particle.x = parseInt(Math.random() * W);
				particle.y = H;
				if (particle.x > W/2 ){

					particle.vx = Math.random() * (-15 - -5) + -5;

				}else{

					particle.vx = Math.random() * (15 - 5) + 5;


				}
				particle.vy = Math.random() * (-25 - -22) + -25;


			}

		if(particle.dead == false){

		particle.draw();

		}

	});
}

function beginAnimation(){
		//create the particles and start to render them

       for (var i = 0; i < particle_count; i++) {
			particle = new Particle();
			particles.push(particle);
		}

		//BOUNCE MOFOS!
       	renderFrame();

}