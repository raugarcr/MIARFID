using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CircuitoCambiarCoche : MonoBehaviour
{
    public GameObject listaCoches;
    private int indice = 0;
    private int numCoches = 0;
    // Start is called before the first frame update
    void Start()
    {
        foreach(Transform child in listaCoches.transform)
        {
            child.gameObject.SetActive(false);
            numCoches++;
        }
        listaCoches.transform.GetChild(0).gameObject.SetActive(true);

    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void CambiarPlayerDer()
    {
        listaCoches.transform.GetChild(indice).gameObject.SetActive(false);
        if (indice == numCoches - 1)
        {
            indice = 0;
        }
        else
        {
            indice++;
        }
        listaCoches.transform.GetChild(indice).gameObject.SetActive(true);
    }

    public void CambiarPlayerIzq()
    {
        listaCoches.transform.GetChild(indice).gameObject.SetActive(false);
        if (indice == 0)
        {
            indice = numCoches - 1;
        }
        else
        {
            indice--;
        }
        listaCoches.transform.GetChild(indice).gameObject.SetActive(true);
    }
}
