#pragma strict

var maxSpeed : float = 5;
var minSpeed : float = 10;
var speed : float = maxSpeed;
var turnAngle : float = 30;
var timeCollided : float = 0;
var turnAgainThreshold : float = 0.2;

function Start (){
	Random.Range(minSpeed, maxSpeed);
}

function FixedUpdate () {
	rigidbody.AddForce(-transform.right * speed);
}

function OnCollisionEnter (){
	TurnAway();
}

function OnCollisionStay (){
	
	timeCollided += Time.deltaTime;
	if (timeCollided > turnAgainThreshold){
		TurnAway();
	} 
}

function OnCollisionExit (){
	timeCollided = 0;
}

function TurnAway (){
	var r : float = Random.value;
	if (r > 0.5){
		transform.eulerAngles.y += turnAngle;
	} else {
		transform.eulerAngles.y -= turnAngle;
	}
}