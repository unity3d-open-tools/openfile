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
		
		var output : JSONObject;

		if ( input.GetType() == typeof ( Transform ) ) {
			output = Serialize ( input as Transform );
		
		} else if ( input.GetType() == typeof ( OCTree ) ) {
			output = Serialize ( input as OCTree );
		
		} else if ( input.GetType() == typeof ( OSInventory ) ) {
			output = Serialize ( input as OSInventory );
		
		} else if ( input.GetType() == typeof ( OSItem ) ) {
			output = Serialize ( input as OSItem );
		
		} else if ( input.GetType() == typeof ( OACharacter ) ) {
			output = Serialize ( input as OACharacter );
		
		}

		if ( output != null ) {
			output.AddField ( "_TYPE_", input.GetType().ToString().Replace ( "UnityEngine.", "" ) );
		}

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

	// OCTree
	public static function Serialize ( input : OCTree ) : JSONObject {
		if ( !input ) { return null; }
		
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
		var rootNodes : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );
		var speakers : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

		for ( var speaker : OCSpeaker in input.speakers ) {
			var s : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
			s.AddField ( "id", speaker.id );
			speakers.Add ( s );
		}

		for ( var root : OCRootNode in input.rootNodes ) {
			var r : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
			var tags : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

			for ( var tag : String in root.tags ) {
				tags.Add ( tag );
			}
			
			var nodes : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );
			
			for ( var node : OCNode in root.nodes ) {
				var n : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
				var connectedTo : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

				for ( var c : int in node.connectedTo ) {
					connectedTo.Add ( c );
				}

				n.AddField ( "id", node.id );
				n.AddField ( "type", node.type.ToString() );
				n.AddField ( "connectedTo", connectedTo );

				switch ( node.type ) {
					case OCNodeType.Speak:
						var speak : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
						var lines : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

						for ( var l : String in node.speak.lines ) {
							lines.Add ( l );
						}

						speak.AddField ( "speaker", node.speak.speaker );
						speak.AddField ( "lines", lines );

						n.AddField ( "speak", speak );
						
						break;

					case OCNodeType.Event:
						var event : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

						event.AddField ( "message", node.event.message );
						event.AddField ( "argument", node.event.argument );

						n.AddField ( "event", event );

						break;

					case OCNodeType.Jump:
						var jump : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

						jump.AddField ( "rootNode", node.jump.rootNode );

						n.AddField ( "jump", jump );

						break;

					case OCNodeType.SetFlag:
						var setFlag : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
						
						setFlag.AddField ( "flag", node.setFlag.flag );
						setFlag.AddField ( "b", node.setFlag.b );

						n.AddField ( "setFlag", setFlag );
						
						break;

					case OCNodeType.GetFlag:
						var getFlag : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
						
						getFlag.AddField ( "flag", node.getFlag.flag );

						n.AddField ( "getFlag", getFlag );
						
						break;

					case OCNodeType.End:
						var end : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

						end.AddField ( "rootNode", node.end.rootNode );

						n.AddField ( "end", end );
						
						break;

				}

				nodes.Add ( n );
			}

			r.AddField ( "firstNode", root.firstNode );
			r.AddField ( "tags", tags );
			r.AddField ( "nodes", nodes );

			rootNodes.Add ( r );
		}

		output.AddField ( "rootNodes", rootNodes );
		output.AddField ( "speakers", speakers );
		output.AddField ( "currentRoot", input.currentRoot );

		return output;
	}

	// OSInventory
	public static function Serialize ( input : OSInventory ) : JSONObject {
		if ( !input ) { return null; }
		
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
		var slots : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

		for ( var slot : OSSlot in input.slots ) {
			var s : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
			var i : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

			i.AddField ( "prefabPath", slot.item.prefabPath );
			i.AddField ( "ammunition", slot.item.ammunition.value );

			s.AddField ( "item", i );
			s.AddField ( "x", slot.x );
			s.AddField ( "y", slot.y );
			s.AddField ( "quantity", slot.quantity );
			s.AddField ( "equipped", slot.equipped );
			
			slots.Add ( s );
		}

		var quickSlots : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

		for ( var quickSlot : int in input.quickSlots ) {
			quickSlots.Add ( quickSlot );
		}

		var grid : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		grid.AddField ( "width", input.grid.width );
		grid.AddField ( "height", input.grid.height );

		var wallet : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

		for ( var currency : OSCurrencyAmount in input.wallet ) {
			var c : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
			
			c.AddField ( "index", currency.index );
			c.AddField ( "amount", currency.amount );

			wallet.Add ( c );
		}

		output.AddField ( "definitions", input.definitions.prefabPath );
		output.AddField ( "slots", slots );
		output.AddField ( "quickSlots", quickSlots );
		output.AddField ( "grid", grid );
		output.AddField ( "wallet", wallet );

		return output;
	}

	// OSItem
	public static function Serialize ( input : OSItem ) : JSONObject {
		if ( !input ) { return null; }
		
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
	
		output.AddField ( "ammunition", input.ammunition.value );

		return output;
	}

	// OACharacter
	public static function Serialize ( input : OACharacter ) : JSONObject {
		if ( !input ) { return null; }
		
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
	
		output.AddField ( "health", input.health );

		if ( input.conversationTree ) {
			output.AddField ( "conversationTree", Serialize ( input.conversationTree ) );
		
			var speakers : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

			for ( var i : int = 0; i < input.convoSpeakers.Length; i++ ) {
				var so : OFSerializedObject = input.convoSpeakers[i].GetComponent.< OFSerializedObject > ();
				
				if ( so ) {
					speakers.Add ( so.id );
				}
			}

			output.AddField ( "convoSpeakers", speakers );
		}

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
