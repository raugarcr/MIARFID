using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class movimiento : MonoBehaviour
{
    public GameObject path;
    private Transform[] pathTransforms;
    public float speed = 1f;
    private int currentNode = 1;
    // Start is called before the first frame update
    void Start()
    {
        pathTransforms = path.GetComponentsInChildren<Transform>();
    }

    // Update is called once per frame
    void Update()
    {
        // Check distance to the goal
        if (Vector3.Distance(transform.position, pathTransforms[currentNode].position) < 0.001f)
        {
            if (currentNode == pathTransforms.Length - 1)
            {
                currentNode = 1;
            }
            else
            {
                currentNode++;
            }

        }
        float step = speed * Time.deltaTime; // calculate distance to move
        transform.position = Vector3.MoveTowards(transform.position, pathTransforms[currentNode].position, step);
        transform.LookAt(pathTransforms[currentNode].position, Vector3.up);
        transform.Rotate(new Vector3(-90, 0, 0));

    }
}
