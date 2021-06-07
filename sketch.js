var dog, happyDog, database;
var foodS, FoodStock;
var fedTime, lastFed,currentTime;
var feed, addFood;
var foodObj;
var dogimg, happyDogImg;
var changeState, readState,gameState;
var bedroomImg, washroomImg, gardenImg;

function preload() {
  dogimg= loadImage("images/Dog.png");
  happyDogImg= loadImage("images/Happy.png");
  bedroomImg= loadImage("images/Wash Room.png");
  washroomImg=loadImage("images/Bed Room.png");
  gardenImg= loadImage("images/Garden.png");
}

function setup(){
  createCanvas(1000,400);
  database= firebase.database();

  foodObj= new Food();

  FoodStock=database.ref('Food');
  FoodStock.on("value",readStock);

  fedTime= database.ref('FeedTime');
   fedTime.on("value",function(data) { 
      lastFed=data.val()
   })

   
readState=database.ref('gameState');
readState.on("value",function(data){
  gameState= data.val();
})

  dog= createSprite(800,200,150,150);
  dog.addImage(dogimg);
  dog.scale= 0.5;

feed= createButton("Feed The Dog");
feed.position(700,95);
feed.mousePressed(feedDog);

addFood= createButton("Add Food");
addFood.position(800,95);
addFood.mousePressed(addFoods);




}

function draw() {
   currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

  

 if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }
    else{
      feed.show();
      addFood.show();
      dog.addImage(dogimg);
    }


      

    drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState: "Hungry"
  })
}


//function to add food in stock
function addFoods(){
foodS++;
database.ref('/').update({
  Food:foodS
})
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}







