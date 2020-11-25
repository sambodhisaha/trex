const PLAY = 1;
const OVER = 0;
var gs = PLAY;


var trex, trex_running, edges, trexStop;
var groundImage, ground, groundI, goImg;
var cloudImage, obs1, obs2, obs3, obs4, obs5, obs6;
var score = 0;
var rImg, restart;
var ckPoint, jump, die;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexStop = loadAnimation("collider.png")
  groundImage = loadImage("ground2.png")
  cloudImage = loadAnimation("cloud.png")
  obs1 = loadImage("obs1.png")
  obs2 = loadImage("obstacle2.png")
  obs3 = loadImage("obs3.png")
  obs4 = loadImage("obs4.png")
  obs5 = loadImage("obs5.png")
  obs6 = loadImage("obs6.png")
  goImg = loadImage("game over.png")
  rImg = loadImage("restart.png")
  ckPoint = loadSound("check.mp3")
  jump = loadSound("jump.mp3")
  die = loadSound("die.mp3")
}

function setup() {

  createCanvas(600, 200);

  // creating trex
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  edges = createEdgeSprites();

  trex.setCollider("rectangle", 0, 0, trex.width, 100);
  trex.addAnimation("stop", trexStop);


  trex.scale = 0.5;
  trex.x = 50

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage)

  groundI = createSprite(200, 190, 400, 20);
  groundI.visible = false;

  cloudGroup = new Group();
  obsGroup = new Group();

  ground.velocityX = -3;

  gameOver = createSprite(280, 80, 10, 10)
  gameOver.visible = false;
  restart = createSprite(280, 100, 10, 10)
  restart.visible = false;
}


function draw() {
  // console.log(frameCount);
  //set background color 
  background("white");


  text("score=" + score, 500, 40);
  // console.log("score="+score);
  //console.log("frameCount="+frameCount/60);


  console.log(Math.round(getFrameRate()))



  if (gs == PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    if (score % 100 == 0 && score > 0) {
      ckPoint.play();
      ground.velocityX--;
      obsGroup.setVelocityXEach(ground.velocityX);
    }
    if (ground.x < 0) {
      ground.x = 200;
    }
    if (keyDown("space") && trex.y > 150) {
      trex.velocityY = -10;
      jump.play();
    }
    trex.velocityY = trex.velocityY + 0.5;

    spawnClouds();
    spawnObs();
    if (trex.isTouching(obsGroup)) {
      gs = OVER;
      die.play();
      //trex.velocityY=-10;
    }
  } else if (gs == OVER) {

    ground.velocityX = 0;
    obsGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    trex.changeAnimation("stop", trexStop);
    trex.velocityY = 0;
    cloudGroup.setLifetimeEach(-200);
    obsGroup.setLifetimeEach(-200);
    gameOver.visible = true;
    gameOver.addImage(goImg)
    gameOver.scale = 0.5
    restart.visible = true;
    restart.addImage(rImg);
    restart.scale = 0.25;
    if (mousePressedOver(restart)) {
      reset();

    }
  }


  trex.collide(groundI)

  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 == 0) {
    var cloud1 = createSprite(600)
    cloud1.addAnimation("cloud", cloudImage)
    cloud1.y = random(1, 50);
    cloud1.velocityX = -3;
    cloud1.lifetime = 200;
    //console.log(cloud1.lifetime);
    cloud1.scale = 0.5
    cloud1.depth = trex.depth
    trex.depth++
    // console.log(cloud1.depth,trex.depth)
    cloudGroup.add(cloud1);

  }
}

function spawnObs() {
  if (frameCount % 60 == 0) {
    var obs = createSprite(590, 160, 10, 10);
    var rand = Math.round(random(1, 6))
    switch (rand) {
      case 1:
        obs.addImage(obs1);
        break;
      case 2:
        obs.addImage(obs2);
        break;
      case 3:
        obs.addImage(obs3);
        break;
      case 4:
        obs.addImage(obs4);
        break;
      case 5:
        obs.addImage(obs5);
        break;
      case 6:
        obs.addImage(obs6);
        break;
    }
    obs.velocityX = -3;
    obs.scale = 0.5;
    obs.lifetime = 200;
    obsGroup.add(obs);

  }

}

function reset() {
  ground.velocityX = -3;
  gs = PLAY;
  obsGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
  gameOver.visible = false;
  restart.visible = false;
}