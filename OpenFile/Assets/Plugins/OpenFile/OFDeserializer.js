#pragma strict

public class OFDeserializer {
	public static function Deserialize ( input : JSONObject ) : OFSerializedObject {
		var output : OFSerializedObject;
		var existingCopy : OFSerializedObject = OFSerializedObject.FindObject ( input.GetField ( "guid" ).str );

		if ( existingCopy ) {
			output = existingCopy;

		} else if ( input.HasField ( "prefabPath" ) && !String.IsNullOrEmpty ( input.GetField ( "prefabPath" ).str ) ) {	
			var newGO : GameObject = MonoBehaviour.Instantiate ( Resources.Load ( input.GetField ( "prefabPath" ).str ) ) as GameObject;
			output = newGO.GetComponent.<OFSerializedObject>();
		} else {
			output = new GameObject ( "name", OFSerializedObject ).GetComponent.<OFSerializedObject>();
		}
		
		var components : JSONObject = input.GetField ( "components" );

		output.gameObject.name = input.GetField ( "name" ).str;
		output.guid = input.GetField ( "guid" ).str;

		for ( var i : int = 0; i < components.list.Count; i++ ) {
			switch ( components.list[i].GetField ( "_TYPE_" ).str ) {
				case "Transform":
					DeserializeTransform ( components.list[i], output.gameObject.transform );
					break;
			}
		}

		return output;
	}

	//////////////////
	// Classes
	//////////////////
	// Component
	public static function DeserializeComponent ( input : JSONObject, component : Component ) {
		if ( component.GetType() == typeof ( Transform ) ) {
			DeserializeTransform ( input, component as Transform );
		
		}
	}

	// Transform
	public static function DeserializeTransform ( input : JSONObject, transform : Transform ) {
		transform.eulerAngles = DeserializeVector3 ( input.GetField ( "eulerAngles" ) );
		transform.position = DeserializeVector3 ( input.GetField ( "position" ) );
		transform.localScale = DeserializeVector3 ( input.GetField ( "localScale" ) );
	}

	/////////////////
	// Structs
	/////////////////
	// Vector3
	public static function DeserializeVector3 ( input : JSONObject ) : Vector3 {
		var output : Vector3 = new Vector3();

		output.x = input.GetField ( "x" ).n;
		output.y = input.GetField ( "y" ).n;
		output.z = input.GetField ( "z" ).n;

		return output;
	}
	
	// Vector2
	public static function DeserializeVector2 ( input : JSONObject ) : Vector2 {
		var output : Vector2 = new Vector2();

		output.x = input.GetField ( "x" ).n;
		output.y = input.GetField ( "y" ).n;

		return output;
	}
}
