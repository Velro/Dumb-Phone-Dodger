#pragma strict

var player : GameObject;
var distanceToRemove : float = 80;
var bank : Transform;
var starting : boolean = false;

function Awake(){
	bank = GameObject.FindWithTag("settingBank").transform;	
	player = GameObject.FindWithTag("Player");
}

function Update (){
	if (transform.parent == null){//if in the bank
		CheckDistance();
	}
}

function OnTriggerEnter (other : Collider){
	if (other.gameObject.tag != "Player" || transform.parent)
		return;
	var heading : float = other.gameObject.GetComponent(PlayerMove).moveDirection.z;
	if (heading > 0){//forward
		var l : Vector3 = transform.position;
		l.z += 40;
		l.y = 0;
		//Debug.Log(l);
		Spawn(bank, l);
		//Debug.Log("forward");
	}
	/*
	if (heading < 0){//backward
		var k : Vector3 = transform.position;
		k.z -= 40;
		k.y = 0;
		Spawn(bank, k);
		//Debug.Log("backward");
	}*/
}

function CheckDistance (){
	if (Vector3.Distance(transform.position, player.transform.position) > distanceToRemove){
		PortToBank(gameObject.transform, bank);
		//Debug.Log("Dropped due to distance");
	}
}

function PortToBank(other : Transform, bank : Transform){
	other.parent = bank;
	other.position = Vector3.zero;
	//other.gameObject.SetActive(false);
}

function Spawn (bank : Transform, position : Vector3){
	var w : GameObject = bank.GetChild(0).gameObject;
	w.transform.parent = null;
	w.transform.position = position;
	//w.SetActive(true);
	return w;
}