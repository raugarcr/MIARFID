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
    (adjacente H2 H1)
    (adjacente H1 PASILLO)
    (adjacente PASILLO H1)
    (adjacente H2 PASILLO)
    (adjacente PASILLO H2)
    (adjacente H3 H4)
    (adjacente H4 H3)
    (adjacente H3 PASILLO)
    (adjacente PASILLO H3)
    (adjacente H4 PASILLO)
    (adjacente PASILLO H4)

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
)

(:goal (and (servido P1)(servido P2)))
)
