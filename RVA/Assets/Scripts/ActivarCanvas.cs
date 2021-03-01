using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ActivarCanvas : MonoBehaviour
{
    private bool activado = false;
    // Start is called before the first frame update
    void Start()
    {
        gameObject.SetActive(activado);
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void ActDesactCanvas()
    {
        activado = !activado;
        gameObject.SetActive(activado);
    }
}
