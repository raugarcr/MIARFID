using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SelectCar : MonoBehaviour
{
    public GameObject listaCoches;
    public Material texturaAsfalto;
    private List<GameObject> listaInst = new List<GameObject>();
    private int indice = 0;
    // Start is called before the first frame update
    void Start()
    {
        foreach (Transform child in listaCoches.transform)
        {
            GameObject newCar = (GameObject)Instantiate(child.gameObject, transform.position, Quaternion.identity);
            newCar.AddComponent<MeshRenderer>();
            newCar.transform.localScale = new Vector3(4f, 4f, 4f);
            newCar.transform.localPosition = gameObject.transform.position + new Vector3(0.0f, 0.5f, 0.0f);
            newCar.transform.parent = gameObject.transform;
            newCar.SetActive(false);
            listaInst.Add(newCar);
        }
        listaInst[0].SetActive(true);

        GameObject suelo = GameObject.CreatePrimitive(PrimitiveType.Plane);
        suelo.transform.localScale = new Vector3(1f, 1f, 2f);
        suelo.transform.localPosition = gameObject.transform.position;
        suelo.transform.parent = gameObject.transform;
        suelo.GetComponent<Renderer>().material = texturaAsfalto;
        suelo.SetActive(true);
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Moved)
        {
            // Obtener el movimiento del dedo desde el último frame
            Vector2 touchDeltaPosition = Input.GetTouch(0).deltaPosition;
            // Rotar el objeto sobre el eje Y
            foreach (GameObject car in listaInst)
            {
                car.transform.Rotate(new Vector3(0.0f, -1 * touchDeltaPosition.x, 0.0f));
            }
        }
    }

    public void ChangeCarDer()
    {
        listaInst[indice].SetActive(false);
        if(indice == listaInst.Count - 1)
        {
            indice = 0;
        }
        else
        {
            indice++;
        }
        listaInst[indice].SetActive(true);
    }

    public void ChangeCarIzq()
    {
        listaInst[indice].SetActive(false);
        if (indice == 0)
        {
            indice = listaInst.Count - 1;
        }
        else
        {
            indice--;
        }
        listaInst[indice].SetActive(true);
    }

}
