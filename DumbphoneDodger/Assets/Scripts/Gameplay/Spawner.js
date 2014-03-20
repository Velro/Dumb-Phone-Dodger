#pragma strict
var minCool : DifficultyStats;
var maxCool : DifficultyStats;

var walkerBank : Transform;
var coffeeBank : Transform;
var coffeeThreshold : DifficultyStats;

var walkerMinSpeed : DifficultyStats;
var walkerMaxSpeed : DifficultyStats;

private var currentCool : float = 3;
private var ltSpawned : float = 0;
private var coffeeRoll : float = 0;

private var player : GameObject;
private var score : float;

class DifficultyStat extends System.Object {
	//@System.NonSerializedAttribute
	var v : float;
	var startValue : float;
	var endValue : float;
	var startAtScore : float;
	var endAtScore : float;
	//@System.NonSerializedAttribute
	var progress : float = 0;
}

class DifficultyStats extends System.Object {
	var a : DifficultyStat[];
	var currentStat : int = 0;
}

function Start () {
	Initialize(minCool);
	Initialize(maxCool);
	Initialize(coffeeThreshold);
	Initialize(walkerMinSpeed);
	Initialize(walkerMaxSpeed);
	currentCool = Random.Range(minCool.a[minCool.currentStat].v, maxCool.a[maxCool.currentStat].v);
	coffeeRoll = Random.value;
	player = GameObject.FindWithTag("Player");
}

function Update () {
	CheckScore();
	LinearIncrease(minCool);
	LinearIncrease(maxCool);
	LinearIncrease(coffeeThreshold);
	LinearIncrease(walkerMinSpeed);
	LinearIncrease(walkerMaxSpeed);
	if (Time.time > ltSpawned + currentCool){
		if (coffeeRoll > coffeeThreshold.a[coffeeThreshold.currentStat].v){
			Spawn(coffeeBank);
		} else {
			Spawn(walkerBank);
		}
	}
	
}

function Spawn (bank : Transform){
	if (bank.GetChild(0) == null)
		return;
	
	var ranChild : int = Mathf.Floor(Random.Range(0, bank.childCount));
	var w : GameObject = bank.GetChild(ranChild).gameObject;
	w.transform.parent = null;
	w.transform.position = transform.position;
	if (w.tag == "enemy"){
		w.transform.eulerAngles = Vector3(0,270,0);
		w.GetComponent(EnemyController).minSpeed = walkerMinSpeed.a[walkerMinSpeed.currentStat].v;
		w.GetComponent(EnemyController).maxSpeed = walkerMaxSpeed.a[walkerMaxSpeed.currentStat].v;
	}
	if (w.tag == "coffee"){
		w.transform.position.y += 0.2;
	}
	w.SetActive(true);
	ltSpawned = Time.time;
	currentCool = Random.Range(minCool.a[minCool.currentStat].v, maxCool.a[maxCool.currentStat].v);
	coffeeRoll = Random.value;
}

function CheckScore (){
	score = player.GetComponent(PlayerStats).score;
}

function LinearIncrease(stats : DifficultyStats){
	if (stats.a[stats.currentStat].startAtScore > score || stats.a[stats.currentStat].endAtScore < score)
		return;
	stats.a[stats.currentStat].progress = (score - stats.a[stats.currentStat].startAtScore) / (stats.a[stats.currentStat].endAtScore - stats.a[stats.currentStat].startAtScore);
	stats.a[stats.currentStat].v = Mathf.Lerp(stats.a[stats.currentStat].startValue, stats.a[stats.currentStat].endValue, stats.a[stats.currentStat].progress);
	if (Mathf.RoundToInt(stats.a[stats.currentStat].progress) >= 1 && stats.currentStat < stats.a.length-1){
		stats.currentStat += 1;
		//Debug.Log("dingding");
	}
}

function Initialize (stats : DifficultyStats){
	for (var i : int =0; i < stats.a.length; i++){
		stats.a[i].v = stats.a[i].startValue;
	}
}