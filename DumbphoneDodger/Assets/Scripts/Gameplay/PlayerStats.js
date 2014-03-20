#pragma strict
var sanity : float = 100;
var sprint : float = 100;
var score : float = 0;
//var sprintRestorePerSecond : float = 2;

var invincibleDuration : float = 0.4;
@System.NonSerializedAttribute
var lastHit : float = 0;

var renderers : Component[];
var t : Transform;

var invincible : boolean = false;

var sprintCooldown : float = 3;
var sprintDuration : float = 2;
@System.NonSerializedAttribute
var ltHit : float = 0;

var onHitSound : AudioClip;

function Start (){
	t = transform.Find("professor_mesh");
	renderers = t.GetComponentsInChildren(MeshRenderer);
}

private var switchColor : boolean = true;
function Update (){
	score += GetComponent(PlayerMove).speed * Time.deltaTime;
	if (sanity > 90)sanity = 90;
	//if (sprint < 100)
	//	sprint += sprintRestorePerSecond * Time.deltaTime;
		
	if (Time.time < lastHit + invincibleDuration && Time.time > 2 && Time.timeScale == 1){
		for (var r : Renderer in renderers){
			if (switchColor){
				r.material.color = Color.grey;
			} else {
				r.material.color = Color.white;
			}
			switchColor = !switchColor;
		}
	} else if (!switchColor && Time.timeScale == 1){
		for (var r : Renderer in renderers){
			r.material.color = Color.white;
		}
		switchColor = true;
	}
	
	if (invincible)sanity = 100;
}

function OnTriggerEnter(other : Collider){
	//Debug.Log("collision");
	if (Time.time < lastHit + invincibleDuration)
		return;
		
	//Debug.Log("not invincible");
	if (other.gameObject.tag != "enemy")
		return;
		
	//Debug.Log("enemy");
	if (other.gameObject.GetComponent(SanityLoss) == null)
		return;
	
	//Debug.Log("sanity loss");
	sanity -= other.gameObject.GetComponent(SanityLoss).sanityLossAmount;
	lastHit = Time.time;
	audio.PlayOneShot(onHitSound, 1);
	Handheld.Vibrate();
}