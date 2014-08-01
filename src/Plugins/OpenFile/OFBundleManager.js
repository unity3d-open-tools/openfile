#pragma strict

import System.Text;
import System.IO;
import Ionic.Zip;

public class OFBundleManager extends MonoBehaviour {
	public var bundleFolder : String = "Libraries";
	public var bundleExtension : String = "lib";
	public var loadOnAwake : boolean = true;
	public var loadedBundles : List.< OFBundle > = new List.< OFBundle > ();

	public static var instance : OFBundleManager;
	public static var loading : boolean = false;

	public function Awake () {
		if ( instance != this ) {
			instance = this;
			
			if ( loadOnAwake ) {
				StartCoroutine ( LoadAllBundles () );
			}
		}
	}

	public static function GetName ( path : String ) : String {
		var strings : String [] = path.Replace ( "\\", "/" ).Split ( "/"[0] );

		return strings [ strings.length - 1 ];
	}

	private function PopulateFolder ( folder : OFBundle.Folder ) : IEnumerator {
		for ( var texPath : String in Directory.GetFiles ( folder.path, "*.png" ) ) {
			texPath = texPath.Replace ( "\\", "/" );

			var www : WWW = new WWW ( "file:///" + texPath );
			yield www;

			var newTex : Texture2D = www.texture;
			newTex.name = GetName ( texPath );

			folder.AddTexture ( newTex );
		}
		
		for ( var meshPath : String in Directory.GetFiles ( folder.path, "*.obj" ) ) {
			meshPath = meshPath.Replace ( "\\", "/" );
			
			var newMesh : Mesh = ObjImporter.Importer.ImportFile ( meshPath );
			newMesh.name = GetName ( meshPath );

			OFHelper.SolveTangents ( newMesh );

			folder.AddMesh ( newMesh );
		}

		for ( var audioPath : String in Directory.GetFiles ( folder.path, "*.ogg" ) ) {
			audioPath = audioPath.Replace ( "\\", "/" );
			
			www = new WWW ( "file:///" + audioPath );
			yield www;

			var newAudio : AudioClip = www.audioClip;
			newAudio.name = GetName ( audioPath );

			folder.AddAudio ( newAudio );
		}
		
		var directories : String [] = Directory.GetDirectories ( folder.path );

		folder.subfolders = new OFBundle.Folder [ directories.Length ];

		for ( var i : int = 0; i < directories.Length; i++ ) {
			var newFolder : OFBundle.Folder = new OFBundle.Folder ();
			newFolder.name = GetName ( directories[i] );
			newFolder.path = folder.path + "/" + newFolder.name;
			
			PopulateFolder ( newFolder );

			folder.subfolders[i] = newFolder;
		}
	}

	public function GetBundle ( name : String ) {
		for ( var i : int = 0; i < loadedBundles.Count; i++ ) {
			if ( loadedBundles[i].name == name ) {
				return loadedBundles[i];
			}
		}

		return null;
	}

	public function GetBundleStrings () : String [] { 
		var strings : String[] = new String [ loadedBundles.Count ];

		for ( var i : int = 0; i < loadedBundles.Count; i++ ) {
			strings[i] = loadedBundles[i].name;
		}

		return strings;
	}

	public function LoadAllBundles () : IEnumerator {
		loading = true;
		
		for ( var dirPath : String in System.IO.Directory.GetDirectories ( Application.dataPath + "/" + bundleFolder ) ) {
			yield LoadBundle ( GetName ( dirPath ), false );
		}
		
		for ( var zipPath : String in System.IO.Directory.GetFiles ( Application.dataPath + "/" + bundleFolder ) ) {
			if ( zipPath.Contains ( "." + bundleExtension ) ) {
				yield LoadBundle ( GetName ( zipPath ), true );
			}
		}

		yield WaitForEndOfFrame ();

		loading = false;
	}

	public function LoadBundle ( name : String, compressed : boolean ) : IEnumerator {
		var path : String;
		
		if ( compressed ) {
			path = Application.temporaryCachePath + "/OpenFile/Bundles/" + bundleFolder + "/" + name.Split ( "."[0] )[0];
			
			var zip : ZipFile = ZipFile.Read ( Application.dataPath + "/" + bundleFolder + "/" + name );
			
			name = name.Split ( "."[0] )[0];

			zip.Dispose ();

			for ( var e : ZipEntry in zip ) {
				e.Extract ( path, ExtractExistingFileAction.OverwriteSilently );
			}
		

		} else {
			path = Application.dataPath + "/" + bundleFolder + "/" + name;
		
		}
			
		var newBundle : OFBundle = new OFBundle ();

		newBundle.name = name;
		newBundle.root = new OFBundle.Folder ();
		newBundle.root.path = path;

		yield PopulateFolder ( newBundle.root );

		loadedBundles.Add ( newBundle );
	}

	public function UnloadBundle ( name : String ) {
		for ( var i : int = loadedBundles.Count - 1; i >= 0; i-- ) {
			if ( loadedBundles[i].name == name ) {
				loadedBundles.RemoveAt ( i );
			}
		}
	}

	public function UnloadAll () {
		loadedBundles.Clear ();
	}
}
