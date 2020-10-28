# -*- coding: utf-8 -*-
"""
Created on Sun Sep 20 12:56:40 2020

@author: Raúl García
"""

import numpy as np
import time
import matplotlib.pyplot as plt

def generatePopulation (initialValue):
    population = []
    for i in range(0, initialValue * 2):
        individual = np.random.permutation(initialValue)
        population.append(individual.tolist())
    return population

def getFitness(individual, values):
    fitnessValue = 0
    for index in range(0, len(individual)-1):
        fitnessValue += values[individual[index]][individual[index+1]]    
    return [fitnessValue, individual]

def selectElitista(sortedValues, numSelected):  
    selected = [sortedValues[i][1] for i in range(0,numSelected)]
    return selected

def selectProportional(sortedValues):
    sumFitness = sum(par[0] for par in sortedValues)
    initProb = 0.0
    for indiv in sortedValues:
        initProb = initProb + (indiv[0]/sumFitness)
        indiv.append(initProb)
    chosen = []
    while(len(chosen) < 2):
        choseProb = np.random.random()
        for indiv in sortedValues:
            if(choseProb < indiv[2]):
                chosen.append(indiv[1])
    return(chosen)
    
def permutationCrossing(parents):
    lengthPartition = int(len(parents[0])/2 -1)
    sons = []
    "Hijo 1"
    startingPoint = np.random.randint(0, len(parents[0])- lengthPartition)
    sectionParent1 = parents[0][startingPoint:(startingPoint+6)]
    sons.append([-1] * len(parents[0]))
    sons[0][startingPoint:(startingPoint+6)] = sectionParent1
    for i in parents[1]:
        if(i not in sons[0]):
            sustitute = next(x for x, val in enumerate(sons[0]) if val == -1) 
            sons[0][sustitute] = i
    "Hijo 2"
    startingPoint = np.random.randint(0, len(parents[0])- lengthPartition)
    sectionParent2 = parents[1][startingPoint:(startingPoint+6)]
    sons.append([-1] * len(parents[0]))
    sons[1][startingPoint:(startingPoint+6)] = sectionParent2
    for i in parents[0]:
        if(i not in sons[1]):
            sustitute = next(x for x, val in enumerate(sons[1]) if val == -1) 
            sons[1][sustitute] = i
    return(sons)

def alternateCrossing(parents):
    i = 0
    j = 0
    padre = True
    sons=[]
    son1 = []
    son2 = []
    while(i <= len(parents[0])-1 and j <= len(parents[1])-1):
        if(padre):
            if(parents[0][i] in son1):
                i += 1
            else:
                son1.append(parents[0][i])
                padre =  not padre
                continue
        else:
            if(parents[1][j] in son1):
                j += 1
            else:
                son1.append(parents[1][j])
                padre =  not padre
                continue
    i = 0
    j = 0 
    padre = True       
    while(i <= len(parents[1])-1 and j <= len(parents[0])-1):
        if(padre):
            if(parents[1][i] in son2):
                i += 1
            else:
                son2.append(parents[1][i])
                padre =  not padre
                continue
        else:
            if(parents[0][j] in son2):
                j += 1
            else:
                son2.append(parents[0][j])
                padre =  not padre
                continue
    sons.append(son1)
    sons.append(son2)
    return sons
            
            

            
            


def reciprocMutation(sons, mutationProb):
    for son in sons:
        for position in range(0, len(son)):
            if(np.random.random() > (1-mutationProb)):
                newValue = son[position]
                while(newValue == son[position]):
                    newValue = np.random.randint(0, len(son))
                position2 = son.index(newValue)    
                son[position2] = son[position]
                son[position] = newValue
    return sons

def steadyReplace(sortedValues, population, sons):
    sonsValued = [getFitness(son, values) for son in sons] 
    sonsAdded = 0
    newPopulation = []
    for son in sonsValued:
        if(son not in population):
            sortedValues.append(son)
            sonsAdded += 1
    sortedValues = sorted(sortedValues,key=lambda elem: elem[0] ,reverse=True)       
    for i in range(0, len(sortedValues) - sonsAdded):
        newPopulation.append(sortedValues[i][1])
    return newPopulation    
        

