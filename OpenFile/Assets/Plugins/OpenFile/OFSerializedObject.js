#pragma strict

public enum OFFieldType {
	None,	
	Boolean,
	//BoxCollider,
	//CapsuleCollider,
	Float,
	GameObject,
	Int,
	//MeshCollider,
	//MeshFilter,
	//MeshRenderer,
	Rect,
	//Rigidbody,
	String,
	Transform,
	Vector3,
	Vector2,
}

public class OFField {
	public var type : OFFieldType;
	public var name : String = "";

	public var b : boolean;
	public var str : String;
	public var i : int;
	public var f : float;
	public var transform : Transform;
	public var gameObject : GameObject;
	public var v3 : Vector3;
	public var v2 : Vector2;
	public var rect : Rect;

	public function Set ( value : Object ) {
		if ( value.GetType() == typeof ( Transform ) ) {
			type = OFFieldType.Transform;
			transform = value as Transform;
		}
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
	public var prefabPath : String = "";

	public function SetField ( name : String, value : Object ) {
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
}
