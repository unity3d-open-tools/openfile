#pragma strict
#pragma downcast

public enum OFFieldType {
	// System types
	None = 0,	
	Boolean,
	Float,
	Int,
	String,
	
	// Unity structs
	Rect = 100,
	Quaternion,
	Vector3,
	Vector2,
	Color,

	// Component types
	Animator = 200,
	Component,
	Light,
	Transform,

	// OpenTools types
	OACharacter = 300,
	OCTree,
	OPPathFinder,
	OSInventory,
	OSItem,
}

public class OFField {
	public var type : OFFieldType;
	public var name : String = "";

	public var b : boolean;
	public var str : String;
	public var i : int;
	public var f : float;
	public var vector3 : Vector3;
	public var vector2 : Vector2;
	public var rect : Rect;
	public var color : Color;
	public var component : Component;

	public static function GetComponentType ( value : Component ) : int {
		var strings : String [] = System.Enum.GetNames ( OFFieldType );
		var type : String = value.GetType().ToString().Replace ( "UnityEngine.", "" ); 
		
		return System.Enum.Parse ( typeof ( OFFieldType ), type );
	}

	public function Set ( value : Component ) {
		type = GetComponentType ( value );
		component = value;
	}
	
	public function Set ( value : Color ) {
		type = OFFieldType.Color;
		color = value;
	}

	public function Set ( value : Rect ) {
		type = OFFieldType.Rect;
		rect = value;
	}

	public function Set ( value : float ) {
		type = OFFieldType.Float;
		f = value;
	}
	
	public function Set ( value : int ) {
		type = OFFieldType.Int;
		i = value;
	}
	
	public function Set ( value : Vector3 ) {
		type = OFFieldType.Vector3;
		vector3 = value;
	}
	
	public function Set ( value : Vector2 ) {
		type = OFFieldType.Vector2;
		vector2 = value;
	}
}

public class OFSerializedObject extends MonoBehaviour {
	public var fields : OFField [] = new OFField[0];	
	public var id : String = "";
	public var prefabPath : String = "";
	public var exportPath : String = "";

	public function RenewId () {
		id = System.Guid.NewGuid().ToString();
	}

	public function Start () {
		if ( String.IsNullOrEmpty ( id ) ) {
			RenewId ();
		}
	}

	public function SetField ( name : String, value : Component ) {
		var tmpFields : List.< OFField > = new List.< OFField > ( fields );
		var found : boolean = false;

		for ( var i : int = 0; i < tmpFields.Count; i++ ) {
			if ( tmpFields[i].name == name ) {
				tmpFields[i].Set ( value );
				found = true;
				break;
			}
		}

		if ( !found ) {
			var newField : OFField = new OFField ();
			newField.name = name;
			newField.Set ( value );
			tmpFields.Add ( newField );
		}

		fields = tmpFields.ToArray ();
	}
	
	public function HasFieldType ( type : OFFieldType ) : boolean {
		for ( var i : int = 0; i < fields.Length; i++ ) {
			if ( fields[i].type == type ) {
				return true;
			}
		}
		
		return false;
	}

	public function HasField ( name : String ) : boolean {
		for ( var i : int = 0; i < fields.Length; i++ ) {
			if ( fields[i].name == name ) {
				return true;
			}
		}
		
		return false;
	}

	public function RemoveField ( name : String ) {
		var tmpFields : List.< OFField > = new List.< OFField > ( fields );

		for ( var i : int = 0; i < tmpFields.Count; i++ ) {
			if ( tmpFields[i].name == name ) {
				tmpFields.RemoveAt ( i );
				break;
			}
		}

		fields = tmpFields.ToArray ();
	}

	public function GetComponentType ( type : OFFieldType ) : Component {
		for ( var i : int = 0; i < fields.Length; i++ ) {
			if ( fields[i] && fields[i].component && fields[i].type == type ) {
				return fields[i].component;
			}
		}
		
		return null;
	}

	public static function FindObject ( id : String ) : OFSerializedObject {
		var result : OFSerializedObject;
		var allObjects : OFSerializedObject[] = GameObject.FindObjectsOfType.<OFSerializedObject>();

		for ( var i : int = 0; i < allObjects.Length; i++ ) {
			if ( allObjects[i].id == id ) {
				result = allObjects[i];
				break;
			}	
		}

		return result;
	}

	public static function GetAllInScene () : OFSerializedObject [] {
		return GameObject.FindObjectsOfType.<OFSerializedObject>();
	}
}
