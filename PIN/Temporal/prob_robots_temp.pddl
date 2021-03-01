(define (problem probrobots)
(:domain robots)
(:objects T1 T2 - taza 
          P1 P2 - person
          R1 R2 - robot
          H1 H2 H3 H4 PASILLO - room)

(:init 
    (estaEn R1 H1)
    (estaEn P1 H2)
    (estaEn R2 H3)
    (estaEn P2 H3)

    (adjacente H1 H2)
    (= (distancia H1 H2) 20)
    (adjacente H2 H1)
    (= (distancia H2 H1) 20)
    (adjacente H1 PASILLO)
    (= (distancia H1 PASILLO) 10)
    (adjacente PASILLO H1)
    (= (distancia PASILLO H1) 10)
    (adjacente H2 PASILLO)
    (= (distancia H2 PASILLO) 10)
    (adjacente PASILLO H2)
    (= (distancia PASILLO H2) 10)
    (adjacente H3 H4)
    (= (distancia H3 H4) 20)
    (adjacente H4 H3)
    (= (distancia H4 H3) 20)
    (adjacente H3 PASILLO)
    (= (distancia H3 PASILLO) 10)
    (adjacente PASILLO H3)
    (= (distancia PASILLO H3) 10)
    (adjacente H4 PASILLO)
    (= (distancia H4 PASILLO) 10)
    (adjacente PASILLO H4)
    (= (distancia PASILLO H4) 10)

    (permitido R1 H1)
    (permitido R1 H2)
    (permitido R1 PASILLO)
    (permitido R2 H3)
    (permitido R2 H4)
    (permitido R2 PASILLO)

    (armario H3)
    (maquinaTe H1)

    (armarioTiene T1)
    (armarioTiene T2)

    (tazaVacia T1)
    (tazaVacia T2)
    
    (sostiene R1 VACIO DER)
    (sostiene R1 VACIO IZQ)
    (sostiene R2 VACIO DER)
    (sostiene R2 VACIO IZQ)
    
    (= ( velocidad R1) 2)
    (= ( velocidad R2) 5)
    
    (= (darTazaLlena) 2)
    (= (darTazaVacia) 1)
)

(:goal (and (servido P1)(servido P2)))
(:metric minimize(total-time))
)
