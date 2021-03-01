using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CambiarArbol : MonoBehaviour
{
    RawImage m_RawImage;
    public Texture[] arbol_Texture;
    private int indice = 0;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void CambiarArbolder()
    {
        if (indice == arbol_Texture.Length - 1)
        {
            indice = 0;
        }
        else
        {
            indice++;
        }
        //Fetch the RawImage component from the GameObject
        m_RawImage = GetComponent<RawImage>();
        //Change the Texture to be the one you define in the Inspector
        m_RawImage.texture = arbol_Texture[indice];
    }

    public void CambiarArbolIzq()
    {
        if(indice == 0)
        {
            indice = arbol_Texture.Length - 1;
        }
        else
        {
            indice--;
        }
        //Fetch the RawImage component from the GameObject
        m_RawImage = GetComponent<RawImage>();
        //Change the Texture to be the one you define in the Inspector
        m_RawImage.texture = arbol_Texture[indice];
    }
}
