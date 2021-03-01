;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; ROBOTS
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define (domain robots)
  (:requirements :strips :typing :fluents :durative-actions )
  (:types robot person room taza mano vacio)
  (:constants 
  	VACIO - vacio
  	IZQ DER - mano
  )
  (:predicates
    (adjacente ?x - room ?y - room)
    (servido ?x - person)
    (estaEn ?x - (either robot person) ?y - room)
    (permitido ?x - robot ?y - room)
    (sostiene ?x - robot ?y - (either taza vacio) ?z - mano)
    (tazaLlena ?x - taza)
    (tazaVacia ?x - taza)
    (maquinaTe ?x - room)
    (armario ?x - room)
    (armarioTiene ?x - taza)
  )
  (:functions 
  	(distancia ?r1 - room ?r2 - room)
  	(velocidad ?r1 - robot)
    	(bateria-por-segundo)
    	(bateria-por-segundo-turbo)
  	(total-bateria-consumida)
  	(darTazaLlena)
  	(darTazaVacia)
  	(bateria ?r1 - robot)
  )

  (:durative-action desplazarRobot
    :parameters (?robot1 - robot ?room1 - room ?room2 - room)
    :duration (= ?duration (/ (distancia ?room1 ?room2) (velocidad ?robot1)))
    :condition (
    	and 
    	(at start(>= (bateria ?robot1) (* (/ (distancia ?room1 ?room2) (velocidad ?robot1)) (bateria-por-segundo))))
    	(at start(estaEn ?robot1 ?room1))
    	(at start(adjacente ?room1 ?room2))
    	(at start(permitido ?robot1 ?room2))
    )
    :effect (
    	and (at start(not (estaEn ?robot1 ?room1))) 
    	(at end(estaEn ?robot1 ?room2))
    	(at end(decrease (bateria ?robot1) (* (/ (distancia ?room1 ?room2) (velocidad ?robot1)) (bateria-por-segundo))))
        (at end(increase (total-bateria-consumida) (* (/ (distancia ?room1 ?room2) (velocidad ?robot1)) (bateria-por-segundo))))
    )
  )
  (:durative-action desplazarRobotTurbo
    :parameters (?robot1 - robot ?room1 - room ?room2 - room)
    :duration (= ?duration (/ (/ (distancia ?room1 ?room2) (velocidad ?robot1)) 2))
    :condition (
    	and
    	(at start(>= (bateria ?robot1) (* (/ (/ (distancia ?room1 ?room2) (velocidad ?robot1)) 2) (bateria-por-segundo-turbo))))
    	(at start(estaEn ?robot1 ?room1))
    	(at start(adjacente ?room1 ?room2))
    	(at start(permitido ?robot1 ?room2))
    )
    :effect (
    	and (at start(not (estaEn ?robot1 ?room1))) 
    	(at end(estaEn ?robot1 ?room2))
        (at end(decrease (bateria ?robot1)  (* (/ (/ (distancia ?room1 ?room2) (velocidad ?robot1)) 2) (bateria-por-segundo-turbo))))
        (at end(increase (total-bateria-consumida) (* (/ (/ (distancia ?room1 ?room2) (velocidad ?robot1)) 2) (bateria-por-segundo-turbo))))
    )
  )
  (:durative-action cogerTaza
    :parameters (?robot1 - robot ?room1 - room ?taza1 - taza ?mano1 - mano)
    :duration (= ?duration 2)
    :condition (
    	and (over all(estaEn ?robot1 ?room1))
    	(at start(armario ?room1))
    	(at start(armarioTiene ?taza1))
    	(at start(sostiene ?robot1 VACIO ?mano1))
    )
    :effect (
    	and (at start(not (armarioTiene ?taza1))) 
    	(at start(not (sostiene ?robot1 VACIO ?mano1)))
    	(at end(sostiene ?robot1 ?taza1 ?mano1))
    )
  )
  (:durative-action darTazaV
    :parameters (?robot1 - robot ?robot2 - robot ?room1 - room ?taza1 - taza ?mano1 - mano ?mano2 - mano)
    :duration (= ?duration (darTazaVacia))
    :condition (
    	and (over all(estaEn ?robot1 ?room1))
    	(over all(estaEn ?robot2 ?room1))
    	(at start(sostiene ?robot1 ?taza1 ?mano1))
    	(at start(sostiene ?robot2 VACIO ?mano2))
    	(over all(tazaVacia ?taza1))
    )
    :effect (
    	and (at start(not (sostiene ?robot1 ?taza1 ?mano1))) 
    	(at end(sostiene ?robot1 VACIO ?mano1))
    	(at start(not (sostiene ?robot2 VACIO ?mano2))) 
    	(at end(sostiene ?robot2 ?taza1 ?mano2))
    )
  )
  
  (:durative-action darTazaLl
    :parameters (?robot1 - robot ?robot2 - robot ?room1 - room ?taza1 - taza ?mano1 - mano ?mano2 - mano)
    :duration (= ?duration (darTazaLlena))
    :condition (
    	and (over all(estaEn ?robot1 ?room1))
    	(over all(estaEn ?robot2 ?room1))
    	(at start(sostiene ?robot1 ?taza1 ?mano1))
    	(at start(sostiene ?robot2 VACIO ?mano2))
    	(over all(tazaLlena ?taza1))
    )
    :effect (
    	and (at start(not (sostiene ?robot1 ?taza1 ?mano1))) 
    	(at end(sostiene ?robot1 VACIO ?mano1))
    	(at start(not (sostiene ?robot2 VACIO ?mano2))) 
    	(at end(sostiene ?robot2 ?taza1 ?mano2))
    )
  )
  
  (:durative-action hacerTe
    :parameters (?robot1 - robot ?room1 - room ?taza1 - taza ?mano1 - mano)
    :duration (= ?duration 2)
    :condition (
    	and(over all(estaEn ?robot1 ?room1))
    	(at start(sostiene ?robot1 ?taza1 ?mano1))
    	(at start(tazaVacia ?taza1))
    	(over all(maquinaTe ?room1))
    )
    :effect (
    	and (at start(not(tazaVacia ?taza1)))
    	(at end(tazaLlena ?taza1))
    )
  )
  (:durative-action servirTe
    :parameters (?robot1 - robot ?room1 - room ?person1 - person ?taza1 - taza ?mano1 - mano) 
    :duration (= ?duration (darTazaLlena))
    :condition (
    	and (over all(estaEn ?robot1 ?room1))
    	(over all(estaEn ?person1 ?room1))
    	(at start(sostiene ?robot1 ?taza1 ?mano1))
    	(at start(tazaLlena ?taza1))
    )
    :effect (
    	and (at start(not (sostiene ?robot1 ?taza1 ?mano1)) )
    	(at end(sostiene ?robot1 VACIO ?mano1)) 
    	(at end(servido ?person1)))
  )  
)
