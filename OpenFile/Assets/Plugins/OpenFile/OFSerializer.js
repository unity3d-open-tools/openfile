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

		output.AddField ( "name", input.gameObject.name );

		for ( var i : int = 0; i < input.fields.Length; i++ ) {
			switch ( input.fields[i].type ) {
				case OFFieldType.Boolean:
					output.AddField ( input.fields[i].name, input.fields[i].b );
					break;
			
				case OFFieldType.String:
					output.AddField ( input.fields[i].name, input.fields[i].str );
					break;

				case OFFieldType.Int:
					output.AddField ( input.fields[i].name, input.fields[i].i );
					break;
				
				case OFFieldType.Float:
					output.AddField ( input.fields[i].name, input.fields[i].f );
					break;
				
				case OFFieldType.Transform:
					output.AddField ( input.fields[i].name, SerializeTransform ( input.fields[i].transform ) );
					break;
				
				case OFFieldType.GameObject:
					output.AddField ( input.fields[i].name, SerializeGameObject ( input.fields[i].gameObject ) );
					break;
			}
		}

		return output;
	}

	//////////////////
	// Classes
	//////////////////
	// GameObject
	public static function SerializeGameObject ( input : GameObject ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
		var serializedObject : OFSerializedObject = input.GetComponent.<OFSerializedObject> ();
		var allComponents : Component[] = input.GetComponents.<Component> ();

		if ( serializedObject ) {
			output = Serialize ( serializedObject );
		
		} else {
			output.AddField ( "name", input.name );

			for ( var i : int = 0; i < allComponents.Length; i++ ) {
				var name : String = allComponents[i].GetType().ToString();
				name = char.ToLowerInvariant ( name[0] ) + name.Substring (1);
				
				output.AddField ( name, SerializeComponent ( allComponents[i] ) );	
			}

		}
			
		return output;
	}

	// Component
	public static function SerializeComponent ( input : Component ) : JSONObject {
		if ( input.GetType() == typeof ( Transform ) ) {
			return SerializeTransform ( input as Transform );
		
		} else {
			return null;
		
		}
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
