#pragma strict
var background : Texture2D;
var whiteBox : Texture2D;
var textStyle : GUIStyle;
var justTextStyle : GUIStyle;

private var playRect : Rect;
private var highScoresRect : Rect;
private var creditsRect : Rect;
private var scoreLabelRect : Rect;

var startDelay : float = 3;
var timeStart : float = 0;
var time : float = 0;

var inHighScores : boolean = false;
var inCredits : boolean = false;

var keyboard : TouchScreenKeyboard;
var input : String;

function Awake (){
	PlayerPrefs.SetString("currentUserName", "AAA");
	/*PlayerPrefs.SetInt("latestScore", 75);	//testing
	PlayerPrefs.SetInt("Score0", 90);
	PlayerPrefs.SetInt("Score1", 80);
	PlayerPrefs.SetInt("Score2", 70);
	PlayerPrefs.SetInt("Score3", 60);
	PlayerPrefs.SetInt("Score4", 50);
	PlayerPrefs.SetInt("Score5", 40);
	PlayerPrefs.SetInt("Score6", 30);
	PlayerPrefs.SetInt("Score7", 20);
	PlayerPrefs.SetString("username0", "de0");
	PlayerPrefs.SetString("username1", "dp1");
	PlayerPrefs.SetString("username2", "dp2");
	PlayerPrefs.SetString("username3", "dp3");
	PlayerPrefs.SetString("username4", "rp4");
	PlayerPrefs.SetString("username5", "rp5");
	PlayerPrefs.SetString("username6", "rp6");
	PlayerPrefs.SetString("username7", "rp7");*/
	
	ArrangeScores();
	PlayerPrefs.Save();
}

function Start () {
	#if UNITY_ANDROID || UNITY_IPHONE	
		Screen.autorotateToLandscapeLeft = true;
		Screen.autorotateToLandscapeRight = true;
		Screen.autorotateToPortrait = false;
		Screen.autorotateToPortraitUpsideDown = false;
		Screen.orientation = ScreenOrientation.AutoRotation;
		playRect = new Rect(0,Screen.height - 140 - 10,240, 140);
		playRect.center.x = Screen.width/2;
		highScoresRect = playRect;
		highScoresRect.center.x = Screen.width/6;
		creditsRect = playRect;
		creditsRect.center.x = (Screen.width/6) * 5;
		scoreLabelRect = new Rect(0,0, 100, 40);
		scoreLabelRect.center.x = Screen.width/2;

	#else
		playRect = new Rect(0,0,Screen.width/10, Screen.height/20);
		playRect.center = new Vector2(Screen.width/2, (Screen.height/3)*2);
	#endif
	timeStart = Time.time;
	PlayerPrefs.SetInt("TutorialWatched", 0);
	PlayerPrefs.Save();
	Time.timeScale = 1;
}

function OnGUI () {
	GUI.DrawTexture(new Rect(0,0, Screen.width, Screen.height), background, ScaleMode.StretchToFill);
	if (GUI.Button(playRect, "Play", textStyle)){
		Application.LoadLevel("Scene");
	}
	if (GUI.Button(highScoresRect, "Scores", textStyle)){
		inHighScores = !inHighScores;
		//Debug.Log("hit");
	}
	if (GUI.Button(creditsRect, "Credits", textStyle)){
		inCredits = !inCredits;
	}
	if (inHighScores){
		var boxRect : Rect = new Rect(0,115,320, 455);
		boxRect.center.x = Screen.width/2;
		GUI.DrawTexture(boxRect, whiteBox, ScaleMode.StretchToFill);
		for (var i = 0; i < 8; i++){
			var thisScoreLabelRect : Rect = scoreLabelRect;
			thisScoreLabelRect.center = new Vector2((Screen.width/2), 160 + (i* 52)); // + 70
			var thisNameLabelRect : Rect = scoreLabelRect;
			thisNameLabelRect.center = new Vector2((Screen.width/2) - 70, 160 + (i * 52));
			GUI.Label(thisScoreLabelRect, PlayerPrefs.GetInt("Score"+i)+"", justTextStyle);
			//GUI.Label(thisNameLabelRect, PlayerPrefs.GetString("username"+i)+"", justTextStyle);
		}
	//	var usernameBackgroundRect : Rect = new Rect((Screen.width/2) + 200, 130, 215, 200);
	//	var usernameRect : Rect = 			new Rect((Screen.width/2) + 205,   0,  205, 95);
	//	GUI.DrawTexture(usernameBackgroundRect, whiteBox, ScaleMode.StretchToFill);//background rect
		
	//	var currentUsernameRect = usernameRect;
	//	currentUsernameRect.center.y = usernameBackgroundRect.center.y + 40;
	//	GUI.Label(currentUsernameRect, "WWW", justTextStyle);//current username
		
		//var changeUsernameRect = usernameRect;
		//changeUsernameRect.center.y = usernameBackgroundRect.center.y - 40;
		//if (GUI.Button(changeUsernameRect, "Sign in", textStyle)){//change name
		//	keyboard = TouchScreenKeyboard.Open("",TouchScreenKeyboardType.NamePhonePad,false,false,false,false,"AAA");
			
			//if (keyboard)
				//PlayerPrefs.SetString("currentUsername", keyboard.substring(0,3));
		//}
	}
	if (inCredits){
		var creditsBackgroundRect : Rect = new Rect(0,0,860, 400);
			creditsBackgroundRect.center = new Vector2(Screen.width/2, Screen.height/2);
		GUI.DrawTexture(creditsBackgroundRect, whiteBox, ScaleMode.StretchToFill);
		var ianRect : Rect = new Rect(0,0, 200, 100);
			ianRect.center = new Vector2(Screen.width/2, 260);
		var jamesRect : Rect = new Rect(0,0, 200, 100);
			jamesRect.center = new Vector2(Screen.width/2, 320);
		var gameplaySong : Rect = new Rect(0,0, 200, 100);
			gameplaySong.center = new Vector2(Screen.width/2, 380);
		var neckbeards : Rect = new Rect(0,0, 200, 100);
			neckbeards.center = new Vector2(Screen.width/2, 500);
		GUI.Label(ianRect, "Art, Design - Ian Atherton", justTextStyle);
		GUI.Label(jamesRect, "Code, Design - James Fulop", justTextStyle);
		GUI.Label(gameplaySong, "Title Song - Rolemusic", justTextStyle);
		GUI.Label(neckbeards, "A Neckbeard Ninjas Production", justTextStyle);
	}
}

function ArrangeScores (){
	if (PlayerPrefs.GetInt("latestScore") == 0)
		return;
	for (var i : int = 0; i < 8; i++){	
		if (PlayerPrefs.GetInt("latestScore") > PlayerPrefs.GetInt("Score"+i)){
			Insert(i);
			return;
		}
	}
	PlayerPrefs.Save();
}
function Insert (at : int){
	ShuffleDown(at);
	PlayerPrefs.SetInt("Score"+at, PlayerPrefs.GetInt("latestScore"));
	PlayerPrefs.SetString("username"+at, PlayerPrefs.GetString("currentUsername"));
}

function ShuffleDown(at : int){
	var storage : int = 0;
	for (var a : int = 7; a > at; a--){ 
		PlayerPrefs.SetInt("Score"+a, PlayerPrefs.GetInt("Score"+(a - 1)));
		PlayerPrefs.SetString("username"+a, PlayerPrefs.GetString("username"+(a-1)));
	}
}