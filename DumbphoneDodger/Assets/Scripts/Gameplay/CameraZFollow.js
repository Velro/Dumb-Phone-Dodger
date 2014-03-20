#pragma strict
var player : GameObject;
var distanceFromPlayer : float = 3;
private var speed : float = 0;

function Start () {
	player = GameObject.FindWithTag("Player");
	speed = player.GetComponent(PlayerMove).speed;
}

function Update () {
	transform.position.z = player.transform.position.z - distanceFromPlayer;
}