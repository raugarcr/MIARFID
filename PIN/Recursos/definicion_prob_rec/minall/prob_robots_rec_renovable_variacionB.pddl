(define (problem probrobots)
(:domain robots)
(:objects T1 T2 T3 T4 - taza 
          P1 P2 P3 P4 - person
          R1 R2 - robot
          H1 H2 H3 H4 H5 PASILLO - room)

(:init 
    (estaEn R1 H4)
    (estaEn P1 H1)
    (estaEn P2 H1)
    (estaEn P3 H3)
    (estaEn P4 H3)
    (estaEn R2 H5)


    (adjacente H1 PASILLO)
    (= (distancia H1 PASILLO) 10)
    (adjacente PASILLO H1)
    (= (distancia PASILLO H1) 10)
    (adjacente H2 PASILLO)
    (= (distancia H2 PASILLO) 10)
    (adjacente PASILLO H2)
    (= (distancia PASILLO H2) 10)
    (adjacente H3 PASILLO)
    (= (distancia H3 PASILLO) 10)
    (adjacente PASILLO H3)
    (= (distancia PASILLO H3) 10)
    (adjacente H4 PASILLO)
    (= (distancia H4 PASILLO) 10)
    (adjacente PASILLO H4)
    (= (distancia PASILLO H4) 10)
    (adjacente H5 PASILLO)
    (= (distancia H5 PASILLO) 10)
    (adjacente PASILLO H5)
    (= (distancia PASILLO H5) 10)
    

    (permitido R1 H1)
    (permitido R1 H2)
    (permitido R1 H4)
    (permitido R1 PASILLO)
    (permitido R2 H5)
    (permitido R2 H2)
    (permitido R2 H3)
    (permitido R2 PASILLO)

    (armario H2)
    (maquinaTe H4)
    (maquinaTe H5)

    (armarioTiene T1)
    (armarioTiene T2)
    (armarioTiene T3)
    (armarioTiene T4)

    (tazaVacia T1)
    (tazaVacia T2)
    (tazaVacia T3)
    (tazaVacia T4)

 
    (sostiene R1 VACIO DER)
    (sostiene R1 VACIO IZQ)
    (sostiene R2 VACIO DER)
    (sostiene R2 VACIO IZQ)

    
    (= ( velocidad R1) 2)
    (= ( velocidad R2) 5)
    
    (= (darTazaLlena) 2)
    (= (darTazaVacia) 1)

    (= (bateria R1) 5)
    (= (bateria R2) 5)

    (= (bateria-maxima) 20)
    (= (bateria-por-segundo) 1)
    (= (bateria-por-segundo-turbo) 4)
    (= (recarga-por-segundo) 5)

    (= (total-bateria-consumida) 0)

    (estacion H4)
    (estacion H5)

    (disponible R1)
    (disponible R2)
)

(:goal (and (servido P1)(servido P2)(servido P3)(servido P4)))
(:metric minimize(+ (* 4 (* (total-time) (total-time) ) ) (* (total-bateria-consumida) (total-bateria-consumida) ) ))
)
