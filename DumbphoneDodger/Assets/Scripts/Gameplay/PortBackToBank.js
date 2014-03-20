#pragma strict
var walkerBank : GameObject;
var coffeeBank : GameObject;

function OnTriggerEnter (other : Collider){
	if (other.gameObject.tag == "enemy"){
		PortToBank(other.gameObject, walkerBank);
	}
	if (other.gameObject.tag == "coffee"){
		PortToBank(other.gameObject, coffeeBank);
	}
}

function PortToBank(other : GameObject, bank : GameObject){
	other.transform.parent = bank.transform;
	other.transform.position = Vector3.zero;
	other.transform.eulerAngles = Vector3.zero;
	other.SetActive(false);
}