def geneticLayers(values, maxIterations = 10000, totalLayers = 12, mutationProb = 0.4, stalled = 3000, replaceType = "steady", crossType = "permutation",selectType="elitist"):
    
    population = generatePopulation(totalLayers)
    finish = False
    iteration = 0
    bestFitness = 0
    stalledCounter = 0
    while not finish:
        
        """Emparejar individuos con su fitness"""
        parIndivFitness = [getFitness(individual, values) for individual in population] 
        sortedValues = sorted(parIndivFitness,key=lambda elem: elem[0] ,reverse=True)
        
        """Seleccionar los mejores individuos"""
        if(selectType == "elitist"):
            selectedIndiv = selectElitista(sortedValues, 2)
        elif(selectType == "proportional"):
            selectedIndiv = selectProportional(sortedValues)
        newBestFitness = sortedValues[0][0]
        bestIndividual = sortedValues[0][1]
        
        if(newBestFitness == bestFitness):
            stalledCounter += 1
        elif(newBestFitness > bestFitness):
            bestFitness = newBestFitness
            #print("Iteracion: ", iteration)
            #print("Mejor Fitness %s" % (bestFitness))
            #print("Tamaño Población %s" % (len(population)))
            stalledCounter = 0
        else:
            stalledCounter = 0

        
        #print("Padre 1 %s, Padre 2 %s" % (selectedIndiv[0], selectedIndiv[1]))
        
        """Cruce"""
        if(crossType == "permutation"):
            sons = permutationCrossing(selectedIndiv)
        elif(crossType == "alternate"):
            sons = alternateCrossing(selectedIndiv)
        """Mutacion"""
        sons = reciprocMutation(sons, mutationProb)
        
        #print("Hijo 1 %s, Hijo 2 %s \n" % (sons[0], sons[1]))
        
        #for son in sons:
        #    if(son not in population):
        #        population.append(son)
        """Reemplazar población"""
        if(replaceType == "steady"):
            population = steadyReplace(sortedValues, population, sons)
        
        iteration += 1
        
        if(stalledCounter == stalled or iteration >= maxIterations):
            #print("Ejecución terminada en iteración: %s" % iteration)
            finish = True
    
    return bestIndividual,iteration, bestFitness

def experimentProb(values):
    for prob, plot in [[0.2,"go--"],[0.4,"ro--"],[0.6,"bo--"]]:
        fitness = []
        times=[]
        for i in range(0,10):
            startTime = time.time()
            bestIndividual,iteration,bestFitness = geneticLayers(values, 10000, 12, prob, 3000, "steady", "permutation")
            finishTime = time.time()
            totalTime = finishTime-startTime
            times.append(totalTime)
            fitness.append(bestFitness)
            print("Solución: %s" % (bestIndividual),"Iteratcion final %s" % (iteration), "Fitness: %s" % (bestFitness), "Time: %0.4f" % (totalTime))
        plt.plot([1,2,3,4,5,6,7,8,9,10], fitness, plot, label = prob)
    plt.ylabel('fitness')
    plt.xlabel('Ejecución')
    plt.legend()
    plt.title("Comparativa del fitness final según probabilidad de mutación")
    plt.show()

def experimentCross(values):
    for cross, plot in [["permutation","go--"],["alternate","ro--"]]:
        fitness = []
        times=[]
        for i in range(0,10):
            startTime = time.time()
            bestIndividual,iteration,bestFitness = geneticLayers(values, 10000, 12, 0.4, 3000, "steady", cross)
            finishTime = time.time()
            totalTime = finishTime-startTime
            times.append(totalTime)
            fitness.append(bestFitness)
            print("Solución: %s" % (bestIndividual),"Iteratcion final %s" % (iteration), "Fitness: %s" % (bestFitness), "Time: %0.4f" % (totalTime))
        plt.plot([1,2,3,4,5,6,7,8,9,10], times, plot, label = cross)
    plt.ylabel('Fitness')
    plt.xlabel('Ejecución')
    plt.legend()
    plt.title("Comparativa del fitness final según tipo de cruce")
    plt.show()



