#pragma strict
var loserMusic : AudioClip;
var volumeOnPause : float = 0.15;
private var volumeOnStart : float;

function Start () {
	volumeOnStart = audio.volume;
}

function Update () {
	CheckIfPaused();

}

function Stop (){
	audio.Stop();
}

function PlayLoser (){
	audio.PlayOneShot(loserMusic);
}

function CheckIfPaused (){
	if (Time.timeScale == 0){
		audio.volume = volumeOnPause;
	} else {
		audio.volume = volumeOnStart;
	}
}