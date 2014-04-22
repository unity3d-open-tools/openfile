#pragma strict

public class OFSerializer {
	public static function CanSerialize ( type : System.Type ) : boolean {
		return CanSerialize ( type.ToString () );
	}

	public static function CanSerialize ( type : String ) : boolean {
		var str : String = type;
		str = str.Replace ( "UnityEngine.", "" );
		var strings : String[] = System.Enum.GetNames ( OFFieldType );

		for ( var i : int = 0; i < strings.Length; i++ ) {
			if ( strings[i] == str ) {
				return true;
			}
		}

		return false;
	}
	
	public static function Serialize ( input : OFSerializedObject ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
		var components : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

		output.AddField ( "name", input.gameObject.name );
		output.AddField ( "guid", input.guid );
	        output.AddField ( "prefabPath", input.prefabPath );	

		for ( var i : int = 0; i < input.fields.Length; i++ ) {
			var c : Component = input.fields[i].component;

			if ( c ) {
				components.Add ( SerializeComponent ( c ) );
			}
		}

		output.AddField ( "components", components );

		return output;
	}


	//////////////////
	// Classes
	//////////////////
	// Component
	public static function SerializeComponent ( input : Component ) : JSONObject {
		var output : JSONObject;
		
		if ( input.GetType() == typeof ( Transform ) ) {
			output = SerializeTransform ( input as Transform );
		
		}

		if ( output != null ) {
			output.AddField ( "_TYPE_", input.GetType().ToString().Replace ( "UnityEngine.", "" ) );
		}

		return output;
	}

	// Transform
	public static function SerializeTransform ( input : Transform ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		output.AddField ( "eulerAngles", SerializeVector3 ( input.eulerAngles ) );
		output.AddField ( "position", SerializeVector3 ( input.position ) );
		output.AddField ( "localScale", SerializeVector3 ( input.localScale ) );
	
		return output;
	}

	
	/////////////////
	// Structs
	/////////////////
	// Vector3
	public static function SerializeVector3 ( input : Vector3 ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		output.AddField ( "x", input.x );
		output.AddField ( "y", input.y );
		output.AddField ( "z", input.z );

		return output;
	}
	
	// Vector2
	public static function SerializeVector2 ( input : Vector2 ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		output.AddField ( "x", input.x );
		output.AddField ( "y", input.y );

		return output;
	}
}
