﻿#pragma strict

public class OFSerializer extends MonoBehaviour {
	private static var plugins : OFPlugin[];
	
	public static function GetPlugin ( type : System.Type ) : OFPlugin {
		if ( !plugins ) {
			plugins = OFReflector.GetPlugins ();
		}
		
		for ( var i : int = 0; i < plugins.Length; i++ ) {
			if ( plugins[i].CheckType ( type ) ) {
				return plugins[i];
			}
		}

		return null;
	}

	public static function CanSerialize ( type : System.Type ) : boolean {
		return CanSerialize ( type.ToString () );
	}

	public static function CanSerialize ( type : String ) : boolean {
		var str : String = type;
		str = str.Replace ( "UnityEngine.", "" );
		var strings : String[] = OFField.GetTypeStrings ();

		for ( var i : int = 0; i < strings.Length; i++ ) {
			if ( strings[i] == str ) {
				return true;
			}
		}

		return false;
	}

	public static function SerializeChildren ( input : Transform ) : JSONObject {
		return SerializeChildren ( [ input ] );
	}

	public static function SerializeChildren ( input : Transform[] ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		for ( var i : int = 0; i < input.Length; i++ ) {
			var t : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );
	
			for ( var o : int = 0; o < input[i].childCount; o++ ) {
				var obj : OFSerializedObject = input[i].GetChild ( o ).GetComponent.< OFSerializedObject > ();
				
				if ( obj ) {
					t.Add ( Serialize ( obj ) );
				}
			}

			output.AddField ( input[i].gameObject.name, t );
		}

		return output;
	}

	public static function Serialize ( input : OFSerializedObject ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
		var components : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

		output.AddField ( "name", input.gameObject.name );
		output.AddField ( "id", input.id );
	        output.AddField ( "prefabPath", input.prefabPath );	

		for ( var i : int = 0; i < input.fields.Length; i++ ) {
			components.Add ( Serialize ( input.fields[i].component ) );
		}

		output.AddField ( "components", components );

		return output;
	}


	//////////////////
	// Classes
	//////////////////
	// Component
	public static function Serialize ( input : Component ) : JSONObject {
		if ( !input ) { return null; }
		
		if ( !plugins ) {
			plugins = OFReflector.GetPlugins ();
		}

		var output : JSONObject;

		// Unity classes
		if ( input.GetType() == typeof ( Light ) ) {
			output = Serialize ( input as Light );
		
		} else if ( input.GetType() == typeof ( Transform ) ) {
			output = Serialize ( input as Transform );
		
		// Plugins
		} else {
	       		for ( var i : int = 0; i < plugins.Length; i++ ) {
				if ( plugins[i].CheckType ( input.GetType() ) ) {
					output = plugins[i].Serialize ( input );
					break;
				}
			}

		}

		if ( output != null ) {
			output.AddField ( "_TYPE_", input.GetType().ToString().Replace ( "UnityEngine.", "" ) );
		}

		return output;
	}

	// Light
	public static function Serialize ( input : Light ) : JSONObject {
		if ( !input ) { return null; }
		
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		output.AddField ( "type", input.type.ToString () );
		output.AddField ( "range", input.range );
		output.AddField ( "color", Serialize ( input.color ) );
		output.AddField ( "intensity", input.intensity );
		output.AddField ( "shadows", input.shadows.ToString () );
	
		return output;
	}

	// Transform
	public static function Serialize ( input : Transform ) : JSONObject {
		if ( !input ) { return null; }
		
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		output.AddField ( "eulerAngles", Serialize ( input.eulerAngles ) );
		output.AddField ( "position", Serialize ( input.position ) );
		output.AddField ( "localScale", Serialize ( input.localScale ) );
	
		return output;
	}


	/////////////////
	// Structs
	/////////////////
	// Color
	public static function Serialize ( input : Color ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		output.AddField ( "r", input.r );
		output.AddField ( "g", input.g );
		output.AddField ( "b", input.b );
		output.AddField ( "a", input.a );

		return output;
	}
	
	// Vector3
	public static function Serialize ( input : Vector3 ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		output.AddField ( "x", input.x );
		output.AddField ( "y", input.y );
		output.AddField ( "z", input.z );

		return output;
	}
	
	// Vector2
	public static function Serialize ( input : Vector2 ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		output.AddField ( "x", input.x );
		output.AddField ( "y", input.y );

		return output;
	}
}