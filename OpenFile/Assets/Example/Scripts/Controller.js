#pragma strict

public class Controller extends MonoBehaviour {
	public function Update () {
		if ( Input.GetKey ( KeyCode.A ) ) {
			rigidbody.velocity = new Vector3 ( -5, rigidbody.velocity.y, 0 );
		} else if ( Input.GetKey ( KeyCode.D ) ) {
			rigidbody.velocity = new Vector3 ( 5, rigidbody.velocity.y, 0 );
		} else {
			rigidbody.velocity = new Vector3 ( 0, rigidbody.velocity.y, 0 );
		}
		
		if ( Input.GetKeyDown ( KeyCode.Space ) && rigidbody.velocity.y > -0.1 && rigidbody.velocity.y < 0.1 ) {
			rigidbody.AddForce ( transform.up * 200 );
		}
	}
}
