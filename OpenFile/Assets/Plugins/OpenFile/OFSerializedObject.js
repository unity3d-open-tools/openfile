#pragma strict

public enum OFFieldType {
	None,
	Boolean,
	String,
	Number,
	Transform,
	GameObject
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
}
