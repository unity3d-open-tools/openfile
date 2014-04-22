#pragma strict

public class SaveManager extends MonoBehaviour {
	public function SaveGame () {
		OFWriter.SaveScene ( gameObject, Application.dataPath + "/SaveData/saved.json" );
	}
	
	public function LoadGame () {
		for ( var o : OFSerializedObject in OFSerializedObject.GetAllInScene() ) {
			Destroy ( o.gameObject );
		}

		OFReader.LoadScene ( gameObject, Application.dataPath + "/SaveData/saved.json" );
	}
}
