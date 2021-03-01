using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Vuforia;

public class RaycastPlane : MonoBehaviour
{

    public GameObject[] arboles;
    public Collider coll;
    public GameObject target;
    private int indice = 0;
    private bool activado = true;

    private void OnMouseDown()
    {
        if (activado)
        {
            //Ray ray = Camera.main.ScreenPointToRay(touch.position);
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;

            if (coll.Raycast(ray, out hit, 1000.0f))
            {
                Vector3 planePoint = ray.GetPoint(hit.distance);
                GameObject newArbol = (GameObject)Instantiate(arboles[indice], planePoint, Quaternion.identity);
                newArbol.transform.parent = target.transform;
                newArbol.transform.localScale = new Vector3(1f, 1f, 1f);
                newArbol.transform.position = planePoint;
            }
        }
        
    }

    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        // Attach this script to a trackable object
        // Create a plane that matches the target plane
        /*
        foreach (Touch touch in Input.touches)
        {
            if (touch.phase == TouchPhase.Began && activado)
            {
                Ray ray = Camera.main.ScreenPointToRay(touch.position);
                //Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
                RaycastHit hit;

                if(coll.Raycast(ray, out hit, 1000.0f))
                {
                    Vector3 planePoint = ray.GetPoint(hit.distance);
                    GameObject newArbol = (GameObject)Instantiate(arboles[indice], planePoint, Quaternion.identity);
                    newArbol.transform.parent = target.transform;
                    newArbol.transform.localScale = new Vector3(1f, 1f, 1f);
                    newArbol.transform.position = planePoint;
                }
                
                

            }
        }
        */
    }

    public void CambiarArbolIzq()
    {
        if (indice == 0)
        {
            indice = arboles.Length - 1;
        }
        else
        {
            indice--;
        }
    }

    public void CambiarArbolder()
    {
        if (indice == arboles.Length - 1)
        {
            indice = 0;
        }
        else
        {
            indice++;
        }
    }

    public void ActDesactRay()
    {
        activado = !activado;
    }
}
