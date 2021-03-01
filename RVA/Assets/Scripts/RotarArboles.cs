using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RotarArboles : MonoBehaviour
{
    private void OnMouseDrag()
    {
        // Obtener el movimiento del dedo desde el último frame
        Vector2 touchDeltaPosition = Input.GetTouch(0).deltaPosition;
        // Rotar el objeto sobre el eje Y

        transform.Rotate(new Vector3(0.0f, -1 * touchDeltaPosition.x, 0.0f));

    }
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