def experimentCrossProb(values):
    prob = [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
    for cross, plot in [["permutation","go--"],["alternate","ro--"]]:
        fitness = []
        times=[]
        for i in prob:
            startTime = time.time()
            bestIndividual,iteration,bestFitness = geneticLayers(values, 10000, 12, i, 3000, "steady", cross)
            finishTime = time.time()
            totalTime = finishTime-startTime
            times.append(totalTime)
            fitness.append(bestFitness)
            print("Solución: %s" % (bestIndividual),"Iteratcion final %s" % (iteration), "Fitness: %s" % (bestFitness), "Time: %0.4f" % (totalTime))
        plt.plot(prob, fitness, plot, label = cross)
    plt.ylabel('Fitness')
    plt.xlabel('Ejecución')
    plt.legend()
    plt.title("Comparativa del fitness final según tipo de cruce")
    plt.show()
    
def experimentCrossProb100(values):
    prob = [0.4,0.5,0.6,0.7,0.8,0.9]  
    for cross in ["alternate"]:
        fitness = []
        times=[]
        for i in prob:
            for n in range(0,50):
                startTime = time.time()
                bestIndividual,iteration,bestFitness = geneticLayers(values, 10000, 12, i, 3000, "steady", cross)
                finishTime = time.time()
                totalTime = finishTime-startTime
                times.append(totalTime)
                fitness.append(bestFitness)
            meanFitness = np.mean(fitness)   
            meanTime = np.mean(times) 
            print("Probabilidad cruce: %s" % (i), "Tipo de Cruce: %s" % (cross), "Fitness: %s" % (meanFitness), "Times: %s" % (meanTime))    

def experimentSelectProb(values):
    prob = [0.3,0.4,0.5,0.6,0.7,0.8,0.9]
    for select, plot in [["elitist","go--"],["proportional","ro--"]]:
        fitness = []
        times=[]
        for i in prob:
            startTime = time.time()
            bestIndividual,iteration,bestFitness = geneticLayers(values, 10000, 12, i, 3000, "steady", "permutation", select)
            finishTime = time.time()
            totalTime = finishTime-startTime
            times.append(totalTime)
            fitness.append(bestFitness)
            print("Solución: %s" % (bestIndividual),"Iteratcion final %s" % (iteration), "Fitness: %s" % (bestFitness), "Time: %0.4f" % (totalTime))
        plt.plot(prob, fitness, plot, label = select)
    plt.ylabel('Tiempo')
    plt.xlabel('Probabilidad de mutación')
    plt.legend()
    plt.title("Comparativa del fitness final según tipo de seleccion")
    plt.show() 

def experimentSelectProb50(values):
    prob = [0.2,0.7,0.8,0.9]
    for select in ["proportional"]:
        fitness = []
        times=[]
        for i in prob:
            for n in range(0,25):
                startTime = time.time()
                bestIndividual,iteration,bestFitness = geneticLayers(values, 10000, 12, i, 3000, "steady", "permutation", select)
                finishTime = time.time()
                totalTime = finishTime-startTime
                times.append(totalTime)
                fitness.append(bestFitness)
            meanFitness = np.mean(fitness)   
            meanTime = np.mean(times) 
            print("Probabilidad cruce: %s" % (i), "Tipo de Cruce: %s" % (select), "Fitness: %s" % (meanFitness), "Times: %s" % (meanTime))    

def experimentFinal(values):
    prob = 0.3
    select = "proportional"
    cross = "permutation"
    for i in range(0,10):
         startTime = time.time()
         bestIndividual,iteration,bestFitness = geneticLayers(values, 10000, 12, prob, 3000, "steady", cross, select)
         finishTime = time.time()
         totalTime = finishTime-startTime
         print("Solucion: %s" % (bestIndividual),"Fitness: %s" % (bestFitness), "Tiempo: %.4f" % (totalTime), "Iteracion: %s" % (iteration))    
        
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
    """
    fitness = []
    times=[]
    for i in range(0,10):
        startTime = time.time()
        bestIndividual,iteration,bestFitness = geneticLayers(values, 10000, 12, 0.6, 3000, "steady", "alternate")
        finishTime = time.time()
        totalTime = finishTime-startTime
        times.append(totalTime)
        fitness.append(bestFitness)
        print("Solución: %s" % (bestIndividual),"Iteratcion final %s" % (iteration), "Fitness: %s" % (bestFitness), "Time: %0.4f" % (totalTime))   
    media =  statistics.mean(fitness)
    print("Valor medio de fitness %s" % (media))
    plt.plot([1,2,3,4,5,6,7,8,9,10], fitness, 'go--')
    plt.ylabel('Fitness')
    plt.xlabel('Partición')
    plt.show()
    media = statistics.mean(times)
    print("Valor medio de tiempo %0.4f" % (media))
    """

    experimentFinal(values)