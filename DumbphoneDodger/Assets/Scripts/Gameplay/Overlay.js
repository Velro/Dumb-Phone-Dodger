#pragma strict
var player : GameObject;

var winner : AudioClip;
var loser : AudioClip;
var audioStuffOnce : boolean = true;
var audioStuffTwice : boolean = true;
var timeLost : float = 0;
var delayToVoice : float = 0.5;

var sprintLabel : GUIStyle;
var outline : GUIStyle;
var scoreStyle : GUIStyle;
var sanityIcon : GUIStyle;
var sprintIcon : GUIStyle;
var sprintButton : GUIStyle;
var loseStyle : GUIStyle;
var pausedStyle : GUIStyle;

//var pauseOverlay : Texture2D;

var pausedCooldown : float = 0.25;
private var lastTimePausedHit : float = 0;

private var scoreRect : Rect;

private var maxSanity : float;
 var sanityPercent : float = 1;
private var maxSprint : float;

 var sprintCooldownPercent : float = 1;
 var sprintDurationPercent : float = 1;
 
private var score : float = 0;

var paused : boolean = false;
var lost : boolean = false;

var delayBeforeContinue : float = 2;
var lostTime : float = 0;

private var sanityIconRect1 : Rect;
private var sanityIconRect2 : Rect;
private var sanityIconRect3 : Rect;
private var sanityIconRect4 : Rect;
private var sanityIconRect5 : Rect;

var sanityBool1 : boolean = true;
var sanityBool2 : boolean = true;
var sanityBool3 : boolean = false;
var sanityBool4 : boolean = false;
var sanityBool5 : boolean = false;

private var sprintRect : Rect;
var sprintBool : boolean = true;

private var leftTutorialRect : Rect;
private var rightTutorialRect : Rect;
private var centerTutorialRect : Rect;

private var leftSprintRect : Rect;
var canSprint : boolean = false;
private var rightSprintRect : Rect;

var levelStartTime : float = 0;

var currentStats : PlayerStats;

function Awake (){
	leftSprintRect = new Rect (0,0,320, 160);
	leftSprintRect.center = new Vector2(Screen.width/8,Screen.height/3);

	rightSprintRect = leftSprintRect;
	rightSprintRect.center = new Vector2((Screen.width/8)*7, Screen.height/3);
}

function Start () {
	#if UNITY_ANDROID || UNITY_IPHONE
		var modelRect : Rect = new Rect(0, 10, 95, 95);
		scoreRect = new Rect(0, 10, 95, 95);
		scoreRect.center.x = Screen.width/2;
		sanityIconRect1 = modelRect;
		sanityIconRect1.center.x = (Screen.width/14);
		sanityIconRect2 = modelRect;
		sanityIconRect2.center.x = (Screen.width/14)+90;
		sanityIconRect3 = modelRect;
		sanityIconRect3.center.x = (Screen.width/14)+180;

		
	 	sprintRect = new Rect(0,10,120,120);
 		sprintRect.center.x = Screen.width - sprintRect.width - 10;
 		
 		leftTutorialRect = new Rect(0,0, Screen.width/4, Screen.height);
 		rightTutorialRect = new Rect((Screen.width/4)*3, 0, Screen.width/4, Screen.height);
 		//centerTutorialRect = new Rect(Screen.width/4, 0, (Screen.width/4)*3, Screen.height);
 		

	#else
		var modelRect : Rect = new Rect(0, 0, 40, 40);
		scoreStyle.fontSize = 12;
		scoreRect = new Rect(0,0,Screen.width/6, Screen.height/14);
		scoreRect.center = new Vector2(Screen.width/2, Screen.height/12);
		sanityIconRect1 = modelRect;
		sanityIconRect1.center = new Vector2((Screen.width/16), Screen.height/12);
		sanityIconRect2 = modelRect;
		sanityIconRect2.center = new Vector2((Screen.width/16)*2, Screen.height/12);
		sanityIconRect3 = modelRect;
		sanityIconRect3.center = new Vector2((Screen.width/16)*3, Screen.height/12);
		
	 	sprintRect = modelRect;
 		sprintRect.center = new Vector2((Screen.width/6)*5, Screen.height/12);
	#endif
	player = GameObject.FindWithTag("Player");
	maxSanity = 100;
	maxSprint = player.GetComponent(PlayerStats).sprint;
	levelStartTime = Time.realtimeSinceStartup;
}

