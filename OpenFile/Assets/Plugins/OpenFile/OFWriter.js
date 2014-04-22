#pragma strict

import System.IO;

public class OFWriter {
	public static function SaveFile ( input : JSONObject, path : String ) {
		if ( OFWeb.IsWebPlayer () ) {
			OFWeb.Set ( path, input );

		} else {
			var sw : StreamWriter;
			
			if ( !File.Exists ( path ) ) {
				sw = File.CreateText ( path );
			} else {
				sw = new StreamWriter ( path );
			}
					
			sw.WriteLine ( input );
			sw.Flush();
			sw.Close();
		
		}
	}

	public static function SaveScene ( parent : GameObject, path : String ) {
		var allObjects : OFSerializedObject[] = parent.GetComponentsInChildren.<OFSerializedObject> ();
		var output : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

		for ( var i : int = 0; i < allObjects.Length; i++ ) {
			output.Add ( OFSerializer.Serialize ( allObjects[i] ) );
		}

		SaveFile ( output, path );
	}
}
