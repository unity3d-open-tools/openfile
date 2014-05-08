#pragma strict

import System.IO;

public class OFReader {
	public static function LoadFile ( path : String ) : JSONObject {
		#if UNITY_WEBPLAYER && !UNITY_EDITOR
			return OFWeb.Get ( path );
		#else
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
		#endif
	}

	public static function LoadChildren ( parents : Transform[], path : String ) {
		OFDeserializer.DeserializeChildren ( LoadFile ( path ), parents );
	}

	public static function LoadScene ( parent : GameObject, path : String ) {
		var input : JSONObject = LoadFile ( path );

		for ( var i : int = 0; i < input.list.Count; i++ ) {
			var newObject : OFSerializedObject = OFDeserializer.Deserialize ( input.list[i] ) as OFSerializedObject;
			newObject.transform.parent = parent.transform;
		}
	}
}