function OnGUI(){
	var stats = player.GetComponent(PlayerStats);
	sprintCooldownPercent = Time.time - (stats.ltHit + stats.sprintCooldown);
	sprintDurationPercent = Time.time - (stats.ltHit + stats.sprintDuration);
	//Debug.Log(Time.time+" "+(player.GetComponent(PlayerStats).ltHit - player.GetComponent(PlayerStats).sprintCooldown));
	if (PlayerPrefs.GetInt("TutorialWatched") == 0){
		Time.timeScale = 0;
		//Debug.Log(Time.realtimeSinceStartup - levelStartTime);
		if (Time.realtimeSinceStartup - levelStartTime < 1.5)
			GUI.Label(leftTutorialRect, "Move Left", outline);
		if (Time.realtimeSinceStartup - levelStartTime  > 1.5 && Time.realtimeSinceStartup - levelStartTime  < 3)
			GUI.Label(rightTutorialRect, "Move Right", outline);
		if (Time.realtimeSinceStartup - levelStartTime  > 3){
			PlayerPrefs.SetInt("TutorialWatched", 1);
			PlayerPrefs.Save();
			Time.timeScale = 1;
		}	
		
	}

	GUI.Label(scoreRect, score.ToString(), scoreStyle);

	scoreRect.center.x = Screen.width/2;
	sanityBool1 = GUI.Toggle(sanityIconRect1, sanityBool1, "", sanityIcon);
	sanityBool2 = GUI.Toggle(sanityIconRect2, sanityBool2, "", sanityIcon);
	sanityBool3 = GUI.Toggle(sanityIconRect3, sanityBool3, "", sanityIcon);
	
	sprintBool = sprintCooldownPercent < 1 ? false : true;
	sprintBool = GUI.Toggle(sprintRect, sprintBool, "", sprintIcon);
	
	if (!lost){
		if (Time.time < player.GetComponent(PlayerStats).ltHit + player.GetComponent(PlayerStats).sprintDuration){
			GUI.Label(leftSprintRect, "Sprint", sprintLabel);//red
			GUI.Label(rightSprintRect, "Sprint", sprintLabel);
		}
		if (Time.time > player.GetComponent(PlayerStats).ltHit + player.GetComponent(PlayerStats).sprintDuration){
			GUI.Label(leftSprintRect, "Sprint", sprintButton);//blue
			GUI.Label(rightSprintRect, "Sprint", sprintButton);
			if (sprintCooldownPercent >= 1 && !lost){
				for (var t : Touch in Input.touches){
					var p : Vector2 = t.position;
					p.y = Screen.height - t.position.y;
					
					if (leftSprintRect.Contains(p) || rightSprintRect.Contains(p)){
						player.GetComponent(PlayerStats).ltHit = Time.time;
						player.GetComponent(PlayerMove).sprinting = true;
					}
				}
			}
		}
	}
	if (lost){
		if (audioStuffOnce){
			var m = GameObject.Find("Music");
			m.SendMessage("Stop");
			timeLost = Time.realtimeSinceStartup;
		}
		var loserRect : Rect = new Rect(0,0,960, 260);
		loserRect.center = new Vector2(Screen.width/2, Screen.height/2);
		var str : String = "You went insane!\n";
		//GUI.Label(loserRect2, "Press any button to continue", scoreStyle);
		if (PlayerPrefs.GetInt("Score0") < Mathf.RoundToInt(score)){
			str = str + "New high score! " + Mathf.RoundToInt(score) + "\n";
			if (audioStuffTwice && Time.realtimeSinceStartup > timeLost + delayToVoice){
				PlayWinnerSound();
				audioStuffTwice = false;
			}
		} else {
			str = str + "Current high score "+PlayerPrefs.GetInt("Score0") + "\n";
			if (audioStuffTwice && Time.realtimeSinceStartup > timeLost + delayToVoice){
				PlayLoserSound();
				audioStuffTwice = false;
			}
		}
		GUI.Label(loserRect, str, loseStyle);
		PlayerPrefs.SetInt("latestScore", Mathf.RoundToInt(score));
		audioStuffOnce = false;
	}
	
	if (paused){
		//GUI.DrawTexture(Rect(0,0,Screen.width, Screen.height), pauseOverlay, ScaleMode.StretchToFill);
		var pausedRect : Rect = new Rect(0,0,Screen.width, Screen.height);
		pausedRect.center = new Vector2(Screen.width/2, Screen.height/2);
		GUI.Label(pausedRect, "Paused", pausedStyle);
	}
}


function Update () {
	currentStats = player.GetComponent(PlayerStats);
	sanityPercent = Mathf.Clamp01(currentStats.sanity / maxSanity);

	score = Mathf.RoundToInt(currentStats.score);
	sanityBool1 = sanityPercent >= 0.3 ? true : false;
	sanityBool2 = sanityPercent >= 0.6 ? true : false;
	sanityBool3 = sanityPercent >= 0.9 ? true : false;
	if (score.ToString().Length > 3){
		scoreRect.width = 205;
	} else if (score.ToString().Length > 2){
		scoreRect.width = 170;
	} else if (score.ToString().Length > 1){
		scoreRect.width = 135;
	}
	if (Input.GetButtonDown("Pause") && Time.realtimeSinceStartup > lastTimePausedHit + pausedCooldown){
		paused = !paused;
		lastTimePausedHit = Time.realtimeSinceStartup;
	}
	if (paused){
		Time.timeScale = 0;
	}
	if (!paused){
		Time.timeScale = 1;
	}
	if (sanityPercent == 0){
		if (lost == false){
			lost = true;
			lostTime = Time.realtimeSinceStartup;
		}
	}
	
	if (lost){
		Time.timeScale = 0;
//		Debug.Log(Time.realtimeSinceStartup+"	"+lostTime + delayBeforeContinue);
		if (Time.realtimeSinceStartup > lostTime + delayBeforeContinue){ 
			if (Input.anyKeyDown){
				PlayerPrefs.Save();
				Application.LoadLevel("MainMenu");
			}
		}
	}
}

function OnApplicationPause (pauseStatus : boolean){
	if (pauseStatus == true)
		paused = true; 
}

function PlayLoserSound(){
	audio.PlayOneShot(loser);
}

function PlayWinnerSound (){
	audio.PlayOneShot(winner);
}
