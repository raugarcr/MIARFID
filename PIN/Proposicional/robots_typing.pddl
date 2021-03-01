;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; ROBOTS
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define (domain robots)
  (:requirements :typing)
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

  (:action desplazarRobot
    :parameters (?robot1 - robot ?room1 - room ?room2 - room)
    :precondition (and (estaEn ?robot1 ?room1)(adjacente ?room1 ?room2)(permitido ?robot1 ?room2))
    :effect (and (not (estaEn ?robot1 ?room1)) (estaEn ?robot1 ?room2))
  )
  (:action cogerTaza
    :parameters (?robot1 - robot ?room1 - room ?taza1 - taza ?mano1 - mano)
    :precondition (and (estaEn ?robot1 ?room1)(armario ?room1)(armarioTiene ?taza1)(sostiene ?robot1 VACIO ?mano1))
    :effect (and (not (armarioTiene ?taza1)) (not (sostiene ?robot1 VACIO ?mano1)) (sostiene ?robot1 ?taza1 ?mano1))
  )
  (:action darTaza
    :parameters (?robot1 - robot ?robot2 - robot ?room1 - room ?taza1 - taza ?mano1 - mano ?mano2 - mano)
    :precondition (and (estaEn ?robot1 ?room1)(estaEn ?robot2 ?room1)(sostiene ?robot1 ?taza1 ?mano1)(sostiene ?robot2 VACIO ?mano2))
    :effect (and (not (sostiene ?robot1 ?taza1 ?mano1)) (sostiene ?robot1 VACIO ?mano1)
    (not (sostiene ?robot2 VACIO ?mano2)) (sostiene ?robot2 ?taza1 ?mano2))
  )
  (:action hacerTe
    :parameters (?robot1 - robot ?room1 - room ?taza1 - taza ?mano1 - mano)
    :precondition (and(estaEn ?robot1 ?room1)(sostiene ?robot1 ?taza1 ?mano1)(tazaVacia ?taza1)(maquinaTe ?room1))
    :effect (and (not(tazaVacia ?taza1)) (tazaLlena ?taza1))
  )
  (:action servirTe
    :parameters (?robot1 - robot ?room1 - room ?person1 - person ?taza1 - taza ?mano1 - mano) 
    :precondition (and (estaEn ?robot1 ?room1)(estaEn ?person1 ?room1)(sostiene ?robot1 ?taza1 ?mano1)(tazaLlena ?taza1))
    :effect (and (not (sostiene ?robot1 ?taza1 ?mano1)) (sostiene ?robot1 VACIO ?mano1) (servido ?person1))
  )  
)
