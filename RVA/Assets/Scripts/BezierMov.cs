using UnityEngine;
using PathCreation;
public class BezierMov : MonoBehaviour
{
    public PathCreator pathCreator;
    public EndOfPathInstruction end;
    public float speed;
    float dstTravelled;
    void Update()
    {
        dstTravelled += speed * Time.deltaTime;
        transform.position = pathCreator.path.GetPointAtDistance(dstTravelled, end);
        transform.rotation = pathCreator.path.GetRotationAtDistance(dstTravelled, end);
        transform.Rotate(new Vector3(-90, 0, 0));
        transform.Rotate(new Vector3(0, -90, 0));
    }
}
