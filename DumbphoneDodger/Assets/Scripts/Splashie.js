#pragma strict
var mainMenu : String;
var fadeSpeed : float = 1.2;
var holdFullAlpha : float = 1;
var splashTex : Texture2D;

private var splashieRect : Rect;
private var guiColor : Color;
private var fadeUp : boolean = true;

function Start () {
	guiColor = Color.white;
	guiColor.a = 0;
	//Invoke("LoadNextScene", timeToLoadNext);
	splashieRect = new Rect(0,0,512,512);
	splashieRect.center = new Vector2(Screen.width/2, Screen.height/2);
}

function OnGUI (){
	GUI.color = guiColor;
	GUI.DrawTexture(splashieRect, splashTex, ScaleMode.ScaleToFit);
}

function Update () {
	if (fadeUp == true){
		guiColor.a += Time.deltaTime * fadeSpeed;
	} else {
		guiColor.a -= Time.deltaTime * fadeSpeed;
	}
	if (guiColor.a >= holdFullAlpha){
		fadeUp = false;
		
	}
	if (guiColor.a < 0){
		LoadNextScene();
	}
}

function LoadNextScene (){
	Application.LoadLevel(mainMenu);
}