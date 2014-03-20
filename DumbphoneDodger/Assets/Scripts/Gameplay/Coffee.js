#pragma strict

var sanityBoostAmount : float = 10;
//var speedOfShrink : float = 10000000;
//var originalScale : Vector3 = new Vector3(0.05, 0.05, 0.05);
var coffeeBank : GameObject;
//var pointOfReturn : Vector3 = new Vector3(0.01, 0.01, 0.01);
var baseSpeedIncreasePerCoffee = 0.05;
var scorePerRegCoffee : float = 10;
var scorePerBonusCoffee : float = 50;
var coffeePickup : AudioClip;

function OnTriggerEnter (other : Collider){
	if (other.gameObject.tag != "Player")
		return;
	
	if (other.gameObject.GetComponent(PlayerStats) == null)
		return;
		
	if (other.gameObject.GetComponent(PlayerStats).sanity == 90){
		other.gameObject.GetComponent(PlayerStats).score += scorePerBonusCoffee;
		//Debug.Log("bonsu1");
	} else {
		other.gameObject.GetComponent(PlayerStats).score += scorePerRegCoffee;
		//Debug.Log("reg");
	}
	other.gameObject.GetComponent(PlayerStats).sanity += sanityBoostAmount;
	other.gameObject.GetComponent(PlayerStats).ltHit = Time.time; //sprint
	other.gameObject.GetComponent(PlayerStats).lastHit = Time.time; //cooldown
	other.gameObject.GetComponent(PlayerMove).sprinting = true;
	other.gameObject.GetComponent(PlayerMove).speed += baseSpeedIncreasePerCoffee;
	other.gameObject.GetComponent(AudioSource).PlayOneShot(coffeePickup, 1);
	PortToBank(gameObject, coffeeBank);	
}
/*
function Update (){
	var s = Time.deltaTime / speedOfShrink;
	gameObject.transform.localScale -= new Vector3(s,s,s);
	//Debug.Log(s);
	if (gameObject.transform.localScale.x <= pointOfReturn.x){
		PortToBank(gameObject, coffeeBank);
	}
}
*/
function PortToBank(other : GameObject, bank : GameObject){
	other.transform.parent = bank.transform;
	other.transform.position = Vector3.zero;
	//other.transform.localScale = originalScale;
	other.SetActive(false);
}