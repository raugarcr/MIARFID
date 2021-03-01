using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class BotonCambiarModo : MonoBehaviour
{
    private string selection = "Place Tree";
    private string placing = "Change Tree";
    // Start is called before the first frame update
    void Start()
    {
        GetComponentInChildren<Text>().text = placing;
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void CambiarModo()
    {
        if(GetComponentInChildren<Text>().text == placing)
        {
            GetComponentInChildren<Text>().text = selection;
        }
        else
        {
            GetComponentInChildren<Text>().text = placing;
        }
        
    }
}
