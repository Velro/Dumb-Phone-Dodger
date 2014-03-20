#pragma strict
var moveDirection : Vector3;
var speed : float = 1;
var leftRightSpeed : float = 1;
var sprintMod : float = 2;
//var sprintLossPerSecond : float = 1;
var pushPower : float = 2;
var turnAmount : float = 45;
private var controller : CharacterController;
private var professorMesh : GameObject;

var sprinting : boolean = false;
var left : boolean = false;
var right : boolean = false;

function Start () {
	controller = GetComponent(CharacterController);
	professorMesh = transform.FindChild("professor_mesh").gameObject;
	
	#if UNITY_ANDROID || UNITY_IPHONE	
		Screen.autorotateToLandscapeLeft = true;
		Screen.orientation = ScreenOrientation.AutoRotation;
	#endif
}
var touchCount : float = 0;
function Update () {
	if (Time.timeScale == 0)
		return;
	
	#if UNITY_ANDROID || UNITY_IPHONE
	if (Input.touchCount > 0){
		touchCount = Input.touchCount;
		/*if (Input.touchCount > 1){
			if (((Input.GetTouch(0).position.x > Screen.width/5 && Input.GetTouch(0).position.x < (Screen.width/5)*4) || 
				(Input.GetTouch(1).position.x > Screen.width/5 && Input.GetTouch(1).position.x < (Screen.width/5)*4)) &&
				Time.time > GetComponent(PlayerStats).ltHit + GetComponent(PlayerStats).sprintCooldown){
				sprinting = true;
				GetComponent(PlayerStats).ltHit = Time.time;
				//Debug.Log("sprinting");
			}
		}*/
		if (Input.GetTouch(0).position.x < Screen.width/4){
			left = true;
			right = false;
			//Debug.Log("left");
		} else if (Input.GetTouch(0).position.x > (Screen.width/4) * 3){
			left = false;
			right = true;
			//Debug.Log("right");
		}
	} else {
		professorMesh.transform.localEulerAngles.y = 0;
		left = false;
		right = false;
	}
	
	if (left){
		professorMesh.transform.localEulerAngles.y = -turnAmount;
		if (sprinting){
			//Debug.Log("sprinting");
			professorMesh.GetComponent(Animator).speed = 1.5;
			moveDirection = Vector3(-1 * leftRightSpeed * sprintMod, 0, speed);
		} else {
			professorMesh.GetComponent(Animator).speed = 1.0;
			moveDirection = Vector3(-1 * leftRightSpeed, 0, speed);
		}
	} else if (right){
		professorMesh.transform.localEulerAngles.y = turnAmount;
		if (sprinting){
			//Debug.Log("sprinting");
			professorMesh.GetComponent(Animator).speed = 1.5;
			moveDirection = Vector3(1 * leftRightSpeed * sprintMod, 0, speed);
		} else {
			professorMesh.GetComponent(Animator).speed = 1.0;
			moveDirection = Vector3(1 * leftRightSpeed, 0, speed);
		}
	} else {
		moveDirection = Vector3(0, 0, speed);
	}
	if (Time.time > GetComponent(PlayerStats).ltHit + GetComponent(PlayerStats).sprintDuration)
		sprinting = false;
	if (sprinting)
		moveDirection.z = Mathf.Lerp(speed, speed * sprintMod, Time.time);
	controller.Move(moveDirection * Time.deltaTime);
	#else
	
	
	
	
	var horizontal = Input.GetAxis("Horizontal");
	//vertical = Mathf.Clamp01(Input.GetAxis("Vertical"));	//no backwards movement
	if (Input.GetButtonDown("Fire1") && Time.time > GetComponent(PlayerStats).ltHit + GetComponent(PlayerStats).sprintCooldown){	
		sprinting = true;
		GetComponent(PlayerStats).ltHit = Time.time;
	}
	if (sprinting){
		moveDirection = Vector3(horizontal * leftRightSpeed * sprintMod, 0, speed);
		//if (moveDirection.magnitude > 0)
			//GetComponent(PlayerStats).sprint -= sprintLossPerSecond * Time.deltaTime;
		professorMesh.GetComponent(Animator).speed = 1.5;
		if (Mathf.Clamp01(Time.time - (player.GetComponent(PlayerStats).ltHit + player.GetComponent(PlayerStats).sprintDuration) == 1 && Mathf.Clamp01(Time.time - (player.GetComponent(PlayerStats).ltHit + player.GetComponent(PlayerStats).sprintCooldown) < 1))
			sprinting = false;
	} else {
		moveDirection = Vector3(horizontal * leftRightSpeed, 0, speed);
		professorMesh.GetComponent(Animator).speed = 1.0;
	}
	if (horizontal < 0){
		professorMesh.transform.localEulerAngles.y = -turnAmount;
	} else if (horizontal > 0){
		professorMesh.transform.localEulerAngles.y = turnAmount;
	} else {
		professorMesh.transform.localEulerAngles.y = 0;
	}
	controller.Move(moveDirection * Time.deltaTime);
	#endif
}

function OnTriggerEnter(other : Collider){
	if (other.gameObject.tag != "enemy")
		return;
	
	var thisPushPower : float = pushPower;
	var pushDirection : Vector3 = Vector3.Normalize(other.transform.position - transform.position);
	if (sprinting)thisPushPower = pushPower * 3.5;
	other.gameObject.SendMessage("Push", pushDirection * thisPushPower);
	//Debug.Log("push " + pushDirection * pushPower);
}
