#pragma strict

public class OFHelper {
	public static function SolveTangents ( theMesh : Mesh ) {
    		var vertexCount : int = theMesh.vertexCount;
		var vertices : Vector3 [] = theMesh.vertices;
    		var normals : Vector3 [] = theMesh.normals;
    		var texcoords : Vector2 [] = theMesh.uv;
    		var triangles : int [] = theMesh.triangles;
    		var triangleCount : int = triangles.Length / 3;
    		var tangents : Vector4 [] = new Vector4[vertexCount];
    		var tan1 : Vector3 [] = new Vector3[vertexCount];
    		var tan2 : Vector3 [] = new Vector3[vertexCount];
    		var tri : int = 0;

    		for ( var i : int = 0; i < triangleCount; i++ ) {
    			var i1 : int = triangles[tri];
    			var i2 : int = triangles[tri + 1];
    			var i3 : int = triangles[tri + 2];
     
		    	var v1 : Vector3 = vertices[i1];
    			var v2 : Vector3 = vertices[i2];
    			var v3 : Vector3 = vertices[i3];
     
    			var w1 : Vector2 = texcoords[i1];
    			var w2 : Vector2 = texcoords[i2];
    			var w3 : Vector2 = texcoords[i3];
     
    			var x1 : float = v2.x - v1.x;
    			var x2 : float = v3.x - v1.x;
    			var y1 : float = v2.y - v1.y;
    			var y2 : float = v3.y - v1.y;
    			var z1 : float = v2.z - v1.z;
    			var z2 : float = v3.z - v1.z;
     
    			var s1 : float = w2.x - w1.x;
    			var s2 : float = w3.x - w1.x;
    			var t1 : float = w2.y - w1.y;
    			var t2 : float = w3.y - w1.y;
     
    			var r : float = 1.0f / (s1 * t2 - s2 * t1);
    			var sdir : Vector3 = new Vector3((t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r);
    			var tdir : Vector3 = new Vector3((s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r);
     
    			tan1[i1] += sdir;
    			tan1[i2] += sdir;
    			tan1[i3] += sdir;
     
			tan2[i1] += tdir;
			tan2[i2] += tdir;
			tan2[i3] += tdir;
     
    			tri += 3;
    		}
     
    		for ( i = 0; i < (vertexCount); i++ ) {
			var n : Vector3 = normals[i];
    			var t : Vector3 = tan1[i];
     
    			// Gram-Schmidt orthogonalize
    			Vector3.OrthoNormalize ( n, t );
     
    			tangents[i].x = t.x;
    			tangents[i].y = t.y;
    			tangents[i].z = t.z;
     
    			// Calculate handedness
    			tangents[i].w = (Vector3.Dot(Vector3.Cross(n, t), tan2[i]) < 0.0) ? -1.0f : 1.0f;
   		}
    		
		theMesh.tangents = tangents;
    	}
}
