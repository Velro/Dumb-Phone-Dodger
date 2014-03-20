#pragma strict
var minSpeed : float = 1;
var maxSpeed : float = 5;
var turnAngle : float = 30;

var turnAgainThreshold : float = 0.2;
var pushDuration : float = 0.25;
var turnBackTime : float = 0.2;

private var controller : CharacterController;
private var timeCollided : float =0;
private var lastTimeHit : float = 0;
private var speed : float = 1;

private var startAngle : float = 0;
private var targetAngle : float = 0;
private var turnTime : float = 0;

private var pushed : boolean = false;
private var pushDirection : Vector3 = Vector3.zero;
private var lastTimePushed : float = 0;

var maxAngle : float = 30;
private var startingAngle : float = 0;

var lastCollided : GameObject;

function Start () {
	startingAngle = transform.eulerAngles.y;
	speed = Random.Range(minSpeed, maxSpeed);
	for (var state : AnimationState in animation) {
		state.time = Random.Range(0, state.length);
		state.speed = 0.75 + (speed/5);
	}
	controller = GetComponent(CharacterController);
	TurnBack();
}

function Update () {
	if (pushed){
		controller.Move(pushDirection * Time.deltaTime);
	} else {
		controller.Move(-transform.right * speed * Time.deltaTime);
	}
	if (Time.time > lastTimePushed + pushDuration){
		pushed = false;
	}
	transform.position.y = 0;
	if (transform.eulerAngles.y != 270)Invoke("TurnBack", turnBackTime);
}

function OnTriggerEnter (other : Collider){
	if (other.name == "Reloader")
		return;
	if (Time.time > lastTimeHit + turnAgainThreshold){
		if (gameObject.activeSelf == false)
			return;
		if (other.transform.position.z > transform.position.z)
			return;
		TurnAway(other);
		lastTimeHit = Time.time;
	}
	lastCollided = other.gameObject;
}

function OnTriggerStay (other : Collider){
	if (other.name == "Reloader")
		return;
		
	timeCollided += Time.deltaTime;
	if (timeCollided > turnAgainThreshold && Time.time > lastTimeHit + turnAgainThreshold){
		if (gameObject.activeSelf == false)
			return;
		TurnAway(other);
	} 
}

function OnTriggerExit (){
	timeCollided = 0;
}

function TurnAway (other : Collider){
	if (gameObject.activeSelf == false)
		return;
	//var r : float = Random.value;
	startAngle = transform.eulerAngles.y;
	if (other.transform.position.x > transform.position.x){
		transform.eulerAngles.y += turnAngle;
	} else {
		transform.eulerAngles.y -= turnAngle;
	}
}

function TurnBack (){
	if (gameObject.activeSelf == false)
		return;
	transform.eulerAngles.y = 270;
}

function Push (direction : Vector3){
	pushed = true;
	pushDirection = direction;
	lastTimePushed = Time.time;
}

