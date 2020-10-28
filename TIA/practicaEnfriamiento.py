# -*- coding: utf-8 -*-
"""
Created on Thu Oct 15 16:57:50 2020

@author: Raúl
"""
import numpy as np
import math
import time

def getFitness(individual, values):
    fitnessValue = 0
    for index in range(0, len(individual)-1):
        fitnessValue += values[individual[index]][individual[index+1]]    
    return fitnessValue
def generateSuccessors(presentSolution):
    successors = []
    for position in range(0, len(presentSolution)):
        for position2 in range(0, len(presentSolution)):
            if(position != position2):
                auxSolution = presentSolution.copy()
                auxValue = auxSolution[position]
                auxSolution[position] = auxSolution[position2]
                auxSolution[position2] = auxValue
                successors.append(auxSolution)
            
    return successors

def selectSuccessor(successors):
    indexSuccessor = np.random.randint(0, len(successors))
    newSuccessor = successors[indexSuccessor]
    return newSuccessor

def updateTemp(kValue, temperature):
    temperature = temperature/(1 + kValue*temperature)    
    return temperature
    

def annealing(values, kValue, initTemp, numLayers):
    temperature = initTemp
    stalled = 0
    iteration = 0
    #initialSolution = np.random.permutation(numLayers)
    initialSolution = [5, 8, 3, 0, 11, 7, 10, 1, 6, 9, 4, 2]
    presentSolution = initialSolution.copy()
    bestSolution = initialSolution.copy()
    bestIteration = 0
    bestFitness = getFitness(initialSolution,values)
    
    while(iteration < 10000):
        successors = generateSuccessors(presentSolution)
        #♣print(presentSolution)
        successor = selectSuccessor(successors)
        fitnessDif = getFitness(successor,values) - getFitness(presentSolution,values) 
        
        if(fitnessDif > 0):
            presentSolution = successor.copy()
            if(getFitness(successor,values) - getFitness(bestSolution,values) > 0):
                bestSolution = successor.copy()
                bestIteration = iteration
                bestFitness = getFitness(bestSolution,values)
                #print("Solución: %s" % (bestSolution),"Iteratcion %s" % (iteration), "Fitness: %s" % (getFitness(bestSolution,values) ))
                stalled = 0
            else:
                stalled += 1
        else:
            if np.random.random() < math.e ** (fitnessDif / temperature):
                presentSolution = successor.copy()
            stalled += 1        
        iteration += 1
        temperature = updateTemp(kValue, temperature);
    return bestSolution, bestFitness, bestIteration

def experimentAnnealing(values):
    for temp in [1000, 10000, 100000]:
        for k in [0.8, 0.85, 0.9, 0.95, 0.99]:
            fitness = []
            times = []
            bestIterations = []
            for i in range(0,50):
                startTime = time.time()
                bestSolution, bestFitness, bestIteration =  annealing(values, k, temp, 12)
                finishTime = time.time()
                totalTime = finishTime-startTime
                times.append(totalTime)
                fitness.append(bestFitness)
                bestIterations.append(bestIteration)
            meanFitness = np.mean(fitness)   
            meanTime = np.mean(times)
            bestIterationMean  =np.mean(bestIterations)
            print("InitTemp: %s" % (temp),"k: %s" % (k),"Fitness: %s" % (meanFitness), "Times: %s" % (meanTime), "Iteracion: %s" % (bestIterationMean))    
               
def experimentFinal(values):
    temp = 100000
    k = 0.001
    for i in range(0, 10):
        startTime = time.time()
        bestSolution, bestFitness, bestIteration =  annealing(values, k, temp, 12)
        finishTime = time.time()
        totalTime = finishTime-startTime
        print("Solucion: %s" % (bestSolution),"Fitness: %s" % (bestFitness), "Tiempo: %.4f" % (totalTime), "Iteracion: %s" % (bestIteration))    
        
if __name__ == "__main__":
    values =  [[0, 10, 15, 25, 32, 25, 21, 21, 15, 22, 12, 54],
               [41, 0, 57, 24, 52, 2, 66, 55, 61, 15, 6, 7],
               [21, 31, 0, 21, 21, 44, 21, 22, 22, 61, 47, 61],
               [66, 22, 15, 0, 47, 21, 41, 15, 21, 22, 32, 34],
               [21, 44, 61, 47, 0, 32, 26, 61, 55, 34, 18, 12],
               [22, 18, 22, 23, 41, 0, 21, 22, 44, 55, 54, 54],
               [15, 25, 34, 21, 26, 27, 0, 34, 25, 41, 7, 22],
               [61, 34, 12, 54, 21, 23, 15, 0, 21, 21, 55, 55],
               [22, 54, 54, 65, 3, 25, 61, 77, 0, 47, 22, 22],
               [34, 7, 22, 23, 54, 42, 22, 54, 21, 0, 12, 15],
               [26, 61, 55, 22, 18, 18, 22, 18, 34, 21, 0, 12],
               [22, 18, 25, 34, 21, 22, 18, 61, 55, 2, 22, 0]]           
    
    experimentFinal(values)
    
    