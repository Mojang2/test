var preset = function(){
                	noStroke();
                	noFill();
                
                	fontDefine("Russo One", "Londrina Solid");
                };
                
                preset();
                
                	/*GAME CONSTANTS*/
                
                	var 
                BULLET_SPEED = 10,
                GRAVITY		 = 1 / 300,
                
                PALETTE = [
                	
                ];
                
                	/*PLAYER*/
                
                var player = {
                	x : 4.0, y : 0.0, z : 4.0,
                	w : 0.7, h : 2.8, l : 0.7,
                
                	prev : {
                		x : 0, y : 0, z : 0,
                	},
                
                	fov :   Math.PI / 2,
                
                	yaw :   0,    pitch : 0,
                	speed : 0.05, jump :  0,
                
                	canJump : false,
                };
                
                player.control = function(){
                	//Mouse control
                	this.yaw -=   mouse.dx * Math.PI / 1000 * TIME.dt;
                	this.pitch -= mouse.dy * Math.PI / 1000 * TIME.dt;
                
                	this.pitch = Math.min(
                				 Math.max(this.pitch, -Math.PI / 2.35),	
                				 					   Math.PI / 2.35);
                
                	this.prev.x = this.x;
                	this.prev.y = this.y;
                	this.prev.z = this.z;
                	
                	//Key control
                	if(keys.UP || keys.W){
                		this.z += this.speed *  Math.cos(this.yaw) * TIME.dt;
                		this.x += this.speed * -Math.sin(this.yaw) * TIME.dt;
                	}
                	if(keys.DOWN || keys.S){
                		this.z -= this.speed *  Math.cos(this.yaw) * TIME.dt;
                		this.x -= this.speed * -Math.sin(this.yaw) * TIME.dt;
                	}
                
                	if(keys.RIGHT || keys.D){
                		this.z += this.speed *  Math.sin(this.yaw) * TIME.dt;
                		this.x += this.speed *  Math.cos(this.yaw) * TIME.dt;
                	}
                	if(keys.LEFT || keys.A){
                		this.z -= this.speed *  Math.sin(this.yaw) * TIME.dt;
                		this.x -= this.speed *  Math.cos(this.yaw) * TIME.dt;
                	}
                
                	if(keys.SPACE && this.canJump){
                		this.jump =    -0.1;
                		this.canJump = false;
                	}
                	if(keys.SHIFTLEFT || 
                	   keys.SHIFTRIGHT){
                		this.y += this.speed * TIME.dt;
                	}
                
                	if(!this.canJump || !this.collide){
                		this.jump += GRAVITY *   TIME.dt;
                		this.y +=    this.jump * TIME.dt;
                
                		this.canJump = false;
                	} else {
                		if(this.collide){
                			this.jump = 0;
                		}
                	}
                	
                	if(this.y > 50){
                	    this.x = 2.5;
                	    this.z = 2.5;
                	    this.y = -10;
                	}
                };
                
                	/*GAME ASSETS*/
                
                var Block = function(x, y, z, w, h, l, id, type){
                	this.x = x;
                	this.y = y;
                	this.z = z;
                
                	this.w = w;
                	this.h = h;
                	this.l = l;
                
                	this.id = id;
                
                	method = "";
                
                	if(type === "none"){
                		method = "none";
                	} else if(type === "liquid"){
                		method = "cuboidVcuboid";
                	} else {
                		method = "collisionAdjust";
                	}
                
                	this.method = method;
                };
                
                Block.prototype.update = function(){
                	Object3D.Cuboid(
                		this.x, this.y, this.z,
                		this.w, this.h, this.l,
                		PALETTE[this.id]);
                };
                
                //In case of long loops
                var resetTimer = function (n) {
                    var setInf = "KAInfiniteLoopSetTimeout";
                    
                    if (setInf in this) {
                        if(typeof this[setInf] === "function"){
                            this[setInf](n);
                        }
                    }
                };
                
                
                
                	/*GAME FUNCTION*/
               
               function game(){
                    try {
                        resetTimer(Math.POSITIVE_INFINITY);
                    	requestAnimationFrame(game);
                    
                    	TIME.update();
                    	TIME.fpsCounter("black");
                    
                    	EngineMECH.revert();
                    	Engine3D.revert();
                    
                    	background(215, 151, 66);
                    
                    	for(let i = 0; i < 7; i++){
                    		for(let j = 0; j < 7; j++){
                    			cubes.push([i, 10 - Math.abs(i) - Math.abs(j), j, 1, 1, 1, color(255, i * 30, j * 30), 0, 0, 0, "block", "collisionAdjust"])
                    		}
                    	}
                    	
                    	for (let i = 0; i < cubes.length; i ++) {
                    	    Object3D.Cuboid(cubes[i][0], cubes[i][1], cubes[i][2], cubes[i][3], cubes[i][4], cubes[i][5], cubes[i][6], cubes[i][7], cubes[i][8], cubes[i][9], cubes[i][10], cubes[i][11], cubes[i][12]);
                    	}
                    	
                    	
                    	/*Object3D.Cuboid(
                    				i,
                    				10 - Math.abs(i) - Math.abs(j),
                    				j, 1, 1, 1,
                    				color(255, i * 30, j * 30),
                    				0, 0, 0,
                    				"block",
                    				"collisionAdjust");
                    	*/
                    
                    	Light.update();
                    	Camera.update();
                    	Camera.FPSfollow(player);
                    	
                    	player.control();
                    
                    	EngineMECH.run(player);
                    	Engine3D.render();
                    
                    	fill(255);
                    	stroke(0);
                    	font("Londrina Solid", width / 10);
                    	align("CENTER", "CENTER");
                    	text("Engine3D v1.00", width / 2, 100, width / 240);
                        
                        font("Russo One", width / 25);
                        text("Mouse to move view [ESC]", width / 2, height - 50, width / 480);
                        text("Arrow / WASD + SPACE to move", width / 2, height - 20, width / 480);
                    	mouse.reset();
                    } catch(err){
                        throw "Please reload the page"
                    }
                };
                
                game();
