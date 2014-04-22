#pragma strict

@CustomEditor ( OFSerializedObject )
public class OFSerializedObjectInspector extends Editor {
	private var expandedComponent : int = -1;
	private var resourceWarning : boolean = false;
	
	override function OnInspectorGUI () {
		if ( Application.isPlaying ) {
			EditorGUILayout.LabelField ( "Cannot edit serializable objects while playing" );
			return;
		}
		
		var obj : OFSerializedObject = target as OFSerializedObject;
		
		if ( obj.gameObject.activeInHierarchy ) {
			// Instance
			EditorGUILayout.LabelField ( "Instance", EditorStyles.boldLabel );
			
			EditorGUILayout.BeginHorizontal ();

			EditorGUILayout.TextField ( "GUID", obj.guid );

			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "Update", GUILayout.Width ( 60 ) ) ) {
				obj.guid = System.Guid.NewGuid().ToString();
			}
			GUI.backgroundColor = Color.white;

			EditorGUILayout.EndHorizontal ();
		
		} else {
			obj.guid = "";
			
			// Resource
			EditorGUILayout.LabelField ( "Resource", EditorStyles.boldLabel );
			
			EditorGUILayout.BeginHorizontal ();

			EditorGUILayout.TextField ( "Path", obj.prefabPath );

			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "Update", GUILayout.Width ( 60 ) ) ) {
				var path : String = AssetDatabase.GetAssetPath ( obj.gameObject );
				if ( path.Contains ( "Assets/Resources/" ) ) {
					path = path.Replace ( "Assets/Resources/", "" );
					path = path.Replace ( ".prefab", "" );

					obj.prefabPath = path;
					
					resourceWarning = false;
				
				} else {
					resourceWarning = true;
				
				}
			}
			GUI.backgroundColor = Color.white;

			EditorGUILayout.EndHorizontal ();
		}

		if ( resourceWarning ) {
			obj.prefabPath = "";
			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "Object not in /Resources folder!", EditorStyles.boldLabel );
			GUI.color = Color.white;
		}
		
		EditorGUILayout.Space ();

		EditorGUILayout.LabelField ( "Components", EditorStyles.boldLabel );
		var allComponents : Component[] = obj.gameObject.GetComponents.<Component>();

		for ( var i : int = 0; i < allComponents.Length; i++ ) {
			var name : String = allComponents[i].GetType().ToString();
			name = name.Replace ( "UnityEngine.", "" );

			if ( allComponents[i].GetType() == OFSerializedObject ) {
				continue;
			}

			if ( OFSerializer.CanSerialize ( allComponents[i].GetType() ) ) {
				var hasField : boolean = obj.HasField ( name );
				
				hasField = EditorGUILayout.Toggle ( name, hasField );
		
				if ( hasField ) {
					obj.SetField ( name, allComponents[i] );
				
				} else {
					obj.RemoveField ( name );

				}

			} else {
				var isExpanded : boolean = expandedComponent == i;
				var wasExpanded : boolean = isExpanded;

				isExpanded = EditorGUILayout.Foldout ( isExpanded, name );

				if ( wasExpanded && !isExpanded ) {
					expandedComponent = -1;
				
				} else if ( isExpanded ) {
					expandedComponent = i;

					var serializedObject : SerializedObject = new SerializedObject ( allComponents[i] );
					var serializedProperty : SerializedProperty = serializedObject.GetIterator ();

					while ( serializedProperty.NextVisible(true) ) {
						if ( OFSerializer.CanSerialize ( serializedProperty.propertyType.ToString() ) ) {
							EditorGUILayout.Toggle ( serializedProperty.name, false );
						} else {
							GUI.color = new Color ( 1, 1, 1, 0.5 );
							EditorGUILayout.LabelField ( serializedProperty.name );
							GUI.color = Color.white;
						}
					}
				}
			}
			
		}
	}
}
