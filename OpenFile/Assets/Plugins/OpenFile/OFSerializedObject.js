#pragma strict

public enum OFFieldType {
	None,	
	Boolean,
	BoxCollider,
	CapsuleCollider,
	GameObject,
	MeshCollider,
	MeshFilter,
	MeshRenderer,
	Number,
	Rigidbody,
	String,
	Transform,
	Vector3,
	Vector2,
}

public class OFField {
	public var type : OFFieldType;
	public var name : String = "";

	// Types
	public var b : boolean;
	public var str : String;
	public var n : float;
	public var transform : Transform;
	public var gameObject : GameObject;
}

public class OFSerializedObject extends MonoBehaviour {
	public var fields : OFField [];	
	public var prefabPath : String = "";

	public function SetField ( name, type ) {
		
	}
}
