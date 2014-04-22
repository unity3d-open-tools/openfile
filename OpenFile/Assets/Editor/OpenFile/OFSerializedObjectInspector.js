#pragma strict

@CustomEditor ( OFSerializedObject )
public class OFSerializedObjectInspector extends Editor {
	private var expandedComponent : int = -1;
	private var resourceWarning : boolean = false;
	
	override function OnInspectorGUI () {
		var obj : OFSerializedObject = target as OFSerializedObject;

		EditorGUILayout.LabelField ( "Resource", EditorStyles.boldLabel );
		
		EditorGUILayout.BeginHorizontal ();

		EditorGUILayout.TextField ( "Path", obj.prefabPath );

		if ( !Application.isPlaying ) {
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
		}

		EditorGUILayout.EndHorizontal ();

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
				EditorGUILayout.Toggle ( name, false );
		
			} else {
				var isExpanded : boolean = expandedComponent == i;

				isExpanded = EditorGUILayout.Foldout ( isExpanded, name );

				if ( isExpanded ) {
					expandedComponent = i;

					var serializedObject : SerializedObject = new SerializedObject ( allComponents[i] );
					var serializedProperty : SerializedProperty = serializedObject.GetIterator ();

					while ( serializedProperty.NextVisible(true) ) {
						EditorGUILayout.Toggle ( serializedProperty.name, false );
					}
				}
			}
			
		}
	}
}
