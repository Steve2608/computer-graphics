import sys
from random import uniform as rand

import math


def bump(x, y, size):
    if size == 0:
        return
    for i in range(-size, size + 1):
        for j in range(-size, size + 1):
            row = x + i
            col = y + j
            if row < 0 or row >= length or col < 0 or col >= length: continue
            matrix[row][col] += math.sqrt((size * 2 - math.fabs(i) - math.fabs(j))) / math.sqrt(size)
            if matrix[row][col] > 5:
                matrix[row][col] = 5


def trim(matrix):
    for i in range(length):
        for j in range(length):
            matrix[i][j] = round(matrix[i][j], 3)


def initMatrix(x, y):
    return [[0 for x in range(x)] for y in range(y)]


def printMatrix(matrix):
    print("[")
    for row in range(length):
        print(str(matrix[row]) + ", ")
    print("]")


def main():
    SPAN = 8

    bump(1, 1, int(rand(1, SPAN)))
    bump(1, 13, int(rand(1, SPAN)))
    bump(1, 19, int(rand(1, SPAN)))
    bump(1, 23, int(rand(1, SPAN)))
    bump(1, 29, int(rand(1, SPAN)))
    bump(1, 38, int(rand(1, SPAN)))
    bump(1, 47, int(rand(1, SPAN)))
    bump(10, 10, int(rand(1, SPAN)))
    bump(5, 13, int(rand(1, SPAN)))
    bump(15, 15, int(rand(1, SPAN)))
    bump(20, 15, int(rand(1, SPAN)))
    bump(22, 18, int(rand(1, SPAN)))
    bump(27, 15, int(rand(1, SPAN)))

    bump(7, 1, int(rand(1, SPAN)))
    bump(11, 1, int(rand(1, SPAN)))
    bump(14, 1, int(rand(1, SPAN)))
    bump(22, 1, int(rand(1, SPAN)))
    bump(27, 1, int(rand(1, SPAN)))
    bump(31, 1, int(rand(1, SPAN)))
    bump(40, 1, int(rand(1, SPAN)))
    bump(48, 1, int(rand(1, SPAN)))

    bump(49, 1, int(rand(1, SPAN)))
    bump(49, 14, int(rand(1, SPAN)))
    bump(49, 18, int(rand(1, SPAN)))
    bump(49, 34, int(rand(1, SPAN)))
    bump(49, 27, int(rand(1, SPAN)))
    bump(49, 41, int(rand(1, SPAN)))
    bump(49, 44, int(rand(1, SPAN)))
    bump(49, 49, int(rand(1, SPAN)))

    bump(1, 49, int(rand(1, SPAN)))
    bump(2, 49, int(rand(1, SPAN)))
    bump(11, 49, int(rand(1, SPAN)))
    bump(19, 49, int(rand(1, SPAN)))
    bump(38, 49, int(rand(1, SPAN)))
    bump(40, 49, int(rand(1, SPAN)))
    bump(22, 49, int(rand(1, SPAN)))
    bump(27, 49, int(rand(1, SPAN)))

    trim(matrix)
    printMatrix(matrix)


if len(sys.argv) != 2:
    raise ValueError("Invalid number of parameters submitted")
length = int(sys.argv[1])
matrix = initMatrix(length, length)

main()
