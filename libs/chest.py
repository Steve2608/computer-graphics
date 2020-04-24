import math


def main():
    data = loadData()
    center = (125, 127)
    index = 0

    for tex in data:
        v = sub(tex, center)
        v = normalize(v)
        v = (v[0], -v[1])  # flip y axis to match "real" world
        v = mul(v, 0.5)
        v = add(v, (0.5, 0))
        # print(v)

        vertex(index, 0, (v[1], v[0]), tex, (-1, 0, 0))
        index += 1

    for tex in data:
        v = sub(tex, center)
        v = normalize(v)
        v = (v[0], -v[1])  # flip y axis to match "real" world
        v = mul(v, 0.5)
        v = add(v, (0.5, 0))
        # print(v)

        vertex(index, 2, (v[1], v[0]), tex, (1, 0, 0))
        index += 1

    topStart = index

    last = None
    cumSum = 0

    s = 0
    for i in range(0, len(data) - 1):
        s += length(sub(data[i], data[i + 1]))

    print(s)

    for tex in data:
        vec = sub(tex, center)
        v = normalize(vec)
        normal = (v[0], -v[1])  # flip y axis to match "real" world
        v = mul(normal, 0.5)
        v = add(v, (0.5, 0))

        distance = 0
        if last:
            distance = length(sub(last, vec))

        cumSum += distance
        print(cumSum)
        pixel = (cumSum / s) * 328 + 150

        vertex(index, 0, (v[1], v[0]), (536, pixel), normal)
        vertex(index + 1, 2, (v[1], v[0]), (536 + 359, pixel), normal)
        index += 2
        last = vec

    # assemble top
    # make quads

    index = 0
    for i in range(0, len(data) - 1):
        a = topStart + i * 2
        b = topStart + i * 2 + 1
        d = topStart + i * 2 + 2
        c = topStart + i * 2 + 3

        out.write("index.push" + str((a, b, c, a, c, d)) + ";\n")


def vertex(idx, x, pos, tex, normal):
    posX = (x,) + pos
    out.write("// " + str(idx) + ";\n")
    out.write("pos.push" + str(posX) + ";\n")
    out.write("normal.push" + str(normal) + ";\n")
    out.write("tex" + str(tex) + ";\n")
    out.write("\n")


def loadData():
    data = [
        (44, 127),
        (44, 110),
        (57, 74),
        (73, 53),
        (99, 35),
        (133, 25),
        (161, 25),
        (195, 35),
        (221, 53),
        (237, 74),
        (250, 110),
        (250, 127)]
    return data


def add(vec1, vec2):
    result = ()
    for x in zip(vec1, vec2):
        result = result + (x[0] + x[1],)
    return result


def sub(vec1, vec2):
    result = ()
    for x in zip(vec1, vec2):
        result = result + (x[0] - x[1],)
    return result


def length(vec):
    total = 0
    for x in vec:
        total += math.pow(x, 2)
    return math.sqrt(total)


def mul(vec, scalar):
    result = ()
    for x in vec:
        result = result + (x * scalar,)
    return result


def normalize(vec):
    return mul(vec, 1 / length(vec))


out = open("code/chest_frame.js", "w")
out.write("function chframe(pos, tex, normal, index) {\n")
main()
out.write("}")
