#pragma strict

public enum OFFieldType {
	None,	
	Boolean,
	Float,
	Int,
	Rect,
	String,
	Vector3,
	Vector2,

	// Component types
	Component,
	Transform,
}

public class OFField {
	public var type : OFFieldType;
	public var name : String = "";

	public var b : boolean;
	public var str : String;
	public var i : int;
	public var f : float;
	public var v3 : Vector3;
	public var v2 : Vector2;
	public var rect : Rect;
	public var component : Component;

	public function Set ( value : Component ) {
		type = OFFieldType.Component;
		component = value;
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
		v3 = value;
	}
	
	public function Set ( value : Vector2 ) {
		type = OFFieldType.Vector2;
		v2 = value;
	}
}

public class OFSerializedObject extends MonoBehaviour {
	public var fields : OFField [];	
	public var guid : String = "";
	public var prefabPath : String = "";

	public function Start () {
		if ( String.IsNullOrEmpty ( guid ) ) {
			guid = System.Guid.NewGuid().ToString();
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

	public static function FindObject ( guid : String ) : OFSerializedObject {
		var result : OFSerializedObject;
		var allObjects : OFSerializedObject[] = GameObject.FindObjectsOfType.<OFSerializedObject>();

		for ( var i : int = 0; i < allObjects.Length; i++ ) {
			if ( allObjects[i].guid == guid ) {
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
