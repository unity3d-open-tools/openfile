#pragma strict

import System.IO;

public class OFReader {
	public static function LoadFile ( path : String ) : JSONObject {
		if ( !File.Exists ( path ) ) {
			Debug.LogError ( "OFReader | No such file '" + path + "'" );
			return null;
		}
		
		var sr : StreamReader = new File.OpenText( path );
		var input : String = "";
		var line : String = "";
		
		line = sr.ReadLine();
		
		while ( line != null ) {
			input += line;
			line = sr.ReadLine();
		}
	
		sr.Close();
		
		return new JSONObject ( input, -2, false, false );
	}

	public static function LoadScene ( parent : GameObject, path : String ) {
		var input : JSONObject = LoadFile ( path );

		for ( var i : int = 0; i < input.list.Count; i++ ) {
			var newObject : OFSerializedObject = OFDeserializer.Deserialize ( input.list[i] );
			newObject.transform.parent = parent.transform;
		}
	}
}
