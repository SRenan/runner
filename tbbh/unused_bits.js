/* ------------ Controls using velocity ----------*/
if(this.cursors.right.isDown){
    if(this.player.body.velocity.x <= 0){
        this.player.body.velocity.x = 10;
    } else{
        this.player.body.velocity.x += 10;
    }
}
if(this.cursors.left.isDown){
    if(this.player.body.velocity.x >= 0){
        this.player.body.velocity.x = -10;
    } else{
        this.player.body.velocity.x -= 10;
    }
}
if(this.cursors.up.isDown){
    if(this.player.body.velocity.y >= 0){
        this.player.body.velocity.y = -10;
    } else{
        this.player.body.velocity.y -= 10;
    }
}
if(this.cursors.down.isDown){
    if(this.player.body.velocity.y <= 0){
        this.player.body.velocity.y = 10;
    } else{
        this.player.body.velocity.y += 10;
    }
}

this.player.body.velocity.x = Math.sign(this.player.body.velocity.x)*Math.min(Math.abs(this.player.body.velocity.x), this.topPlayerSpeed);
this.player.body.velocity.y = Math.sign(this.player.body.velocity.y)*Math.min(Math.abs(this.player.body.velocity.y), this.topPlayerSpeed);

console.log(this.player.body.velocity.x);


/*--------------- controls without inertia-------------*/
        if(this.cursors.right.isDown){
            this.player.body.velocity.x = this.topPlayerSpeed;
            this.hasActiveInput = true;
        }
        if(this.cursors.left.isDown){
            this.player.body.velocity.x = -this.topPlayerSpeed;
            this.hasActiveInput = true;
        }
        if(this.cursors.up.isDown){
            this.player.body.velocity.y = -this.topPlayerSpeed;
            this.hasActiveInput = true;
        }
        if(this.cursors.down.isDown){
            this.player.body.velocity.y = this.topPlayerSpeed;
            this.hasActiveInput = true;
        }
        if(!this.hasActiveInput){
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
        }
        this.hasActiveInput = false;